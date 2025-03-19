from django.urls import path
from .views import UserProfile,UserAccount,UserCompleteProject,UserProject,UserInviteProject,RegisterView,SkillCreateView,UserAddSkillView,SkillListView
from projects.views import ProjectListWithUserStatusView
urlpatterns = [
    path("account/profile/invite-projects-status/",ProjectListWithUserStatusView.as_view(),name="account-project-invite-status"),
    path("account/create/",RegisterView.as_view(),name="account-register"),
    path("account/skill/create/",SkillCreateView.as_view(),name="account-skill"),
    path("account/skill/add/",UserAddSkillView.as_view(),name="account-skill-add"),
    path("account/skill/",SkillListView.as_view(),name="accoun-skill-list"),
    path("account/profile/",UserProfile.as_view(),name="account-profile"),
    path("account/<str:username>/",UserAccount.as_view(),name="account-user"),
    path("account/<str:username>/complete-project",UserCompleteProject.as_view(),name="account-project"),
    path("account/profile/projects/",UserProject.as_view(),name="account-projects"),
    path("account/profile/invite-projects/",UserInviteProject.as_view(),name="account-projects-invite"),
]
