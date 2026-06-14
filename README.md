📘 UniVisit Management System (UVMS)

A Web-Based Visitor Request, Verification, and Tracking System designed to improve visitor management, security, and monitoring in university offices.

🚀 Project Overview

The UniVisit Management System (UVMS) replaces manual visitor logbooks with a digital platform that allows:

Online visitor appointment requests
Approval and scheduling by office staff
Secure visitor verification using unique codes
Real-time tracking of visitor movement

This system enhances security, efficiency, and record management.

🎯 Objectives
Main Objective

To develop a web-based system for managing visitor requests, verification, and tracking.

Specific Objectives
Automate visitor request submission
Implement approval/rejection workflow
Generate secure verification codes
Track visitor entry and exit time
Provide dashboards for monitoring
👥 System Users
User Role	Description
Visitor	Submits visit requests and receives verification code
Secretary/Staff	Approves requests and verifies visitors
Administrator	Manages system, users, and reports
🧩 Key Features
✅ Visitor Features
Register & Login
Submit visit request
View request status
Receive verification code
✅ Staff Features
Approve or reject requests
Schedule visits
Verify visitor codes
✅ Admin Features
Manage users
View system activity
Generate reports
✅ System Features
Visitor tracking (check-in/check-out)
Secure authentication
Centralized database
🛠️ Technology Stack
Frontend
HTML
CSS
JavaScript
Backend
PHP / Node.js
Database
MySQL (univisit_db)
Tools
VS Code
XAMPP / Laravel
🗄️ Database Structure (Overview)

Main tables include:

users
visitors
visit_requests
verification_codes
visit_logs
⚙️ System Requirements
Hardware
Computer or Laptop
Smartphone
Internet connection
Software
Windows/Linux OS
Web Browser
MySQL Database
Web Server (Apache/Nginx)
🔐 Security Features
User authentication (login system)
Password encryption
Role-based access control
Verification code validation
🔄 System Workflow
Visitor submits request
Staff reviews request
Request is approved/rejected
System generates verification code
Visitor arrives and is verified
System records entry and exit time
📊 Non-Functional Requirements
Fast response time (2–5 seconds)
User-friendly interface
High reliability and uptime
Scalable architecture
⚠️ Limitations
No biometric authentication
SMS integration may not be available
Developed as an academic prototype
🔮 Future Improvements
SMS/Email notifications
QR code integration
Mobile application
Biometric verification
📦 Installation Guide
1. Clone the Repository
git clone https://github.com/your-repo/univisit-system.git
2. Setup Database
CREATE DATABASE univisit_db;

Import SQL file:

univisit_db.sql
3. Configure Environment
Set database credentials in .env or config file
4. Run Server
Using XAMPP → Start Apache & MySQL
Place project in htdocs
5. Access System
http://localhost/univisit-system
🧪 Testing
Unit Testing for modules
Login validation
Request submission
Code verification
Database operations
📅 Project Timeline
Activity	Duration
Design	2 Weeks
Development	1 Month
Testing	1 Week
Documentation	1 Month
💰 Estimated Budget
Item	Cost (TZS)
Stationery	20,000
Internet/Hosting	25,000
Tools	25,000
Miscellaneous	20,000
Printing	50,000
Total	140,000
📚 References
Visitor Management Systems Research (2022–2024)
Web-based System Development Practices
👨‍💻 Developers
Sephania L. Alfred
Fredrick P. Mshana
Alice K. Matungwa
🏫 Institution

The University of Dodoma (UDOM)
College of Informatics and Virtual Education

📌 License

This project is developed for academic purposes only.