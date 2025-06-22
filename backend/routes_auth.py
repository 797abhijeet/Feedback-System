from flask import Blueprint, request, jsonify
from extensions import db
from models import User
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/managers', methods=['GET'])
def get_managers():
    managers = User.query.filter_by(role='manager').all()
    result = [{"name": m.name, "email": m.email} for m in managers]
    return jsonify(result)
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    manager_email = data.get('manager_email')  # updated

    if not all([name, email, password, role]):
        return jsonify({'error': 'Missing fields'}), 400

    if role not in ['manager', 'employee']:
        return jsonify({'error': 'Invalid role'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    manager_ref = None
    if role == 'employee':
        if not manager_email:
            return jsonify({'error': 'Manager email required for employee'}), 400
        manager_ref = User.query.filter_by(email=manager_email, role='manager').first()
        if not manager_ref:
            return jsonify({'error': 'Manager not found'}), 404

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role,
        manager_ref=manager_ref
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': f'{role} registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing fields'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.email)  # or str(user.id)


    manager_data = None
    if user.manager_ref:
        manager_data = {
            'id': user.manager_ref.id,
            'name': user.manager_ref.name,
            'email': user.manager_ref.email
        }

    return jsonify({
        'id': user.id,
        'name': user.name,
        'role': user.role,
        'manager': manager_data,
        'token': access_token
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    # user = User.query.get(current_user['id'])
    user = User.query.filter_by(email=current_user).first()  

    if not user:
        return jsonify({'error': 'User not found'}), 404

    manager_data = None
    if user.manager_ref:
        manager_data = {
            'id': user.manager_ref.id,
            'name': user.manager_ref.name,
            'email': user.manager_ref.email
        }

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'manager': manager_data
    })
