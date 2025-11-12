# AUDEASE Complete Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
- Node.js installed (v18+)
- Firebase project configured
- Environment variables set up

---

## 1️⃣ Setup & Configuration Test

### Check Environment Files

**Frontend** - Create `.env` in `frontend/` folder:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend** - Create `.env` in `backend/` folder (if using MongoDB):
```env
MONGO_URI=mongodb://localhost:27017/audease
CLIENT_URL=http://localhost:5173
PORT=4000
JWT_SECRET=your_jwt_secret
```

### Verify Firebase Configuration
```bash
# Navigate to frontend
cd frontend

# Check if firebase.js exists and is configured
cat src/firebase.js
```

---

## 2️⃣ Installation Test

### Install Dependencies

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 2 - Backend (Optional):**
```bash
cd backend
npm install
```

### Check for Installation Errors
```bash
# Frontend
npm list --depth=0

# Should see all dependencies:
# - react@19.1.1
# - firebase@12.5.0
# - react-router-dom@6.30.1
# - framer-motion@12.23.24
# - recharts@3.4.1
# - @fullcalendar/react@6.1.19
# - react-toastify@11.0.5
# etc.
```

---

## 3️⃣ Build & Lint Test

### Run ESLint Check
```bash
cd frontend
npm run lint
```

**Expected Output:**
- ✅ 0 compilation errors
- ⚠️ 11-15 Tailwind CSS v4 style warnings (safe to ignore)

### Build Production Bundle
```bash
npm run build
```

**Expected Output:**
```
✓ built in 10-15 seconds
✓ 433+ modules transformed
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.css     XXX.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB
```

---

## 4️⃣ Development Server Test

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Start Backend Server (Optional)
```bash
cd backend
npm start
# or
node src/server.js
```

**Expected Output:**
```
AUDEASE backend listening on 4000
```

---

## 5️⃣ Firebase Connection Test

### Test 1: Check Firebase Initialization
Open browser console at `http://localhost:5173` and check for:
- ✅ No Firebase errors in console
- ❌ If you see "Firebase: Error (auth/...)", check your .env file

### Test 2: Authentication Available
1. Go to Login page: `http://localhost:5173/login`
2. Open browser DevTools → Console
3. Type: `window.firebase`
4. Should see Firebase object (not undefined)

---

## 6️⃣ Component-by-Component Testing

### 🏠 Landing Page Test
**URL:** `http://localhost:5173/`

**Checklist:**
- ✅ Page loads without errors
- ✅ Hero section visible with gradient title
- ✅ "Get Started" and "Learn More" buttons present
- ✅ Features section displays 4 features
- ✅ "Sign In" link in navigation works
- ✅ Responsive design (test mobile view)

**Actions:**
1. Click "Get Started" → Should redirect to `/register`
2. Click "Sign In" → Should redirect to `/login`

---

### 🔐 Registration Test
**URL:** `http://localhost:5173/register`

**Test Case 1: Valid Registration**
1. Fill in all fields:
   - Full Name: "John Doe"
   - Email: "john.doe@test.com"
   - Password: "Test@123456"
   - Confirm Password: "Test@123456"
   - Role: Select "Student"
   - Department: "Computer Science"
2. Click "Register"
3. **Expected:** Success toast, redirect to Dashboard

**Test Case 2: Password Mismatch**
1. Enter different passwords
2. **Expected:** Validation error "Passwords must match"

**Test Case 3: Weak Password**
1. Enter password: "12345"
2. **Expected:** Error "Password must be at least 8 characters"

**Test Case 3: Duplicate Email**
1. Register with same email twice
2. **Expected:** Firebase error toast "Email already in use"

**Console Check:**
- No JavaScript errors
- Firebase Auth should create user
- Firestore should create user document in `users` collection

---

### 🔑 Login Test
**URL:** `http://localhost:5173/login`

**Test Case 1: Valid Login**
1. Email: (registered email)
2. Password: (correct password)
3. Click "Sign In"
4. **Expected:** Success toast, redirect to role-based dashboard

