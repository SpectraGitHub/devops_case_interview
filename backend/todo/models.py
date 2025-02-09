from django.db import models

# task model with title, completed, and due date fields
class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True) # added due date to the task. 

    def __str__(self):
        return self.title
