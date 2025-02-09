from django.urls import include, path
from rest_framework import routers
from . import api_views

router = routers.DefaultRouter()
router.register(r'tasks', api_views.TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('api/tasks/delete_completed/', api_views.TaskViewSet.as_view({'post': 'delete_completed'}), name='delete_completed_tasks'),
]