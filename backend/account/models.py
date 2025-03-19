from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class User(AbstractUser):
    bio =models.CharField(max_length=250)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    skills = models.ManyToManyField(Skill,related_name="users_skill",blank=True)

