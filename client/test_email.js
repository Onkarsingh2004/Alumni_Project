const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEmailSending() {
    console.log('--- Testing Forgot Password Email Sending ---');
    try {
        const uniqueEmail = `email_test_${Date.now()}@test.com`;

        // 1. Register
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Email Tester',
            email: uniqueEmail,
            password: 'password123',
            role: 'student'
        });
        console.log(`User registered: ${uniqueEmail}`);

        // 2. Forgot Password
        await axios.post(`${API_URL}/auth/forgot-password`, {
            email: uniqueEmail
        });
        console.log('Forgot password request sent.');
        console.log('CHECK SERVER LOGS NOW for "Preview URL" (if Ethereal) or check your Inbox (if Real SMTP).');

    } catch (err) {
        console.error('Error:', err.response?.data?.message || err.message);
    }
}

testEmailSending();
