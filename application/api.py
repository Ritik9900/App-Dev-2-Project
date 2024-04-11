from .models import User
from flask_caching import Cache
from flask import make_response
from flask import jsonify,json
from flask_restful import reqparse,Resource,marshal_with,fields
from .validation import NotFoundError,NotGivenError
from werkzeug.exceptions import HTTPException
from .database import db
from flask import current_app as app
from flask_security import auth_required,roles_required,hash_password,current_user,roles_accepted
from sqlalchemy import or_
from .models import User, Categories, CategoryCreated,CartItem,Cart,ProductCreated,Products,ModifyRequests,DeleteRequests,Orders,StoreManagerRequests,Roles
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib
from flask_security import login_required

cache=Cache(app)
app.app_context().push()

class NotFoundError(HTTPException):
    def __init__(self, status_code, message=''):
        self.response = make_response(message, status_code)

class NotGivenError(HTTPException):
    def __init__(self, status_code, error_code, error_message):
        message = {"error_code": error_code, "error_message": error_message}
        self.response = make_response(json.dumps(message), status_code)



# --------------output Fields --------------
admin_fields = {
    "admin_id": fields.Integer,
    "admin_name": fields.String,
    "mobile": fields.String,
    "password": fields.String,
}

user_fields = {
    "id": fields.Integer,
    "user_name": fields.String,
    "email": fields.String,
    "password": fields.String,
    "city": fields.String,
    "age": fields.String,
}
categories_fields = {
    "category_id": fields.Integer,
    "category_name": fields.String,
}
products_fields = {
    "product_id": fields.Integer,
    "product_name": fields.String,
    "quantity": fields.Integer,
    "unit_price": fields.Integer,
    "revenue": fields.Integer,
    "manufacturing_date": fields.DateTime(dt_format='rfc822'),
    "expiry_date": fields.DateTime (dt_format='rfc822')
}
cart_item_fields = {
    "cart_item_id": fields.Integer,
    "user_id": fields.Integer,
    "product_id": fields.Integer,
    "quantity": fields.Integer,
    "total": fields.Integer
}

manager_fields = {
    "manager_id": fields.Integer,
    "manager_name": fields.String,
    "mobile": fields.String,
    "password": fields.String,
}

admin_parse = reqparse.RequestParser()
admin_parse.add_argument("admin_name")
admin_parse.add_argument("mobile")
admin_parse.add_argument("password")

categories_parse = reqparse.RequestParser()
categories_parse.add_argument("category_name")

products_parse = reqparse.RequestParser()
products_parse.add_argument("product_name")
products_parse.add_argument("quantity")
products_parse.add_argument("unit_price")
products_parse.add_argument("revenue")
products_parse.add_argument("manufacturing_date")
products_parse.add_argument("expiry_date")

user_parse = reqparse.RequestParser()
user_parse.add_argument("user_name")
user_parse.add_argument("email")
user_parse.add_argument("password")
user_parse.add_argument("city")
user_parse.add_argument("age")

cartit_parse = reqparse.RequestParser()
cartit_parse.add_argument("pid")
cartit_parse.add_argument("quantity")
cartit_parse.add_argument("total")

modreq_parse = reqparse.RequestParser()
modreq_parse.add_argument("state")
modreq_parse.add_argument("category_id")
modreq_parse.add_argument("categ_name_req")

delreq_parse = reqparse.RequestParser()
delreq_parse.add_argument("category_id")
delreq_parse.add_argument("state")

manager_request_parse = reqparse.RequestParser()
manager_request_parse.add_argument("user_id")
manager_request_parse.add_argument("state")


def catjson(cat):
    return{
        "category_id": cat.category_id,
        "category_name": cat.category_name
    }

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

def users(user):
    return{
    "id": user.id,
    "user_name": user.username,
    "email": user.email,
    "city": user.city,
    "age": user.age,
}

def cartitem(item):
    return{
        "product_id":item.product_id,
        "cart_item_id":item.cart_item_id,
        "product_name":item.product_name,
        "quantity":item.quantity,
        "total":item.total
    }

def modreqjson(req,category):
    return{
        "req_id":req.id,
        "req_categ_id": req.categ_id,
        "actual_category_name": category.category_name,
        "req_categ_name":req.categ_name_req,
        "req_state": req.state
    }

