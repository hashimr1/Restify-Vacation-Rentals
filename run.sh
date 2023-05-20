#!/bin/bash

# Start the Django server
source venv/bin/activate
cd ./backend
python3 manage.py runserver &

# Start the React server
cd ../frontend
npm start &
cd ..