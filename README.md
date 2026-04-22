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
3. Development mode: `npm run dev`
4. Production mode: `npm start`

## API Endpoints
### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile (Protected)
- PUT /api/auth/updatedetails - Update user name/email (Protected)

### Items
- GET /api/items - Retrieve all items (supports search, sort, filter)
- GET /api/items/me - Get items belonging to the logged-in user
- POST /api/items - Create new item (Protected)
- PUT /api/items/:id - Update item (Protected/Owner)
- DELETE /api/items/:id - Delete item (Protected/Owner)

### Claims
- POST /api/claims - Submit ownership proof for a found item
- GET /api/claims - View all claims (Admin only)
- PUT /api/claims/:id - Update claim status (Pending/Approved/Rejected)

### Statistics
- GET /api/stats - Get system-wide statistics (Protected)
