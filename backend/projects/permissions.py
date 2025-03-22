from rest_framework.permissions import BasePermission,SAFE_METHODS
from .models import ProjectMember

class IsProjectManagerOrIsProjectMember(BasePermission):
        def has_object_permission(self, request, view, obj):
            if request.method in SAFE_METHODS:
                return True

            if obj.user == request.user:
                return True

            if ProjectMember.objects.filter(project=obj, user=request.user, status='a').exists():
                return request.method in SAFE_METHODS
            
            return False



class IsTaskAssignedOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if obj.project.user == request.user:
            return True

        if obj.assigned_to == request.user:
            allowed_fields = {"status", "completed_at", "updated_at"}
            if set(request.data.keys()).issubset(allowed_fields):
                return True
            return False

        if ProjectMember.objects.filter(project=obj.project, user=request.user, status="a").exists():
            return request.method in SAFE_METHODS

        return False
