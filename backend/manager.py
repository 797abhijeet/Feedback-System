from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from extensions import db

manager_bp = Blueprint('manager', __name__)

@manager_bp.route('/employees', methods=['GET'])
@jwt_required()
def get_employees():
    """
    Get all employees assigned to the logged-in manager.
    """
    manager_id = get_jwt_identity()

    # Fetch employees whose manager_id matches the current user's ID
    employees = User.query.filter_by(manager_id=manager_id, role='employee').all()

    employee_list = [
        {
            'id': emp.id,
            'name': emp.name,
            'email': emp.email,
            'role': emp.role
        } for emp in employees
    ]

    return jsonify(employee_list), 200
