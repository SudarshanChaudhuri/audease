# 🧪 Quick Test Checklist - AUDEASE

## ✅ Pre-Flight Checks (COMPLETED)

- [x] ESLint: 0 errors, 0 warnings
- [x] Build: Success (783KB JS, 68KB CSS)
- [x] All routes integrated
- [x] SmartAssistant added globally
- [x] Firebase imports fixed

---

## 🚀 Start Testing Now

### 1. Start Development Server

```bash
cd frontend
npm run dev
```

**Expected:** Server starts on `http://localhost:5173`

---

## 📋 Component Test Checklist

### Landing Page (/)
- [ ] Page loads without errors
- [ ] Click "Get Started" → redirects to `/register`
- [ ] Click "Sign In" → redirects to `/login`

### Registration (/register)
- [ ] Fill form with valid data
- [ ] Submit → Success toast appears
- [ ] Redirect to dashboard
- [ ] Check Firebase Console → user created in `users` collection

### Login (/login)
- [ ] Enter credentials
- [ ] Click "Sign In" → Success
- [ ] Google Sign-In button works
- [ ] "Forgot Password" sends reset email

### Dashboard (/dashboard)
- [ ] Welcome message shows user name
- [ ] Sidebar navigation works
- [ ] Overview cards display numbers
- [ ] All menu items clickable

### Book Auditorium (from dashboard)
- [ ] 4-step form loads
- [ ] Fill Step 1: Event info
- [ ] Fill Step 2: Date & time
- [ ] Fill Step 3: Auditorium selection
- [ ] Step 4: Review & Submit
- [ ] Success → Redirect to "My Bookings"
- [ ] Check Firestore → booking created with status: "pending"

### My Bookings
- [ ] Table displays bookings
- [ ] Status badges colored correctly (pending=yellow, approved=green)
- [ ] Click "View" → Modal opens with details
- [ ] Click "Cancel" → Confirmation dialog
- [ ] After cancel → Status changes to "cancelled"

### Availability Checker
- [ ] Calendar displays
- [ ] Select auditorium from dropdown
- [ ] Existing bookings show as colored events
- [ ] Click date slot → "Book this date?" prompt

### Profile Settings (/dashboard → Profile)
- [ ] Current user data displays
- [ ] Email and role are read-only
- [ ] Edit name, department, phone
- [ ] Click "Save Changes" → Success toast
- [ ] Upload avatar image (<2MB PNG/JPG)
- [ ] Avatar preview updates
- [ ] Click "Reset Password" → Email sent

### Contact Page (/contact)
- [ ] Fill contact form
- [ ] Submit → Success toast
- [ ] Form resets after submission
- [ ] Check Firestore → `support` collection has new entry

### About Page (/about)
- [ ] Page loads with all sections
- [ ] Mission, Features, Values visible
- [ ] Technology badges display
- [ ] "Create Account" button → /register
- [ ] "Contact Us" button → /contact

### Smart Assistant (Chatbot)
- [ ] Floating button visible (bottom-right)
- [ ] Click button → Chat panel opens
- [ ] Welcome message appears
- [ ] Click "Start Booking"
- [ ] Select event type
- [ ] Enter audience size
- [ ] Enter date (future date)
- [ ] Select time slot
- [ ] Select auditorium
- [ ] Bot checks availability
- [ ] Click "Book Now" → Redirects to booking form
- [ ] Booking form has prefilled data

### 404 Page (any invalid URL)
- [ ] Navigate to `/random-page`
- [ ] 404 page displays
- [ ] "Go to Home" button works
- [ ] "Go to Dashboard" button works

### Admin Features (login as admin)
- [ ] Go to "All Bookings"
- [ ] View all users' bookings
- [ ] Click "Approve" on pending booking
- [ ] Status changes to "approved"
- [ ] User receives notification
- [ ] Click "Reject" on booking
- [ ] Status changes to "rejected"
- [ ] Go to "User Management"
- [ ] View list of users
- [ ] Change user role (e.g., student → faculty)
- [ ] Click "Deactivate" on user
- [ ] Status changes to inactive

---

