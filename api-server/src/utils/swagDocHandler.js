const path = require('path');
const swagger = require('swagger-jsdoc');

module.exports = async function swaggerDoc(ctx) {
  // swagger definition comes here
  const swaggerDefinition = {
    info: {
      title: 'EXAMPLE REST API DOC',
      version: '1.0.0',
      description: 'EXAMPLE REST API DOC',
    }
  };
  const options = {
    swaggerDefinition,
    apis: [path.resolve('src/routes/**/*.js'), path.resolve('src/models/**/*.js')],
  };

  const swaggerSpec = swagger(options);
  ctx.body = swaggerSpec;
};
