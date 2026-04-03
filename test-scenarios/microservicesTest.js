// Microservices Communication Test Scenario

// Scenario Name: Distributed System Inter-Service Calls
// Description: This test simulates communication between multiple microservices in a distributed system,
// such as user service, order service, and payment service. It helps identify cascading failures,
// network latency issues, and bottlenecks in service-to-service communication.
// Real-life application: E-commerce platforms, banking systems, or any complex distributed application.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for microservices communication: Simulates inter-service calls
export const options = {
    vus: 30,
    duration: '2m',
    thresholds: {
        http_req_failed: ['rate<0.02'],
        http_req_duration: ['p(95)<1500'],
    },
};

export default function () {
    // Simulate calling multiple microservices
    const userResponse = http.get('https://quickpizza.grafana.com/api/user/1');
    check(userResponse, { 'user service ok': (r) => r.status === 200 });

    const orderResponse = http.get('https://quickpizza.grafana.com/api/orders/1');
    check(orderResponse, { 'order service ok': (r) => r.status === 200 });

    const paymentResponse = http.post('https://quickpizza.grafana.com/api/payment', JSON.stringify({
        orderId: 1,
        amount: 25.99
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(paymentResponse, { 'payment service ok': (r) => r.status === 200 });

    sleep(1);
}