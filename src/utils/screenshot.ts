import Apify from 'apify';
import { random, snakeCase } from 'lodash';
import { Page } from 'puppeteer';

const {
  utils: { log },
} = Apify;

export const screenshot = async (page: Page, title: string, selector?: string): Promise<string> => {
  log.debug(`Saving screenshot of ${title} in ${page.url()}.`);

  let screenshotBuffer: string | void | Buffer;

  if (selector) {
    const element = await page.$(selector);
    screenshotBuffer = await element.screenshot();
  } else {
    screenshotBuffer = await page.screenshot();
  }

  const key = `${snakeCase(title)}_${random()}`;

  await Apify.setValue(key, screenshotBuffer, {
    contentType: 'image/png',
  });

  log.info(`Screenshot of ${title} in ${page.url()} saved.`);

  const keyValueStore = await Apify.openKeyValueStore();

  return keyValueStore.getPublicUrl(key);
};
