# FlowMaster Backend

FlowMaster is a project management application designed to help users efficiently manage their tasks and projects. This repository contains the backend, built using Django REST Framework (DRF).

## Features
- User authentication and profile management.
- Project creation, management, and invitation system.
- Role-based access control for different user levels.
- API endpoints to handle user profiles, projects, and invitations.

## Tech Stack
- **Django**: Web framework for building the backend.
- **Django REST Framework (DRF)**: For building RESTful APIs.

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/flowmaster-backend.git
   cd flowmaster/backend
   ```

2. **Create a virtual environment and activate it:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory and add the necessary configurations (e.g., database URL, secret key).

5. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```

6. **Run the development server:**
   ```sh
   python manage.py runserver
   ```

## API Endpoints
- `POST /api/account/create/` - Register a new user.
- `POST /api/auth/login/` - Log in a user.
- `GET /api/account/profile/` - Get user profile details.
- `GET /api/projects/` - Get a list of projects.
- `POST /api/projects/create/` - Create a new project.
- `GET /api/account/profile/invite-projects/` - Get invited projects.
and others........

## Project Structure
```
flowmaster/backend/
│── account/          # User authentication and profile management
│── projects/         # Project-related models, views, and serializers
│── config/           # Django project settings and configurations
│── requirements.txt  # Project dependencies
│── manage.py         # Django management script
│── .env              # Environment variables
│── README.md         # Project documentation
```


