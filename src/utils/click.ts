import Apify from 'apify';
import { Page } from 'puppeteer';

const {
  utils: { log },
} = Apify;

export const click = async (
  page: Page,
  targetText: string,
  buttonXpath: string,
  expectedXpath: string,
) => {
  try {
    log.debug(`Click ${targetText}`);
    const [button] = await page.$x(buttonXpath);

    log.debug(`Button`, {
      buttonXpath,
      button: button?.[0]?.innerText,
    });

    await button.click();
    await page.waitForXPath(expectedXpath, {
      visible: true,
      timeout: 15000,
    });
    log.debug(`Done`);
  } catch (e) {
    log.exception(e, e.message);
    throw e;
  }
};
