FROM python:3.12-alpine

WORKDIR /app

COPY requirements.txt .

RUN apk add --no-cache gcc musl-dev libffi-dev postgresql-dev

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8080"]