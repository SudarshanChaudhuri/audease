#!/usr/bin/env node

/**
 * Script to create admin accounts
 * Usage: node scripts/createAdmin.js <email> <password> <displayName>
 * Example: node scripts/createAdmin.js admin@audease.com SecurePass123! "System Admin"
 */

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
const resolvedPath = path.resolve(__dirname, '..', serviceAccountPath);

const serviceAccount = require(resolvedPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();

async function createAdmin(email, password, displayName) {
  try {
    console.log('🔐 Creating admin account...');
    console.log(`Email: ${email}`);
    console.log(`Name: ${displayName}`);

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false
    });

    console.log(`✅ Firebase Auth user created: ${userRecord.uid}`);

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      status: 'active'
    });

    console.log('✅ Firestore user document created');
    console.log('\n🎉 Admin account created successfully!');
    console.log('\n📋 Account Details:');
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${displayName}`);
    console.log(`   Role: admin`);
    console.log('\n🔑 You can now login with these credentials.');

  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.error('❌ Error: An account with this email already exists');
      
      // Try to update existing user to admin
      console.log('\n🔄 Attempting to update existing user to admin role...');
      try {
        const existingUser = await admin.auth().getUserByEmail(email);
        await db.collection('users').doc(existingUser.uid).update({
          role: 'admin',
          updatedAt: new Date().toISOString()
        });
        console.log('✅ Existing user updated to admin role');
        console.log(`   UID: ${existingUser.uid}`);
      } catch (updateError) {
        console.error('❌ Error updating existing user:', updateError.message);
      }
    } else {
      console.error('❌ Error creating admin account:', error.message);
    }
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('❌ Usage: node scripts/createAdmin.js <email> <password> <displayName>');
  console.log('\nExample:');
  console.log('  node scripts/createAdmin.js admin@audease.com SecurePass123! "System Admin"');
  console.log('\n⚠️  Note: Password must be at least 6 characters');
  process.exit(1);
}

const [email, password, displayName] = args;

// Validate input
if (!email.includes('@')) {
  console.error('❌ Invalid email format');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters');
  process.exit(1);
}

if (!displayName || displayName.length < 2) {
  console.error('❌ Display name must be at least 2 characters');
  process.exit(1);
}

// Create the admin
createAdmin(email, password, displayName)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
