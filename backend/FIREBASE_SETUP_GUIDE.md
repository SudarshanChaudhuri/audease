# 🔥 Firebase Service Account Setup Guide

## Step-by-Step Instructions

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/

### 2. Select Your Project
Click on **oabs-audease** project

### 3. Navigate to Project Settings
1. Click the **⚙️ gear icon** next to "Project Overview"
2. Select **"Project settings"**

### 4. Go to Service Accounts Tab
1. Click on the **"Service accounts"** tab
2. You should see "Firebase Admin SDK" section

### 5. Generate Private Key
1. Click **"Generate new private key"** button
2. A dialog will appear warning you to keep this file secure
3. Click **"Generate key"**
4. A JSON file will be downloaded to your computer

### 6. Save the File
1. Rename the downloaded file to `serviceAccountKey.json` (if it's not already named that)
2. Move it to the backend root directory:
   ```
   SU/AUDEASE/backend/serviceAccountKey.json
   ```

### 7. Verify the File
The file should contain something like this:
```json
{
  "type": "service_account",
  "project_id": "oabs-audease",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@oabs-audease.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 8. Update .gitignore
Make sure your `.gitignore` includes:
```
serviceAccountKey.json
*.json
!package.json
.env
```

## ⚠️ IMPORTANT SECURITY NOTES

1. **NEVER commit this file to Git**
2. **NEVER share this file publicly**
3. **This key has full admin access to your Firebase project**
4. If compromised, generate a new key immediately and delete the old one

## 🔒 Alternative: Environment Variables

For production, consider using environment variables instead:

```javascript
// Instead of loading from file:
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

Then in `.env`:
```env
FIREBASE_PROJECT_ID=oabs-audease
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@oabs-audease.iam.gserviceaccount.com
```

## ✅ Testing Your Setup

After placing the file, test it by starting the backend:

```bash
cd backend
npm run dev
```

You should see:
```
✅ AUDEASE backend listening on port 5000
📍 Health check: http://localhost:5000/health
```

If you see errors about Firebase initialization, double-check:
1. File path is correct
2. File is valid JSON
3. Project ID matches your Firebase project
