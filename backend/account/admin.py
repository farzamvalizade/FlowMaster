from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,Skill
# Register your models here.

UserAdmin.fieldsets = (
    ("Personal info", {"fields": ("username", "first_name", "last_name", "email")}),
    ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    ("Additional Info", {"fields": ("bio","profile_picture","skills")}),
    ("Important dates", {"fields": ("last_login", "date_joined")}),
)



admin.site.register(User, UserAdmin)
admin.site.register(Skill)