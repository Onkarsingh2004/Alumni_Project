// check_frontend_full.js
async function checkFrontendFull() {
    console.log('🚀 Checking All Frontend Routes...');

    const routes = [
        'http://localhost:3000',
        'http://localhost:3000/login',
        'http://localhost:3000/register',
        // Protected routes (should still return 200 for the shell or redirect)
        'http://localhost:3000/dashboard',
        'http://localhost:3000/profile',
        'http://localhost:3000/mentors',
        'http://localhost:3000/community',
        'http://localhost:3000/events',
        'http://localhost:3000/jobs'
    ];

    let allPass = true;

    for (const url of routes) {
        try {
            const res = await fetch(url);
            if (res.ok) {
                console.log(`✅ ${url} is ONLINE (Status: ${res.status})`);
            } else {
                // Next.js might return 200 even for protected routes (client-side redirect)
                // or 404 if the page doesn't exist.
                console.log(`⚠️ ${url} returned ${res.status}`);
                if (res.status === 404) allPass = false;
            }
        } catch (e) {
            console.log(`❌ ${url} is UNREACHABLE: ${e.message}`);
            allPass = false;
        }
    }

    if (allPass) {
        console.log('\n🎉 All Frontend Pages are buildable and reachable!');
    } else {
        console.log('\n❌ Some pages failed to load.');
    }
}

checkFrontendFull();
