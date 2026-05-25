# Campus Lost and Found

MERN stack application for reporting and recovering lost items on campus. Express and MongoDB power the REST API; React (Vite) provides the single-page front end.

## Features
- User registration and login with JWT authentication
- Roles: regular user and admin
- CRUD for lost and found items with search and filters
- Ownership claims on found items
- Comments on item posts
- Admin claims review and statistics dashboard

## Setup
1. `npm install` (repo root) and `npm install` in `frontend/`
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`
3. Seed sample data: `npm run seed`
4. API: `npm run dev` (port 5000)
5. Client: `cd frontend && npm run dev` (port 3000, proxies `/api` to the API)

Demo logins after seeding: `usman@example.com` / `password123` (admin), `hassam@example.com` / `password123` (user).

## Lab document
From the repo root, with Python 3 and Playwright installed (`pip install python-docx playwright requests` then `python -m playwright install chromium`):

```
python docs/build_submission.py
```

This seeds dummy data into MongoDB (local instance on port 27017), captures UI screenshots, and writes `docs/AWT_Lab_Terminal_MERN_Submission.docx`.

## API Endpoints
### Authentication
- POST /api/auth/register - Register user  
  Body: `{ name: string, email: string, password: string, role?: string }`
- POST /api/auth/login - Login user  
  Body: `{ email: string, password: string }`
- GET /api/auth/me - Get current user profile (Protected)
- PUT /api/auth/updatedetails - Update user name/email (Protected)  
  Body: `{ name?: string, email?: string }`

### Items
- GET /api/items - Retrieve all items (supports search, sort, filter)
- GET /api/items/me - Get items belonging to the logged-in user
- POST /api/items - Create new item (Protected)  
  Body: `{ title: string, description: string, category: string (Electronics/Personal Effects/Documents/Other), type: string (Lost/Found), location: string }`
- PUT /api/items/:id - Update item (Protected/Owner)
- DELETE /api/items/:id - Delete item (Protected/Owner)

### Claims
- POST /api/claims - Submit ownership proof for a found item  
  Body: `{ itemId: string, description: string }`
- GET /api/claims - View all claims (Admin only)
- PUT /api/claims/:id - Update claim status (Pending/Approved/Rejected)  
  Body: `{ status: string (Pending/Approved/Rejected) }`

### Statistics
- GET /api/stats - Get system-wide statistics (Protected)
