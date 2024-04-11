from application.worker import cel_app
from datetime import datetime,timedelta
from celery.schedules import crontab
from jinja2 import Template
from application.email import send_email
from application.models import User,Orders, Categories
from application.database import db
from sqlalchemy.orm import aliased
import os,csv,zipfile
from flask import jsonify



@cel_app.on_after_finalize.connect
def set_up_daily_task(sender, **kwargs):
   sender.add_periodic_task(crontab(hour=20, minute=43),send_dailyvisit_email.s(),name="send_dailyemail_task")


@cel_app.on_after_finalize.connect
def set_up_monthly_task(sender, **kwargs):
   sender.add_periodic_task(crontab(day_of_month='09', hour=20, minute=43),send_monthlyreport_email.s(),name="send_monthly_emailtask")




@cel_app.task()
def send_dailyvisit_email():
    log = User.query.all()
    for i in log:
        if datetime.now() - i.lastlogin >= timedelta(minutes=0):
            with open('templates/visit.html') as file_:
                template = Template(file_.read())
                message = template.render(name=i.username)

            send_email(
                to=i.email,
                subject="Visit Alert",
                message=message
            )

    return "Emails sent to users!"


@cel_app.task()
def send_monthlyreport_email():
    users=User.query.all()
    data = db.session.query(User.id,User.username,User.email,
                        Orders.product_name,Orders.quantity,Orders.total
                    ).join(
                        Orders, User.id == Orders.user_id
                    ).all()
    
    for user in users:
        list=[]
        tp=0
        for i in data:
            if user.id==i.id:
                tp+=i.total
                detail={"productname":i.product_name,"quantity":i.quantity,"total":i.total}
                list.append(detail)
        with open('templates/monthlyreport.html') as file_:
                template = Template(file_.read())
                message = template.render(name=user.username,details=list, totalprice=tp)

        send_email(
                to=user.email,
                subject="Monthly Alert",
                message=message
            )
    return "Monthly Emails sent to users"

@cel_app.task
def generate_report(c_id, to):
    cat = Categories.query.get(c_id)
    if cat:
        prods = cat.product
        csv_data = [
            ["Category Name", "Product Name", "Quantity", "Total"]
        ]
        for j in prods:
                csv_data.append([
                    cat.category_name, j.product_name, j.quantity, j.revenue
                ])
                  
        categoryname_cleaned =  cat.category_name.replace(" ", "_")
        downloads_folder = os.path.expanduser("~/CSV")
        csv_file_path = os.path.join(downloads_folder, f'{categoryname_cleaned}.csv')

        with open(csv_file_path, 'w', newline='') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerows(csv_data)

        # Zip the CSV file
        zip_file_path = os.path.join(downloads_folder, f'{categoryname_cleaned}.zip')
        with zipfile.ZipFile(zip_file_path, 'w') as zipf:
            zipf.write(csv_file_path, arcname=f'{categoryname_cleaned}.csv')

        with open('templates/export_reports.html') as file_:
            template = Template(file_.read())
            message = template.render()

        send_email(
            to=to,
            subject="Export CSV",  
            message=message,
            file=zip_file_path  
        )
        return "Mail Sent to User!!"

    return jsonify({"message": "category not found"})
