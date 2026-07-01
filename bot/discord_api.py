import requests
from django.conf import settings

COMMANDS = [
    {
        "name": "report",
        "description": "Submit a report",
        "type": 1,
        "options": [
            {
                "name": "text",
                "description": "Report message",
                "type": 3,          # STRING
                "required": True
            }
        ]
    },
    {
        "name": "status",
        "description": "Check bot status",
        "type": 1
    }
]


def register_commands():
    url = (
        f"https://discord.com/api/v10/applications/"
        f"{settings.DISCORD_APPLICATION_ID}/commands"
    )

    headers = {
        "Authorization": f"Bot {settings.DISCORD_BOT_TOKEN}",
        "Content-Type": "application/json"
    }

    response = requests.put(
        url,
        headers=headers,
        json=COMMANDS
    )

    return response