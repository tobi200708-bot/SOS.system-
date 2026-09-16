// ========================================
// FIREBASE - EMERGENCY SOS SYSTEM
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ========================================
// FIREBASE CONFIGURATION
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyBTGjmpUk_21vRazMncTdNGd1g0r1l20Bg",
    authDomain: "emergency-sos-system-2717b.firebaseapp.com",
    projectId: "emergency-sos-system-2717b",
    storageBucket: "emergency-sos-system-2717b.firebasestorage.app",
    messagingSenderId: "831859323537",
    appId: "1:831859323537:web:8627060a5cda348fd48530",
    measurementId: "G-FXQ7W4Z1Z3"
};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ========================================
// SAVE EMERGENCY ALERT
// ========================================

export async function saveSOSAlert(alertData) {

    const alertRef = await addDoc(
        collection(db, "emergencyAlerts"),
        {
            type: alertData.type || "ACCIDENT",

            status: alertData.status || "ACTIVE",

            contactName:
                alertData.contactName || "",

            contactPhone:
                alertData.contactPhone || "",

            latitude:
                alertData.latitude || null,

            longitude:
                alertData.longitude || null,

            location:
                alertData.location || "",

            message:
                alertData.message || "",

            createdAt:
                serverTimestamp()
        }
    );

    console.log(
        "Emergency Alert Saved:",
        alertRef.id
    );

    return alertRef.id;
}
