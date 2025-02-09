from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Task
from .serializers import TaskSerializer


# define viewset for task model
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


    # custom action to delete all completed tasks
    @action(detail=False, methods=['post'])
    def delete_completed(self, request):
        try:
            # uses filter method to get all completed tasks and delete them
            Task.objects.filter(completed=True).delete()
            return Response({'status': 'success', 'message': 'Completed tasks deleted'})
        except Exception as err:
            # return error message if soemthing is wrong
            return Response({'status': 'error', 'message': str(err)}, status=500)