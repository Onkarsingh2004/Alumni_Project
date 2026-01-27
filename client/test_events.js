const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEventFlow() {
    console.log('--- Starting Event Functionality Test ---');
    try {
        // 1. Register Alumni (Host)
        const hostEmail = `host_${Date.now()}@test.com`;
        console.log(`1. Registering Host: ${hostEmail}`);
        const hostReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Event Host',
            email: hostEmail,
            password: 'password123',
            role: 'alumni'
        });
        const hostToken = hostReg.data.token;
        console.log('Host Registered.');

        // 2. Register Student (Attendee)
        const studentEmail = `student_${Date.now()}@test.com`;
        console.log(`\n2. Registering Student: ${studentEmail}`);
        const studentReg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Event Student',
            email: studentEmail,
            password: 'password123',
            role: 'student'
        });
        const studentToken = studentReg.data.token;
        const studentId = studentReg.data._id;
        console.log('Student Registered.');

        // 3. Create Event
        console.log('\n3. Host Creating Event...');
        const eventData = {
            title: 'Test Webinar',
            description: 'This is a test event description.',
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            type: 'webinar',
            link: 'http://zoom.us/test'
        };

        const createRes = await axios.post(`${API_URL}/events`, eventData, {
            headers: { Authorization: `Bearer ${hostToken}` }
        });
        const eventId = createRes.data._id;
        console.log(`Event Created. ID: ${eventId}`);

        // 4. Fetch Events (Student)
        console.log('\n4. Student Fetching Events...');
        const listRes = await axios.get(`${API_URL}/events`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        const foundEvent = listRes.data.find(e => e._id === eventId);
        if (foundEvent) {
            console.log('SUCCESS: Student sees the new event.');
        } else {
            console.error('FAILURE: Student cannot see the new event.');
            return;
        }

        // 5. Register for Event (Student)
        console.log('\n5. Student Registering for Event...');
        const regRes = await axios.put(`${API_URL}/events/${eventId}/register`, {}, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('Registration Response (Attendee IDs):', regRes.data);

        // 6. Verify Single Event Details (Get By ID)
        console.log('\n6. Fetching Single Event Details...');
        const detailRes = await axios.get(`${API_URL}/events/${eventId}`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });

        const attendees = detailRes.data.attendees;
        // Check if studentId is in attendees (attendees might be objects or strings depending on populate)
        const isRegistered = attendees.some(a => (typeof a === 'object' ? a._id : a) === studentId);

        if (isRegistered) {
            console.log('SUCCESS: Student is confirmed in the attendee list.');
            console.log(`Event Title: ${detailRes.data.title}`);
            console.log(`Host Name: ${detailRes.data.host.name}`);
        } else {
            console.error('FAILURE: Student not found in attendee list.');
        }

        console.log('\n--- Test Completed Successfully ---');

    } catch (error) {
        console.error('TEST FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testEventFlow();
