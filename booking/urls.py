from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("registerpatient", views.registerPatient, name="registerPatient"),
    path("registerdoctor", views.registerDoctor, name="registerdoctor"),
   
    path("doctors", views.doctors, name="alldoctors"),
    path("profiledoctor", views.perfilDoctor, name="perfildoctor"),
    path("profile", views.perfil, name="perfil"),
    path("reserva", views.reserva, name="reservas"),
    
    # API Routes
    path("profile/<int:id>", views.editUser, name="edituser"),
    path("available/<int:id>", views.available, name="available"),
    path("alldoctors", views.allDoctors, name="doctors"),
    path("doctor/<int:id>", views.doctor, name="doctor"),
    path("reserva/<int:id>", views.reservaUser, name="reservaUser"),
   

 
]