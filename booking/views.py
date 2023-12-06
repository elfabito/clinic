import json
from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import  redirect, render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django import forms

def index(request):
    return render(request, "index.html",{})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, email=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


@csrf_exempt
def registerPatient(request):
    if request.method == "POST":
        
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "registerpatient.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
            user.is_patient = True
            user.save()
            patient = Patient.objects.create(user=user)
            patient.save()
        except IntegrityError:
            return render(request, "registerpatient.html", {
                "message": "We have a user register with that email."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
        # return JsonResponse({"message": "User register successfully."}, status=201)
    else:
        return render(request, "registerpatient.html")
    

@csrf_exempt    
def registerDoctor(request):
    
    if request.method == "POST":
        specialist = request.POST["specialist"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "registerdoctor.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email=email, password=password,first_name=first_name,last_name=last_name)
            user.is_doctor = True
            user.save()
            doctor = Doctor.objects.create(user=user, position=specialist )
            daytime  = DayTimeAvailable.objects.create(doctor=doctor)
            daytime.save()
            doctor.save()
        except IntegrityError:
            return render(request, "registerdoctor.html", {
                "message": "We have a user register with that email."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "registerdoctor.html")    
    

# Create your views here.
def perfil(request):
    patient = Patient.objects.get(user=request.user)
    doctors = Doctor.objects.all()
    return render(request, "profilepatient.html",{"patient":patient, "doctors":doctors})

# def available(request, id):
#     try:
#         user = User.objects.get()
#         doctor = Doctor.objects.get(user=user)
#         daytime= DayTimeAvailable.objects.get()
        
#     except DayTimeAvailable.DoesNotExist:
#         return JsonResponse({"error": "User not found."}, status=404)
#     if request.method == "GET":
#         return JsonResponse(daytime.serialize())
@csrf_exempt
def editUser(request, id):
    
    try:
        user = User.objects.get(pk=id)
        all_doctors = Doctor.objects.all()
        if user.is_patient:
            patient = Patient.objects.get(user=user)
        elif user.is_doctor:
            doctor = Doctor.objects.get(user=user)
            available= DayTimeAvailable.objects.get(doctor=doctor)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    if request.method == "GET":
        if user.is_patient == True:
            return JsonResponse(patient.serialize())
        elif user.is_doctor == True:
            # available_serialize = available.serialize()
            # data = {
            #     "doctor":doctor.serialize(),
            #     "available": available_serialize
            # }
            return JsonResponse(doctor.serialize(), safe=False)
    elif request.method == "PUT":
        
        
        data = json.loads(request.body)
        if data.get("first_name") is not None:
                user.first_name = data["first_name"]
        if data.get("last_name") is not None:
                user.last_name = data["last_name"]
        user.save()
        if user.is_patient == True:
            if data.get("phone") is not None:
                patient.phone = data["phone"]
            if data.get("gender") is not None:
                patient.gender = data["gender"]    
            
            
            patient.save()    
        elif user.is_doctor == True:
            
            if data.get("phone") is not None:
                doctor.phone = data["phone"]
            if data.get("gender") is not None:
                doctor.gender = data["gender"]
            if data.get("position") is not None:
                doctor.position = data["position"]
            if data.get("description") is not None:
                doctor.description = data["description"]
            
            # lunes = data.get("lunes"),
            # print(lunes)
            # martes = data.get("martes"),
            # miercoles = data.get("miercoles"),
            # jueves = data.get("jueves"),
            # viernes = data.get("viernes"),
            # sabado = data.get("sabado")
            # print(sabado)
            # available.lunes = lunes
            # available.martes = martes
            # available.miercoles = miercoles
            # available.jueves = jueves
            # available.viernes = viernes
            # available.sabado = sabado
            
            # print(available)
            # available.save()
            
            # available = data.getlist("available")
            # doctor.available = available
            doctor.save()
        
    # elif request.method == "POST":    
        
                
    #             doctor.save()
    #             return HttpResponse(status=204)
        
    #     # Ensure password matches confirmation
        
        
        
        return HttpResponse(status=204)
        # return HttpResponseRedirect(reverse("index"))
        return JsonResponse({"message": "User register successfully."}, status=201)
    else:
        return render(request, "registerpatient.html")   

class FormPosition(forms.ModelForm):
    class Meta:
        
        model = Doctor
        fields = ['position']
        onchange="dynamicdropdown(this)"
        widget=forms.Select(attrs={"onchange":'dynamicdropdown(this)'})
class FormTime(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['time']
@csrf_exempt
def available(request,id):
    try:
        user = User.objects.get(pk=id)
        doctor = Doctor.objects.get(user=user)
        all_doctors = Doctor.objects.all()
        if user.is_doctor:
            
            available= DayTimeAvailable.objects.get(doctor=doctor)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    if request.method == "GET":
        if user.is_doctor == True:
            available_serialize = available.serialize()
            data = {
                "doctor":doctor.serialize(),
                "available": available_serialize
            }
            return JsonResponse(data, safe=False)
    elif request.method == "PUT":
        
        
        data = json.loads(request.body)
        if user.is_doctor == True:
            
           
            
            lunes = data.get("lunes"),
            print(lunes)
            martes = data.get("martes"),
            miercoles = data.get("miercoles"),
            jueves = data.get("jueves"),
            viernes = data.get("viernes"),
            sabado = data.get("sabado")
            print(sabado)
            available.lunes = lunes
            available.martes = martes
            available.miercoles = miercoles
            available.jueves = jueves
            available.viernes = viernes
            available.sabado = sabado
            
            print(available)
            available.save()
            
            # available = data.getlist("available")
            # doctor.available = available
            
        
    # elif request.method == "POST":    
        
                
    #             doctor.save()
    #             return HttpResponse(status=204)
        
    #     # Ensure password matches confirmation
        
        
        
        return HttpResponse(status=204)
def perfilDoctor(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
        daytime = DayTimeAvailable.objects.get(doctor=doctor)
        # form = FormAvailable(request.POST)
        # form2 = AvailableForm()
    except Doctor.DoesNotExist:
        return JsonResponse({"error": "No Doctor found with that user."}, status=404)
    
    return render(request, "profiledoctor.html",{"doctor":doctor,"daytime":daytime.serialize() })
def reserva(request):
        try:
            user = User.objects.get(pk=request.user.id)
            doctor = User.objects.filter(is_doctor=True)
            patient = Patient.objects.get(user=user)
            kinesiologo = Doctor.objects.filter(position="Kinesiologia")
            masajista = Doctor.objects.filter(position="Masajista")
            Quiropraxia = Doctor.objects.filter(position="Quiropraxia")
            form = FormPosition()
            # formTime = FormTime()
            print(f'ASDSADS {kinesiologo.first()}')
        except Patient.DoesNotExist:
                return JsonResponse({"error": "Post not found."}, status=404)
        if request.method == "GET":
            return render(request , "reserva.html", {
                "patient":patient,
                "form": form, 
                # "formTime": formTime, 
                "k": kinesiologo.first(),
                "m": masajista,
                "q": Quiropraxia
                })
@csrf_exempt
def reservaUser(request, id):
    try:
        user = User.objects.get(pk=id)
        doctor = User.objects.filter(is_doctor=True)
        patient = Patient.objects.get(user=user)
        kinesiologo = Doctor.objects.filter(position="Kinesiologia")
        masajista = Doctor.objects.filter(position="Masajista")
        Quiropraxia = Doctor.objects.filter(position="Quiropraxia")
        # form = FormPosition()
        # formTime = FormTime()
        print(f'ASDSADS {kinesiologo.first()}')
    except Patient.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    if request.method == "GET":
        return render(request , "reserva.html", {
            "patient":patient,
            # "form": form, 
            # "formTime": formTime, 
            "k": kinesiologo.first(),
            "m": masajista,
            "q": Quiropraxia
             })
        # return JsonResponse(appointment.serialize())
    elif request.method == "PUT":
        
        
        data = json.loads(request.body)
        doctor_data = data.get("doctor")
        print(doctor_data)
        doctor_selected = Doctor.objects.filter(id == doctor_data)
        print(doctor_selected)
        service = data.get("service","")
        print(service)
        print(doctor)
        dayOrdered = data.get("dayOrdered","")
        timeOrdered = data.get("timeOrdered","")
        timeConsulta = data.get("timeConsulta","")
        dayConsulta = data.get("dayConsulta")
        
        
        new_appointment = Appointment(
            patient=patient,
            doctor = doctor_selected,
            service=service,
            timeConsulta=timeConsulta,
            dayConsulta=dayConsulta, 
            timeOrdered=timeOrdered, 
            dayOrderedrdered=dayOrdered,
            phone=patient.phone
            )
        new_appointment.save()
        return HttpResponse(status=204)
        # return HttpResponseRedirect(reverse("index"))
        return JsonResponse({"message": "User register successfully."}, status=201)
    else:
        return render(request, "registerpatient.html")   
    
def userPanel(request):
    user = request.user
    appointments = Appointment.objects.filter(user=user).order_by('day', 'time')
    return render(request, 'userPanel.html', {
        'user':user,
        'appointments':appointments,
    })

def allDoctors(request):
    doctors = Doctor.objects.all()
    return JsonResponse([doctor.serialize() for doctor in doctors], safe=False)

# TIME_CHOICES = (
#         (0, '09:00 – 10:00'),
#         (1, '10:00 – 11:00'),
#         (2, '11:00 – 12:00'),
#         (3, '13:00 – 14:00'),
#         (4, '14:00 – 15:00'),
#         (5, '15:00 – 16:00'),
#         (6, '17:00 – 18:00'),
#         (7, '18:00 – 19:00'),
#         (8, '19:00 – 20:00'),
#     )

# class FormAvailable(forms.ModelForm):
#     class Meta:
#         model = Doctor
#         fields = ['available']

# class AvailableForm(forms.Form):
    
#     Horarios = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple,
#                                           choices=TIME_CHOICES)

# @csrf_exempt
# def editDoctor(request, id):   
      
#     try:
#         user = User.objects.get(pk=id)
#         doctor = Doctor.objects.get(user=user)
#     except Doctor.DoesNotExist:
#         return JsonResponse({"error": "No Doctor found with that user."}, status=404)
#     if request.method == "GET":
#         return JsonResponse(doctor.serialize())
#     elif request.method == "PUT":
        
        
#         data = json.loads(request.body)
#         if data.get("phone") is not None:
#                 doctor.phone = data["phone"]
        
#         if data.get("gender") is not None:
#            doctor.gender = data["gender"]
#         if data.get("description") is not None:
#            doctor. description = data[" description"]
#         # description = data.get("description","")
#         specialist = data.get("position","")
#         # doctor.description - description
#         doctor.position = specialist
#         doctor.save()
#         # Ensure password matches confirmation
        
       
        
#         return HttpResponse(status=204)
#         # return HttpResponseRedirect(reverse("index"))
#         return JsonResponse({"message": "User register successfully."}, status=201)
#     else:
#         return render(request, "registerdoctor.html")  

# def booking(request):
#     #Calling 'validWeekday' Function to Loop days you want in the next 21 days:
#     weekdays = validWeekday(22)

#     #Only show the days that are not full:
#     validateWeekdays = isWeekdayValid(weekdays)
    

#     if request.method == 'POST':
#         service = request.POST.get('service')
#         day = request.POST.get('day')
#         if service == None:
#             messages.success(request, "Please Select A Service!")
#             return redirect('booking')

#         #Store day and service in django session:
#         request.session['day'] = day
#         request.session['service'] = service

#         return redirect('bookingSubmit')


#     return render(request, 'booking.html', {
#             'weekdays':weekdays,
#             'validateWeekdays':validateWeekdays,
#         })

