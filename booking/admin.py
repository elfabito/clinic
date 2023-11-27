from django.contrib import admin
from .models import *
# Register your models here.
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


admin.site.register(Appointment)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(History)