from django.db import models
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
    

class CustomUser(AbstractUser):
    
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
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    position = models.CharField(max_length=100, choices=CHOICES, blank=True)
    employment_date = models.DateTimeField(default=datetime.now)
    
    
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
            
            "description": self.description,
            "gender": self.gender,
            "phone": self.phone,
            
        }
    
class DayTimeAvailable(models.Model):
    doctor = models.OneToOneField(Doctor, null=True, on_delete=models.CASCADE, related_name="daytime")
    lunes = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    martes = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    miercoles = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    jueves = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    viernes = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    sabado = MultiSelectField(max_choices=3,max_length=33, choices=TIME_CHOICES, blank=True, null=True)
    def __str__(self):
        return f'HORARIOS DE {self.doctor.user.first_name} // Lunes : {[time for time in self.lunes ]}  Martes : {[time for time in self.martes]} </br> Miercoles : {[time for time in self.miercoles]} </br> Jueves : {[time for time in self.jueves]} </br> Viernes : {[time for time in self.viernes]} </br> Sabado : {[time for time in self.sabado]}'
    def serialize(self):
        return {
            "doctor": self.doctor.user.first_name,
            "position": self.doctor.position,
            "lunes": self.lunes,
            "martes": self.martes,
            "miercoles": self.miercoles,
            "jueves" : self.jueves,
            "viernes": self.viernes,
            "sabado": self.sabado
            
        }
    
class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=128)
       
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
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    phone = models.CharField(max_length=200)
    doctor = models.CharField(max_length=50)
    service = models.CharField(max_length=50)
   
    datetime = models.DateTimeField(blank=False, null=False)
    comment = models.TextField( blank=True)
    time_ordered = models.DateTimeField(null=False, blank=False,auto_now_add=True)
    
    approved = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.patient.user.first_name} | day: {self.datetime} | timeorder: {self.time_ordered}"
    
    def algo(self):
        user = CustomUser.objects.get(first_name = self.doctor)
        doctor = Doctor.objects.get(user = user)
        appoint = DayTimeAvailable.objects.filter(doctor=doctor)
        daytime = self.datetime.split("T")
        day = daytime[0]
        time = daytime[1]
        print(time)
        print(day)
        print(appoint)
    def serialize(self):
        return {
            "id": self.id,
            "patient": self.patient.user.first_name,
            "phone": self.phone,
            "doctor":self.doctor,
            "service": self.service,
            "day" : self.datetime,
            
            "time_ordered": self.time_ordered,
            
            "approved": self.approved,
        }
class History(models.Model):
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    history = models.TextField()

    def __str__(self):
        return self.patient.first_name
    def serialize(self):
        return {
            "patient": self.patient,
            "history": self.history,
            
        }

    
   