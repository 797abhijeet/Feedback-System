from flask import Flask
from extensions import db, migrate, jwt, cors
from routes_auth import auth_bp
from routes_feedback import feedback_bp
from routes_manager import manager_bp
from models import User


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///feedback.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(feedback_bp)
    app.register_blueprint(manager_bp)
    

    # Optional: Endpoint to recreate DB (for dev use only)
    
    

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
