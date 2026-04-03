// WebSocket Connections Test Scenario

// Scenario Name: Real-Time Communication Load
// Description: This test establishes multiple WebSocket connections to simulate real-time features
// like live chat, notifications, or collaborative editing. It measures connection establishment time,
// message delivery reliability, and server capacity for handling persistent connections.
// Real-life application: Chat applications, live sports updates, collaborative document editing, or IoT dashboards.

import ws from "k6/ws";
import { check } from "k6";

// Test for WebSocket connections: Simulates real-time communication under load
export const options = {
    vus: 50,
    duration: '1m',
    thresholds: {
        ws_connecting: ['p(95)<3000'],
        ws_msgs_received: ['rate>0.95'],
    },
};

export default function () {
    const url = 'wss://echo.websocket.org'; // Using a public WebSocket echo server
    const res = ws.connect(url, {}, function (socket) {
        socket.on('open', () => {
            socket.send('Hello from k6!');
        });
        socket.on('message', (data) => {
            check(data, { 'received echo': (d) => d === 'Hello from k6!' });
        });
        socket.on('close', () => {});
    });
    check(res, { 'WebSocket connected': (r) => r && r.status === 101 });
}