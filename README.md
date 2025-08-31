# UEFA Champions League Player Performance Tracker ⚽📊

## About

The **UEFA Champions League Player Performance Tracker** is a full-stack web application designed to track, analyze, and visualize the performance of **850+ players** competing in the **2024–2025 UEFA Champions League**.

Built as a **resume-ready portfolio project**, it combines data engineering, backend APIs, modern frontend frameworks, and secure authentication — showcasing **end-to-end full-stack development skills** highly valued by **Big Tech companies** (Meta, Apple, Amazon, Netflix, Google, Microsoft, Uber) and **elite financial firms** (JPMorgan Chase, Morgan Stanley, Goldman Sachs, Charles Schwab).

The project allows fans, analysts, and scouts to filter and compare players by team, nationality, and position, as well as view advanced statistics such as **expected goals (xG)** and **expected assisted goals (xAG)**.

**Admin users** (restricted via Google OAuth2 + Spring Security role-based access) have full CRUD functionality to manage player records securely.

## Features ✨

### 🏆 **Player Performance Dashboard**
Browse detailed player stats including goals, assists, minutes, starts, penalty kicks, xG, and xAG.

### 🔍 **Advanced Filtering & Search**
Explore players by team, nationality, position, or custom filters with instant search functionality.

### 📊 **Leaderboard & Rankings**
Dynamic leaderboard to showcase top players based on goals, assists, or expected stats.

### 🔐 **Authentication & Authorization**
Integrated Google OAuth2 Login with role-based access; only designated admins can perform CRUD operations.

### ⚙️ **Admin Panel (CRUD)**
Create, update, patch, and delete player records through a protected admin interface.

### 📱 **Responsive UI**
Built with **React.js + Tailwind CSS**, delivering a sleek, modern design optimized for desktop and mobile.

### 🚀 **Scalable Data Management**
Backend built on **Spring Boot + PostgreSQL**, secured with Spring Security (OAuth2, JWT, OpenID Connect).

## Tech Stack 🛠️

### **Backend**
- **Spring Boot 3**
- Spring Data JPA
- Hibernate
- Spring Security
- OAuth2
- JWT

### **Frontend**
- **React.js** (Vite)
- **Tailwind CSS**
- Axios
- React Router

### **Database**
- **PostgreSQL** (hosted locally, deployable to AWS RDS)

### **Authentication**
- **Google OAuth2**
- OpenID Connect

### **DevOps / Deployment**
**Planned:**
- **AWS Elastic Beanstalk** (backend)
- **AWS RDS** (database)
- **Vercel** (frontend)
- HTTPS security with SSL/TLS
