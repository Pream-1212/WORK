# Mayondo Project – MWF Ltd

## Overview

The Mayondo Project is a web-based business management system developed for Mayondo Wood and Furniture (MWF) Ltd, a business specializing in wood products and furniture. The application streamlines day-to-day operations by providing a centralized platform for managing inventory, suppliers, sales, users, and business performance.

The system is built using Node.js, Express.js, MongoDB Atlas, and Pug templates, enabling secure data management and real-time business operations.

---

## Features

### Dashboard Management

* Business overview dashboard
* Sales and inventory summaries
* Quick access to key operational metrics

### Inventory Management

* Add, edit, and delete stock records
* Track available inventory
* Monitor stock movement and history
* Validate stock data before storage

### Supplier Management

* Add and manage supplier information
* Update supplier records
* Track supplier details and supplied products

### Sales Management

* Record sales transactions
* View and manage sales history
* Update and edit sales records

### User Management

* User registration and authentication
* Role-based access control
* Secure session management using Passport.js

### Reporting and Analytics

* Business performance monitoring
* Inventory tracking
* Sales reporting and analysis

### Responsive Interface

* Optimized for desktop and mobile devices
* User-friendly navigation and layouts

---

## Technology Stack

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### Authentication & Security

* Passport.js
* Passport Local Mongoose
* Express Session
* Connect Mongo

### Frontend

* Pug Template Engine
* HTML5
* CSS3
* JavaScript

### Testing & Development

* Jest
* Nodemon

---

## Project Structure

```text
WORK/
│
├── middleware/
├── models/
├── public/
├── routes/
├── views/
│
├── server.js
├── package.json
├── validateStockData.js
├── validateStockData.test.js
├── .env.example
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Pream-1212/WORK.git
cd WORK
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URL=your_mongodb_connection_string
SESSION_SECRET=your_secure_session_secret
```

### 4. Start the Application

Production:

```bash
npm start
```

Development:

```bash
npm run dev
```

### 5. Access the Application

Open your browser and visit:

```text
http://localhost:4000
```

---

## Deployment

The application is configured for deployment on platforms such as Render using:

```bash
npm install
npm start
```

Environment variables required:

```env
MONGODB_URL=your_mongodb_connection_string
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

---

## Author

**Twesige Pream Queen**

Email: [preamqueentwesige@gmail.com](mailto:preamqueentwesige@gmail.com)

---

## License

This project is licensed under the MIT License.

---

## Future Enhancements

* Advanced business analytics
* Exportable reports (PDF/Excel)
* Email notifications
* Audit logging
* Multi-branch inventory management
* Enhanced role-based permissions
* REST API integration
* Cloud file storage support
