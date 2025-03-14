from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
import random
from django.conf import settings
from datetime import datetime, timedelta
from django.core.mail import EmailMessage, send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import get_user_model


# user=get_user_model()


class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data["Subject"], body=data["email_body"], to=[data["to_email"]]
        )
        email.send()


def user_email(request, user):
    token = RefreshToken.for_user(user).access_token
    absurl = f"{settings.SITE_URL}/verify-email?token={str(token)}"
    email_body = (
        f"Hi {user.email}\nUse the link below to verify your account:\n{absurl}"
    )
    data = {
        "email_body": email_body,
        "to_email": user.email,
        "Subject": "Verify Your Email",
    }
    Util.send_email(data)


def generate_six_digit_code():
    return str(random.randint(100000, 999999))


def send_reset_code(user, code):
    subject = "Reset Password Code"
    message = f"Use this code {code} to reset your password"
    email_sender = settings.EMAIL_HOST_USER
    email_reciever = [user.email]
    send_mail(subject, message, email_sender, email_reciever)
