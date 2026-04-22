# Lost and Found System

A RESTful API for managing lost and found items on campus. Built with Express.js and MongoDB.

## Features
- User registration and login with JWT authentication.
- Role-based authorization for administrative tasks.
- CRUD operations for reporting and tracking items.
- Item categorization and location tagging.
- Global error handling and data validation.

## Technical Details
- Backend Framework: Express.js
- Database: MongoDB (Mongoose)
- Security: JWT, Bcryptjs
- Configuration: Dotenv

## Setup Instructions
1. Install dependencies: `npm install`
2. Configure `.env` with `MONGODB_URI` and `JWT_SECRET`.
3. Start the application: `npm run dev` (or `node src/app.js`)

## API Endpoints
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/items - Retrieve all items
- POST /api/items - Create new item (Protected)
- PUT /api/items/:id - Update item (Protected/Owner)
- DELETE /api/items/:id - Delete item (Protected/Owner)
