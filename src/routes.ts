import Apify from 'apify';
import { HandlerFactory } from './crimegrade';
import { InfoError } from './errors';
import { ApifyContext } from './types';

const {
  utils: { log: logUtil },
} = Apify;

const CSS_SELECTORS = {
  MAIN_AREA: '#et-main-area',
};

export const handle = async (context: ApifyContext) => {
  const log = logUtil.child({ prefix: 'Routes' });

  const { request, page } = context;

  try {
    log.debug('Waiting for main area');
    await page.waitForFunction(
      selector => {
        return document.querySelector(selector);
      },
      { timeout: 15000 },
      CSS_SELECTORS.MAIN_AREA,
    );

    await Promise.all([
      page.waitForSelector(CSS_SELECTORS.MAIN_AREA, { visible: true, timeout: 15000 }),
    ]);

    const handler = HandlerFactory.createHandler();
    log.debug('Created handler', { handle });

    await handler.handle(page);
  } catch (error) {
    if (error instanceof InfoError) {
      throw error;
    }

    log.error('Failed to handle route', { error });

    throw new InfoError<typeof error>(`Failed to handle route`, {
      url: page.url(),
      namespace: 'route',
    });
  }
};
