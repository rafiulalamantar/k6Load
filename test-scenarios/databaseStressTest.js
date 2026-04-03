// Database Connection Pool Exhaustion Test Scenario

// Scenario Name: Database Connection Pool Under Stress
// Description: This test simulates heavy concurrent database operations that could exhaust connection pools.
// It creates a high number of simultaneous database transactions (like order placements) to test if the
// application can handle the load without running out of database connections. This is critical for
// e-commerce platforms during peak shopping hours.
// Real-life application: Online retail sites during Black Friday sales or ticket booking systems.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for database connection pool exhaustion: Heavy concurrent database operations
export const options = {
    vus: 100,
    duration: '2m',
    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<3000'],
    },
};

export default function () {
    const response = http.post('https://quickpizza.grafana.com/api/orders', JSON.stringify({
        items: [{ id: 1, quantity: 2 }],
        customer: { name: 'Test User' }
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(response, { 'status is 200': (r) => r.status === 200 });
    sleep(0.5);
}