def delreqjson(req,category):
    return{
        "req_id":req.id,
        "req_categ_id":req.categ_id,
        "actual_categ_name":category.category_name,
        "req_state":req.state
    }

def manager_request(manager_request):
    return {
        "request_id": manager_request.id,
        "user_id": manager_request.user_id,
        "state": manager_request.state,
        "craeted_at": manager_request.created_at.strftime('%Y-%m-%d %H:%M:%S')
    }


class UserAPI(Resource):
    def get(self):
        user=User.query.all()
        if user!=[]:
            return jsonify([users(j) for j in user])
        else:
            raise NotFoundError(status_code=404)
        
    @marshal_with(user_fields)
    @auth_required('token')
    def put(self,id):
        args = user_parse.parse_args()
        user_name=args.get("user_name")
        email=args.get("email")
        pswd=args.get("password")
        city=args.get("city")
        age=args.get("age")

        users=User.query.filter(User.user_name==user_name,User.email==email).first()
        
        if user_name is None:
            raise NotGivenError(status_code=400, error_code="USER1", error_message="User_name is required")

        if email is None:
            raise NotGivenError(status_code=400, error_code="USER2", error_message="Email is required")

        if pswd is None:
            raise NotGivenError(status_code=400, error_code="USER3", error_message="Password is required")
        
        if city is None:
            raise NotGivenError(status_code=400, error_code="USER4", error_message="city is required")
        
        if age is None:
            raise NotGivenError(status_code=400, error_code="USER5", error_message="Age is required")
        
        if users:
            raise NotGivenError(status_code=400, error_code="USER7", error_message="User_name or email already exist")
        
        us=User.query.filter_by(id=id).first()
        
        if us:
            us.user_name=user_name
            us.email=email
            us.password=pswd
            us.city=city
            us.age=age
            db.session.commit()
            return us, 200
        
        else:
            raise NotFoundError(status_code=404)
        
    def post(self):
        args = user_parse.parse_args()
        user_name=args.get("user_name")
        email=args.get("email")
        pswd=args.get("password")
        city=args.get("city")
        age=args.get("age")
        print(email,pswd,user_name,city,age)
        if user_name is None:
            raise NotGivenError(status_code=400, error_code="USER1", error_message="User_name is required")

        if email is None:
            raise NotGivenError(status_code=400, error_code="USER2", error_message="Email Number is required")

        if pswd is None:
            raise NotGivenError(status_code=400, error_code="USER3", error_message="Password is required")
        
        if city is None:
            raise NotGivenError(status_code=400, error_code="USER4", error_message="city is required")
        
        if age is None:
            raise NotGivenError(status_code=400, error_code="USER5", error_message="Age is required")
        
        us=User.query.filter(or_(User.username==user_name,User.email==email)).first()
        if us:
            raise NotFoundError(status_code=409)

        else:
            with app.app_context():
                datastore = app.security.datastore
                if not datastore.find_user(username=user_name) and not datastore.find_user(email=email):
                    datastore.create_user(username=user_name, email=email, password=hash_password(pswd), city=city, age=age)
                    db.session.commit()
            user=User.query.filter_by(username=user_name).first()
            role=Roles(user_id=user.id,role_id=3)
            db.session.add(role)
            db.session.commit()
            return {
                "id": user.id,
                "user_name": user.username,
                "email": user.email,
                "city": user.city,
                "age": user.age,
            }, 201
            
        
class ProfileAPI(Resource):
    @auth_required('token')
    def get(self):
        user_id=current_user.id 
        user=User.query.filter_by(id=user_id).first()
        if user:
            return jsonify(users(user))
        else:
            raise NotFoundError(status_code=404)
        
    def put(self):
        user_id=current_user.id 
        args = user_parse.parse_args()
        user_name=args.get("user_name")
        email=args.get("email")
        pswd=args.get("password")
        if user_name is None:
            raise NotGivenError(status_code=400, error_code="USER1", error_message="user_name is required")
        
        if email is None:
            raise NotGivenError(status_code=400, error_code="USER2", error_message="Email ID is required")
        
        if pswd is None:
            raise NotGivenError(status_code=400, error_code="USER3", error_message="Password is required")
        
        us=User.query.filter(or_(User.username==user_name,User.email==email)).first()
        if us:
            raise NotFoundError(status_code=409)
        
        else:
            us = User.query.filter_by(id=user_id).first()
            us.user_name=user_name
            us.email=email
            us.password=pswd
            db.session.commit()
            return jsonify({})
        