**Test Case 2: Invalid Credentials**
1. Enter wrong password
2. **Expected:** Error toast "Invalid credentials"

**Test Case 3: Google Sign-In**
1. Click "Sign in with Google"
2. **Expected:** Google popup appears
3. Complete Google auth
4. **Expected:** Redirect to dashboard

**Test Case 4: Password Reset**
1. Click "Forgot Password?"
2. Enter email
3. **Expected:** Success toast "Password reset email sent"
4. Check email inbox for reset link

---

### 📊 Dashboard Test (Student)
**URL:** `http://localhost:5173/dashboard` (after login as student)

**Checklist:**
- ✅ Sidebar visible with navigation items
- ✅ Welcome message shows user name
- ✅ Overview cards display (Total Bookings, Pending, Approved, Upcoming)
- ✅ Quick Actions section visible
- ✅ Recent Bookings table (if any exist)

**Sidebar Navigation Test:**
1. Click "Dashboard" → Overview page loads
2. Click "Book Auditorium" → BookingForm opens
3. Click "My Bookings" → BookingHistory loads
4. Click "Availability" → AvailabilityChecker loads
5. Click "Notifications" → Notifications page loads
6. Click "Profile" → ProfileSettings loads
7. Click "Contact Support" → Contact page loads

---

### 📝 Booking Form Test
**URL:** `http://localhost:5173/dashboard` → Click "Book Auditorium"

**Test Case 1: Complete Booking Flow**

**Step 1: Basic Information**
- Event Title: "Tech Workshop"
- Event Type: "Workshop"
- Description: "Testing booking system"
- Department: "Computer Science"
- Click "Next"

**Step 2: Date & Time**
- Date: (select future date)
- Start Time: "09:00"
- End Time: "12:00"
- Click "Next"

**Step 3: Auditorium Selection**
- Audience Size: "150"
- Select "Hall C" (capacity 150)
- Additional Requirements: "Projector needed"
- Click "Next"

**Step 4: Review & Submit**
- Review all details
- Click "Submit Booking"
- **Expected:** 
  - Success toast "Booking request submitted!"
  - Booking saved to Firestore `bookings` collection
  - Status: "pending"
  - Redirect to My Bookings

**Test Case 2: Validation Errors**
1. Try to proceed without filling required fields
2. **Expected:** Form validation errors appear
3. Try to select past date
4. **Expected:** Error "Cannot book past dates"

**Firestore Check:**
```
Collection: bookings
Document ID: (auto-generated)
Fields:
  - userId: (current user ID)
  - eventTitle: "Tech Workshop"
  - eventType: "workshop"
  - status: "pending"
  - createdAt: (timestamp)
  - auditoriumId: "hall-c"
  - date, startTime, endTime, etc.
```

---

### 📅 Availability Checker Test
**URL:** `http://localhost:5173/dashboard` → "Availability"

**Test Case 1: View Calendar**
1. Calendar should display with current month
2. Select auditorium from dropdown
3. **Expected:** Events load on calendar

**Test Case 2: Check Existing Bookings**
1. If bookings exist, they appear as colored events:
   - 🟢 Green: Approved bookings
   - 🟡 Yellow: Pending bookings
   - 🔴 Red: Your bookings
2. Click on event
3. **Expected:** Event details popup

**Test Case 3: Quick Book**
1. Click on empty date slot
2. **Expected:** "Book this date?" confirmation
3. Click "Yes"
4. **Expected:** Opens BookingForm with prefilled date

---

### 📜 Booking History Test
**URL:** `http://localhost:5173/dashboard` → "My Bookings"

**Test Case 1: View Bookings**
1. Table displays all your bookings
2. **Columns:** Event, Date, Time, Auditorium, Status, Actions
3. Status badges colored:
   - 🟡 Pending (yellow)
   - 🟢 Approved (green)
   - 🔴 Rejected (red)

**Test Case 2: Filter Bookings**
1. Click "Pending" tab → Only pending bookings
2. Click "Approved" tab → Only approved bookings
3. Click "Past" tab → Past bookings (date < today)

