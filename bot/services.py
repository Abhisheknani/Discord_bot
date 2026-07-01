import requests
from django.conf import settings
from rest_framework.response import Response
from .models import CommandLog


def send_message_to_channel(message):

    url = f"https://discord.com/api/v10/channels/{settings.REPORT_CHANNEL_ID}/messages"

    headers = {
        "Authorization": f"Bot {settings.DISCORD_BOT_TOKEN}",
        "Content-Type": "application/json",
    }

    payload = {
        "content": message
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    return response


def handle_interaction(data):
    """
    Main entry point for all Discord interactions.
    """

    interaction_type = data.get("type")

    if interaction_type == 1:
        return handle_ping()

    elif interaction_type == 2:
        return handle_application_command(data)

    return Response(
        {
            "error": "Unknown interaction type"
        },
        status=400
    )


def handle_ping():
    """
    Discord endpoint verification.
    """

    return Response(
        {
            "type": 1
        }
    )


def handle_application_command(data):
    """
    Handles Slash Commands.
    """

    command_name = data["data"]["name"]

    if command_name == "status":
        return handle_status()

    elif command_name == "report":
        return handle_report(data)

    return Response(
        {
            "type": 4,
            "data": {
                "content": "Unknown command."
            }
        }
    )


def handle_status():

    return Response(
        {
            "type": 4,
            "data": {
                "content": "Bot is running successfully."
            }
        }
    )


def handle_report(data):

    interaction_id = data.get("id")

    user = data.get("user", {})
    user_id = user.get("id", "")

    guild_id = data.get("guild_id", "")
    channel_id = data.get("channel_id", "")

    options = data["data"].get("options", [])

    report_text = ""

    for option in options:
        if option["name"] == "text":
            report_text = option["value"]

    if not CommandLog.objects.filter(interaction_id=interaction_id).exists():

        CommandLog.objects.create(
            interaction_id=interaction_id,
            command_name="report",
            user_id=user_id,
            guild_id=guild_id,
            channel_id=channel_id,
            report_text=report_text
        )

        message = (
            "📢 **New Report Received**\n\n"
            f"User ID: {user_id}\n"
            f"Guild ID: {guild_id}\n"
            f"Channel ID: {channel_id}\n\n"
            f"Report:\n{report_text}"
        )

        send_message_to_channel(message)

    return Response(
        {
            "type": 4,
            "data": {
                "content": f"Report received.\n\nMessage: {report_text}"
            }
        }
    )