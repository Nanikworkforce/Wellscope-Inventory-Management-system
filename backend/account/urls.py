from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"", UserRegistrationViewset, basename="register")
router.register(r"", LoginViewset, basename="login")
router.register(r"verify", VerifyEmailViewSet, basename="verify")


urlpatterns = [
    path("", include(router.urls)),
]
