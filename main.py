import os
from flask import Flask,render_template
from flask_restful import Api
from flask_security import Security, SQLAlchemySessionUserDatastore
from application.config import LocalDevelopmentConfig
from application.database import db
from application.models import User,Role,Categories,CategoryCreated
from application.worker import cel_app,ContextTask
from application import tasks

app = None
api = None
celery= None
cache=None

def create_app():
    app = Flask(__name__, template_folder="templates")
    if os.getenv("ENV", "development") == "production":
        raise Exception("Currently no production config is setup.")
    else:
        print("Staring Local Development")
        app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    app.app_context().push()
    api = Api(app)
    app.app_context().push()
    user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
    app.security = Security(app, user_datastore)
    cel=cel_app
    cel.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        broker_connection_retry_on_startup=True, timezone="Asia/Kolkata"
    )

    cel.Task=ContextTask
    app.app_context().push()

    return app, api, celery


app, api, celery = create_app()
db.create_all()

from application.controllers import *


from application.api import UserAPI, CategoriesAPI, DeleteReqAPI, ProductsAPI,ModifyRequestAPI, CartItemAPI, CartCheckoutAPI, SearchProductAPI, SearchCategoryAPI, ManagerRequestAPI
from application.api import SummarypageAPI, ProfileAPI
api.add_resource(UserAPI, "/api/user/<int:user_id>", "/api/user")
api.add_resource(CategoriesAPI, "/categories","/categories/<int:category_id>", "/api/categories/create")
api.add_resource(DeleteReqAPI, "/deletereq/" )
api.add_resource(ProductsAPI, "/products/<category_id>","/products/create/<category_id>","/products/prod/<product_id>")
api.add_resource(ModifyRequestAPI, "/modifyreq/")
api.add_resource(CartItemAPI, "/user/cartpage/","/user/cartpage/<int:cart_item_id>")
api.add_resource(CartCheckoutAPI, "/user/checkout")
api.add_resource(SearchProductAPI,"/user/searchbar/products/<query>" )
api.add_resource(SearchCategoryAPI, "/user/searchcat/<query>")
api.add_resource(SummarypageAPI, "/summarypage/")
api.add_resource(ManagerRequestAPI, "/api/request_manager/")
api.add_resource(ProfileAPI, "/api/profile/")





@app.errorhandler(404)
def page_not_found(e):
    return render_template('/security/404.html'), 404


@app.errorhandler(403)
def not_authorized(e):
    return render_template("/security/403.html"), 403

@app.errorhandler(405)
def not_authorized(e):
    return render_template("/security/403.html"), 405



if __name__ == "__main__":
    app.run(debug=True)
