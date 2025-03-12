from django.db import models
from backend.basemodel import TimeBaseModel
from .equipment import Equipment
from .project_pipeline import Project


class FinancialRecord(TimeBaseModel):
    TRANSACTION_TYPES = [
        ("purchase", "Equipment Purchase"),
        ("maintenance", "Maintenance Cost"),
        ("repair", "Repair Cost"),
        ("depreciation", "Depreciation"),
        ("operating", "Operating Cost"),
        ("rental", "Rental Income"),
        ("project", "Project Revenue"),
    ]

    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
        ("cancelled", "Cancelled"),
    ]

    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="financial_records",
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="financial_records",
    )

    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")

    # Depreciation specific fields
    depreciation_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Annual depreciation rate in percentage",
    )
    depreciation_method = models.CharField(
        max_length=20,
        choices=[
            ("straight_line", "Straight Line"),
            ("declining_balance", "Declining Balance"),
            ("sum_years", "Sum of Years"),
        ],
        null=True,
        blank=True,
    )

    # Reference information
    invoice_number = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        base = f"{self.get_transaction_type_display()} - ${self.amount}"
        if self.equipment:
            return f"{base} ({self.equipment.name})"
        elif self.project:
            return f"{base} ({self.project.name})"
        return base

    def calculate_depreciation(self):
        if not self.equipment or not self.depreciation_rate:
            return 0

        initial_value = self.equipment.purchase_price
        age_in_years = (self.transaction_date - self.equipment.purchase_date).days / 365

        if self.depreciation_method == "straight_line":
            return initial_value * (self.depreciation_rate / 100)
        elif self.depreciation_method == "declining_balance":
            return initial_value * (1 - self.depreciation_rate / 100) ** age_in_years
        return 0

    class Meta:
        ordering = ["-transaction_date"]
        indexes = [
            models.Index(fields=["transaction_type", "status"]),
            models.Index(fields=["equipment", "transaction_date"]),
            models.Index(fields=["project", "transaction_date"]),
        ]
