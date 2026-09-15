import { saveSOSAlert } from "./firebase.js";


// ========================================
// ELEMENTS
// ========================================

const sosButton =
    document.getElementById("sosButton");

const sosModal =
    document.getElementById("sosModal");

const confirmSOS =
    document.getElementById("confirmSOS");

const cancelSOS =
    document.getElementById("cancelSOS");

const statusMessage =
    document.getElementById("statusMessage");

const phoneNumber =
    document.getElementById("phoneNumber");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


// ========================================
// MOBILE MENU
// ========================================

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});


// ========================================
// OPEN SOS MODAL
// ========================================

sosButton.addEventListener("click", () => {

    sosModal.style.display = "flex";

});


// ========================================
// CANCEL
// ========================================

cancelSOS.addEventListener("click", () => {

    sosModal.style.display = "none";

});


// ========================================
// GET LOCATION
// ========================================

function getCurrentLocation() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            reject(
                new Error(
                    "Geolocation is not supported."
                )
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                resolve({

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    accuracy:
                        position.coords.accuracy
                });

            },

            (error) => {

                reject(error);

            },

            {

                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0

            }
        );

    });

}


// ========================================
// SEND SMS
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


    window.location.href = smsURL;

}


// ========================================
// CONFIRM SOS
// ========================================

confirmSOS.addEventListener("click", async () => {

    try {

        confirmSOS.disabled = true;

        confirmSOS.textContent =
            "GETTING LOCATION...";

        statusMessage.textContent =
            "Getting your GPS location...";


        // -------------------------------
        // GET GPS
        // -------------------------------

        const location =
            await getCurrentLocation();


        console.log(
            "Location:",
            location
        );


        // -------------------------------
        // SAVE FIREBASE
        // -------------------------------

        confirmSOS.textContent =
            "SENDING ALERT...";

        statusMessage.textContent =
            "Saving emergency alert...";


        await saveSOSAlert(location);


        // -------------------------------
        // PHONE NUMBER
        // -------------------------------

        const phone =
            phoneNumber.value.trim();


        if (!phone) {

            alert(
                "Please enter emergency contact number."
            );

            confirmSOS.disabled = false;

            confirmSOS.textContent =
                "YES, SEND SOS";

            return;
        }


        // -------------------------------
        // SUCCESS
        // -------------------------------

        statusMessage.textContent =
            "🚨 Emergency alert created successfully!";


        confirmSOS.textContent =
            "SOS SENT ✓";


        sosModal.style.display =
            "none";


        // -------------------------------
        // OPEN SMS
        // -------------------------------

        setTimeout(() => {

            openSMS(
                phone,
                location.latitude,
                location.longitude
            );

        }, 500);


    } catch (error) {

        console.error(error);


        statusMessage.textContent =
            "Unable to send SOS.";


        alert(
            "Location permission is required. Please allow location access and try again."
        );


        confirmSOS.disabled = false;

        confirmSOS.textContent =
            "YES, SEND SOS";

    }

});
