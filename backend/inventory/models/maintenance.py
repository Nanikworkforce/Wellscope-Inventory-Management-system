from django.db import models
from .equipment import Equipment
from backend.basemodel import TimeBaseModel

class MaintenanceLog(TimeBaseModel):
    MAINTENANCE_TYPE_CHOICES = [
        ("preventive", "Preventive Maintenance"),
        ("corrective", "Corrective Maintenance"),
        ("condition", "Condition-Based"),
        ("emergency", "Emergency Repair"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("overdue", "Overdue"),
    ]

    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default="medium"
    )
    maintenance_date = models.DateField(auto_now_add=True)
    completion_date = models.DateField(null=True, blank=True)
    next_maintenance_due = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="scheduled"
    )

    description = models.TextField()
    actions_taken = models.TextField(blank=True)  # Actions taken to resolve issues

    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    performed_by = models.CharField(max_length=255)  # Technician Name
    approved_by = models.CharField(max_length=255, blank=True)  # Supervisor Name

    def total_cost(self):
        return self.labor_cost + self.parts_cost

    def is_overdue(self):
        return (
            self.status == "scheduled" and self.scheduled_date < self.created_at.date()
        )

    def update_status(self):
        if self.is_overdue():
            self.status = "overdue"
            self.save()

    def __str__(self):
        return f"Maintenance for {self.equipment.name} - {self.get_status_display()} ({self.progress}%)"

    class Meta:
        ordering = ["-maintenance_date"]
        indexes = [
            models.Index(fields=["equipment", "status"]),
            models.Index(fields=["maintenance_date"]),
            models.Index(fields=["status"]),
        ]
