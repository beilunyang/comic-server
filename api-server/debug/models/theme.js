'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Theme = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ThemeSchema = _mongoose2.default.Schema({
  title: String,
  comics: Array
});

const Theme = exports.Theme = _mongoose2.default.model('Theme', ThemeSchema);
//# sourceMappingURL=theme.js.map