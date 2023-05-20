#!/bin/bash

# Stop Django server on port 8000 if it is running
if sudo lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    sudo lsof -t -i tcp:8000 | xargs kill -9
    echo "Django server on port 8000 stopped."
else
    echo "Django server on port 8000 is not running."
fi

# Stop React server on port 3000 if it is running
if npx kill-port 3000 >/dev/null 2>&1 ; then
    echo "React server on port 3000 stopped."
else
    echo "React server on port 3000 is not running."
fi