"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.firestore = exports.auth = exports.app = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var storage_1 = require("firebase/storage");
// Your web app's Firebase configuration
// IMPORTANT: Replace with your own Firebase project configuration in environment variables.
var firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Add a check to ensure Firebase config is set
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('your_')) {
    throw new Error('Firebase configuration is missing or incomplete. Please update the .env file with your project credentials. See README.md for instructions.');
}
// Initialize Firebase
var app = !(0, app_1.getApps)().length ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
exports.app = app;
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
var firestore = (0, firestore_1.getFirestore)(app);
exports.firestore = firestore;
var storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
