import { Page } from 'puppeteer';

export interface TaskHandler {
  handle: (page: Page, saveResult?: boolean) => Promise<any[]>;
}

export type TaskHandlers = TaskHandler;
