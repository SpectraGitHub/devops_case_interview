from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=False, methods=['post'])
    def delete_completed(self, request):
        try:
            Task.objects.filter(completed=True).delete()
            return Response({'status': 'success', 'message': 'Completed tasks deleted'})
        except Exception as err:
            return Response({'status': 'error', 'message': str(err)}, status=500)