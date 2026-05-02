EventSphere 🚀
EventSphere Management is a leading event management firm specializing in organizing large-scale expos and trade shows across industries. This platform is our full-stack solution to streamline event creation, discovery, and coordination.

This repository contains both the Express backend and the React/Vite frontend in a unified workspace.

📂 Project Structure
To maintain a clean separation of concerns, the project is structured as follows:

/backend: Node.js & Express server, MongoDB models, and authentication middleware.

/frontend: React application built with Vite, Tailwind CSS, and Shadcn UI.

🛠️ Installation & Setup
Follow these steps exactly to get your local development environment running.

1. Clone the Repository
Bash
git clone https://github.com/Muhammadziauddin67/EventSphere.git
cd EventSphere
2. Backend Configuration
Navigate to the backend folder:

Bash
cd backend
Install dependencies:

Bash
npm install
Environment Variables:

Create a file named .env inside the /backend folder.

Copy the values shared in our group chat and paste them into this file.

Note: The server will not connect to the database without this file.

3. Frontend Configuration
Navigate to the frontend directory:

Bash
cd ../frontend
Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
🔐 Best Practices & Security
Environment Variables: The .env file belongs inside the /backend folder. Never commit your secrets.

Dependency Management: Always ensure you are in the correct folder (/backend or /frontend) before running npm install.

Folder Context: The vite-project subfolder has been removed for a cleaner structure. All frontend commands now run directly inside /frontend.

🚀 Roadmap
[ ] Complete Frontend (Shadcn Integration)

[ ] Integration with Google Maps API

[ ] Real-time event notifications

[ ] Floor plans Integration