from django.contrib import admin
from .models import *
# Register your models here.
from .models import User
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ("email", "first_name", "last_name", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    
                    "is_doctor",
                    "is_patient"
                ),
            },
        ),
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                    "is_doctor",
                    "is_patient"
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
admin.site.register(CustomUser,CustomUserAdmin)

admin.site.register(Appointment)
admin.site.register(DayTimeAvailable)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(History)