import Apify from 'apify';
import { random } from 'lodash';
import { Page } from 'puppeteer';

const {
  utils: { log },
} = Apify;

export const screenshot = async (page: Page, title: string, selector?: string) => {
  log.debug(`Saving screenshot of ${title} in ${page.url()}.`);

  let screenshotBuffer: string | void | Buffer;

  if (selector) {
    const element = await page.$(selector);
    screenshotBuffer = await element.screenshot();
  } else {
    screenshotBuffer = await page.screenshot();
  }

  const key = page.url().replace(/[:/]/g, '_');
  await Apify.setValue(key + title.replace(/\s/g, '_') + random(), screenshotBuffer, {
    contentType: 'image/png',
  });

  log.info(`Screenshot of ${title} in ${page.url()} saved.`);
};
