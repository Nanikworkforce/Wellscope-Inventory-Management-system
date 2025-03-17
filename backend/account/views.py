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

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    @method_decorator(csrf_exempt)
    def register(self, request):
        try:
            data = request.data
            print(f"Registration data received: {data}")  # Debug log

            email = data.get("email", "").lower().strip()
            password = data.get("password")
            confirm_password = data.get("confirm_password")
            first_name = data.get("first_name", "")
            last_name = data.get("last_name", "")

            # Validation
            if not email or not password or not confirm_password:
                return Response(
                    {"Error": "Email, password and confirm password are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if password != confirm_password:
                return Response(
                    {"Error": "Passwords do not match"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if user exists
            if User.objects.filter(email=email).exists():
                print(f"User already exists with email: {email}")
                return Response(
                    {"Error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                # Create user
                print(f"Creating user with email: {email}")
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    is_active=False,
                    is_verified=False,
                )

                # Verify user was created
                print(f"Checking if user was created...")
                created_user = User.objects.get(email=email)
                print(
                    f"""
                User created successfully:
                - ID: {created_user.id}
                - Email: {created_user.email}
                - Active: {created_user.is_active}
                - Verified: {created_user.is_verified}
                - Password set: {created_user.has_usable_password()}
                """
                )

                # Send verification email
                print(f"Sending verification email...")
                user_email(request, created_user)
                print(f"Verification email sent to: {email}")

                return Response(
                    {
                        "message": "Registration successful! Please check your email to verify your account.",
                        "email": email,
                        "user_id": created_user.id,
                    },
                    status=status.HTTP_201_CREATED,
                )

            except Exception as e:
                print(f"Error during user creation: {str(e)}")
                return Response(
                    {"error": f"Failed to create user: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return Response(
                {"error": f"Registration failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    @method_decorator(csrf_exempt)
    def logout(self, request):
        logout(request)
        return Response({"Logout Successful"}, status=status.HTTP_200_OK)


class LoginViewset(viewsets.GenericViewSet):
    serializer_class = UserLoginSerializer

    @action(detail=False,methods=['post'],permission_classes=[AllowAny])
    def login(self,request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            user = authenticate(self,email=email,password=password)

            if user:
                if user.is_active:
                    login(request,user)
                    return Response({'Message':_('Login Successful')},status=status.HTTP_201_CREATED)
                else:
                    return Response({'Error':_('Account is Inactive')},status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({'Error':_('Invalid Login Detailed Provided')},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Internal Server Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
            

    @action(detail=False,methods=['post'],permission_classes=[AllowAny])
    def logout(self,request):
        logout(request)
        return Response({'Message':_('Logout Successful')},status=status.HTTP_200_OK)


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
