
from datetime import datetime
from extensions import db

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    manager_email = db.Column(db.String(128), db.ForeignKey('user.email'), nullable=True)

    manager_ref = db.relationship('User', remote_side=[email], uselist=False)

    # Relationships
    feedbacks_given = db.relationship('Feedback', backref='manager', foreign_keys='Feedback.manager_id')
    feedbacks_received = db.relationship('Feedback', backref='employee', foreign_keys='Feedback.employee_id')

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    strengths = db.Column(db.Text, nullable=False)
    improvements = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False)
    acknowledged = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
