// Authentication Token Refresh Test Scenario

// Scenario Name: Token Expiration and Refresh Handling
// Description: This test simulates authentication token expiration and refresh mechanisms under load.
// It ensures that the application can handle token refresh requests efficiently without causing
// authentication failures or excessive server load during token renewal processes.
// Real-life application: Mobile apps, web applications with session management, or API gateways with JWT tokens.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for authentication token refresh: Simulates token expiration and refresh under load
export const options = {
    vus: 20,
    duration: '3m',
    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<2000'],
    },
};

let token = '';

export function setup() {
    // Initial login to get token
    const loginResponse = http.post('https://quickpizza.grafana.com/api/login', JSON.stringify({
        username: 'testuser',
        password: 'password123'
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    token = loginResponse.json().token;
    return { token };
}

export default function (data) {
    // Use token for authenticated requests
    const response = http.get('https://quickpizza.grafana.com/api/protected-data', {
        headers: { 'Authorization': `Bearer ${data.token}` },
    });

    if (response.status === 401) {
        // Token expired, refresh it
        const refreshResponse = http.post('https://quickpizza.grafana.com/api/refresh-token', JSON.stringify({
            token: data.token
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
        if (refreshResponse.status === 200) {
            data.token = refreshResponse.json().token;
        }
    }

    check(response, { 'authenticated request successful': (r) => r.status === 200 });
    sleep(2);
}