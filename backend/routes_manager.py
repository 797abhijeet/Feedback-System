from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Feedback

manager_bp = Blueprint('manager', __name__, url_prefix='/manager')


@manager_bp.route('/my-employees', methods=['GET'])
@jwt_required()
def get_my_employees():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({"error": "Unauthorized access"}), 403

    employees = User.query.filter_by(manager_email=current_user.email, role='employee').all()

    return jsonify([
        {"id": emp.id, "name": emp.name, "email": emp.email}
        for emp in employees
    ])


@manager_bp.route('/team', methods=['GET'])
@jwt_required()
def get_team():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({'error': 'Unauthorized'}), 403

    team_members = User.query.filter_by(manager_ref=current_user).all()

    team_data = [
        {
            'id': member.id,
            'name': member.name,
            'email': member.email
        }
        for member in team_members
    ]

    return jsonify(team_data), 200


@manager_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({'error': 'Unauthorized'}), 403

    team_members = User.query.filter_by(manager_ref=current_user).all()

    dashboard_data = []

    for member in team_members:
        feedbacks = Feedback.query.filter_by(employee_id=member.id).all()
        sentiment_count = {"positive": 0, "neutral": 0, "negative": 0}
        for fb in feedbacks:
            sentiment_count[fb.sentiment] += 1

        dashboard_data.append({
            "employee_id": member.id,
            "employee_name": member.name,
            "feedback_count": len(feedbacks),
            "sentiment_breakdown": sentiment_count
        })

    return jsonify(dashboard_data), 200


@manager_bp.route('/employee/<int:employee_id>/feedback', methods=['GET'])
@jwt_required()
def employee_feedback(employee_id):
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({'error': 'Unauthorized'}), 403

    employee = User.query.get(employee_id)
    if not employee or employee.manager_ref != current_user:
        return jsonify({'error': 'Employee not found or not under your management'}), 404

    feedbacks = Feedback.query.filter_by(employee_id=employee.id).all()

    return jsonify([
        {
            "id": fb.id,
            "strengths": fb.strengths,
            "improvements": fb.improvements,
            "sentiment": fb.sentiment,
            "acknowledged": fb.acknowledged,
            # "timestamp": fb.timestamp.isoformat() if fb.timestamp else None  # Uncomment if timestamp exists
        }
        for fb in feedbacks
    ]), 200


@manager_bp.route('/employee/<int:employee_id>/feedback-history', methods=['GET'])
@jwt_required()
def get_feedback_history(employee_id):
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({'error': 'Unauthorized'}), 403

    employee = User.query.get(employee_id)
    if not employee or employee.manager_ref != current_user:
        return jsonify({'error': 'Employee not found or not under your management'}), 404

    # If `timestamp` exists in your model, keep order_by below.
    try:
        feedbacks = Feedback.query.filter_by(employee_id=employee.id).order_by(Feedback.timestamp.desc()).all()
    except AttributeError:
        feedbacks = Feedback.query.filter_by(employee_id=employee.id).all()

    return jsonify([
        {
            "id": fb.id,
            "strengths": fb.strengths,
            "improvements": fb.improvements,
            "sentiment": fb.sentiment,
            "acknowledged": fb.acknowledged,
            "timestamp": getattr(fb, 'timestamp', None)  # returns None if no timestamp
        }
        for fb in feedbacks
    ]), 200
