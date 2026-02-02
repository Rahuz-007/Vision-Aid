const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, '../config/serviceAccountKey.json'));

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized successfully');
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
}

const db = admin.firestore();
module.exports = { admin, db };
