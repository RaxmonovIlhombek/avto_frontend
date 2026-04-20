const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        let errors = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push('BROWSER_ERROR: ' + msg.text());
                console.log('BROWSER_ERROR:', msg.text());
            }
        });
        
        page.on('pageerror', err => {
            errors.push('PAGE_ERROR: ' + err.toString());
            console.log('PAGE_ERROR:', err.toString());
        });
        
        await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle2' });
        
        if (errors.length === 0) {
            console.log("NO ERRORS FOUND ON /profile");
        }
        
        await browser.close();
    } catch(e) {
        console.error("SCRIPT ERROR:", e);
    }
})();
