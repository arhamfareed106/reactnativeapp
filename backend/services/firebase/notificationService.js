const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../../../firebase-service-account-key.json'); // You would need to provide this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

class FirebaseNotificationService {
  constructor() {
    this.messaging = admin.messaging();
  }

  // Send notification to a specific device
  async sendToDevice(deviceToken, title, body, data = {}) {
    try {
      const message = {
        notification: {
          title,
          body
        },
        data,
        token: deviceToken
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Send notification to multiple devices
  async sendToMultipleDevices(deviceTokens, title, body, data = {}) {
    try {
      const message = {
        notification: {
          title,
          body
        },
        data,
        tokens: deviceTokens
      };

      const response = await this.messaging.sendMulticast(message);
      console.log('Successfully sent multicast message:', response);
      return response;
    } catch (error) {
      console.error('Error sending multicast message:', error);
      throw error;
    }
  }

  // Send notification to users subscribed to a topic
  async sendToTopic(topic, title, body, data = {}) {
    try {
      const message = {
        notification: {
          title,
          body
        },
        data,
        topic: topic
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent message to topic:', response);
      return response;
    } catch (error) {
      console.error('Error sending message to topic:', error);
      throw error;
    }
  }

  // Subscribe device to a topic
  async subscribeToTopic(deviceToken, topic) {
    try {
      const response = await this.messaging.subscribeToTopic([deviceToken], topic);
      console.log('Successfully subscribed to topic:', response);
      return response;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  // Unsubscribe device from a topic
  async unsubscribeFromTopic(deviceToken, topic) {
    try {
      const response = await this.messaging.unsubscribeFromTopic([deviceToken], topic);
      console.log('Successfully unsubscribed from topic:', response);
      return response;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      throw error;
    }
  }

  // Validate device token
  async validateDeviceToken(token) {
    try {
      const appInstance = await this.messaging().getAppInstance(token);
      return appInstance && appInstance.token;
    } catch (error) {
      console.error('Invalid device token:', error);
      return false;
    }
  }
}

module.exports = new FirebaseNotificationService();