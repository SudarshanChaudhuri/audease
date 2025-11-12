const { admin, db } = require('../config/firebaseAdmin');

/**
 * Register a new user
 * Creates user in Firebase Auth and stores metadata in Firestore
 */
async function register(req, res) {
  try {
    const { email, password, name, role = 'student' } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Store user metadata in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'User registered successfully',
      uid: userRecord.uid,
      email: userRecord.email
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
}

/**
 * Login user (verify token)
 * Frontend sends Firebase ID token, backend verifies and returns user info
 */
async function login(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();

    res.json({
      message: 'Login successful',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: userData.name,
        role: userData.role,
        status: userData.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Get current user profile
 */
async function getMe(req, res) {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        uid: req.user.uid,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Update user role (Admin only)
 */
async function updateRole(req, res) {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await db.collection('users').doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, getMe, updateRole };
