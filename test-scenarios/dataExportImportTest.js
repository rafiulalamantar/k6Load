import http from "k6/http";
import { sleep, check } from "k6";

// Test for data export/import: Simulates bulk data operations
export const options = {
    vus: 5,
    duration: '5m',
    thresholds: {
        http_req_failed: ['rate<0.02'],
        http_req_duration: ['p(95)<30000'], // Allow longer for bulk operations
    },
};

export default function () {
    // Simulate data export
    const exportResponse = http.get('https://quickpizza.grafana.com/api/export/orders?format=json');
    check(exportResponse, { 'export successful': (r) => r.status === 200 });

    // Simulate data import
    const importData = JSON.stringify({
        orders: [
            { id: 1001, items: [{ id: 1, quantity: 1 }], total: 12.99 },
            { id: 1002, items: [{ id: 2, quantity: 2 }], total: 25.98 },
        ]
    });

    const importResponse = http.post('https://quickpizza.grafana.com/api/import/orders', importData, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(importResponse, { 'import successful': (r) => r.status === 200 });

    sleep(5);
}