class CategoriesAPI(Resource):
    @cache.cached(timeout=20)
    def get(self):
        cat=Categories.query.all()
        if cat:
            return jsonify([catjson(c) for c in cat])
        else:
            raise NotFoundError(status_code=404)
        
    @roles_required('ADMIN')
    @auth_required('token')   
    @marshal_with(categories_fields)
    def put(self, category_id):
       
        cat = Categories.query.filter(Categories.category_id == category_id).first()

        if cat is None:
            raise NotFoundError(status_code=404)
        
        args =categories_parse.parse_args()
        category_name = args.get("category_name", None)

        if category_name is None:
            raise NotGivenError(status_code=400, error_code="CATEG1", error_message="Category Name is required")
        
        else:
            cat.category_name = category_name
            db.session.commit()
            return cat,201
        
    @roles_required('ADMIN')
    @auth_required('token')    
    def delete(self, category_id):
        
        cat = Categories.query.filter(Categories.category_id == category_id).scalar()
        pc = ProductCreated.query.filter_by(ccateg_id=category_id).scalar()
        cc = CategoryCreated.query.filter_by(ccateg_id=category_id).scalar()
        
        if cat is None or cc is None:
            raise NotFoundError(status_code=404)

        try:
            if pc:
                db.session.delete(pc)
            db.session.delete(cc)
            db.session.delete(cat)
            db.session.commit()
            return "successfully deleted", 200
        except Exception as e:
            db.session.rollback()
            return f"Error deleting product: {str(e)}", 500
        
    @roles_required('ADMIN')
    @auth_required('token')  
    @marshal_with(categories_fields)
    def post(self):
        id=current_user.id
        args = categories_parse.parse_args()
        category_name = args.get("category_name", None)
       
        if category_name is None:
            raise NotGivenError(status_code=400, error_code="CATEG1", error_message="Category Name is required")

        cat = Categories.query.filter(Categories.category_name == category_name).first()
     
        if cat is None:
            cat = Categories(category_name = category_name)
            db.session.add(cat)
            db.session.commit()
            cid=cat.category_id
            cc=CategoryCreated(cadmin_id=id,ccateg_id=cid)
            db.session.add(cc)
            db.session.commit()
            return cat, 201

        else:
            raise NotFoundError(status_code=409)

class DeleteReqAPI(Resource):
    @auth_required('token')
    def get(self):
        delreq=DeleteRequests.query.all()
        if delreq!=[]:
            return jsonify([delreqjson(d,Categories.query.filter_by(category_id=d.categ_id).first()) for d in delreq])
        else:
            return jsonify([])
        
    @auth_required('token')
    def post(self):
        args = delreq_parse.parse_args()
        categ_id = args.get("category_id")
        state=args.get("state")

        if state == "created":
            req = DeleteRequests(categ_id=categ_id,state=state)
            db.session.add(req)
            db.session.commit()
            return {"message": "Request for deleting sent to admin"}, 201
        
        elif state=='approved':
            category=Categories.query.filter_by(category_id=categ_id).first()
            req=DeleteRequests.query.filter_by(categ_id=categ_id).first()
            prod=category.product
            for i in prod:
                db.session.delete(i)
            db.session.delete(category)
            db.session.delete(req)
            db.session.commit()
            return {"message": "Request for deleting approved"}, 201
        
        elif state=='rejected':
            req=DeleteRequests.query.filter_by(categ_id=categ_id).first()
            db.session.delete(req)
            db.session.commit()
            return {"message": "Request for deleting rejected"}, 201


