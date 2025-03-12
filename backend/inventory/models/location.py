from django.db import models
from .equipment import Equipment
from backend.basemodel import TimeBaseModel


class Location(TimeBaseModel):
    site = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_manual_entry = models.BooleanField(default=True)
    equipment = models.ForeignKey(
        Equipment, on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(
        max_length=255, choices=[("active", "Active"), ("inactive", "Inactive")]
    )
    lifecycle_status = models.CharField(
        max_length=255, choices=[("active", "Active"), ("inactive", "Inactive")]
    )
    tracking_info = models.CharField(
        max_length=255,
        choices=[
            ("gps", "GPS Tracking"),
            ("manual", "Manual Entry"),
            ("rfid", "RFID Tracking"),
            ("lost_signal", "Signal Lost"),
            ("untracked", "Not Tracked"),
        ],
    )
    last_updated = models.DateTimeField(auto_now=True)
    geofence_status = models.CharField(
        max_length=255,
        choices=[
            ("inside", "Inside Geofence"),
            ("outside", "Outside Geofence"),
            ("undefined", "No Geofence Set"),
        ],
        default="undefined",
    )

    def __str__(self):
        return self.site
