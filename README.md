```
# EventSphere 🚀

**EventSphere Management** is a leading event management firm specializing in organizing large-scale expos and trade shows across industries. Recognized for solving the challenges inherent in traditional expo management processes, this platform is our full-stack solution to streamline event creation, discovery, and coordination.

This repository contains both the **Express backend** and the **React/Vite frontend**.

---

## 📂 Project Structure

To maintain a clean separation of concerns, the project is structured as follows:

* **`/backend`**: Node.js & Express server, MongoDB models, and authentication middleware.
* **`/frontend/vite-project`**: React application built with Vite and Tailwind CSS.

---

## 🛠️ Installation & Setup (For Team Members)

Follow these steps exactly to get your local development environment running.

### 1. Clone the Repository
```bash
git clone [https://github.com/Muhammadziauddin67/EventSphere.git](https://github.com/Muhammadziauddin67/EventSphere.git)
cd EventSphere
```

### 2. Backend Configuration
1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   - Create a new file named `.env`.
   - Copy the values shared in our group chat and paste them into this new `.env` file.

### 3. Frontend Configuration
1. **Navigate to the Vite directory:**
   ```bash
   cd ../frontend/vite-project
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🔐 Best Practices & Security

* **Environment Variables:** Our root `.gitignore` is configured to block `.env` files. **Never commit your secrets.** If you add a new key, update a `.env.example` file so the team knows what to add.
* **Dependency Management:** Do not delete `package-lock.json`. If you install a new package, commit the updated `package.json` so the rest of the team can run `npm install` to stay in sync.
* **Folder Context:** Always ensure your terminal is in `frontend/vite-project` before running Vite commands, or in `backend` for server commands.

---

## 📸 Project Preview

![Project Hero](./frontend/vite-project/src/assets/hero.png)

---

## 🚀 Roadmap
- [ ] Complete Frontend
- [ ] Integration with Google Maps API
- [ ] Real-time event notifications
- [ ] Floor plans Integration 
```

Your project is looking very official now—ready for the team to dive in! Do you think you'll need a section for API documentation later as the backend grows?
