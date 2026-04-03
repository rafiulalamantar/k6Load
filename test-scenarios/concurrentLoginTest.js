// Concurrent User Login Test Scenario

// Scenario Name: Mass User Authentication Surge
// Description: This test simulates a large number of users attempting to log in simultaneously, which
// commonly happens during system launches, password reset periods, or when services come back online
// after downtime. It tests the authentication system's ability to handle concurrent login attempts
// without overwhelming the servers or causing excessive delays.
// Real-life application: Banking apps after maintenance, social platforms during viral events, or corporate VPN access.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for concurrent user login: Simulates multiple users logging in simultaneously
export const options = {
    vus: 200,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.1'],
        http_req_duration: ['p(95)<5000'],
    },
};

export default function () {
    const loginPayload = JSON.stringify({
        username: `user${__VU}`,
        password: 'password123'
    });
    const response = http.post('https://quickpizza.grafana.com/api/login', loginPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
        'login successful': (r) => r.status === 200 || r.status === 201,
    });
    sleep(0.2);
}