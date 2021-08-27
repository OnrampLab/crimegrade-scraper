import Apify, { pushData } from 'apify';
import { Log } from 'apify-shared/log';
import { Page } from 'puppeteer';
import { InfoError } from '../../../errors';
import { Input } from '../../../types';
import { screenshot } from '../../../utils';
import { AbstractHandler } from './AbstractHandler';

const {
  utils: { log },
} = Apify;

const CSS_SELECTORS = {
  MAP: '.MapSurround',
  OVERALL_GRADE: '.overallGradeLetter',
}

export class BaseHandler extends AbstractHandler {
  protected name: string;
  protected log: Log;

  constructor(name: string) {
    super();

    this.name = name;
    this.log = log.child({ prefix: this.constructor.name });
  }

  async handle(page: Page, saveResult: boolean = true): Promise<any> {
    try {
      this.log.info('Start handling task', { url: page.url() });

      const baseInfo = await this.getBaseInfo(page);
      const result = Object.assign({},  baseInfo);

      if (saveResult) {
        await pushData(result);
      }

      return result;
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

  private async getBaseInfo(page: Page) {
    const input: Input = (await Apify.getInput()) as any;
    const mapImageLink = await screenshot(page, 'crime_map', CSS_SELECTORS.MAP);
    const overallGrade = await (await page.$(CSS_SELECTORS.OVERALL_GRADE)).evaluate((element) => element.innerHTML);

    return {
      'zipCode': input.zipCode,
      'mapImage': mapImageLink,
      'grade': overallGrade,
    };
  }
}
