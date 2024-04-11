from flask import Flask,render_template
from flask import current_app as app
from .models import Roles
from .database import db
from flask import request, jsonify, send_file, current_app
from application.models import User,Products,CreateRequest,Categories,CategoryCreated
from datetime import datetime
from application.validation import NotFoundError,NotGivenError
from application import tasks
from jinja2 import Template
from flask_security import current_user, auth_required



@app.route("/")
def home():
    return render_template("base.html")

@app.route('/generate/<identifier>', methods=['GET', 'POST'])
def generate_and_export(identifier):
    recipient_email = current_user.email
    task = tasks.generate_report.apply_async(args=[identifier, recipient_email])
    return jsonify({})

@auth_required('token')
@app.route('/createreq', methods=['GET','POST'])
def create_request():
    if request.method == 'GET':
        req = CreateRequest.query.all()
        return jsonify([{"category_name": categ.categ_name_req, "state": categ.state} for categ in req])
    if request.method == 'POST':
        data = request.get_json()
        categ_name_req = data.get('category_name')
        state=data.get('state')
        if state=="created":
            categ=Categories.query.filter_by(category_name=categ_name_req).first()
            if categ:
                raise NotGivenError(status_code=409, error_code=409, error_message="Category already exists")
            else:
                cat=CreateRequest(categ_name_req=categ_name_req,state=state)
                db.session.add(cat)
                db.session.commit()
                return jsonify({"message": "Request sent successfully"})
        if state=="approved":
            cat=Categories(category_name=categ_name_req)
            db.session.add(cat)
            db.session.commit()
            cc=CategoryCreated(cadmin_id=current_user.id,ccateg_id=cat.category_id)
            db.session.add(cc)
            db.session.commit()
            categ=CreateRequest.query.filter_by(categ_name_req=categ_name_req).first()
            if categ:
                db.session.delete(categ)
                db.session.commit()
            return jsonify({"message": "Category created successfully"})
        if state=="rejected":
            categ=CreateRequest.query.filter_by(categ_name_req=categ_name_req).first()
            if categ:
                db.session.delete(categ)
                db.session.commit()
            return jsonify({"message": "Category rejected successfully"})

def prodjson(prod):
    return{
        "product_id": prod.product_id,
        "product_name": prod.product_name,
        "unit_price": prod.unit_price,
        "quantity": prod.quantity,
        "revenue": prod.revenue,
        "manufacturing_date": prod.manufacturing_date.strftime('%d/%m/%Y'),
        "expiry_date": prod.expiry_date.strftime('%d/%m/%Y')
    }



@app.route('/addcart/<pid>', methods=['GET'])
def addcart(pid):
    product=Products.query.filter_by(product_id=pid).first()
    return prodjson(product)


    