class ProductsAPI(Resource):
    @cache.cached(timeout=20)
    def get(self ,category_id):
        cat=Categories.query.filter_by(category_id=category_id).first()
        prod = cat.product
        if prod!=[]:
            return jsonify([prodjson(p) for p in prod])
        
        else:
            raise NotFoundError(status_code=404)   
        
    @roles_accepted('MANAGER','ADMIN')
    @auth_required('token')
    def put(self, product_id):
        prod= Products.query.filter(Products.product_id == product_id).first()
        if prod is None:
            raise NotFoundError(status_code=404)
        args = products_parse.parse_args()
        product_name = args.get("product_name", None)
        quantity = args.get("quantity", None)
        unit_price = args.get("unit_price", None)
        
        if product_name is None:
            raise NotGivenError(status_code=400, error_code="PROD1", error_message="product name is required")

        if quantity is None:
            raise NotGivenError(status_code=400, error_code="PROD2", error_message="quantity is required")
        
        if unit_price is None:
            raise NotGivenError(status_code=400, error_code="PROD3", error_message="price is required")
        
        else:
            prod.product_name = product_name
            prod.quantity=quantity
            prod.unit_price=unit_price

            db.session.commit()
    
            return {
                    "product_id": prod.product_id,
                    "product_name": prod.product_name,
                    "quantity": prod.quantity,
                    "unit_price": prod.unit_price,
                    "manufacturing_date": prod.manufacturing_date.strftime('%d/%m/%Y'),
                    "expiry_date": prod.expiry_date.strftime('%d/%m/%Y'),
                    "revenue": prod.revenue
                    }
    @roles_accepted('MANAGER','ADMIN')
    @auth_required('token')        
    def delete(self, product_id):
        prod = Products.query.filter_by(product_id=product_id).scalar()
        cprod = ProductCreated.query.filter_by(cprod_id=product_id).scalar()

        if prod is None or cprod is None:
            raise NotFoundError(status_code=404)

        try:
            db.session.delete(prod)
            db.session.delete(cprod)
            db.session.commit()
            return "successfully deleted", 200
        except Exception as e:
            db.session.rollback()
            return f"Error deleting Product: {str(e)}", 500

    @roles_accepted('MANAGER','ADMIN')
    @auth_required('token')        
    def post(self,category_id):
        args = products_parse.parse_args()
        product_name = args.get("product_name", None)
        unit_price = args.get("unit_price", None)
        quantity = args.get("quantity", None)
        manufacturing_date = args.get("manufacturing_date", None)
        expiry_date = args.get("expiry_date", None)
        print(product_name, unit_price, quantity, manufacturing_date, expiry_date)
        

        if product_name is None:
            raise NotGivenError(status_code=400, error_code="PROD1", error_message="product name is required")
        if quantity is None:
            raise NotGivenError(status_code=400, error_code="PROD2", error_message="quantity is required")
        if manufacturing_date is None:
            raise NotGivenError(status_code=400, error_code="PROD3", error_message="manufacturing date is required")
        if expiry_date is None:
            raise NotGivenError(status_code=400, error_code="PROD4", error_message="expiry date is required")
        if unit_price is None:
            raise NotGivenError(status_code=400, error_code="PROD5", error_message="price is required")

        manufacturing = datetime.strptime(str(manufacturing_date), "%Y-%m-%dT%H:%M")
        expiry = datetime.strptime(str(expiry_date), "%Y-%m-%dT%H:%M")
        cat = Categories.query.filter_by(category_id=category_id).first()
        prod = cat.product
        pname = []
        for p in prod:
            pname.append(p.product_name)
        if pname != []:
            if product_name not in pname:
                p = Products(product_name=product_name, quantity=quantity, expiry_date=expiry,  manufacturing_date=manufacturing, unit_price=unit_price)
                db.session.add(p)
                db.session.commit()
                p_id = p.product_id
                pc = ProductCreated(cprod_id=p_id,ccateg_id=category_id)
                db.session.add(pc)
                db.session.commit()
                p={
                    "product_id": p.product_id,
                    "product_name": p.product_name,
                    "quantity": p.quantity,
                    "unit_price": p.unit_price,
                    "manufacturing_date": p.manufacturing_date.strftime('%d/%m/%Y'),
                    "expiry_date": p.expiry_date.strftime('%d/%m/%Y'),
                    "revenue": p.revenue
                    }
                return p, 201
            else:
                raise NotGivenError(status_code=400, error_code="PROD8", error_message="given product already exist")
        else:
            p = Products(product_name=product_name, quantity=quantity, expiry_date=expiry,  manufacturing_date=manufacturing, unit_price=unit_price)
            db.session.add(p)
            db.session.commit()
            p_id = p.product_id
            pc = ProductCreated(cprod_id=p_id,ccateg_id=category_id)
            db.session.add(pc)
            db.session.commit()
        p={
                "product_id": p.product_id,
                "product_name": p.product_name,
                "quantity": p.quantity,
                "unit_price": p.unit_price,
                "manufacturing_date": p.manufacturing_date.strftime('%d/%m/%Y'),
                "expiry_date": p.expiry_date.strftime('%d/%m/%Y'),
                "revenue": p.revenue
                }
        return p, 201
    
