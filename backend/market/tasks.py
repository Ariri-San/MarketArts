from time import sleep
from django.core.mail import send_mail
import celery

@celery.shared_task
def notify_customers(massage):
    print('Sending 10k emails...')
    print(massage)
    sleep(10)
    print('Emails were successfully sent!')
    # send_mail(subject="subject", message="message", from_email='aririsan81@gmail.com', recipient_list=["omidabcd123@gmail.com"])
