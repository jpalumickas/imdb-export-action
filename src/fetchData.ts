import * as core from '@actions/core';
import puppeteer from 'puppeteer-core';
import getChromePath from './getChromePath';

const email = core.getInput('imdb_email');
const password = core.getInput('imdb_password');
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';

interface Result {
  watchlist?: string;
  ratings?: string;
}

const fetchData = async (): Promise<Result> => {
  const browser = await puppeteer.launch({
    executablePath: getChromePath(),
  });

  const result: Result = {};

  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);

    core.debug('Going to IMDb website');
    console.log('Going to IMDb website');
    await page.goto('https://imdb.com');

    const [signIn] = await page.$x("//a[contains(., 'Sign In')]");
    if (!signIn) {
      throw 'Unable to find Sign In link';
    }

    core.debug('Click on Sign in');
    console.log('Click on Sign in');

    // https://github.com/puppeteer/puppeteer/issues/1412#issuecomment-345482273
    await Promise.all([
      page.waitForNavigation(),
      signIn.click(),
    ]);

    const [signInWithIMDb] = await page.$x(
      "//a[contains(., 'Sign in with IMDb')]"
    );
    if (!signInWithIMDb) {
      throw 'Unable to find Sign in with IMDb link';
    }

    core.debug('Click on Sign in with IMDB');
    console.log('Click on Sign in with IMDB');
    await Promise.all([
      page.waitForNavigation(),
      signInWithIMDb.click(),
    ]);

    core.debug('Enter email and password');
    console.log('Enter email and password');
    await page.type('[type="email"]', email);
    await page.type('[type="password"]', password);

    core.debug('Click log in button');
    console.log('Click log in button');
    await Promise.all([
      page.waitForNavigation(),
      page.click('[type="submit"]'),
    ]);

    core.debug('Fetch watchlist CSV');
    console.log('Fetch watchlist CSV');
    await page.goto('https://www.imdb.com/list/watchlist');
    result.watchlist = await page.evaluate(() => {
      const link = document.evaluate(
        "//a[contains(., 'Export this list')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLLinkElement;

      if (!link) {
        core.debug('Warning! Failed to find watchlist export button');
        console.log('Warning! Failed to find watchlist export button');
        return;
      }

      return fetch(link.href).then((r) => r.text());
    });

    core.debug('Fetch ratings CSV');
    console.log('Fetch ratings CSV');
    await page.goto('https://www.imdb.com/list/ratings');
    result.ratings = await page.evaluate(() => {
      const link = document.evaluate(
        "//a[contains(., 'Export')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLLinkElement;

      if (!link) {
        core.debug('Warning! Failed to find ratings export button');
        console.log('Warning! Failed to find ratings export button');
        return;
      }

      return fetch(link.href).then((r) => r.text());
    });
  } catch (err) {
    console.error(err);
    // setFailed logs the message and sets a failing exit code
    core.setFailed(`Failed to fetch IMDb data: ${err}`);
  } finally {
    await browser.close();
  }

  return result;
};

export default fetchData;
