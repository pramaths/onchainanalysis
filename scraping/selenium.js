const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let options = new chrome.Options();
// Add Chrome options as needed, for example:
// options.addArguments('headless'); // Run Chrome in headless mode

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
(async function openPage() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('ṇhttps://etherscan.io');
        // Add more actions here
    } finally {
        await driver.quit();
    }
})();
