from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializer import *
from .models.equipment import Equipment
from .models.location import Location
from .models.client import Client
from .models.equipment_category import EquipmentCategory
from .models.maintenance import MaintenanceLog


def index(request):
    return HttpResponse("Hello, World!")


class ProjecViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjecEquipmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectEquipment.objects.all()
    serializer_class = ProjectEquipmentSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def retrieve(self, request, *args, **kwargs):
        print(f"Retrieving client with kwargs: {kwargs}")  # Debug log
        return super().retrieve(request, *args, **kwargs)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Print request data for debugging
            print("Received data:", request.data)

            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(
                    {"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
                )

            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Error:", str(e))
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    queryset = EquipmentCategory.objects.all()
    serializer_class = EquipmentCategorySerializer


class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer

    def create(self, request, *args, **kwargs):
        required_fields = {
            "equipment": "equipment_id",
            "performed_by": "performed by",
        }

        missing_fields = [
            field_name
            for field, field_name in required_fields.items()
            if not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)
