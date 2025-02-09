from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task
from .api.serializers import TaskSerializer
from datetime import date

# combined test case for the task model and viewset
class TaskTestCase(TestCase):
    # setup method to create test tasks
    def setUp(self):
        self.client = APIClient()
        Task.objects.create(title='test task', completed=False, due_date=date(2025, 2, 15))
        Task.objects.create(title='test task 2', completed=True, due_date=date(2025, 3, 1))
        Task.objects.create(title='task 1', completed=False, due_date=date(2025, 2, 15))
        Task.objects.create(title='task 2', completed=True, due_date=date(2025, 3, 1))

    # test if tasks are created correctly
    def test_task_creation(self):
        task1 = Task.objects.get(title='test task')
        task2 = Task.objects.get(title='test task 2')
        self.assertEqual(task1.title, 'test task')
        self.assertFalse(task1.completed)
        self.assertEqual(task1.due_date, date(2025, 2, 15))
        self.assertEqual(task2.title, 'test task 2')
        self.assertTrue(task2.completed)
        self.assertEqual(task2.due_date, date(2025, 3, 1))
        print("\nTest task creation | Passed")

    # test retrieving tasks
    def test_get_tasks(self):
        response = self.client.get('/api/todo/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        print("\nTest get tasks | Passed")

    # test deleting completed tasks
    def test_delete_completed_tasks(self):
        response = self.client.post('/api/todo/tasks/delete_completed/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Task.objects.filter(completed=True).count(), 0)
        self.assertEqual(Task.objects.count(), 2)
        print("\nTest delete completed tasks | Passed")

    # test due date validation
    def test_due_date_validation(self):
        past_date = date(2024, 1, 1)  # static date in the past
        data = {
            'title': 'invalid due date task',
            'completed': False,
            'due_date': past_date
        }
        serializer = TaskSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('due_date', serializer.errors)
        self.assertEqual(serializer.errors['due_date'][0], 'Due date cannot be in the past')
        print("\nTest due date validation | Passed")