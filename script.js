import { saveSOSAlert } from "./firebase.js";


// ========================================
// ELEMENTS
// ========================================

const sosButton = document.getElementById("sosButton");
const sosModal = document.getElementById("sosModal");
const confirmSOS = document.getElementById("confirmSOS");
const cancelSOS = document.getElementById("cancelSOS");
const statusMessage = document.getElementById("statusMessage");
const phoneNumber = document.getElementById("phoneNumber");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");


// ========================================
// MOBILE MENU
// ========================================

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

}


// ========================================
// OPEN SOS MODAL
// ========================================

sosButton.addEventListener("click", () => {

    sosModal.style.display = "flex";

});


// ========================================
// CANCEL SOS
// ========================================

cancelSOS.addEventListener("click", () => {

    sosModal.style.display = "none";

});


// ========================================
// GET CURRENT LOCATION
// ========================================

function getCurrentLocation() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            reject(
                new Error(
                    "GPS is not supported by this browser."
                )
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;


                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);
                console.log("Accuracy:", accuracy);


                resolve({

                    latitude: latitude,

                    longitude: longitude,

                    accuracy: accuracy

                });

            },


            (error) => {

                let message = "Unable to get location.";

                if (error.code === 1) {
                    message =
                        "Location permission denied.";
                }

                if (error.code === 2) {
                    message =
                        "Location unavailable.";
                }

                if (error.code === 3) {
                    message =
                        "Location request timed out.";
                }


                reject(new Error(message));

            },


            {

                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0

            }

        );

    });

}


// ========================================
// OPEN SMS APP
// ========================================

function openSMS(phone, latitude, longitude) {

    const mapLink =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    const message =
`🚨 EMERGENCY SOS ALERT 🚨

I need emergency help.

📍 My current location:
${mapLink}

Please contact me immediately.`;


    const smsURL =
        `sms:${phone}?body=${encodeURIComponent(message)}`;


    console.log("SMS URL:", smsURL);


    window.location.href = smsURL;

}


// ========================================
// CONFIRM SOS
// ========================================

confirmSOS.addEventListener("click", async () => {

    try {

        // ====================================
        // CHECK PHONE NUMBER FIRST
        // ====================================

        const phone =
            phoneNumber.value.trim();


        if (!phone) {

            alert(
                "Please enter emergency contact number."
            );

            phoneNumber.focus();

            return;
        }


        // ====================================
        // BUTTON LOCK
        // ====================================

        confirmSOS.disabled = true;

        confirmSOS.textContent =
            "GETTING LOCATION...";


        statusMessage.textContent =
            "Getting your GPS location...";


        // ====================================
        // GET GPS LOCATION
        // ====================================

        const location =
            await getCurrentLocation();


        console.log(
            "GPS Location:",
            location
        );


        statusMessage.textContent =
            "GPS location received.";


        // ====================================
        // SAVE TO FIREBASE
        // ====================================

        confirmSOS.textContent =
            "SENDING ALERT...";


        statusMessage.textContent =
            "Saving emergency alert to Firebase...";


        const alertId =
            await saveSOSAlert(location);


        console.log(
            "Emergency Alert ID:",
            alertId
        );


        // ====================================
        // SUCCESS
        // ====================================

        statusMessage.textContent =
            "🚨 Emergency alert created successfully!";


        confirmSOS.textContent =
            "SOS SENT ✓";


        // Close modal

        sosModal.style.display =
            "none";


        // ====================================
        // OPEN SMS
        // ====================================

        setTimeout(() => {

            openSMS(

                phone,

                location.latitude,

                location.longitude

            );

        }, 500);


    }

    catch (error) {

        console.error(
            "SOS ERROR:",
            error
        );


        // ====================================
        // SHOW ACTUAL ERROR
        // ====================================

        statusMessage.textContent =
            "Unable to send SOS.";


        alert(
            "SOS Error:\n\n" +
            error.message
        );


        // ====================================
        // RESET BUTTON
        // ====================================

        confirmSOS.disabled = false;

        confirmSOS.textContent =
            "YES, SEND SOS";

    }

});
