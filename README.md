
# User Management System (MERN Stack)

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a secure and user-friendly platform for:

* User Authentication with JWT and Google OAuth 2.0

* User Registration and Login with custom validation messages

* Dashboard for managing user profiles (Create, Read, Update, Delete)

* Responsive UI with styled forms, tables, and modals

This app is designed for:

* Students who want to learn authentication and CRUD in MERN

* Developers looking for a starter template for web applications

* Teams who need a secure base for scalable applications

# Acknowledgement

* I would like to thank my trainers and mentors for their continuous support and guidance throughout the development of this project.

* I am grateful to my peers and friends who tested the application and provided valuable feedback.

* Special thanks to the open-source community for providing resources and documentation that made learning and implementation easier.




---

# Features

* Create new profiles with user details.  
* View and display a list of profiles.  
* Update existing profile information.  
* Delete profiles permanently.  
* Responsive and simple UI with icon-based actions.  

---

# Tech Stack

* **Frontend**: React.js, CSS  
* **Backend**: Node.js, Express.js  
* **Database**: MongoDB  
* **Icons**: React Icons  

---

# Installation

Follow these steps to set up the project locally:

### Clone the Repository
```bash
git clone https://github.com/anujkpandit/profile-management-system.git
```
### Navigate into the project
```bash
cd Assignment
```
### Install dependencies

For backend:
```bash
cd server
npm install
```
For frontend:
```bash
cd AdminPanel
npm install
```
### Environment Variables

Create a .env file in the server directory and add the following:
```env
PORT=4000
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-secret-key
```
### Run the Project

Start backend server:
```bash
cd server
npm start
```
Start frontend client:
```bash
cd AdminPanel
npm run dev
```
### Project Structure

```
└── 📁MERN_stack_small_project-main
    └── 📁AdminPanel
        └── 📁public
            ├── vite.svg
        └── 📁src
            └── 📁assets
                ├── react.svg
            └── 📁components
                ├── AuthCallback.jsx
                ├── ProtectedRoute.jsx
                ├── PublicRoute.jsx
            └── 📁pages
                ├── Dashboard.jsx
                ├── Login.jsx
                ├── Register.jsx
            └── 📁services
                ├── api.js
            ├── App.css
            ├── App.jsx
            ├── CrudContainer.jsx
            ├── main.jsx
            ├── Signin.css
        ├── .env
        ├── .eslintrc.cjs
        ├── .gitignore
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── vite.config.js
    └── 📁server
        └── 📁config
            ├── passport.js
        └── 📁db
            ├── mongoose.js
        └── 📁middleware
            ├── auth.js
        └── 📁models
            ├── profile.js
            ├── user.js
        └── 📁routes
            ├── auth.js
            ├── profile.js
            ├── user.js
        ├── .env
        ├── index.js
        ├── package-lock.json
        ├── package.json
    └── README.md
```

### Usage

* **Register a new account**  
  Navigate to the Register page and create an account by providing your email and password.  

* **Login with your credentials**  
  Use the Login page to sign in with your registered email and password.  

* **Sign in with Google**  
  Click the **"Sign in with Google"** button to log in using your Google account via OAuth 2.0.  

* **Access the Dashboard**  
  After successful login, you will be redirected to the dashboard where you can manage profiles.  

* **Manage Profiles**  
  - Create a new profile by filling in details.  
  - Edit existing profiles using the edit icon.  
  - Delete profiles with the delete icon.  

* **Logout**  
  Log out securely when you’re done.


---

# API Reference

### Auth Routes
* `POST /auth/register` - Register a new user  
* `POST /auth/login` - Login with email and password  
* `GET /auth/google` - Redirect to Google OAuth login  
* `GET /auth/google/callback` - Handle Google OAuth callback  

### Profile Routes
* `GET /profiles` - Get all profiles  
* `POST /profiles` - Create a new profile  
* `PUT /profiles/:id` - Update profile by ID  
* `DELETE /profiles/:id` - Delete profile by ID  

---

# Contributing

Contributions are always welcome!  

To contribute:  
1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add your message"`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

---

# License

This project is licensed under the MIT License. See the LICENSE file for details.

---