**Test Case 3: Cancel Booking**
1. Click "Cancel" on a pending booking (created <24 hours ago)
2. Confirm cancellation
3. **Expected:** 
   - Status changes to "cancelled"
   - Toast success message
   - Booking updated in Firestore

**Test Case 4: 24-Hour Rule**
1. Try to cancel booking made >24 hours ago
2. **Expected:** Error "Cannot cancel after 24 hours"

**Test Case 5: View Details**
1. Click "View" button
2. **Expected:** Modal opens with full booking details

---

### 📈 Analytics Test (Admin/Faculty Only)
**URL:** `http://localhost:5173/dashboard` → "Analytics" (requires admin/faculty login)

**Checklist:**
- ✅ 4 stat cards at top (Total, Pending, Approved, Rejected)
- ✅ Bar chart: Bookings per auditorium
- ✅ Pie chart: Booking status distribution
- ✅ Line chart: Bookings over time (last 30 days)

**Test Case 1: Data Loading**
1. Charts should populate with real Firestore data
2. If no data exists, charts show empty state

**Test Case 2: Interactivity**
1. Hover over bar chart bars → Tooltip appears
2. Hover over pie chart slices → Percentage shows
3. Charts are responsive (resize window)

---

### 🔔 Notifications Test
**URL:** `http://localhost:5173/dashboard` → "Notifications"

**Test Case 1: View Notifications**
1. List displays all notifications
2. Unread notifications have colored background
3. Newest notifications at top

**Test Case 2: Mark as Read**
1. Click "Mark as Read" button
2. **Expected:** 
   - Notification background changes
   - `read: true` updated in Firestore

**Test Case 3: Delete Notification**
1. Click "Delete" button
2. **Expected:** 
   - Notification removed from list
   - Document deleted from Firestore

**Test Case 4: Auto-Notifications (Admin Action Required)**
1. Admin approves a booking
2. **Expected:** User receives notification "Booking approved"
3. Admin rejects a booking
4. **Expected:** User receives notification "Booking rejected"

---

### 💬 Support Chat Test
**URL:** `http://localhost:5173/dashboard` → Click chat icon (bottom-right)

**Test Case 1: Open/Close Chat**
1. Click floating button (bottom-right)
2. **Expected:** Chat panel slides in
3. Click X or button again
4. **Expected:** Chat panel slides out

**Test Case 2: Send Message**
1. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "Need help with booking"
2. Click "Send"
3. **Expected:**
   - Success toast
   - Form resets
   - Message saved to Firestore `support` collection

**Firestore Check:**
```
Collection: support
Document:
  - name: "Test User"
  - email: "test@example.com"
  - message: "Need help with booking"
  - userId: (if logged in)
  - status: "open"
  - createdAt: (timestamp)
```

---

### 👤 Profile Settings Test
**URL:** `http://localhost:5173/dashboard` → "Profile"

**Test Case 1: View Profile**
- Current name displayed
- Email displayed (read-only)
- Role displayed (read-only)
- Department field editable
- Phone field editable

**Test Case 2: Update Profile**
1. Change name to "John Updated"
2. Change department to "Electrical Engineering"
3. Enter phone: "1234567890"
4. Click "Save Changes"
5. **Expected:**
   - Success toast
   - Firebase Auth `displayName` updated
   - Firestore user doc updated
   - Page refreshes with new data

**Test Case 3: Upload Avatar**
1. Click "Choose File"
2. Select image (PNG/JPG, <2MB)
3. **Expected:**
   - Preview shows uploaded image
   - Image converted to base64
   - Saved to Firestore user doc (photoURL field)

**Test Case 4: Avatar Validation**
1. Try to upload PDF file
2. **Expected:** Error "Please select an image file"
3. Try to upload 5MB image
4. **Expected:** Error "Image must be less than 2MB"

**Test Case 5: Password Reset**
1. Click "Reset Password"
2. **Expected:** 
   - Email sent to user's email
   - Success toast
   - Check inbox for reset link

---

