from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView,RetrieveUpdateDestroyAPIView,CreateAPIView,UpdateAPIView
from rest_framework.response import Response
from django.db import models
from django.shortcuts import get_object_or_404

from .models import Project , Task , ProjectMember
from .serializers import ProjectListSerializer,ProjectSerializer,TaskSerializer,ProjectStatusSerializer,TaskStatusSerializer,ProjectInviteSerializer,ProjectMemberStatusSerializer,ProjectWithMemberStatusSerializer

from .permissions import IsProjectManagerOrIsProjectMember,IsTaskAssignedOrReadOnly
# Create your views here.


class ProjectList(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]  
    filterset_fields = ['status','title','slug']
    ordering_fields = ['deadline', 'created_at', 'updated_at']
    search_fields = ['title', 'description', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
            return Project.objects.filter(
                models.Q(user=self.request.user) |  
                models.Q(project_members__user=self.request.user, project_members__status='a')  
            ).distinct()
    
class ProjectDetailInfo(RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated,IsProjectManagerOrIsProjectMember]

    def get_queryset(self):
            return Project.objects.filter(
                models.Q(user=self.request.user) |  
                models.Q(project_members__user=self.request.user, project_members__status='a')
            ).distinct()

class ProjectStatusUpdate(UpdateAPIView):
    queryset = Project
    permission_classes = [IsAuthenticated,IsProjectManagerOrIsProjectMember]
    serializer_class = ProjectStatusSerializer

class ProjectCreate(CreateAPIView):
    queryset = Project
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskList(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated,IsTaskAssignedOrReadOnly]  
    filter_fields = ['priority']
    ordering_fields = ['due_date', 'created_at', 'updated_at']
    search_fields = ['title', 'description', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
            return Task.objects.filter(
                models.Q(project__user=self.request.user) |  
                models.Q(project__project_members__user=self.request.user, project__project_members__status='a')  
            ).distinct()
            

class TaskDetailInfo(RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated,IsTaskAssignedOrReadOnly]
    lookup_field = "slug"
    def get_queryset(self):
            return Task.objects.filter(
                models.Q(project__user=self.request.user) |  
                models.Q(project__project_members__user=self.request.user, project__project_members__status='a')
            ).distinct()

    
class TaskStatusUpdate(UpdateAPIView):
    queryset = Task
    permission_classes = [IsAuthenticated,IsTaskAssignedOrReadOnly]
    serializer_class = TaskStatusSerializer

class TaskCreate(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save()


class ProjectInviteView(CreateAPIView):
    serializer_class = ProjectInviteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.all()

    def get_serializer_context(self):
        project = get_object_or_404(Project, pk=self.kwargs["pk"])

        if project.user != self.request.user:
            raise PermissionError("Only the project owner can invite users!")

        return {"project": project}


class AcceptProjectInvite(UpdateAPIView):
    queryset = ProjectMember.objects.filter(status="p")
    serializer_class = ProjectMemberStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        project_id = self.kwargs["project_id"]
        user_id = self.kwargs["user_id"]

        if self.request.user.id != user_id:
            raise PermissionDenied("You cannot accept this invitation!")

        return get_object_or_404(ProjectMember, project_id=project_id, user_id=user_id, status="p")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = "a"
        instance.save()

        return Response({"message": "You have successfully joined the project!"})
    
class RejectProjectInvite(UpdateAPIView):
    queryset = ProjectMember.objects.filter(status="p")
    serializer_class = ProjectMemberStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        project_id = self.kwargs["project_id"]
        user_id = self.kwargs["user_id"]

        if self.request.user.id != user_id:
            raise PermissionDenied("You cannot accept this invitation!")

        return get_object_or_404(ProjectMember, project_id=project_id, user_id=user_id, status="p")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = "r"
        instance.save()

        return Response({"message": "You have Rejected the project!"})

class ProjectListWithUserStatusView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectWithMemberStatusSerializer

    def get_queryset(self):
        user = self.request.user
        projects = Project.objects.filter(project_members__user=user)
        return projects

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context
