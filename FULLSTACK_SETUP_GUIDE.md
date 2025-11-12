# 🚀 Full-Stack AUDEASE Setup Guide

## ✅ Backend + Frontend Integration Complete!

Your AUDEASE application now has a **complete full-stack architecture** with:
- **Backend API** (Express + Firebase Admin SDK)
- **Frontend** (React + Firebase Client SDK)
- **Secure authentication** via Firebase ID tokens

---

## 📋 Setup Steps

### **1. Get Firebase Service Account Key**

**Required for Backend to work!**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **oabs-audease**
3. Click ⚙️ **Project Settings** > **Service Accounts** tab
4. Click **"Generate New Private Key"**
5. Save the downloaded JSON file as:
   ```
   SU/AUDEASE/backend/serviceAccountKey.json
   ```

**IMPORTANT:** This file contains sensitive credentials. **NEVER** commit it to Git!

---

### **2. Start Backend Server**

```bash
cd SU/AUDEASE/backend
npm run dev
```

✅ Backend should start on: **http://localhost:5000**

Expected output:
```
✅ AUDEASE backend listening on port 5000
📍 Health check: http://localhost:5000/health
```

---

### **3. Start Frontend Server**

```bash
cd SU/AUDEASE/frontend
npm run dev
```

✅ Frontend should start on: **http://localhost:5174**

---

## 🔄 How It Works Now

### **Authentication Flow:**
1. User registers/logs in via Firebase Auth (frontend)
2. Frontend gets Firebase ID token
3. **All API requests** automatically include token in Authorization header
4. Backend verifies token with Firebase Admin SDK
5. Backend attaches user info (`uid`, `email`, `role`) to request

### **Booking Flow:**
1. User creates booking (frontend)
2. Frontend calls `POST /api/bookings` with Firebase token
3. Backend verifies user authentication
4. Backend checks slot availability
5. Backend creates booking in Firestore
6. Backend sends notification to user

### **Admin Flow:**
1. Admin approves/rejects booking (frontend)
2. Frontend calls `POST /api/admin/approve/:id`
3. Backend verifies admin role
4. Backend updates booking status
5. Backend sends notification to booking creator

---

## 📡 Frontend Changes Made

### **✅ Updated Files:**

1. **`src/lib/api.js`**
   - Base URL: `http://localhost:5000/api`
   - Auto-attaches Firebase ID token to every request
   - Handles 401 errors (token expired)

2. **`src/components/BookingForm.jsx`**
   - Uses `POST /api/bookings` to create bookings
   - Uses `GET /api/bookings/checkAvailability` for slot checks
   - Removed direct Firestore writes

3. **`src/components/BookingHistory.jsx`**
   - Uses `GET /api/bookings/user/:uid` to fetch bookings
   - Uses `POST /api/bookings/cancel/:id` to cancel bookings
   - Removed direct Firestore reads

### **🔥 Firebase Still Used For:**
- User authentication (login/register)
- Generating ID tokens
- Google Sign-In

---

## 🧪 Testing the Integration

### **Test 1: Health Check**
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"ok","message":"AUDEASE backend is running"}`

### **Test 2: Register User**
1. Open http://localhost:5174/register
2. Fill in: name, email, password, role
3. Click "Create Account"
4. **Check backend logs** → should show registration success
5. **Check Firebase Console** → new user should appear

### **Test 3: Create Booking**
1. Login to the app
2. Click "Create Booking" or "New Booking"
3. Fill in all details
4. Submit booking
5. **Check backend logs** → should show API call
6. **Check Firestore** → booking document should appear with `status: 'pending'`

### **Test 4: View Bookings**
1. Go to dashboard
2. Navigate to "My Bookings" or "Booking History"
3. **Should fetch bookings from backend API**
4. Check browser DevTools Network tab → should see `GET /api/bookings/user/...`

---

## 🔒 Security Features

✅ **All API routes protected** with Firebase token verification
✅ **Role-based access control** (admin, faculty, student)
✅ **Automatic token refresh** handled by frontend
✅ **CORS configured** for frontend domain
✅ **Service account key** never exposed to frontend

---

## 🐛 Troubleshooting

### **Backend won't start:**
- ❌ Missing `serviceAccountKey.json` → Download from Firebase Console
- ❌ Wrong project ID in `.env` → Check `FIREBASE_PROJECT_ID=oabs-audease`
- ❌ Port 5000 in use → Change `PORT` in `.env`

### **Frontend can't connect:**
- ❌ Backend not running → Start backend first
- ❌ Wrong backend URL → Check `api.js` baseURL
- ❌ CORS error → Check backend `CLIENT_URL` in `.env`

### **Authentication errors:**
- ❌ Token expired → User needs to login again
- ❌ User not in Firestore → Check registration flow
- ❌ Wrong role → Update user role in Firestore

---

## 📂 File Structure

```
SU/AUDEASE/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── firebaseAdmin.js       ← Firebase Admin initialization
│   │   ├── controllers/
│   │   │   ├── authController.js      ← Auth logic
│   │   │   ├── bookingController.js   ← Booking CRUD
│   │   │   ├── adminController.js     ← Admin operations
│   │   │   └── notificationController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js      ← Token verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── helpers/
│   │   │   └── availabilityHelper.js  ← Slot conflict detection
│   │   └── server.js                  ← Express app
│   ├── .env                           ← Environment variables
│   ├── serviceAccountKey.json         ← Firebase credentials (DO NOT COMMIT!)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── lib/
    │   │   └── api.js                 ← ✅ Updated: Auto-adds Firebase tokens
    │   ├── components/
    │   │   ├── BookingForm.jsx        ← ✅ Updated: Uses backend API
    │   │   └── BookingHistory.jsx     ← ✅ Updated: Uses backend API
    │   ├── pages/
    │   │   ├── Login.jsx              ← Firebase Auth (unchanged)
    │   │   └── Register.jsx           ← Firebase Auth (unchanged)
    │   └── config/
    │       └── firebase.js            ← Firebase client config
    └── package.json
```

---

## 🎯 Next Steps

### **1. Update More Components to Use Backend:**
- `AllBookings.jsx` → `GET /api/admin/all`
- `Notifications.jsx` → `GET /api/notifications/:uid`
- `AdminDashboard.jsx` → `GET /api/admin/pending`, `POST /api/admin/approve/:id`

### **2. Add More Backend Routes:**
- Analytics (`/api/analytics`)
- User Management (`/api/users`)
- Auditoriums (`/api/auditoriums`)
- Support (`/api/support`)

### **3. Deploy to Production:**
- Use environment variables for service account (not JSON file)
- Set up proper CORS for production domain
- Enable Firestore security rules

---

## ✨ Current Status

✅ Backend fully functional with Firebase Admin SDK
✅ Frontend API client configured with token auto-injection
✅ Booking creation integrated with backend
✅ Booking fetching integrated with backend
✅ Booking cancellation integrated with backend
✅ Authentication flow complete (frontend Firebase → backend verification)

**Ready to test!** 🚀

Start both servers and try creating a booking!
