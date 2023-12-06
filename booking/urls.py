from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("registerpatient", views.registerPatient, name="registerPatient"),
    path("registerdoctor", views.registerDoctor, name="registerdoctor"),


    path("profile", views.perfil, name="perfil"),
    path("profile/<int:id>", views.editUser, name="edituser"),
    path("available/<int:id>", views.available, name="available"),
    path("profiledoctor", views.perfilDoctor, name="perfildoctor"),
    path("alldoctors", views.allDoctors, name="doctors"),
    path("reserva", views.reserva, name="reservas"),
    path("reserva/<int:id>", views.reservaUser, name="reservaUser"),
    # path("available", views.available, name="available"),

 
]