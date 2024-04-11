import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication


SMTP_SERVER_HOST="localhost"
SMTP_SERVER_PORT=1025
SENDER_ADDRESS='GroceRitstore@gmail.com'
SENDER_PASSWORD=''

def send_email(to,subject,message,file=None):
    msgg=MIMEMultipart()
    msgg['From']=SENDER_ADDRESS
    msgg['To']=to
    msgg['Subject']=subject
    
    msgg.attach(MIMEText(message,"html"))

    if not file==None:
        with open(file, 'rb') as f:
            attach = MIMEApplication(f.read(), _subtype='zip')
            attach.add_header('Content-Disposition', 'attachment', filename=file)
            msgg.attach(attach)
    
    smt=smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)
    smt.login(SENDER_ADDRESS,SENDER_PASSWORD)
    smt.send_message(msgg)
    smt.quit()
    return True