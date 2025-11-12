# Admin Account Creation Guide

## Overview
Admin accounts in AUDEASE cannot be created through the frontend registration for security reasons. Only system administrators can create admin accounts using backend scripts.

---

## Method 1: Interactive Script (Recommended)

Run the interactive script that will prompt you for admin details:

```bash
cd backend
npm run create-admin
```

You will be prompted to enter:
- Email address
- Password (minimum 6 characters)
- Display name

### Example:
```bash
$ npm run create-admin

🔐 ============================================
     AUDEASE - Admin Account Creator
============================================

📧 Enter admin email: admin@audease.com
🔑 Enter password (min 6 characters): SecurePass123!
👤 Enter display name: System Administrator

⏳ Creating admin account...

✅ Firebase Auth user created: abc123xyz...
✅ Firestore user document created

🎉 ============================================
     Admin account created successfully!
============================================

📋 Account Details:
   UID: abc123xyz...
   Email: admin@audease.com
   Name: System Administrator
   Role: admin

🔑 Login at: http://localhost:5174/login
============================================
```

---

## Method 2: Command Line Script

For automation or scripts, use the CLI version:

```bash
cd backend
npm run create-admin-cli <email> <password> <displayName>
```

### Example:
```bash
npm run create-admin-cli admin@audease.com SecurePass123! "System Administrator"
```

---

## Method 3: Direct Node Script

You can also run the script directly:

```bash
cd backend
node scripts/createAdmin.js admin@audease.com SecurePass123! "System Administrator"
```

---

## Default Admin Accounts (For Testing)

Create these test admin accounts:

### Admin 1 (Primary)
```bash
npm run create-admin-cli admin@audease.com Admin123! "Primary Admin"
```

### Admin 2 (Secondary)
```bash
npm run create-admin-cli admin2@audease.com Admin123! "Secondary Admin"
```

---

## Updating Existing User to Admin

If an account already exists and you need to make it an admin:

1. Run the interactive script:
   ```bash
   npm run create-admin
   ```

2. Enter the existing user's email

3. When prompted about the existing account, choose "yes" to update

---

## Login as Admin

Once the admin account is created:

1. Go to: `http://localhost:5174/login`
2. Enter the admin email and password
3. You will be redirected to the Admin Dashboard

---

## Admin Features

Admin accounts have access to:
- ✅ Admin Dashboard
- ✅ Approve/Reject Bookings
- ✅ User Management (Create, Edit, Delete users)
- ✅ Change User Roles
- ✅ System Analytics
- ✅ View All Bookings
- ✅ Manage Notifications

---

## Security Notes

⚠️ **Important:**
- Admin accounts can only be created via backend scripts
- Never expose admin creation endpoints to the frontend
- Use strong passwords for admin accounts
- Regularly audit admin account usage
- Consider implementing 2FA for admin accounts in production

---

## Troubleshooting

### Error: "Email already exists"
The script will offer to update the existing user to admin role.

### Error: "Cannot find module './serviceAccountKey.json'"
Make sure your Firebase service account key is in the correct location:
- Path: `backend/serviceAccountKey.json`
- Or update `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`

### Error: "Password must be at least 6 characters"
Firebase requires passwords to be at least 6 characters long.

### Error: "Invalid email format"
Make sure the email includes an @ symbol and valid domain.

---

## Next Steps

After creating an admin account:
1. Login to verify the account works
2. Test admin features (user management, booking approvals)
3. Create additional admin accounts as needed
4. Document admin credentials securely
