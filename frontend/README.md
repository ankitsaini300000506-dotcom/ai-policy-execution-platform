# 🚀 PolicyVision3.0 - Frontend Dashboard

> **Immersive Policy Execution Interface** - A futuristic, real-time command center for policy management and AI visualization.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)](https://tailwindcss.com)

---

## 🎯 The Interface

The **PolicyVision Frontend** is not just a dashboard; it's a mission control center. It bridges the gap between complex AI analysis and human decision-making through:
- 🎨 **Glassmorphism UI** - Modern, translucent aesthetics
- ⚡ **Real-Time Updates** - Live socket/polling integration
- 🧊 **3D Visualization** - Interactive data representation
- 📱 **Responsive Design** - Seamless across devices

---

## ✨ Key Modules

### 1. 📤 Policy Upload & Ingestion
- **Drag & Drop Zone** - Intuitive file upload with validation
- **Real-time Progress** - Visual feedback during AI processing
- **Format Support** - PDF, DOCX parsing

### 2. 🧠 Neural Processing View
- **Live AI Visualization** - Watch the neural network "think"
- **Step-by-Step Logs** - Transparency in rule extraction
- **Ambiguity Detection** - Visual flagging of vague clauses

### 3. 📝 Ambiguity Review
- **Interactive Resolution** - Human-in-the-loop clarification
- **Smart Suggestions** - AI-proposed fixes for ambiguities
- **Context Awareness** - Original text highlighting

### 4. 📊 Mission Control Dashboard
- **System Overview** - High-level metrics (Tasks, Policies, Health)
- **Role-Based Views** - Clerk, Officer, Admin specific task lists
- **Activity Timeline** - Chronological feed of all system actions
- **Performance Charts** - Visual analytics of processing speed

### 5. 🏆 Results "Victory Chamber"
- **3D Data Viz** - Interactive 3D elements representing policy structure
- **Before/After Comparison** - Visual proof of optimization
- **Smart Export** - Generate PDF reports or JSON data

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | React framework for production |
| **Language** | TypeScript | Type safety and developer experience |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Animations** | Framer Motion | Smooth, complex animations |
| **Icons** | Heroicons | Beautiful SVG icons |
| **State** | React Hooks | Local and global state management |
| **HTTP Client** | Axios | API communication |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the `frontend` root:
   ```env
   NEXT_PUBLIC_API_URL=https://eighty-clubs-stop.loca.lt
   NEXT_PUBLIC_BACKEND_URL=https://policy-execution-backend.onrender.com
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── dashboard/       # Dashboard Page & Components
│   │   ├── processing/      # AI Processing Visualization
│   │   ├── results/         # 3D Results View
│   │   ├── review/          # Ambiguity Review Interface
│   │   └── upload/          # File Upload Interface
│   ├── components/          # Shared UI Components
│   │   ├── ui/              # Buttons, Cards, Icons
│   │   └── common/          # Header, Footer
│   ├── lib/                 # Utilities & API Client
│   └── styles/              # Global CSS & Tailwind
├── public/                  # Static Assets
├── tailwind.config.js       # Design System Config
└── tsconfig.json            # TypeScript Config
```

---

## 🔄 Backend Integration

The frontend communicates with two key backends:

1. **NLP Backend** (for Parsing)
   - `POST /api/policy/process` - Upload & Analyze
   - `POST /api/policy/clarify` - Resolve Ambiguities

2. **Execution Backend** (for Management)
   - `GET /tasks` - Fetch Role-based Tasks
   - `POST /tasks/update-status` - Execute Tasks
   - `GET /audit-logs` - Fetch System History

---

## 🎨 Design System

Our design philosophy centers on **"Functional Futurism"**:
- **Colors:** Cyan (#06b6d4), Purple (#8b5cf6), Emerald (#10b981)
- **Typography:** Orbitron (Headings), Inter (Body), JetBrains Mono (Code)
- **Effects:** Glassmorphism, Neon Glows, Smooth Transitions

---

## 👥 Team

**Frontend Development** - PolicyVision Interface

---

<div align="center">

**Built with ❤️ for PolicyVision3.0 Hackathon**

*Visualizing the Future of Policy Execution*

</div>
