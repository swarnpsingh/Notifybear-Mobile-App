import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (make sure this matches your server setup)
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // or use a service account
});

// Replace with your device's FCM token
const fcmToken = 'PASTE_YOUR_DEVICE_FCM_TOKEN_HERE';

const payload = {
  notification: {
    title: 'Test Notification',
    body: 'This is a test notification from backend!',
  },
};

admin.messaging().sendToDevice(fcmToken, payload)
  .then(response => {
    console.log('Successfully sent message:', response);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error sending message:', error);
    process.exit(1);
  }); 