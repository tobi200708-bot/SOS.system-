// ========================================
// AUTOMATIC EMERGENCY SOS - SCRIPT.JS
// ========================================

import { saveSOSAlert } from "./firebase.js";


// ========================================
// HTML ELEMENTS
// ========================================

const contactName = document.getElementById("contactName");
const contactPhone = document.getElementById("contactPhone");
const saveContactButton = document.getElementById("saveContactButton");
const contactStatus = document.getElementById("contactStatus");

const accidentButton = document.getElementById("accidentButton");
const systemStatus = document.getElementById("systemStatus");
const locationStatus = document.getElementById("locationStatus");
const statusMessage = document.getElementById("statusMessage");


// ========================================
// SETTINGS
// ========================================

let accidentProcessing = false;

// Sensor sensitivity
// Higher value = less sensitive
const ACCIDENT_THRESHOLD = 25;


// ========================================
// LOAD SAVED CONTACT
// ========================================

const savedContact = localStorage.getItem("emergencyContact");

if (savedContact) {

    const contact = JSON.parse(savedContact);

    contactName.value = contact.name || "";
    contactPhone.value = contact.phone || "";

    contactStatus.textContent =
        "✅ Emergency contact loaded";

    contactStatus.classList.add("success");
}


// ========================================
// SAVE CONTACT
// ========================================

saveContactButton.addEventListener("click", () => {

    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();

    if (name === "" || phone === "") {

        contactStatus.textContent =
            "❌ Enter contact name and phone number";

        contactStatus.classList.remove("success");
        contactStatus.classList.add("error");

        return;
    }


    const contact = {
        name: name,
        phone: phone
    };


    localStorage.setItem(
        "emergencyContact",
        JSON.stringify(contact)
    );


    contactStatus.textContent =
        "✅ Emergency contact saved";

    contactStatus.classList.remove("error");
    contactStatus.classList.add("success");

});


// ========================================
// MANUAL TEST BUTTON
// ========================================

accidentButton.addEventListener("click", () => {

    startEmergencyAlert("MANUAL TEST");

});


// ========================================
// AUTOMATIC ACCIDENT DETECTION
// ========================================

function startSensorDetection() {

    if (!window.DeviceMotionEvent) {

        systemStatus.textContent =
            "⚠️ Motion sensor not supported";

        return;
    }


    // Android/iPhone permission
    if (
        typeof DeviceMotionEvent.requestPermission ===
        "function"
    ) {

        systemStatus.textContent =
            "📱 Tap the test button once to enable sensor.";

        return;
    }


    window.addEventListener(
        "devicemotion",
        detectAccident,
        true
    );


    systemStatus.textContent =
        "🟢 Automatic accident detection ON";

}


// ========================================
// MOTION SENSOR
// ========================================

function detectAccident(event) {

    if (accidentProcessing) {
        return;
    }


    const acceleration =
        event.accelerationIncludingGravity;


    if (!acceleration) {
        return;
    }


    const x = acceleration.x || 0;
    const y = acceleration.y || 0;
    const z = acceleration.z || 0;


    const totalAcceleration =
        Math.sqrt(
            (x * x) +
            (y * y) +
            (z * z)
        );


    // Detect strong sudden movement
    if (totalAcceleration > ACCIDENT_THRESHOLD) {

        accidentProcessing = true;


        systemStatus.textContent =
            "🚨 POSSIBLE ACCIDENT DETECTED!";


        statusMessage.textContent =
            "⚠️ Sending emergency alert...";


        startEmergencyAlert("AUTOMATIC ACCIDENT");


        // Prevent repeated alerts
        setTimeout(() => {

            accidentProcessing = false;

        }, 30000);

    }

}


// ========================================
// ENABLE SENSOR
// ========================================

async function enableSensor() {

    try {

        if (
            typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission ===
            "function"
        ) {

            const permission =
                await DeviceMotionEvent.requestPermission();


            if (permission !== "granted") {

                systemStatus.textContent =
                    "❌ Motion sensor permission denied";

                return;
            }
        }


        window.addEventListener(
            "devicemotion",
            detectAccident,
            true
        );


        systemStatus.textContent =
            "🟢 Automatic accident detection ON";


    } catch (error) {

        console.error(error);

        systemStatus.textContent =
            "❌ Sensor permission failed";
    }

}


// ========================================
// START AUTOMATIC SENSOR
// ========================================

enableSensor();


// ========================================
// EMERGENCY ALERT
// ========================================

async function startEmergencyAlert(source) {

    const savedContactData =
        localStorage.getItem("emergencyContact");


    if (!savedContactData) {

        statusMessage.textContent =
            "❌ Save emergency contact first.";

        statusMessage.classList.add("error");

        accidentProcessing = false;

        return;
    }


    const contact =
        JSON.parse(savedContactData);


    systemStatus.textContent =
        "🚨 " + source;


    locationStatus.textContent =
        "📍 Getting current location...";


    statusMessage.textContent =
        "⏳ Processing emergency alert...";


    getCurrentLocation(contact, source);

}


// ========================================
// GET LOCATION
// ========================================

function getCurrentLocation(contact, source) {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "❌ Location is not supported.";

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            const mapsLink =
                `https://www.google.com/maps?q=${latitude},${longitude}`;


            locationStatus.textContent =
                "📍 Location detected";


            // ========================================
            // MESSAGE
            // ========================================

            const message =
                `🚨 EMERGENCY ALERT!\n\n` +
                `Accident detected.\n` +
                `Source: ${source}\n\n` +
                `Please help me immediately.\n\n` +
                `📍 My Location:\n` +
                `${mapsLink}`;


            // ========================================
            // FIREBASE
            // ========================================

            try {

                await saveSOSAlert({

                    type: "ACCIDENT",

                    status: "ACTIVE",

                    contactName:
                        contact.name,

                    contactPhone:
                        contact.phone,

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    location:
                        mapsLink,

                    message:
                        message

                });


                console.log(
                    "✅ Emergency alert saved to Firebase"
                );


                statusMessage.textContent =
                    "✅ Alert saved. Opening SMS...";


            } catch (error) {

                console.error(
                    "Firebase error:",
                    error
                );


                statusMessage.textContent =
                    "⚠️ Accident detected. Opening SMS...";
            }


            // ========================================
            // OPEN SMS
            // ========================================

            const smsURL =
                `sms:${contact.phone}?body=${encodeURIComponent(message)}`;


            setTimeout(() => {

                window.location.href = smsURL;

            }, 500);


        },


        (error) => {

            console.error(
                "Location error:",
                error
            );


            locationStatus.textContent =
                "❌ Unable to get location.";

            statusMessage.textContent =
                "⚠️ Location unavailable.";

            accidentProcessing = false;

        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}


// ========================================
// SYSTEM READY
// ========================================

console.log(
    "🚨 Emergency SOS System loaded"
);
