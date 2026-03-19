const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8081');
    
    // Select class
    await page.click('#start-game-btn');
    await new Promise(r => setTimeout(r, 500));
    const classBtns = await page.$$('.class-btn');
    if (classBtns.length > 0) {
        await classBtns[0].click();
        await new Promise(r => setTimeout(r, 500));
    }
    
    // Select background
    const bgBtns = await page.$$('.bg-btn');
    if (bgBtns.length > 0) {
        await bgBtns[0].click();
        await new Promise(r => setTimeout(r, 500));
    }
    
    // Check if modal is visible
    const modalStyle = await page.$eval('#narrative-modal', el => el.style.display);
    console.log("Modal display style after background selection:", modalStyle);
    
    // Click close button
    if (modalStyle === 'flex') {
        await page.click('#close-narrative-btn');
        await new Promise(r => setTimeout(r, 500));
        const newModalStyle = await page.$eval('#narrative-modal', el => el.style.display);
        console.log("Modal display style after clicking close:", newModalStyle);
    }

    await browser.close();
})();
