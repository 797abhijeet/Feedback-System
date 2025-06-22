# 🗣️ Feedback Sharing System

A role-based feedback sharing platform where **Managers** can give structured feedback to their **Employees**, and Employees can view, acknowledge, and comment on received feedback. Includes JWT authentication, React frontend, and Flask backend with SQLite (configurable to PostgreSQL/MySQL).

---

## 🚀 Features

### ✅ Core Functionality

- 🧑‍💼 **Manager Role**:
  - View list of employees
  - Submit feedback (strengths, improvements, sentiment)
  - View feedback history


- 👨‍💻 **Employee Role**:
  - View feedback given to them
  - Acknowledge feedback
  

- 🔐 **Authentication & Authorization**:
  - JWT-based login/register system
  - Role-based access control

- 📈 **Upcoming/Planned Features**:
  - Employee feedback requests
  - Anonymous peer feedback
  - Notifications (email/in-app)
  - Tagging system (e.g., "Leadership", "Communication")
  - Export feedback as PDF
  - Markdown support in comments

---

## 🛠️ Tech Stack

### 📦 Backend (Flask)
- Flask + Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Migrate
- SQLite (default), can be swapped for PostgreSQL/MySQL
- bcrypt for password hashing
- CORS support

### 🖥️ Frontend (React)
- React + React Router
- Axios (with JWT token support)
- Material UI (MUI)
- Role-based dashboard rendering

---

## 📁 Folder Structure
feedback-sharing-system/
├── backend/
│ ├── app.py
│ ├── models.py
│ ├── extensions.py
│ ├── config.py
│ ├── routes/
│ │ ├── auth.py
│ │ ├── manager.py
│ │ ├── feedback.py
│ │ └── comments.py
│ ├── migrations/
│ └── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── App.js
│ │ ├── Login.js
│ │ ├── Register.js
│ │ ├── ManagerDashboard.js
│ │ ├── ManagerFeedbackForm.js
│ │ ├── EmployeeFeedbackList.js
│ │ └── axiosConfig.js
│ └── public/
├── README.md



---

## 🔐 API Endpoints Overview

### Auth
| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | `/auth/register`     | Register user          |
| POST   | `/auth/login`        | Login + JWT token      |

### Manager
| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| GET    | `/manager/my-employees`    | Get employees under manager   |

### Feedback
| Method | Endpoint                  | Description                            |
|--------|---------------------------|----------------------------------------|
| POST   | `/feedback/ab`            | Submit feedback to employee            |
| GET    | `/feedback/<employee_id>` | View feedback history for employee     |

### Comments
| Method | Endpoint                                     | Description                    |
|--------|----------------------------------------------|--------------------------------|
| POST   | `/feedback/<feedback_id>/comments`           | Add comment to feedback        |
| GET    | `/feedback/<feedback_id>/comments`           | View comments for feedback     |

---

## ⚙️ Backend Setup (Flask)

bash
cd backend
python -m venv venv
source venv/bin/activate    # or venv\Scripts\activate on Windows
pip install -r requirements.txt
export FLASK_APP=app.py
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
flask run


## Frontend Setup (React)
bash
Copy
Edit
cd frontend
npm install
npm start


🌍 Deployment (Vercel + Render)
Backend (Render or Railway)
Create a render.yaml or deploy Flask from dashboard

Set environment variables for JWT secret, DB URL

Frontend (Vercel)
Connect your GitHub repo

Set build command: npm run build

Output directory: build

Set environment variable for REACT_APP_API_URL

🤝 Contributing
Fork the repo

Create a new branch (git checkout -b feature-x)

Commit changes (git commit -m "Add feature x")

Push to branch (git push origin feature-x)

Create a pull request

📬 Contact
Built with ❤️ by Abhijeet Saxena
Feel free to reach out for improvements or collaborations!

Let me know if you want a shorter version, or if you want to include screenshots, demo links, or Swagg
