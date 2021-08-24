import Apify from 'apify';
import { Log } from 'apify-shared/log';
import { BaseHandler } from '../core/handlers/BaseHandler';

const {
  utils: { log },
} = Apify;

const CSS_SELECTORS = {
  COUNT: '#nValue',
};

export class Handler extends BaseHandler {
  protected name: string;
  protected dataKey: string;
  protected log: Log;

  static create() {
    return new Handler();
  }
}
