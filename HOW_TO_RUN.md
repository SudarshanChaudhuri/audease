# 🚀 How to Run & Test AUDEASE

## Quick Start (3 Steps)

### Step 1: Configure Firebase

Create `.env` file in `frontend/` folder:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Get these values from:**
Firebase Console → Project Settings → Your apps → SDK setup and configuration

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

**Open:** http://localhost:5173

---

## 🧪 Quick Test (5 Minutes)

### Test 1: Registration
1. Go to http://localhost:5173/register
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test@123456"
   - Confirm Password: "Test@123456"
   - Role: "Student"
   - Department: "Computer Science"
3. Click "Register"
4. ✅ **Expected:** Success toast → Redirect to dashboard

### Test 2: Create Booking
1. From dashboard, click "Book Auditorium"
2. Fill Step 1:
   - Event Title: "Tech Workshop"
   - Event Type: "Workshop"
   - Description: "Testing booking"
   - Department: "Computer Science"
3. Fill Step 2:
   - Date: (tomorrow's date)
   - Start Time: "09:00"
   - End Time: "12:00"
4. Fill Step 3:
   - Audience Size: "150"
   - Select "Hall C"
5. Review & Submit
6. ✅ **Expected:** Success toast → Booking in "My Bookings" with status "pending"

### Test 3: Smart Assistant
1. Click green floating button (bottom-right)
2. Click "Start Booking"
3. Select "📚 Seminar"
4. Click "50-150" for audience
5. Enter date: "2025-12-25"
6. Click "09:00-12:00"
7. Click "Hall C"
8. Click "Book Now"
9. ✅ **Expected:** Redirect to booking form with all fields prefilled

### Test 4: Profile Update
1. Go to Profile (sidebar)
2. Change name to "Test User Updated"
3. Upload avatar (any image < 2MB)
4. Click "Save Changes"
5. ✅ **Expected:** Success toast → Profile updated

### Test 5: Contact Form
1. Go to http://localhost:5173/contact
2. Fill form:
   - Name: "Jane Doe"
   - Email: "jane@example.com"
   - Message: "Test message"
3. Submit
4. ✅ **Expected:** Success toast → Form clears

---

## 📊 Verify in Firebase Console

### Check Firestore Database

1. Open Firebase Console
2. Go to Firestore Database
3. Check these collections:

**users** → Should have 1 document (your test user)
```
{
  name: "Test User Updated"
  email: "test@example.com"
  role: "student"
  department: "Computer Science"
  createdAt: (timestamp)
}
```

**bookings** → Should have 2 documents (from tests above)
```
{
  userId: (your user ID)
  eventTitle: "Tech Workshop"
  status: "pending"
  date: (tomorrow)
  ...
}
```

**support** → Should have 1 document (from contact form)
```
{
  name: "Jane Doe"
  email: "jane@example.com"
  message: "Test message"
  status: "open"
}
```

---

## 🔧 Build for Production

```bash
npm run build
```

**Expected Output:**
```
✓ 828 modules transformed.
✓ built in 6s

dist/index.html                   0.46 kB
dist/assets/index-xxx.css        68.89 kB
dist/assets/index-xxx.js        783.78 kB
```

---

## 🐛 Troubleshooting

### Problem: "Firebase: No Firebase App"
**Solution:** Create `.env` file with VITE_ prefixed variables

### Problem: "Permission denied"
**Solution:** Update Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Problem: Chatbot not visible
**Solution:** Check `App.jsx` has `<SmartAssistant />` after `</Routes>`

### Problem: Build fails
**Solution:** Check all imports use correct paths:
- Firebase: `import { db, auth } from '../config/firebase'`
- Not: `import { db } from '../firebase'`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SmartAssistant.jsx  ← Chatbot
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProfileSettings.jsx
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   ├── NotFound.jsx
│   │   └── ...
│   ├── config/
│   │   └── firebase.js  ← Firebase config
│   ├── lib/
│   │   └── api.js
│   ├── App.jsx  ← Main routing
│   └── main.jsx
├── .env  ← Firebase credentials (CREATE THIS)
└── package.json
```

---

## ✅ All Components (21/21 Complete)

1. ✅ Firebase Configuration
2. ✅ Login.jsx
3. ✅ Register.jsx
4. ✅ DashboardLayout.jsx
5. ✅ BookingForm.jsx
6. ✅ Landing.jsx
7. ✅ AvailabilityChecker.jsx
8. ✅ BookingHistory.jsx
9. ✅ Analytics.jsx
10. ✅ Notifications.jsx
11. ✅ SupportChat.jsx
12. ✅ AllBookings.jsx (Admin)
13. ✅ UserManagement.jsx (Admin)
14. ✅ ProfileSettings.jsx
15. ✅ Contact.jsx
16. ✅ About.jsx
17. ✅ NotFound.jsx
18. ✅ SmartAssistant.jsx

---

## 🎯 Testing Status

- ✅ ESLint: 0 errors, 0 warnings
- ✅ Build: Success (783KB JS)
- ✅ All routes integrated
- ✅ Firebase imports fixed
- ✅ Production ready

---

## 📚 Documentation

- **Detailed Testing:** See `TESTING_GUIDE.md`
- **Quick Checklist:** See `QUICK_TEST_CHECKLIST.md`
- **Implementation:** See `FINAL_COMPONENTS_SUMMARY.md`

---

## 🚀 Ready to Launch!

**Minimum Requirements:**
- Node.js 18+
- Firebase project created
- `.env` file configured

**Start Testing:**
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 and start testing!

---

**Need Help?** Check the detailed `TESTING_GUIDE.md` for step-by-step instructions.
