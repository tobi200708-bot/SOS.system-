// ========================================
// EMERGENCY SOS SYSTEM - SCRIPT.JS
// ========================================

import { saveSOSAlert } from "./firebase.js";


// ========================================
// GET HTML ELEMENTS
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
// LOAD SAVED CONTACT
// ========================================

const savedContact = localStorage.getItem("emergencyContact");

if (savedContact) {

    const contact = JSON.parse(savedContact);

    contactName.value = contact.name;
    contactPhone.value = contact.phone;

    contactStatus.textContent = "✅ Emergency contact loaded";
    contactStatus.classList.add("success");
}


// ========================================
// SAVE EMERGENCY CONTACT
// ========================================

saveContactButton.addEventListener("click", () => {

    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();

    if (name === "" || phone === "") {

        contactStatus.textContent =
            "❌ Please enter contact name and number";

        contactStatus.classList.add("error");

        return;
    }


    // Save contact in browser
    const contact = {
        name: name,
        phone: phone
    };

    localStorage.setItem(
        "emergencyContact",
        JSON.stringify(contact)
    );


    contactStatus.textContent =
        "✅ Emergency contact saved successfully";

    contactStatus.classList.remove("error");
    contactStatus.classList.add("success");

});


// ========================================
// ACCIDENT DETECTION
// ========================================

accidentButton.addEventListener("click", () => {

    const savedContactData =
        localStorage.getItem("emergencyContact");


    // Check contact
    if (!savedContactData) {

        statusMessage.textContent =
            "❌ Please save emergency contact first.";

        statusMessage.classList.add("error");

        return;
    }


    const contact = JSON.parse(savedContactData);


    systemStatus.textContent =
        "🚨 ACCIDENT DETECTED!";

    systemStatus.classList.add("error");


    statusMessage.textContent =
        "⚠️ Emergency alert started...";


    // Get current location
    getCurrentLocation(contact);

});


// ========================================
// GET CURRENT LOCATION
// ========================================

function getCurrentLocation(contact) {

    locationStatus.textContent =
        "📍 Getting current location...";


    if (!navigator.geolocation) {

        locationStatus.textContent =
            "❌ Geolocation is not supported.";

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
                `📍 Location detected: ${latitude}, ${longitude}`;


            // ========================================
            // SAVE ALERT TO FIREBASE
            // ========================================

            try {

                await saveSOSAlert({

                    type: "ACCIDENT",
                    status: "ACTIVE",

                    contactName: contact.name,
                    contactPhone: contact.phone,

                    latitude: latitude,
                    longitude: longitude,

                    location: mapsLink,

                    message:
                        "Emergency! Accident detected. Please check my location."
                });


                statusMessage.textContent =
                    "✅ Emergency alert saved to cloud.";

            } catch (error) {

                console.error(
                    "Firebase error:",
                    error
                );

                statusMessage.textContent =
                    "⚠️ Alert detected, but cloud save failed.";
            }


            // ========================================
            // SEND SMS
            // ========================================

            const message =
                `🚨 EMERGENCY ALERT!\n\n` +
                `Accident detected.\n` +
                `Please help me immediately.\n\n` +
                `📍 My Location:\n${mapsLink}`;


            const smsURL =
                `sms:${contact.phone}?body=${encodeURIComponent(message)}`;


            statusMessage.textContent =
                "📱 Opening SMS...";


            // Open phone SMS application
            window.location.href = smsURL;

        },


        (error) => {

            console.error(
                "Location error:",
                error
            );


            locationStatus.textContent =
                "❌ Unable to get location.";

            statusMessage.textContent =
                "⚠️ Accident detected, but location could not be obtained.";
        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}
