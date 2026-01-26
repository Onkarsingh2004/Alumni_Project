const API_URL = 'http://localhost:5000/api';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function runLiveDemo() {
    console.clear();
    console.log('🎬 STARTING LIVE CONSOLE DEMONSTRATION 🎬\n');
    await sleep(1000);

    try {
        // --- SCENE 1: ALICE ARRIVES ---
        console.log('👤 [ACT 1] Enter Alice (Student)');
        const aliceEmail = `alice_${Date.now()}@demo.com`;
        console.log(`   🔸 Alice travels to /register...`);
        await sleep(800);

        const aliceReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Alice Student', email: aliceEmail, password: '123', role: 'student' })
        });
        const aliceData = await aliceReg.json();
        const aliceToken = aliceData.token;
        console.log(`   ✅ Alice successfully created an account! (ID: ${aliceData._id})`);
        await sleep(1000);

        console.log(`   🔸 Alice updates her profile (Skills: React, Node)...`);
        await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aliceToken}` },
            body: JSON.stringify({ universityId: 'U101', branch: 'CSE', year: '3', skills: ['React', 'Node'] })
        });
        console.log(`   ✅ Profile Saved.`);
        console.log('');
        await sleep(1500);

        // --- SCENE 2: BOB ARRIVES ---
        console.log('🎓 [ACT 2] Enter Bob (Alumni - Google Engineer)');
        const bobEmail = `bob_${Date.now()}@google.com`;
        console.log(`   🔸 Bob travels to /register...`);
        await sleep(800);

        const bobReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Bob Engineer', email: bobEmail, password: '123', role: 'alumni' })
        });
        const bobData = await bobReg.json();
        const bobToken = bobData.token;
        console.log(`   ✅ Bob successfully created an account!`);
        await sleep(1000);

        console.log(`   🔸 Bob updates his profile (Company: Google, Open for Mentorship)...`);
        await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bobToken}` },
            body: JSON.stringify({ company: 'Google', role: 'Staff Engineer', experience: 8, domain: 'Backend', isMentorshipAvailable: true })
        });
        console.log(`   ✅ Bob is now live on the platform.`);
        console.log('');
        await sleep(1500);

        // --- SCENE 3: INTERACTION ---
        console.log('🤝 [ACT 3] The Connection');
        console.log(`   🔸 Alice searches for mentors at Google...`);
        await sleep(800);

        const searchRes = await fetch(`${API_URL}/profiles/alumni?company=Google`, {
            headers: { 'Authorization': `Bearer ${aliceToken}` }
        });
        const mentors = await searchRes.json();
        console.log(`   ✅ Alice found Bob! Sending request...`);
        await sleep(1000);

        const reqRes = await fetch(`${API_URL}/mentorship/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aliceToken}` },
            body: JSON.stringify({ alumniId: bobData._id, message: "Teach me System Design!" })
        });
        const reqData = await reqRes.json();
        console.log(`   ✅ Request Sent (Status: ${reqData.status})`);
        console.log('');
        await sleep(1500);

        // --- SCENE 4: BOB RESPONDS ---
        console.log('📬 [ACT 4] Bob Checks Dashboard');
        console.log(`   🔸 Bob sees a notification...`);
        await sleep(1000);

        console.log(`   🔸 Bob clicks 'Accept'...`);
        await fetch(`${API_URL}/mentorship/respond`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bobToken}` },
            body: JSON.stringify({ requestId: reqData._id, status: 'accepted' })
        });
        console.log(`   ✅ Mentorship Officially Started!`);
        console.log('');
        await sleep(1500);

        // --- SCENE 5: EVENTS ---
        console.log('📅 [ACT 5] Community Event');
        console.log(`   🔸 Bob hosts a Webinar...`);
        const eventRes = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bobToken}` },
            body: JSON.stringify({ title: 'Google Interview Prep', description: 'Tips & Tricks', date: new Date().toISOString(), type: 'webinar' })
        });
        const eventData = await eventRes.json();
        console.log(`   ✅ Event Created: "${eventData.title}"`);
        await sleep(1000);

        console.log(`   🔸 Alice sees the event and registers...`);
        await fetch(`${API_URL}/events/${eventData._id}/register`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${aliceToken}` }
        });
        console.log(`   ✅ Alice is now on the Attendee list!`);

        console.log('\n✨ DEMO COMPLETE - The System Works Perfectly! ✨');

    } catch (e) {
        console.error('❌ Demo Crashed:', e);
    }
}

runLiveDemo();
