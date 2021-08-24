import Apify, { pushData } from 'apify';
import { Log } from 'apify-shared/log';
import { Page } from 'puppeteer';
import { InfoError } from '../../../errors';
import { AbstractHandler } from './AbstractHandler';

const {
  utils: { log },
} = Apify;

export class BaseHandler extends AbstractHandler {
  protected name: string;
  protected dataKey: string;
  protected log: Log;

  constructor() {
    super();

    this.log = log.child({ prefix: this.constructor.name });
  }

  async handle(page: Page, saveResult: boolean = true): Promise<any[]> {
    try {
      this.log.info('Start handling skill task', { url: page.url() });

      await page.waitForXPath(`//button/div[contains(., "${this.name}")]`, {
        visible: true,
        timeout: 15000,
      });

      const contents = await this.getResult(page);

      if (saveResult) {
        await this.saveResult(contents, page);
      }

      return contents;
    } catch (error) {
      if (error instanceof InfoError) {
        throw error;
      }

      log.exception(error as Error, `Failed handle task`, error);

      throw new InfoError(`Failed handle task`, {
        namespace: this.name,
        url: page.url(),
      });
    }
  }

  private async getResult(page: Page) {
    const texts: string[] = await page.evaluate(dataKey =>
      Array.from(document.querySelectorAll('pre')).map(element => element.innerText),
    );

    const contents = texts.map(text => ({
      [this.dataKey]: text,
    }));
    return contents;
  }

  private async saveResult(contents: { [x: string]: string }[], page: Page) {
    const result = contents.map(content => ({ ...content, '#url': page.url() }));
    await pushData(result);
  }
}
