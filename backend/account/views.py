from django.db.models import Q
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView,RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import User,Skill
from projects.models import Project
from projects.serializers import ProjectListSerializer
from .serializers import ProfileSerializer,AccountSerializer,RegistersSerializer,SkillSerializer
# Create your views here.


class UserProfile(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated,]
    def get_object(self):
        return self.request.user
    
class UserAccount(RetrieveAPIView):
    serializer_class = AccountSerializer
    lookup_field = "username"

    def get_queryset(self):
        return User.objects.all()
    
class UserCompleteProject(ListAPIView):
    serializer_class = ProjectListSerializer
    lookup_field = "username"

    def get_queryset(self):
        return Project.objects.filter(status="completed")
    
class UserProject(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Project.objects.filter(
            Q(user=self.request.user) | 
            Q(project_members__user=self.request.user, project_members__status='a')
        ).distinct()
    
class UserInviteProject(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        return Project.objects.filter( 
            Q(project_members__user=self.request.user)
        ).distinct()
        

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistersSerializer

class SkillCreateView(CreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated,]

class UserAddSkillView(CreateAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        skill_name = request.data.get("name")
        if skill_name:
            skill, _ = Skill.objects.get_or_create(name=skill_name)
            request.user.skills.add(skill)

class SkillListView(ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated,]
