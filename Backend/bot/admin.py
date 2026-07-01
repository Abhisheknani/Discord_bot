from django.contrib import admin
from .models import CommandLog,BotConfiguration

# Register your models here.
admin.site.register(CommandLog)

admin.site.register(BotConfiguration)
