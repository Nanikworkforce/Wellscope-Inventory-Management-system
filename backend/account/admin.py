from django.contrib import admin
from account.models import User,ResetPassword

admin.site.register(User)
admin.site.register(ResetPassword)