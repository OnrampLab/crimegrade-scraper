import { Page } from 'puppeteer';

export abstract class AbstractHandler {
  abstract handle(page: Page, saveResult: boolean): Promise<any[]>;
}
