from django.db import models
from datetime import datetime
from datetime import datetime
from django.contrib.auth.models import User 

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from multiselectfield import MultiSelectField

GENDER_CHOICES = (
    ("Male", "Male"),
    ("Female", "Female"),
    ("Dont want to say", "Dont want to say"))
CHOICES = (
    ("Kinesiologia", "Kinesiologia"),
    ("Masajista", "Masajista"),
    ("Quiropraxia", "Quiropraxia"),
    ("Otro", "Otro"),
    )
TIME_CHOICES = (
        (0, '09:00 – 10:00'),
        (1, '10:00 – 11:00'),
        (2, '11:00 – 12:00'),
        (3, '13:00 – 14:00'),
        (4, '14:00 – 15:00'),
        (5, '15:00 – 16:00'),
        (6, '16:00 – 17:00'),
        (7, '17:00 – 18:00'),
        (8, '18:00 – 19:00'),
    )
# TIME_CHOICES = (
#     ("3 PM", "3 PM"),
#     ("3:30 PM", "3:30 PM"),
#     ("4 PM", "4 PM"),
#     ("4:30 PM", "4:30 PM"),
#     ("5 PM", "5 PM"),
#     ("5:30 PM", "5:30 PM"),
#     ("6 PM", "6 PM"),
#     ("6:30 PM", "6:30 PM"),
#     ("7 PM", "7 PM"),
#     ("7:30 PM", "7:30 PM"),
# )

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users require an email field')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, email, password, first_name, last_name, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_patient', False)
        extra_fields.setdefault('is_doctor', False)
        return self._create_user(email=email, password=password,first_name=first_name, last_name=last_name, **extra_fields)

    def create_superuser(self, email, password, first_name, last_name, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_doctor', True)
        extra_fields.setdefault('is_patient', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email=email, password=password,first_name=first_name, last_name=last_name, **extra_fields)
   
    def serialize(self):
        return {
            "id": self.id,
            
            "is_doctor" : self.is_doctor,
            "is_patient": self.is_patient,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            
        }
    

class User(AbstractUser):
    username = None
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)
    
    
    email = models.EmailField(db_index=True, unique=True, max_length=250)
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    def serialize(self):
        return {
            "id": self.id,
            
            "is_doctor" : self.is_doctor,
            "is_patient": self.is_patient,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            
        }
    

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    position = models.CharField(max_length=100, choices=CHOICES)
    employment_date = models.DateTimeField(default=datetime.now)
    available = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    
    phone = models.CharField(max_length=17, blank=True)
    
    description = models.TextField(null=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=128)
    
    def __str__(self):
        return f"{self.user.first_name} | position: {self.position}"
    def serialize(self):
        return {
            "user_id": self.user.id,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "position": self.position,
            "employment_date " : self.employment_date ,
            "available": [time for time in self.available],
            "description": self.description,
            "gender": self.gender,
            "phone": self.phone,
            
        }
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=128)
    # phone = models.CharField(max_length=200)
    
    phone = models.CharField(max_length=17, blank=True)
    date_recorded = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.user.first_name
    
    def serialize(self):
        return {
            "user_id": self.user.id,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "date_recorded " : self.date_recorded,
           
            "gender": self.gender,
            "phone": self.phone,
            
        }

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)
    service = models.CharField(max_length=50, choices=CHOICES, default="Doctor care")
    day_ordered = models.DateField(default=datetime.now)
    # time = models.CharField(max_length=10, choices=TIME_CHOICES, default="3 PM")
    time = models.IntegerField(choices=TIME_CHOICES)
    day = models.DateField(max_length=10)
    time_ordered = models.DateTimeField(default=datetime.now, blank=True)
    phone = models.CharField(max_length=200)
    approved = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.user.username} | day: {self.day} | time: {self.time}"
    def serialize(self):
        return {
            "user": self.user,
            "service": self.service,
            "day" : self.day,
            "time": self.time,
            "time_ordered": self.time_ordered,
            "phone": self.phone,
            "approved": self.approved,
        }
class History(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    history = models.TextField()

    def __str__(self):
        return self.patient.first_name
    def serialize(self):
        return {
            "patient": self.patient,
            "history": self.history,
            
        }

    
   