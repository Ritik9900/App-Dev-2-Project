from flask_security import UserMixin,RoleMixin
from .database import db
from datetime import datetime
from datetime import date


class Roles(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer, db.ForeignKey('role.id')) 

class Orders(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
    product_name= db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total= db.Column(db.Integer, nullable=False)
    products = db.relationship("Products")

class Role(db.Model, RoleMixin):
    __tablename__='role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    __tablename__='user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String,nullable=False,unique=True)
    age=db.Column(db.String,nullable=False)
    city=db.Column(db.String,nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    lastlogin = db.Column(db.DateTime, default=datetime.utcnow)
    password = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean(), default=True)
    fs_uniquifier = db.Column(db.String(256), unique=True)
    roles = db.relationship('Role', secondary='roles',backref=db.backref('users', lazy='dynamic'))
    category= db.relationship("Categories", secondary="categorycreated")

class Categories(db.Model):
    __tablename__="categories"
    category_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    category_name = db.Column(db.String, nullable=False)
    product = db.relationship("Products", backref='cat', secondary="productcreated")

class CategoryCreated(db.Model):
    __tablename__="categorycreated"
    vc_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    cadmin_id=db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    ccateg_id=db.Column(db.Integer, db.ForeignKey("categories.category_id"), nullable=False)

class Products(db.Model):
    __tablename__="products"
    product_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    product_name=db.Column(db.String, nullable=False)
    unit_price=db.Column(db.Integer,nullable=False)
    quantity=db.Column(db.Integer, nullable=False)
    revenue = db.Column(db.Integer, nullable=True, default=0)
    manufacturing_date= db.Column(db.DateTime(timezone=True), default=datetime.utcnow,nullable=False)
    expiry_date= db.Column(db.DateTime(timezone=True), default=datetime.utcnow,nullable=False)

class ProductCreated(db.Model):
    __tablename__="productcreated"
    sc_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    cprod_id=db.Column(db.Integer, db.ForeignKey("products.product_id"),nullable=False)
    ccateg_id=db.Column(db.Integer, db.ForeignKey("categories.category_id"),nullable=False)

class CartItem(db.Model):
    __tablename__="cart_item"
    cart_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
    product_name = db.Column(db.String, nullable=False)
    quantity=db.Column(db.Integer, nullable=False)
    total=db.Column(db.Integer, nullable=False)
    product=db.relationship("Products")

class Cart(db.Model):
    __tablename__="cart"
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    cartitemid = db.Column(db.Integer, db.ForeignKey("cart_item.cart_item_id"), nullable=False)
    items = db.relationship("CartItem", backref="cart", cascade="all, delete-orphan", single_parent=True)

class ModifyRequests(db.Model):
    __tablename__='requests'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    categ_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'),nullable=False)
    categ_name_req=db.Column(db.String, nullable=False)
    state= db.Column(db.String, nullable=False)


class CreateRequest(db.Model):
    __tablename__='createrequests'
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    categ_name_req=db.Column(db.String, nullable=False)
    state=db.Column(db.String, nullable=False)

class DeleteRequests(db.Model):
    __tablename__='delrequests'
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    categ_id= db.Column(db.Integer, db.ForeignKey('categories.category_id'), nullable=False)
    state=db.Column(db.String, nullable=True)

class StoreManagerRequests(db.Model):
    __tablename__ = 'store_manager_requests'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    state = db.Column(db.String, default='Pending', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


    
