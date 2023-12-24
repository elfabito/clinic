# Generated by Django 4.2.4 on 2023-12-24 10:25

import booking.models
import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import multiselectfield.db.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('is_doctor', models.BooleanField(default=False)),
                ('is_patient', models.BooleanField(default=False)),
                ('email', models.EmailField(db_index=True, max_length=250, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', booking.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Doctor',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('position', models.CharField(blank=True, choices=[('Kinesiologia', 'Kinesiologia'), ('Masajista', 'Masajista'), ('Quiropraxia', 'Quiropraxia'), ('Otro', 'Otro')], max_length=100)),
                ('employment_date', models.DateTimeField(default=datetime.datetime.now)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('phone', models.CharField(blank=True, max_length=17)),
                ('description', models.TextField(null=True)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Dont want to say', 'Dont want to say')], max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Dont want to say', 'Dont want to say')], max_length=128)),
                ('phone', models.CharField(blank=True, max_length=17)),
                ('date_recorded', models.DateTimeField(default=datetime.datetime.now)),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('history', models.TextField()),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='DayTimeAvailable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lunes', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('09:00 – 10:00', '09:00 – 10:00'), ('10:00 – 11:00', '10:00 – 11:00'), ('11:00 – 12:00', '11:00 – 12:00'), ('13:00 – 14:00', '13:00 – 14:00'), ('14:00 – 15:00', '14:00 – 15:00'), ('15:00 – 16:00', '15:00 – 16:00'), ('16:00 – 17:00', '16:00 – 17:00'), ('17:00 – 18:00', '17:00 – 18:00'), ('18:00 – 19:00', '18:00 – 19:00')], max_length=103, null=True)),
                ('martes', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('09:00 – 10:00', '09:00 – 10:00'), ('10:00 – 11:00', '10:00 – 11:00'), ('11:00 – 12:00', '11:00 – 12:00'), ('13:00 – 14:00', '13:00 – 14:00'), ('14:00 – 15:00', '14:00 – 15:00'), ('15:00 – 16:00', '15:00 – 16:00'), ('16:00 – 17:00', '16:00 – 17:00'), ('17:00 – 18:00', '17:00 – 18:00'), ('18:00 – 19:00', '18:00 – 19:00')], max_length=103, null=True)),
                ('miercoles', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('09:00 – 10:00', '09:00 – 10:00'), ('10:00 – 11:00', '10:00 – 11:00'), ('11:00 – 12:00', '11:00 – 12:00'), ('13:00 – 14:00', '13:00 – 14:00'), ('14:00 – 15:00', '14:00 – 15:00'), ('15:00 – 16:00', '15:00 – 16:00'), ('16:00 – 17:00', '16:00 – 17:00'), ('17:00 – 18:00', '17:00 – 18:00'), ('18:00 – 19:00', '18:00 – 19:00')], max_length=103, null=True)),
                ('jueves', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('09:00 – 10:00', '09:00 – 10:00'), ('10:00 – 11:00', '10:00 – 11:00'), ('11:00 – 12:00', '11:00 – 12:00'), ('13:00 – 14:00', '13:00 – 14:00'), ('14:00 – 15:00', '14:00 – 15:00'), ('15:00 – 16:00', '15:00 – 16:00'), ('16:00 – 17:00', '16:00 – 17:00'), ('17:00 – 18:00', '17:00 – 18:00'), ('18:00 – 19:00', '18:00 – 19:00')], max_length=103, null=True)),
                ('viernes', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('09:00 – 10:00', '09:00 – 10:00'), ('10:00 – 11:00', '10:00 – 11:00'), ('11:00 – 12:00', '11:00 – 12:00'), ('13:00 – 14:00', '13:00 – 14:00'), ('14:00 – 15:00', '14:00 – 15:00'), ('15:00 – 16:00', '15:00 – 16:00'), ('16:00 – 17:00', '16:00 – 17:00'), ('17:00 – 18:00', '17:00 – 18:00'), ('18:00 – 19:00', '18:00 – 19:00')], max_length=103, null=True)),
                ('sabado', multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('09:00 – 10:00', '09:00 – 10:00'), ('10:00 – 11:00', '10:00 – 11:00'), ('11:00 – 12:00', '11:00 – 12:00'), ('13:00 – 14:00', '13:00 – 14:00'), ('14:00 – 15:00', '14:00 – 15:00'), ('15:00 – 16:00', '15:00 – 16:00'), ('16:00 – 17:00', '16:00 – 17:00'), ('17:00 – 18:00', '17:00 – 18:00'), ('18:00 – 19:00', '18:00 – 19:00')], max_length=103, null=True)),
                ('doctor', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='daytime', to='booking.doctor')),
            ],
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('phone', models.CharField(max_length=200)),
                ('service', models.CharField(max_length=50)),
                ('datetime', models.DateTimeField()),
                ('comment', models.TextField(blank=True)),
                ('time_ordered', models.DateTimeField(auto_now_add=True)),
                ('canceled', models.BooleanField(default=False)),
                ('approved', models.BooleanField(default=False)),
                ('doctor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='booking.doctor')),
                ('patient', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='booking.patient')),
            ],
        ),
    ]