### 📞 Contact Page Test
**URL:** `http://localhost:5173/contact`

**Test Case 1: Submit Contact Form**
1. Fill in:
   - Name: "Jane Doe"
   - Email: "jane@example.com"
   - Subject: "General Inquiry"
   - Message: "When are auditoriums available?"
2. Click "Send Message"
3. **Expected:**
   - Success toast
   - Form resets
   - Data saved to Firestore `support` collection

**Test Case 2: Validation**
1. Submit with empty fields
2. **Expected:** Validation errors
3. Enter invalid email
4. **Expected:** "Must be a valid email"

---

### ℹ️ About Page Test
**URL:** `http://localhost:5173/about`

**Checklist:**
- ✅ Mission section loads
- ✅ 4 features displayed with icons
- ✅ Values section (Simplicity, Transparency, Efficiency)
- ✅ Technology stack badges
- ✅ CTA buttons (Create Account, Contact Us)
- ✅ All links functional

**Actions:**
1. Click "Create Account" → Redirects to `/register`
2. Click "Contact Us" → Redirects to `/contact`

---

### 🤖 Smart Assistant Test
**URL:** Any dashboard page (floating button bottom-right)

**Test Case 1: Open Chatbot**
1. Click floating green button (bottom-right)
2. **Expected:** 
   - Chat panel slides in
   - Welcome message appears
   - "Start Booking" button visible

**Test Case 2: Complete Booking Flow**

**Step 1:** Click "Start Booking"
**Step 2:** Select event type (e.g., "📚 Seminar")
**Step 3:** Select audience size (e.g., "50-150")
**Step 4:** Enter date (e.g., "2025-12-15")
**Step 5:** Select time slot (e.g., "09:00-12:00")
**Step 6:** Select auditorium (e.g., "Hall C")

**Expected:**
- Bot checks availability in Firestore
- If available: "✅ Great news! Hall C is available"
- If not: "❌ Sorry, not available" + options

**Step 7:** Click "Book Now"

**Expected:**
- Redirects to `/dashboard/book`
- BookingForm opens with prefilled data:
  - eventType: "seminar"
  - audienceSize: 100
  - date: "2025-12-15"
  - startTime: "09:00"
  - endTime: "12:00"
  - auditoriumId: "hall-c"

**Test Case 3: Conflict Detection**
1. Create a booking manually in Firestore:
   - auditoriumId: "hall-a"
   - date: "2025-12-20"
   - startTime: "10:00"
   - endTime: "12:00"
   - status: "approved"

2. Use chatbot to book same auditorium:
   - Date: "2025-12-20"
   - Time: "10:00-12:00"
   - Auditorium: "Hall A"

3. **Expected:** 
   - Bot says "❌ Sorry, Hall A is not available at that time"
   - Options: "Choose Another Hall" or "Choose Another Date"

**Test Case 4: Reset Conversation**
1. Start booking flow
2. Click reset button (top-right, circular arrow icon)
3. **Expected:**
   - All messages cleared
   - Booking data reset
   - Welcome message reappears

**Test Case 5: Custom Input**
1. For audience size, click "Custom"
2. Type "250" in input field
3. Press Enter
4. **Expected:** Bot accepts and continues to date step

---

### 👨‍💼 Admin Dashboard Test
**URL:** `http://localhost:5173/dashboard` (login as admin)

**Extra Features (Admin Only):**
1. **All Bookings Management**
   - View all users' bookings
   - Approve/Reject buttons
   
2. **User Management**
   - View all registered users
   - Change user roles
   - Activate/Deactivate users
   - Delete users

3. **Analytics Access**
   - View system-wide statistics

**Test Case 1: Approve Booking**
1. Go to "All Bookings"
2. Find a "Pending" booking
3. Click "Approve"
4. **Expected:**
   - Status changes to "approved"
   - User receives notification
   - Booking updated in Firestore
   - Toast success message

**Test Case 2: Reject Booking**
1. Click "Reject" on a pending booking
2. Optional: Enter rejection reason
3. **Expected:**
   - Status changes to "rejected"
   - User receives notification
   - Toast success message

