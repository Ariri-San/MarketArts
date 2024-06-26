FROM python:3.11.0-alpine

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install pipenv
RUN pip install --upgrade pip 
RUN pip install pipenv

# Install application dependencies
COPY Pipfile Pipfile.lock ./
# We use the --system flag so packages are installed into the system python
# and not into a virtualenv. Docker containers don't need virtual environments. 
RUN pipenv install --system

# Copy the application files into the image
COPY . .

# Expose port 8000 on the container
EXPOSE 8000

RUN python manage.py migrate
RUN python manage.py addsuperuser
RUN python manage.py collectstatic
CMD [ "python", "manage.py", "runserver" , "0.0.0.0:8000"]