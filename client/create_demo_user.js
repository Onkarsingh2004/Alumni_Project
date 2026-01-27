const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function createDemoUser() {
    try {
        const email = 'student@example.com';
        const password = 'password123';

        console.log(`--- Creating Demo User ---`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Demo Student',
                email: email,
                password: password,
                role: 'student'
            });
            console.log('✅ User created successfully!');
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                console.log('⚠️ User already exists (which is fine).');
            } else {
                console.error('❌ Error creating user:', error.response?.data || error.message);
            }
        }

        console.log('\nYou can now use these credentials to log in or test the Forgot Password flow.');

    } catch (err) {
        console.error('Script failed:', err.message);
    }
}

createDemoUser();
