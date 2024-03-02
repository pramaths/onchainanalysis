const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://etherscan.io', { waitUntil: 'networkidle2' });

    // More robust waiting for dynamic content
    await page.waitForSelector('.row', { visible: true, timeout: 10000 }) // Adjust timeout as needed

    const transactions = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.row')); // Make sure this selector is correct
        return rows.map(row => {
            const from = row.querySelector('div:nth-child(2) > div > div:nth-child(1) > a').getAttribute('href');
            const to = row.querySelector('div:nth-child(2) > div > div:nth-child(2) > a').getAttribute('href');
            const amount = row.querySelector('.badge').textContent.trim();
            return { from, to, amount };
        });
    });

    console.log(transactions);

    await browser.close();
})();
