const API_URL = 'http://localhost:5000/api';

async function testAdvancedFeatures() {
    console.log('🚀 Starting Deep Dive Test: Community & Events');

    // Helper to get a fresh token
    const getFreshToken = async (name) => {
        const email = `tester_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: 'password', role: 'student' })
        });
        const data = await res.json();
        return data.token;
    };

    try {
        const token = await getFreshToken('Adv Tester');
        console.log('✅ Auth Secured');

        // --- Community Testing ---
        console.log('\n--- 💬 Community Module ---');

        // 1. Create Post
        const postRes = await fetch(`${API_URL}/community`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: 'Deep Test Post', content: 'Testing deep features.', tags: ['Test', 'Deep'] })
        });
        const post = await postRes.json();
        if (!post._id) throw new Error('Post Creation Failed');
        console.log(`✅ Post Created: "${post.title}"`);

        // 2. Like Post
        const likeRes = await fetch(`${API_URL}/community/${post._id}/like`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const likes = await likeRes.json();
        if (likes.length !== 1) throw new Error('Like Failed');
        console.log(`✅ Post Liked (Count: ${likes.length})`);

        // 3. Comment on Post
        const commentRes = await fetch(`${API_URL}/community/${post._id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ text: 'This is a test comment.' })
        });
        const comments = await commentRes.json();
        if (comments.length !== 1) throw new Error('Comment Failed');
        console.log(`✅ Comment Added: "${comments[0].text}"`);

        // 4. Verify in Feed
        const feedRes = await fetch(`${API_URL}/community`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const feed = await feedRes.json();
        const foundPost = feed.find(p => p._id === post._id);
        if (!foundPost) throw new Error('Post not found in feed');
        console.log(`✅ Feed Verification: Post is visible`);


        // --- Events Testing ---
        console.log('\n--- 📅 Events Module ---');

        // 5. Host Event
        const eventRes = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: 'Deep Dive Webinar', description: 'Deep testing.', date: new Date().toISOString(), type: 'webinar' })
        });
        const event = await eventRes.json();
        if (!event._id) throw new Error('Event Creation Failed');
        console.log(`✅ Event Hosted: "${event.title}"`);

        // 6. Register for Event
        const regRes = await fetch(`${API_URL}/events/${event._id}/register`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const attendees = await regRes.json();
        if (attendees.length !== 1) throw new Error('Event Registration Failed');
        console.log(`✅ Registered for Event (Attendees: ${attendees.length})`);

        // 7. Verify Event in Feed
        const eventsFeedRes = await fetch(`${API_URL}/events`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const eventsFeed = await eventsFeedRes.json();
        const foundEvent = eventsFeed.find(e => e._id === event._id);
        if (!foundEvent) throw new Error('Event not found in feed');
        console.log(`✅ Event Verification: Event is visible`);

        console.log('\n🎉 ALL ADVANCED FEATURES VERIFIED SUCCESSFULLY!');

    } catch (e) {
        console.error('\n❌ TEST FAILED:', e.message);
    }
}

testAdvancedFeatures();
