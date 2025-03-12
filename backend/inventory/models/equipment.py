from django.db import models
from backend.basemodel import TimeBaseModel


class Equipment(TimeBaseModel):
    serial_number = models.CharField(
        max_length=100, unique=True
    )  # Barcode, RFID, Serial Number
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        "EquipmentCategory", on_delete=models.SET_NULL, null=True
    )
    purchase_date = models.DateField()
    status = models.CharField(
        max_length=50,
        choices=[
            ("active", "Active"),
            ("maintenance", "Maintenance"),
            ("decommissioned", "Decommissioned"),
        ],
    )
    condition = models.CharField(
        max_length=50,
        choices=[
            ("new", "New"),
            ("good", "Good"),
            ("worn", "Worn"),
            ("damaged", "Damaged"),
        ],
    )
    current_location = models.ForeignKey(
        "Location",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="current_equipment",
    )
    next_maintenance_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.serial_number}"
    class Meta:
        verbose_name_plural = "Equipment"