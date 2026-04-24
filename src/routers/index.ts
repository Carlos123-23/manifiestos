import naturalPersonRouter from './naturalPerson';
import authenticationRouter from './authentication';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

interface PrefixedRouter {
  route: (app: FastifyInstance, opts: FastifyPluginOptions, callback: () => void) => void;
  prefix: string;
}

/**
* Array of routes
* Routes are stored in an array with its prefix
* It is later used on the app composer
*/
const router: Array<PrefixedRouter> = [
  {
    route: naturalPersonRouter,
    prefix: '/api'
  },
  {
    route: authenticationRouter,
    prefix: '/api'
  }
];

/**
 * @returns routes.
 */
export = router;
