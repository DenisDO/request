/* eslint-disable no-undef */
const uploadBar = document.getElementById('uploadProgress-bar');
const downloadBar = document.getElementById('downloadProgress-bar');
const downloadButton = document.getElementById('downloadButton');
const isImageFormat = function(data) {
  return data.includes('image');
};

function isValidFile(fileName) {
  // eslint-disable-next-line no-useless-escape
  const characters = /^[^\\/:\*\?"<>\|]+$/;
  const dot = /^\./;

  return characters.test(fileName) && !dot.test(fileName);
}

function enableElement(elementID, style) {
  const element = document.getElementById(elementID);
  element.disabled = false;

  if (style) {
    element.className = style;
  }
}

function showImage(data, imageType, fileName) {
  const imageURL = URL.createObjectURL(data, { type: imageType });
  const image = document.getElementById('myImage');
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

function createRequestForList() {
  // eslint-disable-next-line no-undef
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  xhr.get('/list', { responseType: 'json' })
    // eslint-disable-next-line no-use-before-define
    .then(data => showFilesList(data))
    .catch(xhr => {
      const notifyReject = new Notification(ERROR, `Error: ${xhr.statusText}`);
      notifyReject.showNotify();
    });
}

function resetProgressBar(bar, backgroundColor) {
  bar.style.display = 'none';
  bar.style.width = '0%';
  bar.innerHTML = '';
  bar.style.backgroundColor = backgroundColor;
  bar.style.backgroundImage = 'none';
}

function chooseFileFromList(event) {
  const element = event.target;

  if (element.tagName === 'LI') {
    document.getElementById('downloadText').value = element.innerHTML;
    enableElement('downloadButton', 'button button--enabled');
  }
}

function showFilesList(files) {
  const container = document.getElementById('filesCintainer');
  container.innerHTML = '';
  container.style.textAlign = 'left';
  const list = document.createElement('ul');
  list.className = 'filesList__container';

  for (const key in files) {
    const item = document.createElement('li');
    item.className = 'filesList__item';
    item.innerHTML = `${files[key]}`;
    list.appendChild(item);
  }
  list.addEventListener('click', chooseFileFromList);
  container.appendChild(list);
}

function onUploadProgress(event, isFinished) {
  const percentage = Math.round(event.loaded / event.total * 100);
  uploadBar.style.width = `${percentage}%`;
  uploadBar.style.display = 'block';

  if (!isFinished) {
    uploadBar.innerHTML = `${percentage}%`;
  } else {
    uploadBar.innerHTML = 'Success!';
    uploadBar.style.backgroundImage = 'linear-gradient(90deg, #5e29b7 0%, #38d160 100%)';
    setTimeout(resetProgressBar, 2000, uploadBar, '#5e29b7');
  }
}

function onDownloadProgress(event, isFinished) {
  const percentage = Math.round(event.loaded / event.total * 100);
  downloadBar.style.display = 'block';
  downloadBar.style.width = `${percentage}%`;
  const title = document.querySelector('title');
  title.innerHTML = `My App - ${percentage}%`;

  if (isFinished) {
    title.innerHTML = 'My App';
    downloadBar.style.backgroundImage = 'linear-gradient(90deg, #5e29b7 0%, #38d160 100%)';
    setTimeout(resetProgressBar, 2000, downloadBar, '#5e29b7');
  }
}

function disableElement(elementID, style) {
  const element = document.getElementById(elementID);
  element.disabled = true;

  if (style) {
    element.className = style;
  }
}

document.getElementById('uploadForm').onsubmit = function(e) {
  disableElement('upload__button', 'button button--disabled');
  e.preventDefault();
  const file = e.target.sampleFile.files[0];
  const fileName = file.name;

  if (isValidFile(fileName)) {
    const form = new FormData();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'multipart/form-data');
    form.append('sampleFile', file);

    disableElement('upload__form__input', 'upload-bar upload-bar--disabled');
    disableElement('upload');
    const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
    xhr.post('/upload', { responseType: 'blob', onUploadProgress, data: form })
      .then(() => {
        enableElement('upload__form__input', 'upload-bar upload-bar--enabled');
        enableElement('upload');
        enableElement('downloadText');
        createRequestForList();
        const notifyFilesList = new Notification(INFO, 'Files list is available!');
        const notifyUploaded = new Notification(INFO, `File ${fileName} was uploaded!`);
        notifyFilesList.showNotify();
        notifyUploaded.showNotify();
      })
      .catch(xhr => {
        enableElement('upload__form__input', 'upload-bar upload-bar--enabled');
        enableElement('upload');
        const notifyReject = new Notification(ERROR, `Error: ${xhr.statusText}`);
        notifyReject.showNotify();
      });
  } else {
    const notifyUpload = new Notification(ERROR, `${fileName} is forbidden file!`);
    const notifyValidFile = new Notification(WARNING, 'The file should not start with ' +
    'a dot and not contain forbidden characters!');
    notifyUpload.showNotify();
    notifyValidFile.showNotify();
  }
  document.querySelector('.upload-content').innerHTML = 'Choose your file';
};

document.getElementById('downloadForm').onsubmit = function(e) {
  disableElement('downloadButton', 'button button--disabled');
  e.preventDefault();
  const file = e.target[0].value;

  if (isValidFile(file)) {
    disableElement('downloadText');
    const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
    xhr.get(`/files/${file}`, { responseType: 'blob', onDownloadProgress })
      .then(data => {
        const dataType = data.type;
        enableElement('downloadText');

        if (isImageFormat(dataType)) {
          showImage(data, dataType);
          const notifyImage = new Notification(INFO, 'Image is downloaded!');
          notifyImage.showNotify();
        } else {
          downloadFile(data, dataType);
          const notifyFile = new Notification(INFO, 'The file may be downloaded to Your device!');
          notifyFile.showNotify();
        }
      })
      .catch(xhr => {
        enableElement('downloadText');
        const notifyReject = new Notification(ERROR, `Error: ${xhr.statusText}`);
        notifyReject.showNotify();
      });
  } else {
    const notifyDownload = new Notification(ERROR, `${file} is forbidden file!`);
    const notifyValidFile = new Notification(WARNING, 'The file should not start with ' +
    'a dot and not contain forbidden characters!');
    notifyDownload.showNotify();
    notifyValidFile.showNotify();
  }
  document.getElementById('downloadText').value = '';
};

document.getElementById('upload').onchange = function(e) {
  const file = e.target.value.replace(/.*\\/, '');

  if (file) {
    enableElement('upload__button', 'button button--enabled');
    document.querySelector('.upload-content').innerHTML = file;
    const notifyFile = new Notification(INFO, `The file ${file} is ready for upload!`);
    notifyFile.showNotify();
  } else {
    disableElement('upload__button', 'button button--disabled');
    document.querySelector('.upload-content').innerHTML = 'Choose your file';
    const notifyFile = new Notification(WARNING, 'No file selected!');
    notifyFile.showNotify();
  }
};

document.getElementById('downloadText').onchange = function(e) {
  const file = e.target.value;

  if (file) {
    enableElement('downloadButton', 'button button--enabled');
    const notifyDownload = new Notification(INFO, `You can download the file ${file}!`);
    notifyDownload.showNotify();
  } else {
    disableElement('downloadButton', 'button button--disabled');
    const notifyDownload = new Notification(WARNING, 'There is not file for download!');
    notifyDownload.showNotify();
  }
};