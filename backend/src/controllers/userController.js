const { admin, db } = require('../config/firebaseAdmin');

/**
 * Get all users (Admin only)
 */
async function getAllUsers(req, res) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by created date (newest first)
    users.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
}

/**
 * Get user by ID
 */
async function getUserById(req, res) {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      user: {
        id: userDoc.id,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
}

/**
 * Delete user (Admin only)
 */
async function deleteUser(req, res) {
  try {
    const { uid } = req.params;

    // Check if user is trying to delete themselves
    if (uid === req.user.uid) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user from Firebase Auth
    await admin.auth().deleteUser(uid);

    // Delete user document from Firestore
    await db.collection('users').doc(uid).delete();

    // Optional: Delete user's bookings (or mark them as cancelled)
    const bookingsRef = db.collection('bookings');
    const userBookings = await bookingsRef.where('userId', '==', uid).get();
    
    const batch = db.batch();
    userBookings.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
}

/**
 * Get users by role
 */
async function getUsersByRole(req, res) {
  try {
    const { role } = req.params;

    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('role', '==', role).get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
}

/**
 * Update user profile (user can update their own, admin can update any)
 */
async function updateUserProfile(req, res) {
  try {
    const { uid } = req.params;
    const { displayName, phoneNumber, department } = req.body;

    // Check if user is updating their own profile or is admin
    if (uid !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (department !== undefined) updateData.department = department;
    updateData.updatedAt = new Date().toISOString();

    await db.collection('users').doc(uid).update(updateData);

    res.json({ message: 'User profile updated successfully', user: updateData });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  getUsersByRole,
  updateUserProfile
};