**Test Case 3: User Management**
1. Go to "User Management"
2. Find a user
3. Click role dropdown
4. Change from "student" to "faculty"
5. **Expected:**
   - Role updated in Firestore
   - User sees faculty dashboard on next login

**Test Case 4: Deactivate User**
1. Click "Deactivate" on a user
2. **Expected:**
   - User status changes to inactive
   - User cannot log in

---

### 🚫 404 Page Test
**URL:** `http://localhost:5173/random-nonexistent-page`

**Checklist:**
- ✅ 404 page displays
- ✅ Large "404" heading visible
- ✅ Sad face emoji icon
- ✅ Error message "Oops! Page Not Found"
- ✅ "Go to Home" button works
- ✅ "Go to Dashboard" button works
- ✅ Quick links (About, Contact, Login) functional

---

## 7️⃣ Firestore Database Test

### Check Collections Structure

Open **Firebase Console** → **Firestore Database**

**Expected Collections:**

1. **users**
   ```
   Document ID: (user UID)
   Fields:
     - name: string
     - email: string
     - role: "student" | "faculty" | "admin"
     - department: string
     - phone: string
     - photoURL: string (base64 or URL)
     - createdAt: timestamp
     - updatedAt: timestamp
     - status: "active" | "inactive"
   ```

2. **bookings**
   ```
   Document ID: (auto-generated)
   Fields:
     - userId: string
     - eventTitle: string
     - eventType: string
     - description: string
     - department: string
     - date: string (YYYY-MM-DD)
     - startTime: string (HH:MM)
     - endTime: string (HH:MM)
     - auditoriumId: string
     - audienceSize: number
     - requirements: string
     - status: "pending" | "approved" | "rejected" | "cancelled"
     - createdAt: timestamp
   ```

3. **notifications**
   ```
   Document ID: (auto-generated)
   Fields:
     - userId: string
     - title: string
     - message: string
     - type: "info" | "success" | "warning"
     - read: boolean
     - createdAt: timestamp
   ```

4. **support**
   ```
   Document ID: (auto-generated)
   Fields:
     - name: string
     - email: string
     - subject: string (optional)
     - message: string
     - userId: string (optional)
     - status: "open" | "closed"
     - createdAt: timestamp
   ```

---

## 8️⃣ Security Rules Test

### Test Firestore Security Rules

Create test rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Support collection
    match /support/{supportId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow create: if request.auth != null || request.resource.data.userId == null;
    }
  }
}
```

---

## 9️⃣ Performance Test

### Check Bundle Size
```bash
cd frontend
npm run build
```

**Expected:**
- Total bundle size: <1MB gzipped
- Main JS chunk: <500KB
- CSS chunk: <100KB

### Check Load Time
1. Open browser DevTools → Network tab
2. Navigate to `http://localhost:5173`
3. **Expected:**
   - DOMContentLoaded: <2 seconds
   - Load time: <3 seconds
   - No 404 errors

### Check Memory Usage
1. Open DevTools → Performance tab
2. Record a session (30 seconds)
3. Navigate through different pages
4. Stop recording
5. **Expected:**
   - No memory leaks
   - Heap size stable (<50MB)

---

## 🔟 Cross-Browser Test

### Test on Multiple Browsers

**Browsers to Test:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS/iOS)

**Features to Verify:**
1. Login/Registration works
2. Booking form submits
3. Calendar displays correctly
4. Charts render properly
5. Chatbot opens/closes
6. Toast notifications appear
7. Modals open/close

---

## 1️⃣1️⃣ Mobile Responsiveness Test

### Test on Different Screen Sizes

**Sizes:**
- 📱 Mobile: 375px (iPhone SE)
- 📱 Mobile: 428px (iPhone 14 Pro Max)
- 📱 Tablet: 768px (iPad)
- 💻 Desktop: 1920px

**DevTools Method:**
1. Open DevTools
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device from dropdown

