import Apify from 'apify';
import { InfoError } from './errors';

const {
  utils: { log: logUtil },
} = Apify;

export const preNavigationHook = async ({ request, page, session }) => {
  const log = logUtil.child({ prefix: 'PreNavigationHook' });

  try {
  } catch (e) {
    if (e instanceof InfoError) {
      throw e;
    }

    const error = e as Error;

    log.exception(error);

    throw new InfoError('Failed to do PreNavigationHook', {
      namespace: 'preNavigationHook',
      url: page.url(),
    });
  }
};
