from django.db import models


class CommandLog(models.Model):

    interaction_id = models.CharField(max_length=30,unique=True)
    command_name = models.CharField(max_length=50)
    user_id = models.CharField(max_length=30)
    guild_id = models.CharField(max_length=30,blank=True)
    channel_id = models.CharField(max_length=30,blank=True)
    report_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.command_name} - {self.user_id}"