from rest_framework import serializers
from .models import CommandLog, BotConfiguration


class CommandLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandLog
        fields = "__all__"


class BotConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotConfiguration
        fields = "__all__"