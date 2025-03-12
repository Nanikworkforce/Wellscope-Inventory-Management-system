from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r"equipment", EquipmentViewSet)
router.register(r"clients", ClientViewSet)
router.register(r"locations", LocationViewSet)
router.register(r"equipment-categories", EquipmentCategoryViewSet)
router.register(r"projects", ProjecViewSet)
router.register(r"project_equipment", ProjecEquipmentViewSet)
router.register(r"maintenance", MaintenanceLogViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
