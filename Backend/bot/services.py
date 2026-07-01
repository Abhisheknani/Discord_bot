import requests

from django.conf import settings
from rest_framework.response import Response

from .models import CommandLog, BotConfiguration


def send_message_to_channel(message):

    config = BotConfiguration.objects.first()

    if not config:
        return

    if not config.mirror_enabled:
        return

    if not config.notification_channel_id:
        return

    url = f"https://discord.com/api/v10/channels/{config.notification_channel_id}/messages"

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
        json=payload,
        timeout=10
    )

    if response.status_code not in (200, 201):
        print("Notification Failed")
        print(response.status_code)
        print(response.text)

    return response


def handle_interaction(data):

    interaction_type = data.get("type")

    # Ping request should always work
    if interaction_type == 1:
        return handle_ping()

    config = BotConfiguration.objects.first()

    if config and not config.bot_enabled:
        return Response(
            {
                "type": 4,
                "data": {
                    "content": "Bot is currently disabled."
                }
            }
        )

    if interaction_type == 2:
        return handle_application_command(data)

    elif interaction_type == 3:
        return handle_button_interaction(data)

    elif interaction_type == 5:
        return handle_modal_submit(data)

    return Response(
        {
            "error": "Unknown interaction type"
        },
        status=400
    )


def handle_ping():

    return Response(
        {
            "type": 1
        }
    )


def handle_application_command(data):

    command_name = data["data"]["name"]

    if command_name == "status":
        return handle_status()

    elif command_name == "report":
        return open_report_modal()

    return Response(
        {
            "type": 4,
            "data": {
                "content": "Unknown command."
            }
        }
    )


def open_report_modal():

    return Response(
        {
            "type": 9,
            "data": {
                "custom_id": "report_modal",
                "title": "Create Report",
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 4,
                                "custom_id": "report_text",
                                "label": "Report",
                                "style": 2,
                                "required": True
                            }
                        ]
                    }
                ]
            }
        }
    )


def handle_modal_submit(data):

    interaction_id = data["id"]

    # Prevent duplicate processing
    if CommandLog.objects.filter(interaction_id=interaction_id).exists():

        return Response(
            {
                "type": 4,
                "data": {
                    "content": "Report already processed."
                }
            }
        )

    user = data["member"]["user"]

    username = (
        user.get("global_name")
        or user.get("username")
    )

    report_text = data["data"]["components"][0]["components"][0]["value"]

    guild_id = data.get("guild_id", "")

    channel_id = data.get("channel_id", "")

    report = CommandLog.objects.create(
        interaction_id=interaction_id,
        command_name="report",
        username=username,
        guild_id=guild_id,
        channel_id=channel_id,
        report_text=report_text,
    )

    message = (
        "📢 **New Report Received**\n\n"
        f"👤 User: {username}\n\n"
        f"📝 Report:\n{report.report_text}"
    )

    send_message_to_channel(message)

    return Response(
        {
            "type": 4,
            "data": {
                "content": f"📢 Report Received\n\n{report_text}",
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 3,
                                "label": "Resolve",
                                "custom_id": f"resolve_report:{interaction_id}"
                            },
                            {
                                "type": 2,
                                "style": 4,
                                "label": "Ignore",
                                "custom_id": f"ignore_report:{interaction_id}"
                            }
                        ]
                    }
                ]
            }
        }
    )


def handle_button_interaction(data):

    custom_id = data["data"]["custom_id"]

    action, interaction_id = custom_id.split(":")

    report = CommandLog.objects.get(
        interaction_id=interaction_id
    )

    if action == "resolve_report":

        report.status = "RESOLVED"
        report.save()

        return Response(
            {
                "type": 7,
                "data": {
                    "content": "✅ Report Resolved",
                    "components": []
                }
            }
        )

    if action == "ignore_report":

        report.status = "IGNORED"
        report.save()

        return Response(
            {
                "type": 7,
                "data": {
                    "content": "❌ Report Ignored",
                    "components": []
                }
            }
        )


def handle_status():

    config = BotConfiguration.objects.first()

    bot_enabled = config.bot_enabled if config else False
    mirror_enabled = config.mirror_enabled if config else False

    return Response(
        {
            "type": 4,
            "data": {
                "content": (
                    "🤖 Bot Status\n\n"
                    f"Bot Enabled : {bot_enabled}\n"
                    f"Mirror Enabled : {mirror_enabled}"
                )
            }
        }
    )