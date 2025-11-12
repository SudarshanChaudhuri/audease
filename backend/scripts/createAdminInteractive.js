#!/usr/bin/env node

/**
 * Interactive script to create admin accounts
 * Usage: npm run create-admin
 */

const admin = require('firebase-admin');
const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  console.log('\n🔐 ============================================');
  console.log('     AUDEASE - Admin Account Creator');
  console.log('============================================\n');

  try {
    const email = await question('📧 Enter admin email: ');
    if (!email.includes('@')) {
      console.error('❌ Invalid email format');
      rl.close();
      process.exit(1);
    }

    const password = await question('🔑 Enter password (min 6 characters): ');
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      rl.close();
      process.exit(1);
    }

    const displayName = await question('👤 Enter display name: ');
    if (!displayName || displayName.length < 2) {
      console.error('❌ Display name must be at least 2 characters');
      rl.close();
      process.exit(1);
    }

    console.log('\n⏳ Creating admin account...\n');

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
    console.log('\n🎉 ============================================');
    console.log('     Admin account created successfully!');
    console.log('============================================\n');
    console.log('📋 Account Details:');
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${displayName}`);
    console.log(`   Role: admin`);
    console.log('\n🔑 Login at: http://localhost:5174/login');
    console.log('============================================\n');

  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.error('\n❌ Error: An account with this email already exists');
      
      const update = await question('\n🔄 Update existing user to admin? (yes/no): ');
      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        try {
          const email = await question('📧 Enter email to update: ');
          const existingUser = await admin.auth().getUserByEmail(email);
          await db.collection('users').doc(existingUser.uid).update({
            role: 'admin',
            updatedAt: new Date().toISOString()
          });
          console.log('\n✅ User updated to admin role successfully!');
          console.log(`   UID: ${existingUser.uid}`);
        } catch (updateError) {
          console.error('❌ Error updating user:', updateError.message);
        }
      }
    } else {
      console.error('\n❌ Error creating admin account:', error.message);
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdmin();
