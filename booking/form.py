from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction
from .models import *

# class PatientSignupForm(UserCreationForm):
#     first_name = forms.CharField(required=True)
#     last_name = forms.CharField(required=True)
#     phone = forms.CharField(required=True)

#     class Meta(UserCreationForm):
#         model = User

#     @transaction.atomic
#     def data_save(self):
#         user = super().save(commit=False)
#         user.save()
#         patient = Patient.objects.create(user=user)
#         patient.first_name = self.cleaned_data.get('first_name')
#         patient.first_name = self.cleaned_data.get('last_name')
#         patient.email = self.cleaned_data.get('email')
#         patient.phone = self.cleaned_data.get('phone')
#         patient.save()
#         return user
    
# class DoctorSignupForm(UserCreationForm):
#     first_name = forms.CharField(required=True)
#     last_name = forms.CharField(required=True)
#     phone = forms.CharField(required=True)

#     class Meta(UserCreationForm):
#         model = User   

#     @transaction.atomic
#     def data_save(self):
#         user = super().save(commit=False)
#         user.save()
#         doctor = Doctor.objects.create(user=user)
#         doctor.first_name = self.cleaned_data.get('first_name')
#         doctor.first_name = self.cleaned_data.get('last_name')
#         doctor.email = self.cleaned_data.get('email')
#         doctor.phone = self.cleaned_data.get('phone')
#         doctor.save()
#         return user
    