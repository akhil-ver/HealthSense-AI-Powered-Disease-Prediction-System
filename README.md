# HealthSense AI — Advanced Clinical Intelligence Platform

HealthSense AI is a state-of-the-art, full-stack clinical intelligence platform. It utilizes **Google Gemini AI** to deeply analyze patient vitals, predict health stability, detect potential mental burnout, and offer customized preventive wellness roadmaps. The platform features a premium, interactive 3D aesthetic and a comprehensive set of tools for both patients and healthcare professionals.

## ✨ Key Features

*   **🤖 AI Health Assessment:** Uses Google Gemini to generate dynamic clinical health stability scores, physical risk factors, and mental stress warnings based on user vitals.
*   **🧑‍⚕️ Doctor Dashboard:** A unified view for healthcare professionals to monitor all registered patients, viewing their latest stability scores, vitals, and AI-predicted risk levels.
*   **📊 Dynamic Data Visualizations:** Real-time health trend charts built with Recharts.
*   **📄 Clinical PDF Export:** One-click generation of professional clinical health reports for offline sharing.
*   **💬 Support Coach:** An AI-powered interactive wellness coach for instant health-related queries.
*   **📅 Appointments Module:** Fully functional scheduling system with a beautiful booking interface.
*   **🌙 Global Dark Mode:** Seamless ThemeContext integration for switching between light and rich dark aesthetics.
*   **✨ 3D Premium UI:** State-of-the-art glassmorphism design featuring vibrant gradients, micro-animations, and dynamic 3D hover-tilt cards.

## 🚀 Architecture & Tech Stack

*   **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Recharts + Lucide React
*   **Backend**: Node.js + Express
*   **Database**: MySQL + Sequelize ORM
*   **AI Engine**: Google GenAI SDK (`gemini-3-flash-preview`)
*   **PDF Generation**: jsPDF

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MySQL Server (running on localhost)
*   A Google Gemini API Key

### 1. Database Configuration
1. Ensure your local MySQL server is running.
2. The default credentials expected in `backend/models/index.js` are user `root` and password `Akhil@123`.

### 2. Environment Configuration
1. Create a `.env` file in the **root** folder:
   ```env
   
   ```

### 3. Quick Start (Concurrently)
The project is configured to run both the frontend and backend servers simultaneously using a single command.

1. Navigate to the **root** directory.
2. Install all dependencies (this installs root, frontend, and backend packages):
   ```bash
   npm run install-all
   ```
   *(If `install-all` fails, simply run `npm install` in the root, `frontend`, and `backend` directories individually).*
3. Start the application:
   ```bash
   npm run dev
   ```
4. The backend will automatically sync the MySQL database and run on `http://localhost:3001`.
5. The frontend will start via Vite. Open `http://localhost:5173` in your browser.

---

## 🔒 Security & Architecture Notes
*   **Secure API Access**: The Gemini API key is heavily restricted to the Node.js backend to prevent exposure on the client-side network panel.
*   **Algorithmic Fallback**: If no API key is provided, the backend features a complex local algorithm that will dynamically calculate health scores based on your vitals without calling Gemini.
