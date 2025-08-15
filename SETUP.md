# Social Media Platform Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

## Installation

### 1. Clone and Setup Frontend
```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in the backend directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configurations:
```env
MONGODB_URI=mongodb://localhost:27017/social-media-platform
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup
Start MongoDB service:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Start Frontend (Terminal 2)
```bash
npm run dev
```

## Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Default Admin Account
- Email: admin@example.com
- Password: admin123

## API Endpoints
- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Posts: `/api/posts/*`
- Streams: `/api/streams/*`
- Matches: `/api/matches/*`
- Chat: `/api/chat/*`
- Admin: `/api/admin/*`
- Notifications: `/api/notifications/*`

## Database Structure
See `database-structure.md` for detailed schema information.

## Troubleshooting
1. Ensure MongoDB is running
2. Check port availability (5000, 5173)
3. Verify environment variables
4. Check Node.js version compatibility

## Production Deployment
1. Set NODE_ENV=production
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure MongoDB Atlas for cloud database