from django.contrib import admin
from .models.equipment import Equipment
from .models.project_pipeline import Project
from .models.finance import FinancialRecord
from .models.client import Client
from .models.location import Location
from .models.maintenance import MaintenanceLog
from .models.usageLogs import UsageLog
from .models.equipment_category import EquipmentCategory
from .models.project_equipment import ProjectEquipment


@admin.register(ProjectEquipment)
class ProjecttEquipmentAdmin(admin.ModelAdmin):
    list_display=["project","equipment","release_date","hours_allocated"]
    list_filter=["assignment_date"]
    search_fields=["project"]
    date_hierarchy='created_at'


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "serial_number",
        "status",
        "created_at",
        "category",
        "condition",
        "current_location",
    ]
    list_filter = ["status", "created_at", "updated_at"]
    search_fields = ["name", "description"]
    date_hierarchy = "created_at"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "client",
        "project_code",
        "status",
        "created_at",
        "project_manager",
    ]
    list_filter = ["status", "created_at", "updated_at"]
    search_fields = ["name", "description"]
    date_hierarchy = "created_at"


@admin.register(FinancialRecord)
class FinancialRecordAdmin(admin.ModelAdmin):
    list_display = [
        "transaction_type",
        "amount",
        "transaction_date",
        "due_date",
        "status",
    ]
    list_filter = ["transaction_type", "transaction_date", "due_date", "status"]
    search_fields = ["transaction_type", "description"]
    date_hierarchy = "transaction_date"


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ["company_name", "email", "phone"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["name", "email"]
    date_hierarchy = "created_at"


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = [
        "site",
        "latitude",
        "longitude",
        "tracking_info",
        "geofence_status",
        "is_manual_entry",
    ]
    list_filter = ["geofence_status", "created_at", "updated_at"]
    search_fields = ["name", "description"]
    date_hierarchy = "created_at"


@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = [
        "equipment",
        "maintenance_type",
        "priority",
        "maintenance_date",
        "completion_date",
    ]
    list_filter = [
        "equipment",
        "maintenance_type",
        "priority",
        "maintenance_date",
        "completion_date",
    ]
    search_fields = ["equipment", "description"]
    date_hierarchy = "maintenance_date"


@admin.register(UsageLog)
class UsageLogAdmin(admin.ModelAdmin):
    list_display = [
        "equipment",
        "date_logged",
        "start_time",
        "end_time",
        "hours_used",
        "usage_type",
    ]
    list_filter = ["equipment", "date_logged", "usage_type"]
    search_fields = ["equipment", "location"]
    date_hierarchy = "date_logged"


@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["name", "description"]
    date_hierarchy = "created_at"
