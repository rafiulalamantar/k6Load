import browser from k6 / browser;

export async function browserTest() {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('');
    await page.locator("#inputUsername").type("Rafiul")
    await page.locator("#inputPassword").type("")
    await page.locator("button[type='submit']").click();

    await page.waitForTimeout(2000);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'page contains pizza': (r) => {

            r.body.includes("pizza")
        }
    });
}