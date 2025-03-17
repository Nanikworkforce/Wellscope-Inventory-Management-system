from django.shortcuts import render
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets, status, views, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.validators import ValidationError
from rest_framework.decorators import action
from django.utils.translation import gettext_lazy as _
from .serializer import *
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Util, user_email, generate_six_digit_code, send_reset_code
from datetime import datetime, timedelta
import jwt
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


# Create your views here.
User = get_user_model()


@method_decorator(csrf_exempt, name="dispatch")
class UserRegistrationViewset(viewsets.ViewSet):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=["post"])
    def register(self, request):
        try:
            print("Received registration data:", request.data)

            first_name = request.data.get("first_name")
            last_name = request.data.get("last_name")
            email = request.data.get("email", "").lower().strip()
            password = request.data.get("password", "").strip()
            confirm_password = request.data.get("confirm_password", "").strip()

            # Validation
            if not all([email, password, confirm_password, first_name, last_name]):
                return Response(
                    {"error": "All fields are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if password != confirm_password:
                return Response(
                    {"error": "Passwords do not match"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_active=False,
                is_verified=False,
            )
            user_email(request, user)
            return Response(
                {
                    "message": "Registration successful! Please check your email to verify your account.",
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def logout(self, request):
        logout(request)
        return Response(_("Logout Successful"), status=status.HTTP_200_OK)


class LoginViewset(viewsets.GenericViewSet):
    serializer_class = UserLoginSerializer

    @action(detail=False, methods=["post"])
    def login(self, request):
        try:
            # Get and validate input data
            data = request.data
            print("Login request data:", data)  # Debug log

            email = data.get("email", "").lower().strip()
            password = data.get("password", "")

            if not email or not password:
                return Response(
                    {"error": "Please provide both email and password"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                user = User.objects.get(email=email)
                print(
                    f"Found user: {user.email}, Active: {user.is_active}, Verified: {user.is_verified}"
                )
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            user = authenticate(request, email=email, password=password)
            if not user:
                return Response(
                    {"error": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            if not user.is_verified:
                return Response(
                    {"error": "Please verify your email before logging in"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            if not user.is_active:
                return Response(
                    {"error": "Your account is not active"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            login(request, user)
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "token": {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def logout(self, request):
        logout(request)
        return Response({"Message": _("Logout Successful")}, status=status.HTTP_200_OK)


class VerifyEmailViewSet(viewsets.GenericViewSet):
    serializer_class = VerifyEmailSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "token",
                openapi.IN_QUERY,
                description="The token for email verification",
                type=openapi.TYPE_STRING,
            )
        ]
    )
    @action(methods=["get"], detail=False)
    def verify(self, request):
        token = request.GET.get("token")
        print(f"Verification attempt with token: {token[:20]}...")  # Debug log

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print(f"Decoded payload: {payload}")  # Debug log

            user = User.objects.get(id=payload["user_id"])
            print(
                f"""
            User before verification:
            - Email: {user.email}
            - Active: {user.is_active}
            - Verified: {user.is_verified}
            """
            )

            if not user.is_verified:
                user.is_verified = True
                user.is_active = True  # Make sure to set is_active to True
                user.save()

                # Verify the changes were saved
                updated_user = User.objects.get(id=user.id)
                print(
                    f"""
                User after verification:
                - Email: {updated_user.email}
                - Active: {updated_user.is_active}
                - Verified: {updated_user.is_verified}
                """
                )

                return Response(
                    {"message": "Email verified successfully! You can now login."},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Email already verified"},
                    status=status.HTTP_200_OK,
                )

        except jwt.ExpiredSignatureError as e:
            print(f"Token expired: {str(e)}")
            return Response(
                {"error": "Verification link has expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except (jwt.DecodeError, User.DoesNotExist) as e:
            print(f"Verification error: {str(e)}")
            return Response(
                {"error": "Invalid verification link"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response(
                {"error": f"Verification failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def generate_token(user):
        expiration = datetime.utcnow() + timedelta(hours=24)
        payload = {"user_id": user.id, "exp": expiration, "iat": datetime.utcnow()}
        print(f"Token payload: {payload}")
        print(f"User found: {user}")
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        print(f"Generated token: {token}")
        return token
