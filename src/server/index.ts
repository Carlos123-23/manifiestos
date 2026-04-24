import 'reflect-metadata';
/* eslint-disable @typescript-eslint/no-var-requires */
// import darwin config must be the first import
import darwinConfig from '../config/darwin.config';
import { techLog } from '@darwin-node/logger';
import fastifyConfig from '../config/fastify.config';
import fastify from 'fastify';
import { generateFastifyApp } from '@darwin-node/composer';
import { registerHttpInterceptors } from '../app/adapter/http/interceptors/registerHttp.interceptor';

const routes = require('../routers');
const server = fastify();
techLog.info(`[DARWIN-DEBUG] Exclude array en config: ${JSON.stringify(darwinConfig.security?.exclude)}`);
const app = generateFastifyApp(server, routes, darwinConfig);
registerHttpInterceptors(app);

const App = Object.assign(app);
App.run = App.listen.bind(App);
App.run(fastifyConfig, () => {
  /* istanbul ignore next */
  techLog.info('Server listening');
});
