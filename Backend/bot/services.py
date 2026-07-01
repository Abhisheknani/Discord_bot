import requests
from django.conf import settings
from rest_framework.response import Response
from .models import CommandLog, BotConfiguration


def send_message_to_channel(message):

    config = BotConfiguration.objects.first()

    if not config or not config.mirror_enabled:
        return

    channel_id = config.notification_channel_id

    url = f"https://discord.com/api/v10/channels/{channel_id}/messages"

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
        print("Failed to send notification")
        print(response.status_code)
        print(response.text)

    return response


def handle_interaction(data):
    """
    Main entry point for all Discord interactions.
    """

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

    interaction_type = data.get("type")

    if interaction_type == 1:
        return handle_ping()

    elif interaction_type == 2:
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

    values = data["data"]["components"]

    report_text = values[0]["components"][0]["value"]

    username = data["member"]["user"]["username"]

    CommandLog.objects.create(
        interaction_id=data["id"],
        command_name="report",
        username=username,
        guild_id=data.get("guild_id", ""),
        channel_id=data.get("channel_id", ""),
        report_text=report_text
    )

    send_message_to_channel(
        f"📢 New Report\n\nUser: {username}\n\n{report_text}"
    )

    return Response(
        {
            "type": 4,
            "data": {
                "content": "✅ Report submitted successfully."
            }
        }
    )


def handle_status():

    config = BotConfiguration.objects.first()

    return Response(
        {
            "type": 4,
            "data": {
                "content": (
                    f"🤖 Bot Status\n\n"
                    f"Bot Enabled : {config.bot_enabled if config else False}\n"
                    f"Mirror Enabled : {config.mirror_enabled if config else False}"
                )
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

    elif action == "ignore_report":

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


# def handle_report(data):

#     interaction_id = data.get("id")

#     user = data.get("user", {})

#     user_id = user.get("id", "")
#     username = user.get("global_name") or user.get("username", "")

#     guild_id = data.get("guild_id", "")
#     channel_id = data.get("channel_id", "")

#     options = data["data"].get("options", [])

#     report_text = ""

#     for option in options:
#         if option["name"] == "text":
#             report_text = option["value"]

#     if not CommandLog.objects.filter(interaction_id=interaction_id).exists():

#         CommandLog.objects.create(
#             interaction_id=interaction_id,
#             command_name="report",
#             user_id=user_id,
#             username=username,
#             guild_id=guild_id,
#             channel_id=channel_id,
#             report_text=report_text
#         )

#         message = (
#             "📢 **New Report Received**\n\n"
#             f"👤 User : {username}\n\n"
#             f"📝 Report:\n{report_text}"
#         )

#         send_message_to_channel(message)

#     return Response(
#     {
#         "type": 4,
#         "data": {
#             "content": f"📢 Report Received\n\n{report_text}",
#             "components": [
#                 {
#                     "type": 1,
#                     "components": [
#                         {
#                             "type": 2,
#                             "style": 3,
#                             "label": "Resolve",
#                             "custom_id": f"resolve_report:{interaction_id}"
#                         },
#                         {
#                             "type": 2,
#                             "style": 4,
#                             "label": "Ignore",
#                             "custom_id": f"ignore_report:{interaction_id}"
#                         }
#                     ]
#                 }
#             ]
#         }
#     }
#     )