#!/usr/bin/env bash

pip install -r requirements.txt

python manage.py migrate


python manage.py shell <<EOF
from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser(
        username="abhishek",
        email="anuguabhishek42@gmail.com",
        password="admin123"
    )
    print("Default admin created.")
else:
    print("Admin already exists.")
EOF


python manage.py collectstatic --noinput