from backend.basemodel import TimeBaseModel
from django.db import models
from .location import Location
from .equipment import Equipment
from django.utils import timezone
from .client import Client

class Project(TimeBaseModel):
    PROJECT_STATUS = [
        ("planning", "Planning Phase"),
        ("pending", "Pending Approval"),
        ("approved", "Approved"),
        ("in_progress", "In Progress"),
        ("on_hold", "On Hold"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    client = models.ForeignKey(
        Client, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='client_projects'
    )
    project_code = models.CharField(max_length=50, unique=True)

    # Timeline
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    # Location and Equipment
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    equipment = models.ManyToManyField(
        Equipment, through="ProjectEquipment", related_name="projects"
    )

    # Status and Priority
    status = models.CharField(max_length=50, choices=PROJECT_STATUS, default="planning")
    priority = models.CharField(
        max_length=20, choices=PRIORITY_LEVELS, default="medium"
    )
    progress = models.IntegerField(default=0, help_text="Progress percentage")
    project_manager = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.project_code}) - {self.get_status_display()}"

    def is_delayed(self):
        if self.end_date and self.start_date:
            return self.end_date > self.start_date + timezone.timedelta(
                days=self.estimated_duration
            )
        return False

    class Meta:
        ordering = ["-start_date"]
        indexes = [
            models.Index(fields=["status", "start_date"]),
            models.Index(fields=["project_code"]),
        ]
