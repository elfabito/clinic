from django.contrib import admin
from .models import *
# Register your models here.
from .models import User

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    ordering = ('email',)


admin.site.register(Appointment)
admin.site.register(DayTimeAvailable)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(History)