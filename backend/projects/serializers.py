from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from datetime import date
from .models import Project,Task,ProjectMember

#Project List Serializer
class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"

    def validate_deadline(self, value):
        created_at = self.instance.created_at if self.instance else date.today()
        if value and value < created_at:
            return serializers.ValidationError("the deadline must not be Before created date! Please check deadline field ")
    
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
    
    def validate_due_date(self, value):
        created_at = self.instance.created_at if self.instance else date.today()
        if value and value < created_at:
            return serializers.ValidationError("The due date must not be before created date! Please Check the due date field")
        return value
    
    def validate_assigned_to(self, value):
        project = self.instance.project if self.instance else self.initial_data.get('project')

        if not project:
            raise serializers.ValidationError("Project isn't valid!")

        if not (ProjectMember.objects.filter(project=project, user=value, status='a').exists() or Project.user != value):
            raise serializers.ValidationError("The User is not a member of your Project!")

        return value
    
class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True,read_only=True)
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "deadline",
            "status",
            "user",
            "created_at",
            "updated_at",
            "tasks"
        )


class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("status",)

class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ("status",)



class ProjectInviteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = ProjectMember
        fields = ["email"]

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist!")

        project = self.context["project"]

        if ProjectMember.objects.filter(project=project, user=user).exists():
            raise serializers.ValidationError("User is already a member or invited!")



        return value

    def create(self, validated_data):
        user = User.objects.get(email=validated_data["email"])
        project = self.context["project"]


        project_member = ProjectMember.objects.create(project=project, user=user, status="p")

        confirmation_link = f"http://127.0.0.1:8000/api/projects/{project.id}/confirm/{user.id}/"


        send_mail(
            subject=f"Invitation to join {project.title}",
            message=f"Hi {user.username},\n\n"
                    f"You have been invited to join the project '{project.title}'.\n"
                    f"Click the link below to accept the invitation:\n{confirmation_link}\n\n"
                    "If you did not request this, please ignore this email.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return project_member


class ProjectMemberStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMember
        fields = ["status"]


class ProjectWithMemberStatusSerializer(serializers.ModelSerializer):
    user_status = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "deadline",
            "status",
            "created_at",
            "updated_at",
            "user_status"
        )

    def get_user_status(self, obj):
        user = self.context.get('user') 
        if user:
            try:
                project_member = ProjectMember.objects.get(project=obj, user=user)
                return project_member.status
            except ProjectMember.DoesNotExist:
                return "Not a member"
        return "User not provided"

