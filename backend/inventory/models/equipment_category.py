from django.db import models
from backend.basemodel import TimeBaseModel

class EquipmentCategory(TimeBaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Equipment Categories"
