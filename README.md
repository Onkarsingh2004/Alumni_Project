# 🎓 Alumni Portal

A Resume-Killer project bridging the gap between Students and Alumni. Built with Next.js 16 (App Router), Node.js, Express, and MongoDB.

## 🚀 Features

### 👤 Phase 1: Core & Auth
*   **Role-Based System**: Distinct dashboards for **Students** and **Alumni**.
*   **Secure Auth**: JWT + BCrypt authentication.
*   **Profile Management**:
    *   **Students**: Resume, Skills, Branch, Year.
    *   **Alumni**: Company, Role, Experience, Mentorship availability.

### 🤝 Phase 2: Mentorship (The "Heart")
*   **Search**: Filter alumni by Company (e.g., Google), Domain, or Skills.
*   **Request System**: Students send personalized requests.
*   **Dashboard**: Track status (Pending -> Accepted).

### 🌍 Phase 3: Community & Events
*   **Forum**: Discuss queries with tags and likes (Stackoverflow style).
*   **Events**: Alumni host webinars; Students register instantly.
*   **Real-time Updates**: Instant feed updates.

---

## 🛠 Tech Stack
*   **Frontend**: Next.js 16, Tailwind CSS v4, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose).
*   **Architecture**: Client-Server (REST API).

---

## 🏃‍♂️ How to Run

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Running locally on port 27017)

### 2. Quick Start
Run both Client and Server with a single command:
```bash
npm run dev
```
*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing
Check system health with included scripts:

*   **Console Demo**: Watch it play out automatically.
    ```bash
    node demo_script.js
    ```

*   **Stress Test**: Verify stability.
    ```bash
    node stress_test_final.js
    ```

---

## 📂 Project Structure
*   `/client` - Next.js Frontend
*   `/server` - Express Backend
*   `/implementation_plan.md` - Development Roadmap

---
*Built with ❤️ for the Future.*
