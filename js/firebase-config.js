// SFRD - Firebase Configuration and Initialization
// This file initializes Firebase and exports the required services

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb5YyZOu4lWNGfJ5RK9SX_5bPq9nwfsnc",
  authDomain: "sfrd-organization.firebaseapp.com",
  projectId: "sfrd-organization",
  storageBucket: "sfrd-organization.appspot.com",
  messagingSenderId: "1022212374454",
  appId: "1:1022212374454:web:23b0d3f2c44db5b6b40b17",
  measurementId: "G-CP58WDH12M"
};

// This is a unique identifier for the application instance within the project.
const appId = "sfrd-organization";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services for use in other modules
export { auth, db, storage, appId };
