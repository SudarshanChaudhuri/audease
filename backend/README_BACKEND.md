# AUDEASE Backend

Backend API for the Online Auditorium Booking System using Firebase Admin SDK.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Service Account Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **oabs-audease**
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **"Generate New Private Key"**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the backend root directory

### 3. Configure Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
CLIENT_URL=http://localhost:5174
FIREBASE_PROJECT_ID=oabs-audease
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and verify token
- `GET /api/auth/me` - Get current user profile (requires auth)
- `PATCH /api/auth/role/:uid` - Update user role (admin only)

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:uid` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings/cancel/:id` - Cancel booking
- `GET /api/bookings/checkAvailability` - Check slot availability

### Admin (`/api/admin`)
- `GET /api/admin/pending` - Get pending bookings
- `POST /api/admin/approve/:id` - Approve booking
- `POST /api/admin/reject/:id` - Reject booking
- `GET /api/admin/all` - Get all bookings with filters

### Notifications (`/api/notifications`)
- `GET /api/notifications/:uid` - Get user notifications
- `PATCH /api/notifications/markRead/:id` - Mark notification as read
- `POST /api/notifications/markAllRead/:uid` - Mark all as read

## 🔒 Authentication

All protected routes require a Firebase ID token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_FIREBASE_ID_TOKEN'
}
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebaseAdmin.js      # Firebase Admin initialization
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── bookingController.js  # Booking CRUD
│   │   ├── adminController.js    # Admin operations
│   │   └── notificationController.js
│   ├── helpers/
│   │   └── availabilityHelper.js # Booking availability checks
│   ├── middleware/
│   │   └── authMiddleware.js     # Auth & role verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── adminRoutes.js
│   │   └── notificationRoutes.js
│   └── server.js                 # Express app entry point
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── serviceAccountKey.json        # Firebase service account (DO NOT COMMIT)
└── package.json
```

## 🔥 Firebase Collections

### `users`
```javascript
{
  uid: string,
  name: string,
  email: string,
  role: 'student' | 'faculty' | 'admin',
  status: 'active' | 'inactive',
  createdAt: timestamp
}
```

### `bookings`
```javascript
{
  eventTitle: string,
  eventType: string,
  date: string (YYYY-MM-DD),
  startTime: string (HH:mm),
  endTime: string (HH:mm),
  auditoriumId: string,
  expectedAudience: number,
  createdBy: string (uid),
  createdByName: string,
  status: 'pending' | 'approved' | 'rejected' | 'cancelled',
  adminNote: string,
  createdAt: timestamp,
  approvedAt: timestamp,
  approvedBy: string
}
```

### `notifications`
```javascript
{
  uid: string,
  title: string,
  message: string,
  type: 'info' | 'approval' | 'rejection' | 'reminder',
  isRead: boolean,
  createdAt: timestamp
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "student"
  }'
```

## 📝 Notes

- **Service Account Key**: Never commit `serviceAccountKey.json` to version control
- **Firestore Indexes**: May need to create composite indexes for complex queries
- **CORS**: Currently allows requests from `http://localhost:5174` (frontend dev server)
- **Security Rules**: Configure Firestore security rules in Firebase Console

## 🛠️ Development

**View logs:**
```bash
npm run dev
```

**Check for errors:**
- Check terminal output
- Check Firebase Console > Firestore for data
- Check Firebase Console > Authentication for users
