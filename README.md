UEFA Champions League Player Performance Tracker ⚽📊
A full-stack web application designed to track, analyze, and visualize performance statistics for 850+ professional soccer players across 36 teams in the UEFA Champions League. This project features a secure Spring Boot REST API, a dynamic React.js frontend, and a robust PostgreSQL database.

Core Features ✨
🏆 Player Performance Dashboard: Browse and visualize detailed player statistics including goals, assists, minutes played, expected goals (xG), and expected assisted goals (xAG).

🔍 Advanced Filtering & Search: Implement comprehensive filtering by team, nationality, and position. Optimized search queries deliver instant results from a large dataset.

📊 Dynamic Leaderboards: View interactive leaderboards showcasing top players based on key performance indicators like goals, assists, or advanced metrics.

🔐 Secure Authentication & Authorization: Integrated Google OAuth2 and OpenID Connect for secure user login. A JWT-based system ensures that API endpoints are protected.

⚙️ Role-Based Admin Panel: Admins have exclusive, role-based access to perform CRUD (Create, Read, Update, Delete) operations on player records through a secure interface.

📱 Responsive UI: The frontend is built with React.js and styled with Tailwind CSS, providing a sleek, modern, and fully responsive user experience on both desktop and mobile devices.

Technical Architecture 🛠️
This application is built with a modern, decoupled architecture. The React frontend communicates with a secure, stateless Spring Boot backend via a REST API. Authentication is handled using Google OAuth2, with JWTs used to authorize subsequent API requests.

Frontend (React.js): The client-side application, built with Vite and styled with Tailwind CSS, handles all user interactions and data visualization.

Backend (Spring Boot): The server-side application exposes a REST API for all data operations. It leverages Spring Data JPA for database interaction and Spring Security for robust authentication and authorization.

Database (PostgreSQL): A relational database used to store and manage all player, team, and statistical data efficiently.

Authentication Flow:

User logs in via Google OAuth2.

The Spring Boot backend validates the token and generates a session JWT.

This JWT is sent with every subsequent API request to access protected resources.

Role-based access control restricts sensitive operations (like CRUD) to admin users only.

Tech Stack
Category

Technology / Framework

Backend

Java, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, JWT

Frontend

React.js (Vite), JavaScript, HTML5, Tailwind CSS, Axios, React Router

Database

PostgreSQL

Auth

Google OAuth2, OpenID Connect

Dev Tools

Git, IntelliJ, VS Code, Postman

Planned DevOps

Docker, AWS Elastic Beanstalk (Backend), AWS RDS (Database), Vercel (Frontend)

Getting Started
To run this project locally, you will need Java (JDK), Node.js, and PostgreSQL installed.

Prerequisites
Java 21+

Maven 3.8+

Node.js 18+

PostgreSQL 15+

Backend Setup
Clone the repository:

git clone [https://github.com/jasonjesuraja06/ucl-tracker-project.git](https://github.com/jasonjesuraja06/ucl-tracker-project.git)
cd ucl-tracker-project/backend

Configure your PostgreSQL database in src/main/resources/application.properties.

Set up your Google OAuth2 credentials.

Build and run the Spring Boot application:

mvn spring-boot:run

The backend will be running on http://localhost:8080.

Frontend Setup
Navigate to the frontend directory:

cd ../frontend

Install the required npm packages:

npm install

Start the React development server:

npm run dev

The frontend will be accessible at http://localhost:5173.

Author
Jason Jesuraja

LinkedIn: linkedin.com/in/jason-jesuraja

GitHub: github.com/jasonjesuraja06
