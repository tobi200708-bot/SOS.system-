import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ========================================
// FIREBASE CONFIG
// ========================================

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

    appId:
        "YOUR_APP_ID",

    measurementId:
        "G-T8V9F5B3Q8"
};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ========================================
// SAVE SOS ALERT
// ========================================

export async function saveSOSAlert(locationData) {

    try {

        const alertData = {

            type: "SOS",

            status: "ACTIVE",

            message:
                "Emergency SOS activated",

            location: {

                latitude:
                    locationData.latitude,

                longitude:
                    locationData.longitude,

                accuracy:
                    locationData.accuracy
            },

            createdAt:
                serverTimestamp(),

            source:
                "Emergency-SOS-System"
        };


        const docRef = await addDoc(
            collection(db, "emergencyAlerts"),
            alertData
        );


        console.log(
            "SOS Alert ID:",
            docRef.id
        );

        return docRef.id;

    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );

        throw error;
    }
}
