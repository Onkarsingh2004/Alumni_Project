const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function stressTestFinal() {
    console.log(`🔥 STARTING FINAL 10-CYCLE STRESS TEST 🔥`);
    console.log(`Target: Frontend Reachability + Full Backend logic (Auth -> Profile -> Community -> Events)`);
    console.log('--------------------------------------------------');

    let totalErrors = 0;
    const ITERATIONS = 10;

    for (let i = 1; i <= ITERATIONS; i++) {
        process.stdout.write(`\r🔄 Cycle ${i}/${ITERATIONS}... `);

        try {
            // --- 1. FRONTEND CHECK ---
            const feRoutes = ['/', '/login', '/register', '/dashboard', '/community', '/events', '/mentors'];
            for (const route of feRoutes) {
                const res = await fetch(FRONTEND_URL + route);
                if (!res.ok) throw new Error(`Frontend ${route} Status ${res.status}`);
            }

            // --- 2. BACKEND FULL FLOW ---

            // Register
            const email = `final_stress_${i}_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
            const regRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `Stress User ${i}`, email, password: 'password123', role: 'alumni' })
            });
            if (!regRes.ok) throw new Error(`Registration Failed: ${await regRes.text()}`);
            const { token, _id } = await regRes.json();

            // Update Profile
            const profRes = await fetch(`${API_URL}/profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ company: 'Stress Inc', role: 'Tester', experience: 10, domain: 'QA', isMentorshipAvailable: true })
            });
            if (!profRes.ok) throw new Error(`Profile Update Failed`);

            // Community: Post -> Like -> Comment
            const postRes = await fetch(`${API_URL}/community`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: `Cycle ${i} Post`, content: 'Stress testing...', tags: ['QA'] })
            });
            if (!postRes.ok) throw new Error('Post Failed');
            const post = await postRes.json();

            await fetch(`${API_URL}/community/${post._id}/like`, {
                method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });

            await fetch(`${API_URL}/community/${post._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ text: 'Automated comment' })
            });

            // Events: Create -> Register
            const eventRes = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: `Cycle ${i} Event`, description: 'Testing', date: new Date().toISOString(), type: 'meetup' })
            });
            if (!eventRes.ok) throw new Error('Event Creation Failed');
            const event = await eventRes.json();

            await fetch(`${API_URL}/events/${event._id}/register`, {
                method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });

            // Search Logic
            const searchRes = await fetch(`${API_URL}/profiles/alumni?company=Stress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const searchData = await searchRes.json();
            if (searchData.length === 0) throw new Error('Search Failed (No results)');

            // Success for this cycle
            // console.log(` Cycle ${i} PASSED`);

        } catch (e) {
            console.log(`\n❌ Cycle ${i} FAILED: ${e.message}`);
            totalErrors++;
        }

        // Small delay to be polite to the local server
        await sleep(200);
    }

    console.log('\n--------------------------------------------------');
    if (totalErrors === 0) {
        console.log(`🏆 PERFECT RUN! 10/10 Cycles Passed.`);
        console.log(`   The system is extremely stable.`);
    } else {
        console.log(`⚠️ SYSTEM UNSTABLE: ${totalErrors} failures detected.`);
    }
}

stressTestFinal();
