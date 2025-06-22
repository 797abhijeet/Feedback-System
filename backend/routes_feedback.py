from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Feedback

feedback_bp = Blueprint('feedback', __name__, url_prefix='/feedback')


@feedback_bp.route('/ab', methods=['POST'])
@jwt_required()
def submit_feedback():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    employee_email = data.get('employee_email')
    strengths = data.get('strengths')
    improvements = data.get('improvements')
    sentiment = data.get('sentiment')

    employee = User.query.filter_by(email=employee_email, role='employee').first()
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    feedback = Feedback(
        manager_id=current_user.id,
        employee_id=employee.id,
        strengths=strengths,
        improvements=improvements,
        sentiment=sentiment
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully"}), 201


@feedback_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_feedback():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'employee':
        return jsonify({"error": "Unauthorized"}), 403

    feedbacks = Feedback.query.filter_by(employee_id=current_user.id).all()
    return jsonify([{
        "id": f.id,
        "strengths": f.strengths,
        "improvements": f.improvements,
        "sentiment": f.sentiment,
        "acknowledged": f.acknowledged
    } for f in feedbacks]), 200


@feedback_bp.route('/<int:id>/ack', methods=['PUT'])
@jwt_required()
def acknowledge_feedback(id):
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'employee':
        return jsonify({"error": "Unauthorized"}), 403

    feedback = Feedback.query.filter_by(id=id, employee_id=current_user.id).first()
    if not feedback:
        return jsonify({"error": "Feedback not found"}), 404

    feedback.acknowledged = True
    db.session.commit()

    return jsonify({"message": "Feedback acknowledged"}), 200

@feedback_bp.route('/<int:feedback_id>', methods=['PUT'])
@jwt_required()
def update_feedback(feedback_id):
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or current_user.role != 'manager':
        return jsonify({"error": "Unauthorized"}), 403

    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({"error": "Feedback not found"}), 404

    data = request.get_json()
    feedback.strengths = data.get('strengths', feedback.strengths)
    feedback.improvements = data.get('improvements', feedback.improvements)
    feedback.sentiment = data.get('sentiment', feedback.sentiment)

    db.session.commit()

    return jsonify({"message": "Feedback updated successfully"}), 200
