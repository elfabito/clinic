import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import  HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django import forms
from django.http import JsonResponse


def index(request):
    return render(request, "index.html",{})

@csrf_exempt
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
        
        first_name = request.POST["first_name"].capitalize()
        last_name = request.POST["last_name"].capitalize()
        email = request.POST["email"].lower()

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "registerpatient.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = CustomUser.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
            user.is_patient = True
            user.save()
            patient = Patient.objects.create(user=user)
            patient.save()
        except IntegrityError:
            return render(request, "registerpatient.html", {
                "message": "We have a user register with that email."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("perfil"))
        # return JsonResponse({"message": "User register successfully."}, status=201)
    else:
        return render(request, "registerpatient.html")
    

@csrf_exempt    
def registerDoctor(request):
    
    if request.method == "POST":
        specialist = request.POST["specialist"]
        first_name = request.POST["first_name"].capitalize()
        last_name = request.POST["last_name"].capitalize()
        email = request.POST["email"].lower()

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "registerdoctor.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = CustomUser.objects.create_user(email=email, password=password,first_name=first_name,last_name=last_name)
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
        return HttpResponseRedirect(reverse("perfildoctor"))
    else:
        return render(request, "registerdoctor.html")    
    

def perfil(request):
    patient = Patient.objects.get(user=request.user)
    appointments = Appointment.objects.filter(patient=patient).order_by('datetime')
    approved = appointments.filter(approved=True).count()
    canceled = appointments.filter(canceled=True).count()
    forapproved = appointments.count() - approved - canceled
    doctors = Doctor.objects.all()
    return render(request, "profilepatient.html",{"patient":patient,"count_approved":approved, "count_canceled": canceled,"count_forapproved":forapproved,"appointment":appointments,"doctors":doctors})

@csrf_exempt
def editUser(request, id):
    
    try:
        user = CustomUser.objects.get(pk=id)
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
            
            return JsonResponse(doctor.serialize(), safe=False)
    elif request.method == "PUT":
        
        
        data = json.loads(request.body)
        if data.get("first_name") is not None:
                user.first_name = data["first_name"].capitalize()
        if data.get("last_name") is not None:
                user.last_name = data["last_name"].capitalize()
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

            doctor.save()
        

        
        return HttpResponse(status=204)
        # return HttpResponseRedirect(reverse("index"))
        return JsonResponse({"message": "User register successfully."}, status=201)
    else:
        return render(request, "registerpatient.html")   


class CommentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields=['datetime', 'comment']
        
        widgets = {
            'comment':forms.Textarea(attrs={'class':'form-control rounded-0', 'row':3}),
        }


class imageForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields=['image']


@csrf_exempt
def available(request,id):
    try:
        user = CustomUser.objects.get(pk=id)
        doctor = Doctor.objects.get(user=user)
        
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
            martes = data.get("martes"),
            miercoles = data.get("miercoles"),
            jueves = data.get("jueves"),
            viernes = data.get("viernes"),
            sabado = data.get("sabado")
            
            available.lunes = lunes
            available.martes = martes
            available.miercoles = miercoles
            available.jueves = jueves
            available.viernes = viernes
            available.sabado = sabado
           
            available.save()
        
        return HttpResponse(status=204)

@login_required
@csrf_exempt
def perfilDoctor(request):
    try:
        form = imageForm()
        doctor = Doctor.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor).order_by('datetime')
        
        approved = appointments.filter(approved=True).count()
        canceled = appointments.filter(canceled=True).count()
        forapproved = appointments.count() - approved - canceled
        daytime = DayTimeAvailable.objects.get(doctor=doctor)
       
    except Doctor.DoesNotExist:
        return JsonResponse({"error": "No Doctor found with that user."}, status=404)
    if request.method == "GET":
        return render(request, "profiledoctor.html",{"doctor":doctor,"count_approved":approved, "count_canceled": canceled,"count_forapproved":forapproved,"form":form,"appointment":appointments,"daytime":daytime.serialize() })
    elif request.method== "POST":
        
        image = request.FILES.get('imagefile')
        doctor.image = image
        doctor.save()
    return HttpResponseRedirect(reverse("perfildoctor")) 

@login_required
@csrf_exempt
def reserva(request):
    try:
        user = CustomUser.objects.get(pk=request.user.id)
        patient = Patient.objects.get(user=user)
        form = CommentForm()
    
    except Patient.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
    if request.method == "GET":
        return render(request , "reserva.html", {
            "patient":patient,
            "form": form, 
        })
    elif request.method == "POST":
        
        data = json.loads(request.body)

        service = data.get("service","")
        doctor = data.get("doctor","")
        datetimeget = data.get("datetime")
        comment = data.get("comment")
        doctor = CustomUser.objects.get(pk = doctor["user_id"])
        doctor_selected = Doctor.objects.get(user=doctor)

        new_appointment = Appointment.objects.create(
            patient=patient,
            comment=comment,
            service=service,
            
            datetime = datetimeget,
            doctor=doctor_selected  ,
            phone=patient.phone
            )
        new_appointment.save()
        messages.success(request, message= 'Register Successfully, wait for approved')
        return JsonResponse({"msg": 'Register Successfully, wait for approved'}, status=404)
            

@login_required
@csrf_exempt
def reservaUser(request, id):
    try:
         
       appointment = Appointment.objects.get(pk=id)
   
    except Patient.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    if request.method == "GET":
        return JsonResponse(appointment.serialize())
    elif request.method == "PUT":
        data = json.loads(request.body)
        approved = data.get("approved")
        appointment.approved = approved
        canceled = data.get("canceled")
        appointment.canceled = canceled
        appointment.save()
        
    
        return HttpResponse(status=204)
    elif request.method == "DELETE":
        appointment.delete()
        # return HttpResponseRedirect(reverse("index"))
        return JsonResponse({"message": "Appoinment deleted successfully."}, status=201)
      

def allDoctors(request):
    doctors = Doctor.objects.all()
    return JsonResponse([doctor.serialize() for doctor in doctors], safe=False)


def doctors(request):
    doctors = Doctor.objects.all()
    available = DayTimeAvailable.objects.all()
    return render(request, 'doctors.html', {
        'doctors':doctors,
        'available': available
        
    })


def doctor(request,id):
    try:
        user = User.objects.get(id =id)
        doctor = Doctor.objects.get(user = user)
    except Doctor.DoesNotExist:
        return JsonResponse({"error": "Doctor not found."}, status=404)
    if request.method == "PUT":
        image = request.FILES.get('image')
        
        doctor.image=image
        doctor.save()
        
        
    