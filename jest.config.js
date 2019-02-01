module.exports = {
  // when lauch broswer in jest, it should issues
  // SecurityError: localStorage is not available for opaque origins
  // solution: https://github.com/jsdom/jsdom/issues/2304
  testURL: "http://localhost/"
};
