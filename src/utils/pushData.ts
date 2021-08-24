import Apify from 'apify';
import { Page } from 'puppeteer';

export const pushData = (page: Page, contents: any[]) => {
  const result = contents.map(content => ({ ...content, '#url': page.url }));
  Apify.pushData(result);
};
