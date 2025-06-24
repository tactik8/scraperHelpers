

import { proxyHelpers } from "../../helpers/proxyHelpers/proxyHelpers.js"


//const puppeteer = require("puppeteer");
import puppeteer from 'puppeteer'

//const { exec } = require("node:child_process");
import { exec} from "node:child_process"

//const { promisify } = require("node:util");
import { promisify} from "node:util"

//const puppeteerExtra = require("puppeteer-extra");
import puppeteerExtra from 'puppeteer-extra';
//const { puppeteerExtra } = pkg2;


//const Stealth = require("puppeteer-extra-plugin-stealth");
import Stealth from 'puppeteer-extra-plugin-stealth';
//const { Stealth } = pkg1;

//const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
import AnonymizeUAPlugin from 'puppeteer-extra-plugin-anonymize-ua';
//const { AnonymizeUAPlugin } = pkg;

//const randomUseragent = require("random-useragent");
import randomUseragent from 'random-useragent';
//const { randomUseragent } = pkg4;



const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";



puppeteerExtra.use(Stealth());
puppeteerExtra.use(AnonymizeUAPlugin());


let proxiesDB = new proxyHelpers.Proxies()

export const scraper = {

    init: init,
    get: scrapePage
}


async function init(url){
  /**
   * @param {string} url
   * @param {string} proxy
   */

  await proxiesDB.init(url);
  return

}

async function scrapePage(url) {
  /**
   * @param {string} url
   */


  let count = 0;
  let maxCount = 300



  while(true){
    
    
    let proxies = proxiesDB.getActiveProxies(url)

    
    while (count < maxCount) {
      try {
        let status = await mainStealthNext(proxies[count], url);
        if (status == true){
          proxiesDB.setProxyActive(proxies[count], url)
          console.log("Success");
          return
        } else {
          proxiesDB.setProxyInactive(proxies[count], url)
          console.log("error", count);
          count += 1;
        }
  
      } catch (error){
        proxiesDB.setProxyInactive(proxies[count], url)
        console.log("error", error);
        console.log("error", count);
        count += 1;
      }
    }
  }
}

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

async function mainStealthNext(proxy, url) {




  console.log('Scrapeing', url)
  
  const userAgent = randomUseragent.getRandom();
  const UA = userAgent || USER_AGENT;

  const { stdout: chromiumPath } = await promisify(exec)("which chromium");

  const browser = await puppeteerExtra.launch({
    //headless: false,
    headless: 'shell',
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1920,1080",
      `--proxy-server=${proxy.ip}:${proxy.port}`,
    ],
    executablePath: chromiumPath.trim(),
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(UA);
  await page.setJavaScriptEnabled(true);
  await page.setDefaultNavigationTimeout(0);

  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
      //req.continue();
    } else {
      req.continue();
    }
  });

  await page.evaluateOnNewDocument(() => {
    // Pass webdriver check
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });

  await page.evaluateOnNewDocument(() => {
    // Pass chrome check
    window.chrome = {
      runtime: {},
      // etc.
    };
  });

  await page.evaluateOnNewDocument(() => {
    //Pass notifications check
    const originalQuery = window.navigator.permissions.query;
    return (window.navigator.permissions.query = (parameters) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters));
  });

  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, "plugins", {
      // This just needs to have `length > 0` for the current test,
      // but we could mock the plugins too if necessary.
      get: () => [1, 2, 3, 4, 5],
    });
  });

  await page.evaluateOnNewDocument(() => {
    // Overwrite the `languages` property to use a custom getter.
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
  });



  try {
    await page.goto(url);
    await page.waitForNetworkIdle(); // Wait for network resources to fully load

    let filename = "screenshots/screenshot_" + new Date().toISOString() + ".png";
    await page.screenshot({ path: filename });

  } catch (error){
    console.log('e', error)
    await browser.close();
     return false
  }

  try {
     await browser.close();
     return true
  } catch (error){
    console.log('e', error)
  }
  return false
}
