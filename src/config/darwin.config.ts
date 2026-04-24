import './gluon.config';
/**
 * Darwinf Config,
 * You can use it to configure:
 * * Security
 * * UI with api specification ([localhost:8080 | host]/api-docs)
 * @returns module darwin config.
 */
export = {
  // Configuración original de seguridad Darwin:
   security: {
     enable: true,
     exclude: [
       '/api/find-by-identification',
       '/api/authentication',
       '/api/authentication/role-selection',
       '/api/authentication/customer-identification'
     ],
     headers: {
       propagation: true
     }
   },
  /*security: {
    enable: false,
    exclude: [],
    headers: {
      propagation: true
    }
  },*/
  healthEndpoint: {
    enable: true
  },
  helmet: {
    enable: true
  },
  gracefulShutdown: {
    enable: true,
    options: {
      timeout: 30000
    }
  },
  graphql: {
    ui: ['playground']
  },
  apiSpecification: {
    enable: true
  },
  overrideResponse: {
    enable: true
  }
};
