import Apify from 'apify';
import { BaseError } from 'make-error';

export const errors = {
  proxyIsRequired: () => new Error('Proxy is required to run this actor'),
  urlsAreRequired: () => new Error('Please provide urls configuration'),
  typeIsRequired: () => new Error('Type of scrape is required for the actor to run.'),
};

/**
 * Contains information about the error
 */
export interface InfoErrorMeta<T = any> {
  /**
   * Url that had the error
   */
  url: string;
  /**
   * Differentiate between error causes, usually the name of the function / section
   */
  namespace: string;
  /**
   * Attach request userData to the error
   */
  userData?: T;
}

/**
 * Enriched error with contextual information
 */
export class InfoError<T = any> extends BaseError {
  time: string;

  meta: InfoErrorMeta<T>;

  runId: string | null;

  constructor(message: string, meta: InfoErrorMeta<T>) {
    super(message);

    this.time = new Date().toISOString();
    this.meta = {
      ...meta,
    };
    this.runId = Apify.getEnv().actorRunId;
  }

  toJSON() {
    return {
      runId: this.runId,
      time: this.time,
      meta: this.meta,
    };
  }
}
