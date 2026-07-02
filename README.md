# Discord Support Bot & Admin Dashboard

A full-stack Discord Support Bot built with **Django REST Framework** and **React**. The application securely handles Discord interactions, stores reports in a database, mirrors notifications to Discord channels, and provides an authenticated web dashboard for administrators to manage reports and bot configuration.

---

# Live Demo

### Frontend

https://discord-bot-1-el28.onrender.com/

### Backend

https://discord-bot-n7ho.onrender.com/

---

# Features

## Discord Bot

- Discord Slash Commands
- Ed25519 Signature Verification
- `/status` command
- `/report` command
- Discord Modal (Interaction Type 5)
- Discord Button Components (Interaction Type 3)
- Report storage in database
- Mirror reports to a configurable Discord notification channel
- Resolve / Ignore report actions

## Admin Dashboard

- JWT Authentication
- Protected Dashboard
- Reports Management
- Bot Configuration Management
- Enable / Disable Bot
- Enable / Disable Notification Mirroring
- Update Notification Channel ID
- Responsive React UI

---

# Assignment Features Completed

-  Public deployed application
-  Discord Interactions Endpoint
-  Ed25519 Signature Verification
-  Slash Commands
-  Report Modal
-  Button Interactions
-  Database Persistence
-  Notification Mirroring
-  Configuration Dashboard
-  JWT Authentication
-  React Admin Dashboard
-  Render Deployment

---

# Architecture

```
Discord User
      │
      ▼
Discord API
      │
      ▼
Django REST API
      │
 ┌────┴─────────┐
 │              │
 ▼              ▼
SQLite      Discord API
 │
 ▼
React Dashboard
```

---

# Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- Django REST Framework Simple JWT
- SQLite
- Gunicorn
- WhiteNoise

## Frontend

- React
- Vite
- Bootstrap
- Axios
- React Router

## Deployment

- Render Web Service
- Render Static Site

---

# Project Structure

```
discord/
│
├── Backend/
│   ├── bot/
│   ├── mainapp/
│   ├── manage.py
│   ├── requirements.txt
│   ├── build.sh
│   └── Procfile
│
└── frontend/
    └── admin/
        ├── src/
        ├── public/
        ├── package.json
        └── vite.config.js
```

---

# Installation

## Backend

```bash
cd Backend

python -m venv env

# Windows
env\Scripts\activate

# macOS/Linux
source env/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

## Frontend

```bash
cd frontend/admin

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the Backend folder.

```env
SECRET_KEY=

DEBUG=True

ALLOWED_HOSTS=

CORS_ALLOWED_ORIGINS=

DISCORD_PUBLIC_KEY=

DISCORD_BOT_TOKEN=

DISCORD_APPLICATION_ID=

REPORT_CHANNEL_ID=
```

---

# Discord Bot Setup

1. Create a Discord Application.
2. Create a Bot.
3. Copy:

- Application ID
- Bot Token
- Public Key

4. Configure the Interaction Endpoint:

```
https://discord-bot-n7ho.onrender.com/interactions/
```

5. Invite the bot to your server using the generated OAuth2 URL.

---

# Deployment

## Backend

The backend is deployed as a Render Web Service.

Deployment includes:

- Installing dependencies
- Running migrations
- Automatically creating a default administrator account (if one does not already exist)
- Collecting static files

### Why is the admin user created automatically?

The project uses SQLite for simplicity in this assignment.

Since Render creates a fresh container during a new deployment, the SQLite database starts empty. To ensure reviewers can immediately access the dashboard after deployment, the build process checks whether an administrator account exists and creates one if necessary.

The deployment performs the following steps:

```bash
pip install -r requirements.txt

python manage.py migrate

python manage.py shell <<EOF
from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="abhishek").exists():
    User.objects.create_superuser(
        username="abhishek",
        email="anuguabhishek42@gmail.com",
        password="admin123"
    )
EOF

python manage.py collectstatic --noinput
```

This makes the deployment idempotent—if the administrator already exists, no duplicate account is created.

---

## Frontend

The frontend is deployed as a Render Static Site.

Build command:

```bash
npm install

npm run build
```

Publish Directory

```
dist
```

A rewrite rule is configured so React Router works correctly.

```
Source:
/*

Destination:
/index.html

Action:
Rewrite
```

---

# Dashboard Login

A default administrator account is automatically created during deployment.

Username

```
abhishek
```

Password

```
admin123
```

---

# API Endpoints

| Endpoint | Method | Authentication | Description |
|----------|--------|----------------|-------------|
| `/api/login/` | POST | No | Obtain JWT Token |
| `/api/reports/` | GET | Yes | Retrieve all reports |
| `/api/reports/<id>/` | GET | Yes | Retrieve report details |
| `/api/config/` | GET / PATCH | Yes | Retrieve or update bot configuration |
| `/interactions/` | POST | No | Discord Interaction Endpoint |

---

# Testing Instructions

## Dashboard

Open

```
https://discord-bot-1-el28.onrender.com/
```

Login using:

Username

```
abhishek
```

Password

```
admin123
```

---

## Discord

Invite the bot to your server.

Run:

```
/status
```

Expected:

```
Bot Status

Bot Enabled : True

Mirror Enabled : True
```

Run:

```
/report
```

Expected:

- Report modal opens
- Submit report
- Report stored in database
- Notification appears in configured Discord channel
- Report visible in dashboard

Click:

- Resolve
- Ignore

Expected:

The report status updates successfully.

---

# Screenshots

The repository includes screenshots demonstrating:

- Login Page
- Dashboard
- Reports Page
- Settings Page


---

# Future Improvements

- AI-powered report summarization
- Multi-server support
- Role-based permissions
- Audit logging
- Report analytics

---

# AI Usage

This project was developed with assistance from:

- ChatGPT (OpenAI)
- GitHub Copilot

Further details are documented in **AI_NOTES.md**.

---

# License

This project was developed as part of a technical assessment and is intended for educational and evaluation purposes.