import Apify, { pushData } from 'apify';
import { Log } from 'apify-shared/log';
import { ElementHandle, Page } from 'puppeteer';
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
  CONTENT: 'h2 + p, h3 + p',
}

const XPATH_SELECTOR = {
  STATS_TABLE: (category) => `//h3[contains(text(),'${category} Crime Rates')]/following-sibling::table`,
}

enum CRIME_CATEGORY {
  VIOLENT = 'Violent',
  PROPERTY = 'Property',
  OTHER = 'Other',
};

type CrimeStatistic = {
  catetory: CRIME_CATEGORY;
  rate: number;
  grade: string;
  details: CrimeStatisticDetail[];
}

type CrimeStatisticDetail = {
  type: string;
  rate: number;
}

type CrimeContent = {
  title: string;
  descriptions: string[];
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
      const statistics = await this.getStatistics(page);
      const contents = await this.getContents(page);
      const result = Object.assign({},  baseInfo, statistics, contents);

      if (saveResult) {
        await pushData(result);
      }

      this.log.info('Finish handling task', { url: page.url() });

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

  private async getStatistics(page: Page) {
    const result: CrimeStatistic[] = [];

    for (let category of Object.values(CRIME_CATEGORY)) {
      const stat = await this.getStatisticByCategory(page, category);
      result.push(stat);
    }

    return { statistics: result };
  }

  private async getStatisticByCategory(page: Page, category: CRIME_CATEGORY) {
    const result = {} as CrimeStatistic;
    const table = (await page.$x(XPATH_SELECTOR.STATS_TABLE(category)))[0];
    const rows = await table.$x('./tbody/tr');
    const dataRows = [];

    rows.shift();

    for (let row of rows) {
      const emptyCells = await row.$x("./td[contains(@class, 'blankRow')]");

      if (emptyCells.length === 0) {
        dataRows.push(row);
      };
    }

    const totalRow = dataRows.pop();
    const totalValue = await (await totalRow.$x('./td[2]/div'))[0].evaluate(element => element.innerHTML);
    const [totalRate, totalGrade] = totalValue.split(' ');

    result.catetory = category;
    result.rate = Number(totalRate);
    result.grade = totalGrade.replace(/[\(\)]/g, '');
    result.details = [];

    for (let row of dataRows) {
      const crimeType = await (await row.$x('./td[1]/div'))[0].evaluate(element => element.innerHTML);
      const crimeRate = await (await row.$x('./td[2]/div'))[0].evaluate(element => element.innerHTML);

      result.details.push({
        type: crimeType,
        rate: Number(crimeRate),
      });
    }

    return result;
  }

  private async getContents(page: Page) {
    const contents = await page.$$(CSS_SELECTORS.CONTENT);
    const result: CrimeContent[] = [];

    for (let content of contents) {
      const data = {} as CrimeContent;

      data.title = await content.evaluate(element => element.previousElementSibling.innerHTML);
      data.descriptions = [];

      let currentContentNode: ElementHandle = await content.evaluateHandle(element => element);

      while (true) {
        const description = await currentContentNode.evaluate(element => element.innerHTML);

        data.descriptions.push(description);

        const nextContentNode: ElementHandle  = await currentContentNode.evaluateHandle(element => element.nextElementSibling);
        const nextContentNodeName = await nextContentNode.evaluate(element => element ? element.nodeName : null);

        if (!nextContentNodeName || nextContentNodeName !== 'P') {
          break;
        }

        currentContentNode = nextContentNode;
      }

      result.push(data);
    }

    return { contents: result };
  }
}
