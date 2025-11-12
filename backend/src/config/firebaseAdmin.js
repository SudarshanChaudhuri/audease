const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
const resolvedPath = path.resolve(serviceAccountPath);

let serviceAccount;

// Check if service account file exists
if (!fs.existsSync(resolvedPath)) {
  console.warn('⚠️  WARNING: Service account file not found at:', resolvedPath);
  console.log('📋 Attempting to use environment variable...');
  
  // Try to use FIREBASE_SERVICE_ACCOUNT environment variable (for Render Secret Files)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('✅ Using service account from environment variable');
    } catch (error) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable');
      console.error('📋 Setup Instructions:');
      console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.error('2. Select your project: oabs-audease');
      console.error('3. Go to Project Settings > Service Accounts');
      console.error('4. Click "Generate New Private Key"');
      console.error('5. Upload as Secret File in Render or set FIREBASE_SERVICE_ACCOUNT env var\n');
      process.exit(1);
    }
  } else {
    console.error('\n❌ ERROR: Firebase Service Account Key not found!\n');
    console.error(`Expected location: ${resolvedPath}\n`);
    console.error('📋 Setup Instructions:');
    console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.error('2. Select your project: oabs-audease');
    console.error('3. Go to Project Settings > Service Accounts');
    console.error('4. Click "Generate New Private Key"');
    console.error('5. Save the downloaded file as: serviceAccountKey.json');
    console.error('6. Place it in the backend root directory\n');
    console.error('📖 See FIREBASE_SETUP_GUIDE.md for detailed instructions\n');
    process.exit(1);
  }
} else {
  serviceAccount = require(resolvedPath);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
});

const db = admin.firestore();

console.log('✅ Firebase Admin SDK initialized successfully');
console.log(`📦 Project ID: ${serviceAccount.project_id}`);

module.exports = { admin, db };
