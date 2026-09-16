const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-sos", async (req, res) => {
    try {
        const { phone, latitude, longitude } = req.body;

        const message = await client.messages.create({
            body:
`🚨 EMERGENCY SOS ALERT 🚨

Emergency help may be required.
automatic send sms 
Location:
https://maps.google.com/?q=${latitude},${longitude}`,

            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        res.json({
            success: true,
            messageSid: message.sid
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("SOS server running");
});
