from rest_framework import serializers
from ..models import Task
from datetime import date


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ["url", "id", "title", "completed", "due_date"] # added due date here too
    

    # function to validate the due date to ensure it is not in the past
    def validate_due_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Due date cannot be in the past")
        return value