## 🔥 Firebase Console Checks

### Firestore Database

Open Firebase Console → Firestore Database

**Collections to verify:**

1. **users**
   - [ ] Documents created on registration
   - [ ] Fields: name, email, role, department, createdAt

2. **bookings**
   - [ ] Documents created on booking submission
   - [ ] Fields: userId, eventTitle, date, startTime, endTime, status
   - [ ] Status values: pending/approved/rejected/cancelled

3. **notifications**
   - [ ] Documents created on booking approval/rejection
   - [ ] Fields: userId, title, message, read, createdAt

4. **support**
   - [ ] Documents created from contact form
   - [ ] Fields: name, email, subject, message, status

### Authentication
- [ ] Go to Authentication tab
- [ ] Verify users are created
- [ ] Email/Password provider enabled
- [ ] Google provider enabled (if configured)

---

## 🐛 Common Issues to Watch For

### Issue: Firebase Not Initialized
**Symptom:** Console error "Firebase: No Firebase App"
**Check:** `.env` file exists with all VITE_ prefixed variables

### Issue: Permission Denied
**Symptom:** "Missing or insufficient permissions"
**Check:** Firestore security rules allow authenticated users

### Issue: Page Not Found on Refresh
**Symptom:** 404 error when refreshing page
**Note:** This is normal in dev mode. In production, configure server redirects.

### Issue: Chatbot Not Visible
**Symptom:** No floating button
**Check:** SmartAssistant is added in App.jsx (outside Routes)

---

## ⚡ Quick Test Script

**Copy and paste these steps:**

```bash
# Terminal 1 - Start frontend
cd frontend
npm run dev

# Browser - Open http://localhost:5173
# Then follow this flow:

1. Go to /register
2. Create account: test@example.com / Test@123456
3. Login → Dashboard loads
4. Click "Book Auditorium"
5. Fill form → Submit
6. Check "My Bookings" → Booking appears
7. Click chatbot button (bottom-right)
8. Complete booking flow
9. Go to /profile → Update profile
10. Go to /contact → Submit form
11. Go to /about → Check content
12. Go to /random → See 404 page
```

---

## 📊 Test Results

**Date:** _______________  
**Tester:** _______________

| Feature | Status | Notes |
|---------|--------|-------|
| Registration | ☐ Pass / ☐ Fail | |
| Login | ☐ Pass / ☐ Fail | |
| Booking Flow | ☐ Pass / ☐ Fail | |
| My Bookings | ☐ Pass / ☐ Fail | |
| Chatbot | ☐ Pass / ☐ Fail | |
| Profile | ☐ Pass / ☐ Fail | |
| Contact | ☐ Pass / ☐ Fail | |
| About | ☐ Pass / ☐ Fail | |
| 404 Page | ☐ Pass / ☐ Fail | |

**Issues Found:**
1. _____________________________________
2. _____________________________________

**Overall Status:** ☐ Ready for Production / ☐ Needs Fixes

---

## 🎯 Performance Metrics

**Build Output:**
- JS Bundle: 783.78 KB (244.57 KB gzipped) ✅
- CSS Bundle: 68.89 KB (10.94 KB gzipped) ✅
- Total: < 1MB ✅

**Page Load Times (Target):**
- Landing: < 2 seconds
- Dashboard: < 3 seconds
- Booking Form: < 2 seconds

---

## 📱 Mobile Testing

Test on these screen sizes:
- [ ] 375px (iPhone SE)
- [ ] 428px (iPhone 14 Pro Max)
- [ ] 768px (iPad)
- [ ] 1920px (Desktop)

**DevTools:** Ctrl+Shift+M → Select device

---

## 🌐 Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)

---

## ✅ Final Checklist Before Production

- [ ] All tests pass
- [ ] No console errors
- [ ] Firebase credentials are production keys
- [ ] Environment variables set
- [ ] Firestore security rules deployed
- [ ] Mobile responsive
- [ ] Cross-browser compatible

---

**Ready to Test!** 🚀

Start the dev server and begin checking off items above.

For detailed testing instructions, see `TESTING_GUIDE.md`.
