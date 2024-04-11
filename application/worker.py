from celery import Celery
from flask import current_app as app

cel_app=Celery("Application Jobs")


class ContextTask(cel_app.Task):
    def __call__(self, *args,**kwargs):
        with app.app_context():
            return self.run(*args,**kwargs)