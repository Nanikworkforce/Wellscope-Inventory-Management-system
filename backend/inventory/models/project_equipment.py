from django.db import models
from .location import Location
from .equipment import Equipment
from django.utils import timezone
from .client import Client
from backend.basemodel import TimeBaseModel


class ProjectEquipment(TimeBaseModel):
    project = models.ForeignKey(
        "inventory.Project",  # Reference model as 'app_label.ModelName'
        on_delete=models.CASCADE,
    )
    equipment = models.ForeignKey("Equipment", on_delete=models.CASCADE)
    assignment_date = models.DateField()
    release_date = models.DateField(null=True, blank=True)
    hours_allocated = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    hours_used = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.equipment.name} - {self.project.name}"

    class Meta:
        unique_together = ["project", "equipment", "assignment_date", "release_date"]
        ordering = ["-assignment_date"]
        verbose_name_plural = "Project Equipment"
