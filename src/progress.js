(function() {
  const [uploadProgress] = document.getElementsByClassName('uploadProgress__bar');
  const [downloadProgress] = document.getElementsByClassName('downloadProgress__bar');
  const title = document.querySelector('title');

  function resetProgressBar(bar, backgroundColor) {
    bar.style.display = 'none';
    bar.style.width = '0%';
    bar.style.backgroundColor = backgroundColor;
    bar.style.backgroundImage = 'none';
    bar.innerHTML = '';
  }

  function changeProgressBar(nodeElement, event, titlePercent) {
    const percentage = Math.round(event.loaded / event.total * 100);
    nodeElement.style.width = `${percentage}%`;
    nodeElement.style.display = 'block';

    if (titlePercent) {
      title.innerHTML = `My App - ${percentage}%`;
    } else {
      nodeElement.innerHTML = `${percentage}%`;
    }

    if (event.loaded === event.total) {
      title.innerHTML = 'My App';
      nodeElement.style.backgroundImage = 'linear-gradient(90deg, #5e29b7 0%, #38d160 100%)';
      setTimeout(resetProgressBar, 2000, nodeElement, '#5e29b7');
    }
  }

  window.onUploadProgress = event => changeProgressBar(uploadProgress, event);
  window.onDownloadProgress = event => changeProgressBar(downloadProgress, event, true);
}());