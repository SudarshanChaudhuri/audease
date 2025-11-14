const { db, admin } = require('../config/firebaseAdmin');

/**
 * Create and send a notification to a user
 */
async function sendNotification(uid, title, message, type = 'info') {
  try {
    await db.collection('notifications').add({
      uid,
      title,
      message,
      type,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Send notification error:', error);
    throw error;
  }
}

/**
 * Get notifications for a user
 */
async function getNotifications(req, res) {
  try {
    const { uid } = req.params;

    // Users can only view their own notifications unless they're admin
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Removed orderBy to avoid composite index (uid + createdAt)
    const snapshot = await db.collection('notifications')
      .where('uid', '==', uid)
      .limit(50)
      .get();

    const notifications = [];
    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in-memory by createdAt desc
    notifications.sort((a, b) => {
      const aTs = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?._seconds ? a.createdAt._seconds * 1000 : 0);
      const bTs = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?._seconds ? b.createdAt._seconds * 1000 : 0);
      return bTs - aTs;
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Mark notification as read
 */
async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const doc = await db.collection('notifications').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const notification = doc.data();

    // Users can only mark their own notifications as read
    if (notification.uid !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.collection('notifications').doc(id).update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Mark all notifications as read for a user
 */
async function markAllAsRead(req, res) {
  try {
    const { uid } = req.params;

    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const snapshot = await db.collection('notifications')
      .where('uid', '==', uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    res.json({ message: `Marked ${snapshot.size} notifications as read` });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  markAllAsRead
};
