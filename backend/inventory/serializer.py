from rest_framework import serializers
from .models.equipment import Equipment
from .models.project_pipeline import Project
from .models.finance import FinancialRecord
from .models.client import Client
from .models.location import Location
from .models.maintenance import MaintenanceLog
from .models.usageLogs import UsageLog
from .models.equipment_category import EquipmentCategory
from .models.project_equipment import ProjectEquipment


# class MaintenanceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MaintenanceLog
#         fields = "__all__"


class ProjectEquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectEquipment
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "site", "latitude", "longitude"]


class EquipmentSerializer(serializers.ModelSerializer):
    location = LocationSerializer(source="current_location", read_only=True)
    serialNumber = serializers.CharField(source="serial_number", required=False)
    maintenanceSchedule = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentCategory.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = Equipment
        fields = [
            "id",
            "name",
            "serialNumber",
            "serial_number",
            "category",
            "category_name",
            "status",
            "condition",
            "purchase_date",
            "current_location",
            "next_maintenance_date",
            "location",
            "maintenanceSchedule",
        ]
        extra_kwargs = {
            "serial_number": {"required": True},
            "name": {"required": True},
            "status": {"required": True},
            "condition": {"required": True},
        }

    def get_maintenanceSchedule(self, obj):
        return (
            {"nextMaintenance": obj.next_maintenance_date}
            if obj.next_maintenance_date
            else None
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["category"] = representation.pop("category_name", None)
        if hasattr(instance, "equipment_assignment_errors"):
            representation["equipment_assignment_warnings"] = (
                instance.equipment_assignment_errors
            )
        return representation

    def create(self, validated_data):
        print("Creating with data:", validated_data)  # Debug log
        return super().create(validated_data)


class EquipmentInProjectSerializer(serializers.ModelSerializer):
    serialNumber = serializers.CharField(source="serial_number")

    class Meta:
        model = Equipment
        fields = ["id", "name", "serialNumber"]


class ProjectSerializer(serializers.ModelSerializer):
    client = serializers.SerializerMethodField()
    location = LocationSerializer(read_only=True)
    equipment = serializers.SerializerMethodField()
    client_id = serializers.IntegerField(write_only=True, required=True)
    location_id = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "client",
            "client_id",
            "location",
            "location_id",
            "project_code",
            "start_date",
            "end_date",
            "status",
            "priority",
            "progress",
            "project_manager",
            "equipment",
        ]

    def get_client(self, obj):
        if obj.client:
            return {"id": obj.client.id, "company_name": obj.client.company_name}
        return None

    def get_equipment(self, obj):
        project_equipment = obj.projectequipment_set.all()
        equipment_data = []
        for pe in project_equipment:
            equipment = pe.equipment
            equipment_data.append(
                {
                    "id": equipment.id,
                    "name": equipment.name,
                    "serialNumber": equipment.serial_number,
                }
            )
        return equipment_data

    def create(self, validated_data):
        equipment_ids = self.context["request"].data.get("equipment", [])
        client_id = validated_data.pop("client_id")
        location_id = validated_data.pop("location_id", None)

        project = Project.objects.create(
            client_id=client_id, location_id=location_id, **validated_data
        )

        # Create ProjectEquipment entries
        assignment_errors = []
        for equipment_id in equipment_ids:
            try:
                # Check if assignment already exists
                existing = ProjectEquipment.objects.filter(
                    project=project,
                    equipment_id=equipment_id,
                    assignment_date=validated_data.get("start_date"),
                    release_date=validated_data.get("end_date"),
                ).first()

                if not existing:
                    ProjectEquipment.objects.create(
                        project=project,
                        equipment_id=equipment_id,
                        assignment_date=validated_data.get("start_date"),
                        release_date=validated_data.get("end_date"),
                    )
            except Exception as e:
                assignment_errors.append(f"Equipment {equipment_id}: {str(e)}")

        # If there were any errors with equipment assignment, add them to the response
        if assignment_errors:
            project.equipment_assignment_errors = assignment_errors

        return project


class FinancialRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialRecord
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "id",
            "company_name",
            "contact_person",
            "email",
            "phone",
            "created_at",
            "updated_at",
        ]


class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceLog
        fields = "__all__"
        read_only_fields = ("maintenance_date",)

    def validate(self, data):
        required_fields = ["equipment", "performed_by"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            raise serializers.ValidationError(
                {field: "This field is required." for field in missing_fields}
            )
        return data


class UsageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageLog
        fields = "__all__"


class EquipmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentCategory
        fields = "__all__"
