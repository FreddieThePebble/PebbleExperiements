const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(bodyParser.json());

app.post('/validate_token', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  // Google OAuth Client ID
        });

        const payload = ticket.getPayload();
        const userInfo = {
            name: payload.name,
            email: payload.email,
            id: payload.sub,
            imageUrl: payload.picture,
        };

        res.json(userInfo); // Return the user info to the frontend
    } catch (error) {
        res.status(400).send('Invalid token');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