**Checklist:**
- ✅ Sidebar collapses on mobile
- ✅ Forms stack vertically
- ✅ Tables scroll horizontally
- ✅ Buttons are touch-friendly (min 44px)
- ✅ Text is readable (min 16px)
- ✅ No horizontal scroll on small screens

---

## 1️⃣2️⃣ Error Handling Test

### Test Error Scenarios

**Test Case 1: Network Offline**
1. Open DevTools → Network tab
2. Set to "Offline"
3. Try to load page
4. **Expected:** Error message or offline indicator

**Test Case 2: Firebase Connection Error**
1. Enter wrong Firebase config in `.env`
2. Restart dev server
3. **Expected:** Console errors but no crashes

**Test Case 3: Invalid Form Data**
1. Submit booking with end time before start time
2. **Expected:** Validation error

**Test Case 4: Unauthorized Access**
1. Logout
2. Try to access `/dashboard` directly
3. **Expected:** Redirect to login page

---

## 1️⃣3️⃣ User Flow Test (End-to-End)

### Complete User Journey

**Scenario:** Student books an auditorium, admin approves

**Step 1: Registration** (2 minutes)
1. Go to `/register`
2. Create account (role: student)
3. Verify email (if enabled)
4. Login automatically

**Step 2: Explore Dashboard** (1 minute)
1. View overview cards
2. Check "My Bookings" (empty initially)
3. View notifications (welcome notification)

**Step 3: Check Availability** (2 minutes)
1. Go to "Availability Checker"
2. Select "Hall A" from dropdown
3. View calendar
4. Check available slots

**Step 4: Create Booking** (3 minutes)
1. Click "Book Auditorium"
2. Fill 4-step form:
   - Event: "Student Council Meeting"
   - Date: Tomorrow
   - Time: 14:00-16:00
   - Auditorium: Hall A
3. Submit

**Step 5: Check Status** (1 minute)
1. Go to "My Bookings"
2. Verify booking status: "pending"
3. Check notification received

**Step 6: Admin Approval** (2 minutes)
1. Logout
2. Login as admin
3. Go to "All Bookings"
4. Find the pending booking
5. Click "Approve"

**Step 7: Student Confirmation** (1 minute)
1. Logout
2. Login as student again
3. Check notifications
4. **Expected:** "Your booking for... has been approved"
5. Go to "My Bookings"
6. **Expected:** Status is "approved"

**Total Time:** ~12 minutes

---

## 1️⃣4️⃣ Chatbot Flow Test (Detailed)

### Test SmartAssistant Complete Flow

**Scenario:** Use chatbot to book an auditorium

1. **Open Chat**
   - Click floating button
   - See welcome message

2. **Start Flow**
   - Click "Start Booking"
   - Bot asks for event type

3. **Event Type**
   - Click "📚 Seminar"
   - Bot confirms and asks audience size

4. **Audience Size**
   - Click "150-300"
   - Bot suggests suitable halls

5. **Date**
   - Type "2025-12-25"
   - Bot asks for time

6. **Time**
   - Click "09:00-12:00"
   - Bot shows auditorium options

7. **Auditorium**
   - Click "Hall B (Capacity: 300)"
   - Bot checks availability

8. **Result**
   - ✅ Available: "Book Now" button appears
   - ❌ Not available: Options to change date/hall

9. **Book Now**
   - Click button
   - Redirected to booking form
   - All fields prefilled
   - Submit booking

**Expected Time:** 2-3 minutes (faster than manual form!)

---

## 1️⃣5️⃣ Accessibility Test

### WCAG Compliance Check

**Keyboard Navigation:**
1. Press Tab to navigate through elements
2. **Expected:** Visible focus indicators
3. Press Enter/Space to activate buttons
4. **Expected:** Actions trigger correctly

**Screen Reader Test:**
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Navigate through pages
3. **Expected:** All content announced correctly

**Color Contrast:**
1. Use browser extension (WAVE, axe DevTools)
2. Check color contrast ratios
3. **Expected:** AAA rating for text (7:1 ratio)

**Alt Text:**
1. Check all images have alt attributes
2. **Expected:** Descriptive alt text for icons

---

