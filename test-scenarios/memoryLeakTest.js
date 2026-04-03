// Memory Leak Simulation Test Scenario

// Scenario Name: Memory Leak Detection
// Description: This test runs for an extended period with repeated requests that could potentially cause
// memory accumulation on the server. It simulates users continuously fetching large datasets or performing
// memory-intensive operations. The goal is to identify if the application has memory leaks that could
// lead to performance degradation or crashes over time.
// Real-life application: Data analytics dashboards, content management systems, or any app serving large files.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for memory leak simulation: Repeated requests that might cause memory accumulation
export const options = {
    vus: 20,
    duration: '5m',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
    },
};

export default function () {
    // Simulate memory-intensive operations
    const response = http.get('https://quickpizza.grafana.com/api/large-dataset');
    check(response, { 'status is 200': (r) => r.status === 200 });
    sleep(1);
}