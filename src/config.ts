import { env } from './utils';

export const config = {
  user: {},
  app: {
    /*
     * When using docker, you should enable the headless mode
     */
    headless: Boolean(env('ENABLE_HEADLESS', 'false')),
  },
};
