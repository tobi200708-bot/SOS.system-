/* =====================================================
   EMERGENCY SOS SYSTEM
   FIREBASE.JS
===================================================== */


// =====================================================
// FIREBASE APP
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


// =====================================================
// FIRESTORE
// =====================================================

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "emergency-sos-system-2717b.firebaseapp.com",

    projectId:
        "emergency-sos-system-2717b",

    storageBucket:
        "emergency-sos-system-2717b.firebasestorage.app",

    messagingSenderId:
        "831859323537",

    appId: "YOUR_APP_ID",

    measurementId:
        "G-T8V9F5B3Q8"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app =
    initializeApp(firebaseConfig);


// =====================================================
// INITIALIZE FIRESTORE
// =====================================================

const db =
    getFirestore(app);


// =====================================================
// SAVE EMERGENCY SOS ALERT
// =====================================================

export async function saveSOSAlert(locationData) {

    try {

        // ---------------------------------------------
        // CHECK LOCATION
        // ---------------------------------------------

        if (!locationData) {

            throw new Error(
                "Location data is missing."
            );

        }


        if (
            locationData.latitude === undefined ||
            locationData.longitude === undefined
        ) {

            throw new Error(
                "GPS coordinates are missing."
            );

        }


        // ---------------------------------------------
        // EMERGENCY ALERT DATA
        // ---------------------------------------------

        const alertData = {

            type: "SOS",

            status: "ACTIVE",

            message:
                "Emergency SOS activated",

            location: {

                latitude:
                    Number(locationData.latitude),

                longitude:
                    Number(locationData.longitude),

                accuracy:
                    Number(locationData.accuracy || 0)

            },

            createdAt:
                serverTimestamp(),

            source:
                "Emergency-SOS-System"

        };


        // ---------------------------------------------
        // SAVE TO FIRESTORE
        // ---------------------------------------------

        const docRef =
            await addDoc(

                collection(
                    db,
                    "emergencyAlerts"
                ),

                alertData

            );


        // ---------------------------------------------
        // CONSOLE
        // ---------------------------------------------

        console.log(
            "================================"
        );

        console.log(
            "🚨 SOS ALERT SAVED"
        );

        console.log(
            "Alert ID:",
            docRef.id
        );

        console.log(
            "Latitude:",
            locationData.latitude
        );

        console.log(
            "Longitude:",
            locationData.longitude
        );

        console.log(
            "================================"
        );


        // ---------------------------------------------
        // RETURN DOCUMENT ID
        // ---------------------------------------------

        return docRef.id;


    } catch (error) {

        console.error(
            "❌ Firebase SOS Error:",
            error
        );


        // Send error back to script.js

        throw new Error(
            error.message
        );

    }

}


// =====================================================
// OPTIONAL TEST FUNCTION
// =====================================================

export async function testFirebase() {

    try {

        const testData = {

            type: "TEST",

            status: "TEST",

            message:
                "Emergency SOS Firebase test",

            createdAt:
                serverTimestamp(),

            source:
                "Firebase-Test"

        };


        const docRef =
            await addDoc(

                collection(
                    db,
                    "systemEvents"
                ),

                testData

            );


        console.log(
            "✅ Firebase test successful:",
            docRef.id
        );


        return docRef.id;


    } catch (error) {

        console.error(
            "❌ Firebase test failed:",
            error
        );


        throw error;

    }

}
