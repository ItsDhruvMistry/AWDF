const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'd:/Charusat/Sem 5/AWDF/Practical/P2/screenshot.png', fullPage: true });
    await browser.close();
    console.log('Screenshot saved successfully.');
  } catch (err) {
    console.error('Error taking screenshot:', err);
    process.exit(1);
  }
})();
