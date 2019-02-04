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

  function enableElement(elements) {
    elements.forEach(element => {
      if (element.className.includes('disabled')) {
        element.className = element.className.replace('disabled', 'enabled');
      }
      element.disabled = false;
    });
  }

  function disableElement(elements) {
    elements.forEach(element => {
      if (element.className.includes('enabled')) {
        element.className = element.className.replace('enabled', 'disabled');
      }
      element.disabled = true;
    });
  }

  function showImage(data, imageType, fileName) {
    const imageURL = URL.createObjectURL(data, { type: imageType });
    const [image] = document.getElementsByClassName('image');
    image.style.display = 'inline-block';
    image.src = imageURL;
    image.alt = fileName;
  }

  function downloadFile(data, fileType) {
    const downloadElement = document.createElement('a');
    downloadElement.style.display = 'none';
    document.body.appendChild(downloadElement);
    const downloadURL = URL.createObjectURL(data, { type: fileType });
    downloadElement.href = downloadURL;
    downloadElement.download = fileType;
    downloadElement.click();
    document.body.removeChild(downloadElement);
  }

  window.utils = {
    isImageFormat,
    isValidFile,
    enableElement,
    disableElement,
    showImage,
    downloadFile
  };
})();
