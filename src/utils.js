/* eslint-disable no-useless-escape */
(function() {
  function isImageFormat(data) {
    return data.includes('image');
  }

  function isValidFile(fileName) {
    const characters = /^[^\\/:\*\?"<>\|]+$/;
    const dot = /^\./;

    return characters.test(fileName) && !dot.test(fileName);
  }

  window.utils = {
    isImageFormat,
    isValidFile
  };
})();
