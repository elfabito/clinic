# Distinctiveness:

* **Focused Healthcare Platform:**

The application's primary emphasis on healthcare services, particularly doctor-patient interactions and appointments, sets it apart. This specialization caters exclusively to medical engagements, ensuring a tailored and relevant user experience within the healthcare domain.

* **Role-Based Differentiation:**

The clear distinction between patients and doctors, each with dedicated profiles and unique functionalities, provides specialized tools for respective user roles. This differentiation ensures that the platform serves the specific needs of patients seeking healthcare and doctors providing medical services.

* **Specialized Doctor Profiles:**

The inclusion of doctor-specific details such as picture profiles, unique positions (Kinesiology, Quiropractiq, Massage, Other), and descriptive comments distinguishes the application. These details enhance the professional credibility of doctors and empower patients with comprehensive information for informed decision-making.

* **Strategic Appointment Workflow:**

The stringent appointment scheduling logic, including restrictions on same-day bookings and mandatory profile completion before bookings, demonstrates a commitment to reliable healthcare interactions. This prioritizes accuracy and trustworthiness in appointments.

* **Professional Directory Page:**

The creation of a dedicated page showcasing registered therapists' profiles offers a centralized resource for users seeking healthcare services. This feature allows patients to explore and select therapists based on detailed information and professional backgrounds, streamlining the decision-making process.

# Complexity:

* **Role-Based Functionalities:**

Implementing role-specific actions such as appointment booking for patients, doctor approval processes, and mutual cancellation options increases system complexity. This ensures controlled and specialized interactions based on user roles.

* **Appointment Workflow Logic:**

The intricate appointment scheduling system, involving date restrictions, mandatory profile completion, and doctor approval, adds complexity. This robust system ensures a reliable and organized appointment management process.

* **User Profile Customization:**

Allowing users to manage their profiles with different sets of fields (common fields for both, specialized fields for doctors) adds complexity. This customization ensures personalized experiences for users while maintaining professionalism.

* **Doctor Availability Calculation:**

Calculating available dates based on the selected position and the doctor's specified available times increases system complexity. This feature ensures that patients can only book appointments within specific date ranges and available slots based on the therapist's schedule.

* **User Dashboard Segmentation:**

Offering segmented sections within user profiles for different appointment statuses (next appointments, approved, canceled) increases system complexity. This feature enhances user control over appointment management.

Distinctiveness lies in its specialized healthcare focus and tailored user experiences. Complexity arises from the intricacies of role-based functionalities, appointment workflows, and user profile customization, all designed specifically for the healthcare domain to ensure a reliable and efficient healthcare service platform.

# What’s contained in each file you created:

 /statics/
- inbox.js . All Javascript functions.
- Styles.css Some Style to complement the website

 /templates/
- doctors.html - Section for show all therapist
- index.html - Home Section
- layout.html - The layout or template is a diagram of the distribution of the elements. ( html tag, head, navbar, body , footer)
- login.html - Login Section
- profiledoctor.html - Profile for doctors
- profilepatient.html - Profile for patients
- registerdoctor.html - This page is not linked on website, is only for share
- registerpatient.html - Register section for visitors or futures patients
- reserva.html - Booking section.

 /booking/

- admin.py - Admin Section

- models.py - All models..
User , Doctor , Patient , DayTimeAvailable, Appoinments.  
Each attribute of the model represents a database field

- url.py - All urls..Routes for the website, and api routes restfull.

- views.py - Diferents Python functions that takes http requests and returns http response or jsonresponse depending on wich url is excecuted

- /media/images - All images upload are going to be here.

# How to run your application.

You should run

* cd C:\Users\user\Desktop\DjangoProject> pip install virtualenv

* For Create a venv run this virtualenv -p python3 venv

* Activate virtualenv venv\Scripts\activate

* It will look like this (venv) C:\Users\user\Desktop\DjangoProject>

* Then run pip install -r requirements.txt

Note : In Visual Basic:
Press "Ctrl" + "Shift" + "p" . 
Python Create Enviroment, Select venv, and select requirements.txt.
This should create the enviroments.
Open Terminal as Admin, go to your proyect folder.
and run .\env\Scripts\activate


* Migrations:

python manage.py makemigrations

python manage.py migrate

* Run the django project

python manage.py runserver

You can create a superUser,

python manage.py createsuperuser

then go to the /admin section to see all models.

# Any other additional information the staff should know about your project:

You can create Users from /admin section, where you can choose if “is_doctor” or “is_patient”, to create doctor or patient model, another choice is sharing the link /registerdoctor. And they can create by it self.

Doctors can upload profile images, if they dont upload, they have a custom img to show .
