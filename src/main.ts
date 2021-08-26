import Apify from 'apify';
import { config } from './config';
import { errors, InfoError } from './errors';
import { preNavigationHook } from './preNavigationHook';
import { handle } from './routes';
import { ApifyContext, Input } from './types';

const {
  utils: { log: logUtil },
} = Apify;

Apify.main(async () => {
  const input: Input | null = (await Apify.getInput()) as any;

  if (!input || typeof input !== 'object') {
    throw new Error('Missing input');
  }

  const { zipCode, proxy, debugLog = false, useStealth = false, useChrome } = input;

  if (debugLog) {
    logUtil.setLevel(logUtil.LEVELS.DEBUG);
  }

  const log = logUtil.child({ prefix: 'Main' });

  log.info('Starting Main Process', { useChrome, isAtHome: Apify.isAtHome() });

  const startUrls = [
    {
      url: `https://crimegrade.org/safest-places-in-${zipCode}`,
    },
  ];

  const requestList = await Apify.openRequestList('start-urls', startUrls);
  const requestQueue = await Apify.openRequestQueue();
  const proxyConfiguration = await Apify.createProxyConfiguration(proxy);

  // TODO: should handle cookies

  try {
    if (Apify.isAtHome() && (!proxy || (!proxy.useApifyProxy && !proxy.proxyUrls)))
      throw errors.proxyIsRequired();
  } catch (error) {
    log.info('--  --  --  --  --');
    log.info(' ');
    log.error('Run failed because the provided input is incorrect:');
    log.error((error as Error).message);
    log.info(' ');
    log.info('--  --  --  --  --');
    process.exit(1);
  }

  const crawler = new Apify.PuppeteerCrawler({
    requestList,
    requestQueue,
    proxyConfiguration,
    maxRequestRetries: 0,
    preNavigationHooks: [preNavigationHook],
    launchContext: {
      // @ts-ignore
      launchOptions: {
        ...getLaunchOptions(),
      },
      useChrome: typeof useChrome === 'boolean' ? useChrome : Apify.isAtHome(),
      stealth: useStealth,
    },
    handlePageFunction: async (context: ApifyContext) => {
      log.debug('Start handlePageFunction');
      const { request, page, session, browserController } = context;

      try {
        const {
          url,
          userData: { label },
        } = request;

        log.info('Page opened.', { label, url });

        return handle(context);
      } catch (e) {
        const error = e as Error;

        log.debug(error.message, {
          url: request.url,
          userData: request.userData,
          error: error,
        });

        if (error instanceof InfoError) {
          // We want to inform the rich error before throwing
          log.warning(error.message, error.toJSON());

          if (['internal', 'login', 'threshold'].includes(error.meta.namespace)) {
            session.retire();
            await browserController.close(page);
          }
        }
      }
    },
    handleFailedRequestFunction: async ({ request, error }) => {
      if (error instanceof InfoError) {
        // this only happens when maxRetries is
        // comprised mainly of InfoError, which is usually a problem
        // with pages
        log.exception(error);
      } else {
        log.error(`Requests failed on ${request.url} after ${request.retryCount} retries`);
      }

      await Apify.pushData({
        '#debug': Apify.utils.createRequestDebugInfo(request),
        '#error': request.url,
      });
    },
  });

  log.info('Starting the crawl.');
  await crawler.run();
  log.info('Crawl finished.');
});

function getLaunchOptions() {
  if (!config.app.headless) {
    return null;
  }

  return {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
}
