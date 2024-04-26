export const padNumber = (value, options) => {
  if (value < 10) {
    return (options !== null && options !== void 0 && options.padWithZero ? "0" : " ") + value;
  } else {
    return String(value);
  }
};
//# sourceMappingURL=padNumber.js.map