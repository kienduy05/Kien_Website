# 🚀 WebCaNhan - Fullstack Personal Website

A modern, full-stack personal website built with **React**, **Node.js**, **Express**, and **SQL Server**. This repository contains both the frontend application and the backend API service.

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Environment Variables](#-environment-variables)
- [License](#-license)

## 🛠 Tech Stack

### **Frontend**
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Linting:** oxlint

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Microsoft SQL Server (`mssql`)
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **File Uploads:** Multer
- **Other:** CORS, Lodash, dotenv

## ✨ Features
- 🔐 **Authentication:** Secure login and registration using JWT and password hashing.
- 👤 **Profile Management:** Admin/User profile editing capabilities.
- 📁 **File Uploads:** Support for uploading images/files via Multer.
- ⚡ **Fast Development:** Instant server start and HMR via Vite.
- 🗄️ **Robust Database:** SQL Server integration for reliable data storage.

## 📂 Project Structure

```text
WebCaNhan/
├── WebCaNhan-backend/       # Express.js REST API
│   ├── src/                 # Controllers, Models, Routes, Utils
│   ├── index.js             # Entry point
│   ├── .env                 # Environment variables (not tracked)
│   └── package.json
└── WebCaNhan-frontend/      # React + Vite Frontend
    ├── src/                 # Components, Pages, Context, Layouts
    ├── public/              # Static assets
    ├── index.html           # HTML entry point
    ├── vite.config.js       # Vite configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or Docker container)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd WebCaNhan
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd WebCaNhan-backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../WebCaNhan-frontend
   npm install
   ```

### Running the App

You will need two separate terminal windows/tabs to run the frontend and backend simultaneously.

**Terminal 1: Start Backend Server**
```bash
cd WebCaNhan-backend
npm run dev
# Server will run on http://localhost:PORT (configured in .env)
```

**Terminal 2: Start Frontend Development Server**
```bash
cd WebCaNhan-frontend
npm run dev
# Frontend will run on http://localhost:5173
```

## 🔐 Environment Variables

You need to create a `.env` file in the `WebCaNhan-backend` directory with the following configuration (ask the owner for the actual values):

```env
# Example backend .env
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=localhost
DB_DATABASE=your_database_name
JWT_SECRET=your_jwt_secret
```

*Optional:* If the frontend uses environment variables, create a `.env` file in the `WebCaNhan-frontend` directory (e.g., `VITE_API_URL=http://localhost:3000/api`).

## 📄 License
This project is licensed under the ISC License.
