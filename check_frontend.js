// check_frontend.js
// No external dependencies needed for Node 18+

async function checkFrontend() {
    console.log('🚀 Checking Frontend Routes...');

    const routes = [
        'http://localhost:3000',
        'http://localhost:3000/login',
        'http://localhost:3000/register'
    ];

    let allPass = true;

    for (const url of routes) {
        try {
            const res = await fetch(url);
            if (res.ok) {
                console.log(`✅ ${url} is ONLINE (Status: ${res.status})`);
            } else {
                console.log(`❌ ${url} returned ${res.status}`);
                allPass = false;
            }
        } catch (e) {
            console.log(`❌ ${url} is UNREACHABLE: ${e.message}`);
            allPass = false;
        }
    }

    if (allPass) {
        console.log('\n🎉 All Frontend Routes passed basic health check!');
    } else {
        console.log('\n⚠️ Some routes failed. Check server logs.');
    }
}

checkFrontend();
