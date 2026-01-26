const API_URL = 'http://localhost:5000/api';

async function testFullBackend() {
    console.log('🚀 Starting Full Backend Logic Test...');
    let token = '';

    const runTest = async (name, fn) => {
        try {
            await fn();
            console.log(`✅ ${name}: Passed`);
        } catch (e) {
            console.log(`❌ ${name}: Failed - ${e.message}`);
        }
    };

    try {
        // 1. Auth Flow
        const email = `alumni_${Date.now()}@test.com`;
        await runTest('Auth: Register Alumni', async () => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Test Alumni', email, password: 'password123', role: 'alumni' })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            token = data.token;
        });

        // 2. Profile Flow
        await runTest('Profile: Update Alumni', async () => {
            const res = await fetch(`${API_URL}/profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ company: 'Google', role: 'SDE II', experience: 5, domain: 'Backend', isMentorshipAvailable: true })
            });
            if (!res.ok) throw new Error(await res.text());
        });

        await runTest('Profile: Get Profile', async () => {
            const res = await fetch(`${API_URL}/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
        });

        // 3. Mentorship Flow (Requires Student checking availablity)
        await runTest('Mentorship: Search Alumni', async () => {
            const res = await fetch(`${API_URL}/profiles/alumni?company=Google`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            if (data.length === 0) throw new Error('No alumni found');
        });

        // 4. Community Flow
        let postId = '';
        await runTest('Community: Create Post', async () => {
            const res = await fetch(`${API_URL}/community`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: 'System Design 101', content: 'Here is how to scale...', tags: ['Tech', 'Design'] })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            postId = data._id;
        });

        await runTest('Community: Like Post', async () => {
            const res = await fetch(`${API_URL}/community/${postId}/like`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
        });

        // 5. Events Flow
        let eventId = '';
        await runTest('Events: Create Event', async () => {
            const res = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: 'Alumni Meetup', description: 'Networking', date: new Date().toISOString(), type: 'meetup', link: 'zoom.us' })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            eventId = data._id;
        });

        await runTest('Events: Register Event', async () => {
            // Self registration for test
            const res = await fetch(`${API_URL}/events/${eventId}/register`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
        });

    } catch (err) {
        console.log('Fatal Error in Test Suite:', err);
    }
}

testFullBackend();
