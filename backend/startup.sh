#! /bin/bash

sudo add-apt-repository universe
sudo apt update
sudo apt install python3-pip
sudo pip3 install virtualenv
sudo virtualenv venv
source venv/bin/activate
sudo pip3 install Django
sudo pip3 install djangorestframework
sudo pip3 install djangorestframework-simplejwt
sudo pip3 install Pillow
sudo pip3 install django-cors-headers
sudo python3 manage.py makemigrations
sudo python3 manage.py migrate