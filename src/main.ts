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
    // {
    //   url: `https://crimegrade.org/safest-places-in-${zipCode}`,
    // },
    {
      url: "https://crimegrade.org/safest-places-in-60002",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60004",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60005",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60007",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60008",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60010",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60012",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60013",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60014",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60015",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60016",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60018",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60020",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60021",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60022",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60025",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60026",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60029",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60030",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60031",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60033",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60034",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60035",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60040",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60041",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60042",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60043",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60044",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60045",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60046",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60047",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60048",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60050",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60051",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60053",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60056",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60060",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60061",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60062",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60064",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60067",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60068",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60069",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60070",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60071",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60072",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60073",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60074",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60076",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60077",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60081",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60083",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60084",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60085",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60087",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60088",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60089",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60090",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60091",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60093",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60096",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60097",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60098",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60099",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60101",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60102",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60103",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60104",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60106",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60107",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60108",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60109",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60110",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60111",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60112",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60113",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60115",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60118",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60119",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60120",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60123",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60124",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60126",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60129",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60130",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60131",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60133",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60134",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60135",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60136",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60137",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60139",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60140",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60141",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60142",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60143",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60144",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60145",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60146",
    },
    {
      url: "https://crimegrade.org/safest-places-in-60148",
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
