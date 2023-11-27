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
    path("profiledoctor", views.perfilDoctor, name="perfildoctor"),

    path("reserva", views.reserva, name="reservas")
 
]