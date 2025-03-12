from backend.basemodel import TimeBaseModel
from django.db import models


class Client(TimeBaseModel):
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.company_name} -- {self.contact_person}"
