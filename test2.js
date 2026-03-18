
import http from "k6/http"
import { check, sleep } from "k6";
import {Trend} from "k6/metrics";

const aoiResponseTime = new Trend('pizza_response_time');

export const options = {

    stages: [
        { duration: '4s', target: 2 }, // Ramp up to 2 VUs over 4 seconds
        { duration: '5s', target: 5 }, // Stay at 5 VUs for 5 seconds
        { duration: '3', target: 0 }, // Ramp down to 0 VUs over 10 seconds
    ],

    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'], // less than 1% of requests should fail
        'checks': ['rate>0.9'],    // 90% of checks should pass
        'http_req_duration{name: pizza-api}': ['p(95)<500'],
        'pizza_response_time': ['p(95)<200']

    }
}

export default function () {
    const res = http.get("https://quickpizza.grafana.com");

    pizza_response_time.add(res.timings.waiting);
    //DNS Lookup time
    //TCP Connection time
    //TLS Handshake time
    //Time to First Byte
    //Content Download time
    //Total time taken for the request to complete

    check(res, {
        'is status 200': (r) => r.status === 200,
        'page contains pizza': (r) => {

            r.body.includes("pizza")
        }
    });
    http.get("https://quickpizza.grafana.com/api/pizza",{
        tags: { name: "pizza-api" }
    });
    sleep(1)
}

//http_req_duration -> time taken for request + Time takedn response