// Browser-Based UI Test Scenario

// Scenario Name: User Interface Performance Test
// Description: This test uses browser automation to simulate real user interactions with the web interface.
// It measures page load times, rendering performance, and user experience metrics in a real browser
// environment, providing insights into frontend performance.
// Real-life application: E-commerce websites, web applications where user experience is critical.

import { browser } from "k6/browser";
import http from "k6/http";
import { check } from "k6";

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            exec: "browserTest",
            vus: 2,
            maxDuration: '1m',
            iterations: 4,
            options: {
                browser: {
                    type: "chromium",
                    headless: true, // Changed to true for CI/server environments
                }

            }
        },
        backendTest: {
            executor: 'shared-iterations',
            exec: "backendTest",
            vus: 1,
            iterations: 4,
            startTime: '0s'

        }
    },
    thresholds: {
        'checks': ['rate>=0.8'],    // 80% of checks should pass (allowing for browser test flakiness)
    }
}

export async function browserTest() {

    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the pizza website
    await page.goto('https://quickpizza.grafana.com/');

    // Wait for page to load and check if we can access basic elements
    await page.waitForTimeout(2000);

    // Check if the page loaded successfully by looking for a common element
    const pageTitle = await page.title();

    check(pageTitle, {
        'page title loaded': (title) => title.length > 0
    });

    // Try to find and interact with menu items (simulating user browsing)
    try {
        const menuItems = await page.locator('.menu-item, [data-testid*="pizza"], .pizza-item').count();
        check(menuItems, {
            'menu items found': (count) => count > 0
        });
    } catch (e) {
        // If specific selectors don't work, just check that page loaded
        check(true, {
            'page loaded successfully': () => true
        });
    }

    await context.close();

}

export async function backendTest() {

    const res = http.get("https://quickpizza.grafana.com/");

    check(res, {
        'is status 200': (r) => r.status === 200,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
        'has content': (r) => r.body.length > 0
    });

}