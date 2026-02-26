# HouseHunt - House Rental Application

A MERN stack application for finding and renting properties.

## Features

- User authentication (Renter, Owner, Admin)
- Property listing and search
- Booking system
- Admin approval for owners
- Owner property management

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Configure backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. Run the application:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Default Admin Account

Create an admin user directly in MongoDB:
```javascript
{
  name: "Admin",
  email: "admin@househunt.com",
  password: "$2a$10$...", // bcrypt hash of your password
  type: "admin",
  isApproved: true
}
```

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Bootstrap & Material-UI
- JWT Authentication
