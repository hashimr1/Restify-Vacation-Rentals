FROM --platform=linux/amd64 python:3

EXPOSE 8000

ENV PYTHONUNBUFFERED 1
ENV TZ=UTC

WORKDIR /app/backend

COPY requirements.txt ./

# RUN pip3 install --upgrade pip3

RUN pip install -r requirements.txt --no-cache-dir

COPY . ./

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
