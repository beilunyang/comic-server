'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _swaggerJsdoc = require('swagger-jsdoc');

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function swaggerDoc(ctx) {
  // swagger definition comes here
  const swaggerDefinition = {
    info: {
      title: 'EXAMPLE REST API DOC',
      version: '1.0.0',
      description: 'EXAMPLE REST API DOC'
    }
  };
  const options = {
    swaggerDefinition,
    apis: [_path2.default.resolve('src/routes/**/*.js'), _path2.default.resolve('src/models/**/*.js')]
  };

  const swaggerSpec = (0, _swaggerJsdoc2.default)(options);
  ctx.body = swaggerSpec;
};
//# sourceMappingURL=swagDocHandler.js.map