class ModifyRequestAPI(Resource):
    
    @auth_required('token')
    def get(self):
        modreq=ModifyRequests.query.all()
        if modreq!=[]:
            return jsonify([modreqjson(m,Categories.query.filter_by(category_id=m.categ_id).first()) for m in modreq])
        else:
            return jsonify([])

    
    @auth_required('token')   
    def post(self):
        args = modreq_parse.parse_args()
        categ_id = args.get("category_id")
        req = ModifyRequests.query.filter_by(categ_id=args.get("category_id")).first()
        state=args.get("state")
        categ_name_req = args.get("categ_name_req")
        if state == "created":
            req = ModifyRequests(categ_name_req=categ_name_req,categ_id=categ_id,state=state)
            db.session.add(req)
            db.session.commit()
            return {"message": "Request sent successfully"}, 201
        
        elif state=='approved':
            req = ModifyRequests.query.filter_by(categ_id=categ_id).first()
            print(categ_id,req)
            category_id = req.categ_id
            category=Categories.query.filter_by(category_id=category_id).first()
            category.category_name=categ_name_req
            db.session.delete(req)
            db.session.commit()
            return {"message": "Request approved successfully"}, 201
        
        elif state=='rejected':
            req = ModifyRequests.query.filter_by(categ_id=categ_id).first()
            db.session.delete(req)
            db.session.commit()
            return {"message": "Request rejected successfully"}, 201
        
class CartItemAPI(Resource):
    @marshal_with(cart_item_fields)
    @auth_required('token')
    def post(self):
        user_id=current_user.id 
        args = cartit_parse.parse_args()
        product_id= args.get("pid")
        quantity = args.get("quantity")
        total = args.get("total")
        product = Products.query.get(product_id)
        pname=product.product_name
        if not product:
            return {"message": "Product not found"}, 404
        if product.quantity>=int(quantity):
            cart_item = CartItem.query.filter_by(product_id=product_id).first()
            if cart_item:
                cart_item.quantity += int(quantity)
                cart_item.total += int(total)
                db.session.commit()
            else:
                cart_item = CartItem(user_id=user_id,product_id=product_id,product_name=pname, quantity=quantity, total=total)
                db.session.add(cart_item)
                db.session.commit()
                user_cart = Cart(user_id=user_id,cartitemid=cart_item.cart_item_id)
                db.session.add(user_cart)
                db.session.commit()
        else:
            return {"message": "Requested quantity not available"}, 404
        
        return cart_item, 201
    
    @auth_required('token')
    def get(self):
        user_id=current_user.id
        user_cart = CartItem.query.filter_by(user_id=user_id).all()

        if not user_cart:
            return []
        
        return jsonify([cartitem(i) for i in user_cart])
    
    @auth_required('token')
    def delete(self, cart_item_id):
        cart_item = CartItem.query.filter_by(cart_item_id=cart_item_id).first()
        cart=Cart.query.filter_by(cartitemid=cart_item_id).first()
        if not cart_item or not cart:
            return {"message": "item not found"}, 404
        prod=Products.query.filter_by(product_id=cart_item.product_id).first()
        prod.quantity+=cart_item.quantity
        db.session.delete(cart)
        db.session.delete(cart_item)
        db.session.commit()

        return {"message": "item removed from cart successfully"}, 200
    
