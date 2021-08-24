import Apify from 'apify';
import { Log } from 'apify-shared/log';
import { TaskHandlers } from '../types';
import { Handler } from './overallCrime';

const {
  utils: { log },
} = Apify;

type Factory = Record<string, TaskHandlers>;

export class HandlerFactory {
  protected static log: Log = log.child({ prefix: 'HandlerFactory' });
  protected static mapping;

  static createHandler(): TaskHandlers {
    log.debug('Getting handler');

    const handler = new Handler();

    return handler;
  }
}