## 1️⃣6️⃣ Final Checklist

### Pre-Deployment Verification

- ✅ All ESLint errors resolved (0 errors)
- ✅ Production build succeeds
- ✅ Firebase credentials configured
- ✅ Environment variables set
- ✅ All routes functional
- ✅ Authentication works (email + Google)
- ✅ Booking flow completes successfully
- ✅ Admin features work (approve/reject)
- ✅ Notifications sent and received
- ✅ Chatbot guides booking flow
- ✅ Profile updates save correctly
- ✅ File uploads work (avatars)
- ✅ Forms validate properly
- ✅ Charts render with data
- ✅ Calendar shows bookings
- ✅ Mobile responsive
- ✅ Cross-browser compatible
- ✅ No console errors
- ✅ Security rules configured
- ✅ Performance optimized

---

## 🐛 Common Issues & Fixes

### Issue 1: Firebase Not Initialized
**Error:** "Firebase: No Firebase App '[DEFAULT]' has been created"
**Fix:** Check `.env` file has all VITE_ prefixed variables

### Issue 2: Routes Not Working
**Error:** 404 on page refresh
**Fix:** Add `vite.config.js` with proper history fallback

### Issue 3: Firestore Permission Denied
**Error:** "Missing or insufficient permissions"
**Fix:** Update Firestore security rules (see section 8)

### Issue 4: Images Not Loading
**Error:** Avatar upload fails
**Fix:** Check file size (<2MB) and type (PNG/JPG only)

### Issue 5: Chatbot Not Opening
**Error:** Floating button doesn't respond
**Fix:** Check SmartAssistant component is imported in App.jsx

---

## 📊 Test Results Template

Use this template to document your testing:

```
## Test Session: [Date]

### Environment
- Browser: Chrome 120
- Node: v18.17.0
- OS: Windows 11

### Results
| Component | Status | Notes |
|-----------|--------|-------|
| Landing Page | ✅ Pass | All links work |
| Registration | ✅ Pass | Validation works |
| Login | ✅ Pass | Google auth works |
| Dashboard | ✅ Pass | Cards display correctly |
| Booking Form | ✅ Pass | Submits successfully |
| Availability | ✅ Pass | Calendar renders |
| My Bookings | ✅ Pass | Filters work |
| Analytics | ✅ Pass | Charts render |
| Notifications | ✅ Pass | Mark as read works |
| Profile | ✅ Pass | Avatar upload works |
| Chat Support | ✅ Pass | Messages save |
| Smart Assistant | ✅ Pass | Booking flow complete |
| About Page | ✅ Pass | Content displays |
| 404 Page | ✅ Pass | Navigation works |

### Issues Found
1. [None]

### Recommendations
1. [Add more test data]
```

---

## 🎯 Quick Test Script

Run all tests in sequence:

```bash
# 1. Check dependencies
cd frontend && npm list --depth=0

# 2. Run linter
npm run lint

# 3. Build production
npm run build

# 4. Start dev server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173

# 6. Test authentication
# Register → Login → Dashboard

# 7. Test booking flow
# Book Auditorium → Submit → Check My Bookings

# 8. Test chatbot
# Click floating button → Complete flow

# 9. Test admin features
# Login as admin → Approve booking

# 10. Final check
# All features working? ✅
```

---

## 🚀 Ready for Production?

**Before deploying:**

1. ✅ All tests pass
2. ✅ ESLint shows 0 errors
3. ✅ Build completes successfully
4. ✅ Firebase production config set
5. ✅ Security rules deployed
6. ✅ Environment variables configured
7. ✅ Performance optimized
8. ✅ Mobile tested
9. ✅ Cross-browser tested
10. ✅ User flow tested end-to-end

**Deploy commands:**
```bash
# Build
npm run build

# Preview production build
npm run preview

# Deploy to Firebase Hosting (if configured)
firebase deploy
```

---

**Testing Guide Version:** 1.0  
**Last Updated:** November 11, 2025  
**Total Components:** 21  
**Estimated Testing Time:** 2-3 hours