class CartCheckoutAPI(Resource):
    @auth_required('token')
    def post(self):
        user_id=current_user.id 
        user_cart = CartItem.query.filter_by(user_id=user_id).all()
        if not user_cart:
            return {"message": "Your Cart is empty"}, 400
        
        total_price=0
        for cart_item in user_cart:
            cart=Cart.query.filter_by(cartitemid=cart_item.cart_item_id).first()
            product = Products.query.filter_by(product_id=cart_item.product_id).first()
            order=Orders(user_id=user_id,product_id=cart_item.product_id,product_name=cart_item.product_name,quantity=cart_item.quantity,total=cart_item.total)
            db.session.add(order)
            if product:
                total_price+=int(cart_item.total)
                product.quantity-=cart_item.quantity
                product.revenue+=int(cart_item.total)
                db.session.delete(cart)
                db.session.delete(cart_item)

        db.session.commit()

        return {"message": "Checkout is successful", "total_price": total_price}, 200
    
class SearchProductAPI(Resource):
        @auth_required('token')
        def get(self,query):
            product_name = query
            prod=Products.query.filter(Products.product_name.like(f'%{product_name}%')).all()
            if prod:
                return jsonify([prodjson(c) for c in prod])
            else:
                raise NotFoundError(status_code=404) 
            
search_parse = reqparse.RequestParser()
search_parse.add_argument("query")
class SearchCategoryAPI(Resource):
    @auth_required('token')
    def get(self,query):
        category_name = query
        cat=Categories.query.filter(Categories.category_name.like(f'%{category_name}%')).all()
        if cat:
            return jsonify([catjson(c) for c in cat])
        else:
            raise NotFoundError(status_code=404)
        
class SummarypageAPI(Resource):
    @auth_required('token')
    @roles_required('ADMIN')
    @cache.cached(timeout=20)
    def get(self):
        c= Categories.query.all()
        cat=[i.category_name for i in c]
        p=[]
        for i in c:
            p.append(i.product)
        det=[]
        for j in p:
            de=[]
            for k in j:
                product_name = k.product_name
                revenue = k.revenue
                if revenue is not None:
                    de.append([product_name, revenue])
            det.append(de)
        d={}
        for i in range(len(cat)):
            d[cat[i]]=det[i]
        for key, values in d.items():
            x_values = [val[0] for val in values]
            y_values = [val[1] for val in values]
            matplotlib.use('Agg')
            plt.clf()
            plt.bar(x_values, y_values)
            plt.xlabel('Category')
            plt.ylabel('Revenue Generate')
            plt.title(f'{key}')
            plt.savefig("static/js/"+f"{key}.png")
        return jsonify(cat)


def manager_request_to_json(manager_request):
    return {
        "request_id": manager_request.id,
        "user_id": manager_request.user_id,
        "state": manager_request.state
    }


class ManagerRequestAPI(Resource):
    @auth_required('token')
    def get(self):
        manager_requests= StoreManagerRequests.query.all()

        if manager_requests:
            return jsonify([manager_request_to_json(manager_request) for manager_request in manager_requests])
        else:
            return jsonify([])
    
    @auth_required('token')
    def post(self):
        user_id = current_user.id
        new_manager_request = StoreManagerRequests(
            user_id=user_id,
            state='Pending',
            created_at=datetime.utcnow()
        )

        db.session.add(new_manager_request)
        db.session.commit()

        return jsonify({"message": "Store manager request submitted successfully."})
    
    @auth_required('token')
    @roles_required('ADMIN')
    def put(self):
        args=manager_request_parse.parse_args()
        user_id = args.get("user_id")
        state=args.get("state")
        print(user_id,state)
        manager_request = StoreManagerRequests.query.filter_by(user_id=user_id).first()

        if not manager_request:
            raise NotFoundError(status_code=404, message="No store manager request found.")

        if state=="approved":
            db.session.delete(manager_request)
            role=Roles.query.filter_by(user_id=user_id).first()
            role.role_id=2
            db.session.commit()

        return jsonify({"message": "Store manager request approved successfully."})
    
    @auth_required('token')
    @roles_required('ADMIN')
    def delete(self):
        args=manager_request_parse.parse_args()
        user_id = args.get("user_id")
        state=args.get("state")
        manager_request = StoreManagerRequests.query.filter_by(user_id=user_id).first()

        if not manager_request:
            raise NotFoundError(status_code=404, message="No store manager request found.")
        if state=="rejected":
            db.session.delete(manager_request)
            db.session.commit()

        return jsonify({"message": "Store manager request deleted successfully."})
    
    


        