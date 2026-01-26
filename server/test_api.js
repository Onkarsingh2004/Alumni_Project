const API_URL = 'http://localhost:5000/api';

async function testBackend() {
    console.log('🚀 Starting Backend Test (using fetch)...');

    try {
        // 1. Health Check
        try {
            const res = await fetch('http://localhost:5000/');
            if (res.ok) console.log('✅ Server: Online');
            else throw new Error('Server returned ' + res.status);
        } catch (e) {
            console.error('❌ Server: Offline', e.message);
            return;
        }

        // 2. Register User (Student)
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';
        let token = '';

        try {
            const regRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Student',
                    email,
                    password,
                    role: 'student'
                })
            });

            if (!regRes.ok) {
                const err = await regRes.json();
                throw new Error(err.message);
            }

            const data = await regRes.json();
            token = data.token;
            console.log('✅ Auth: Registration Successful');
        } catch (e) {
            console.error('❌ Auth: Registration Failed', e.message);
            return;
        }

        // 3. Login User
        try {
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (loginRes.ok) console.log('✅ Auth: Login Successful');
            else throw new Error('Login failed');
        } catch (e) {
            console.error('❌ Auth: Login Failed', e.message);
        }

        // 4. Update Profile
        try {
            const updateRes = await fetch(`${API_URL}/profiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    universityId: 'UNIV123',
                    branch: 'CSE',
                    year: '3rd',
                    skills: ['Java', 'Python']
                })
            });

            if (updateRes.ok) console.log('✅ Profile: Update Successful');
            else {
                const err = await updateRes.json();
                throw new Error(err.message);
            }
        } catch (e) {
            console.error('❌ Profile: Update Failed', e.message);
        }

        console.log('🎉 Backend Test Completed!');
    } catch (error) {
        console.error('Unexpected Error:', error);
    }
}

testBackend();
