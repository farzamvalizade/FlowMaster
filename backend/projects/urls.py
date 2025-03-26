from django.urls import path
from .views import ProjectList,ProjectDetailInfo,ProjectCreate,TaskList,TaskDetailInfo,TaskCreate,ProjectStatusUpdate,TaskStatusUpdate,ProjectInviteView,AcceptProjectInvite,RejectProjectInvite

urlpatterns = [
    path("projects/",ProjectList.as_view(),name="project-list"),
    path("projects/<int:pk>/",ProjectDetailInfo.as_view(),name="project-detail"),
    path("projects/create/",ProjectCreate.as_view(),name="project-create"),
    path("project/status/<int:pk>/",ProjectStatusUpdate.as_view(),name="project-status-update"),
    path("projects/<int:pk>/invite/", ProjectInviteView.as_view(), name="project-invite"),
    path("projects/<int:project_id>/confirm/<int:user_id>/", AcceptProjectInvite.as_view(), name="accept-invite"),
    path("projects/<int:project_id>/reject/<int:user_id>/", RejectProjectInvite.as_view(), name="reject-invite"),
    path("tasks/",TaskList.as_view(),name="task-list"),
    path("tasks/<slug:slug>/",TaskDetailInfo.as_view(),name="task-detail"),
    path("tasks/create/",TaskCreate.as_view(),name="task-create"),
    path("task/status/<int:pk>/",TaskStatusUpdate.as_view(),name="task-status-update"),

]
