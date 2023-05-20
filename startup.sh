#!/bin/bash

# Start the Django server
sudo add-apt-repository universe
sudo apt update
sudo apt install python3-pip
sudo pip3 install virtualenv
sudo virtualenv venv
source venv/bin/activate
pip3 install Django
pip3 install djangorestframework
pip3 install djangorestframework-simplejwt
pip3 install Pillow
pip3 install django-cors-headers
cd ./backend
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py loaddata default_data.json

# Start the React server
cd ../frontend
sudo apt install npm
npm install
npm audit fix
cd ..