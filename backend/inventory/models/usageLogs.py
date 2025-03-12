from django.db import models
from .equipment import Equipment
from backend.basemodel import TimeBaseModel

class UsageLog(TimeBaseModel):
    USAGE_TYPE_CHOICES = [
        ("operational", "Operational Use"),
        ("testing", "Testing/Calibration"),
        ("training", "Training"),
        ("standby", "Standby Time"),
    ]

    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    date_logged = models.DateField(auto_now_add=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    hours_used = models.DecimalField(max_digits=6, decimal_places=2)
    usage_type = models.CharField(max_length=20, choices=USAGE_TYPE_CHOICES)

    # Location during usage
    location = models.CharField(max_length=255)
    project = models.CharField(max_length=255, blank=True)

    # Maintenance triggers
    maintenance_alert = models.BooleanField(default=False)
    alert_reason = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Calculate hours used if not provided
        if not self.hours_used:
            time_diff = self.end_time - self.start_time
            self.hours_used = time_diff.total_seconds() / 3600

        # Check maintenance thresholds
        total_hours = (
            UsageLog.objects.filter(equipment=self.equipment).aggregate(
                total=models.Sum("hours_used")
            )["total"]
            or 0
        )

        total_hours += self.hours_used

        # Check if maintenance is needed (example threshold: 2000 hours)
        if total_hours >= 2000:
            self.maintenance_alert = True
            self.alert_reason = "Equipment has reached 2000 hours of operation"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.equipment.name} - {self.hours_used} hrs ({self.usage_type})"

    class Meta:
        ordering = ["-date_logged"]
        indexes = [
            models.Index(fields=["equipment", "date_logged"]),
            models.Index(fields=["maintenance_alert"]),
        ]
