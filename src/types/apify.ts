import { BrowserCrawlingContext, CrawlingContext, PuppeteerCrawler } from 'apify';
import { Page } from 'puppeteer';

export type ApifyContext = CrawlingContext &
  BrowserCrawlingContext & {
    page: Page;
    crawler: PuppeteerCrawler;
  };
