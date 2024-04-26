"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padNumber = void 0;
const padNumber = (value, options) => {
  if (value < 10) {
    return (options !== null && options !== void 0 && options.padWithZero ? "0" : " ") + value;
  } else {
    return String(value);
  }
};
exports.padNumber = padNumber;
//# sourceMappingURL=padNumber.js.map