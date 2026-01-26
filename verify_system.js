const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

async function verifySystem() {
    console.log(`🔥 Starting Robust System Verification (5 Iterations)...`);

    let totalErrors = 0;

    for (let i = 1; i <= 5; i++) {
        console.log(`\n🔄 Iteration ${i}/5`);

        // --- 1. FRONTEND CHECK ---
        const feRoutes = ['/', '/login', '/register', '/dashboard', '/community', '/events'];
        for (const route of feRoutes) {
            try {
                const res = await fetch(FRONTEND_URL + route);
                if (!res.ok) throw new Error(`Status ${res.status}`);
            } catch (e) {
                console.error(`   ❌ Frontend ${route} FAILED: ${e.message}`);
                totalErrors++;
            }
        }
        console.log(`   ✅ Frontend Routes Checked`);

        // --- 2. BACKEND LOGIC CHECK ---
        try {
            // Register
            const email = `stress_user_${i}_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
            const regRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `User ${i}`, email, password: 'password123', role: 'student' })
            });
            if (!regRes.ok) {
                const text = await regRes.text();
                throw new Error(`Registration Failed: ${text}`);
            }
            const { token } = await regRes.json();

            // Profile
            const profRes = await fetch(`${API_URL}/profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ universityId: '123', branch: 'CSE', year: '4', skills: ['Stress Test'] })
            });
            if (!profRes.ok) throw new Error('Profile Update Failed');

            // Community Post
            const postRes = await fetch(`${API_URL}/community`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: `Stress Post ${i}`, content: 'Testing...', tags: ['Test'] })
            });
            if (!postRes.ok) throw new Error('Post Creation Failed');

            // Event Fetching
            const eventRes = await fetch(`${API_URL}/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!eventRes.ok) throw new Error('Event Fetch Failed');

            console.log(`   ✅ Backend Logical Flow Passed`);

        } catch (e) {
            console.error(`   ❌ Backend Flow FAILED: ${e.message}`);
            totalErrors++;
        }
    }

    console.log('\n-----------------------------------');
    if (totalErrors === 0) {
        console.log('🏆 SYSTEM STABLE: All checks passed across 5 iterations.');
        console.log('   (Frontend Reachability + Backend Logic verified)');
    } else {
        console.log(`⚠️ SYSTEM UNSTABLE: Found ${totalErrors} errors during verification.`);
    }
}

verifySystem();
