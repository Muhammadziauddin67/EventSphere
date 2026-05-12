# EventSphere 🚀

EventSphere Management is a leading event management firm specializing in organizing large-scale expos and trade shows across industries. This platform is our full-stack solution to streamline event creation, discovery, and coordination.

This repository contains both the Express backend and the React/Vite frontend in a unified workspace.

---

## 📂 Project Structure

To maintain a clean separation of concerns, the project is structured as follows:

- **/backend**: Node.js & Express server, MongoDB models, and authentication middleware  
- **/frontend**: React application built with Vite, Tailwind CSS, and Shadcn UI  

---

## 🛠️ Installation & Setup

Follow these steps exactly to get your local development environment running.

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammadziauddin67/EventSphere.git
cd EventSphere
```

---

### 2. Backend Configuration & Launch

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

### Environment Variables
Create a file named `.env` inside the `/backend` folder and add the required credentials.
> ⚠️ The server will not connect to the database without this file.
### Start Backend Server
```bash
node server.js
```
### Expected Output
```bash
Server is listening on Port number: 8000
MongoDB Connected Successfully
```
---
### 3. Frontend Configuration & Launch
Open a **new terminal** (keep backend running), then:
Navigate to frontend:
```bash
db frontend
```
Install dependencies:
```bash
tnpm install
```
Start development server:
```bash
npm run dev
```
---
## ⚙️ Final Workflow Summary
### Terminal 1 (Backend)
```bash
db backend
node server.js
```

### Terminal 2 (Frontend)
```bash
db frontend
npm run dev
```

---
## 🔐 Best Practices & Security
* Keep `.env` inside `/backend` only  
* Never commit sensitive data to GitHub  
* Always run commands in the correct directory  
* Ensure backend is running before frontend  
---
## 🚀 Roadmap
* [ ] Testing
* [ ] Documentation
* [ ] Github Completion
