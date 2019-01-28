const uploadBar = document.getElementById('uploadProgress-bar');
const downloadBar = document.getElementById('downloadProgress-bar');
const downloadButton = document.getElementById('downloadButton');
const isImageFormat = function(data) {
  return data.includes('image');
};

function showImage(data, imageType, fileName) {
  const imageURL = URL.createObjectURL(data, { type: imageType });
  const image = document.getElementById('myImage');
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
    .then(data => showFilesList(data));
}

function showFilesList(files) {
  const container = document.getElementById('filesCintainer');
  container.innerHTML = '';
  container.style.textAlign = 'left';
  const list = document.createElement('ul');
  list.className = 'filesList__container';

  for (const key in files) {
    const item = document.createElement('li');
    item.innerHTML = `${files[key]}`;
    list.appendChild(item);
  }
  container.appendChild(list);
}

function onUploadProgress(event, isFinished) {
  const percentage = Math.round(event.loaded / event.total * 100);
  uploadBar.style.width = `${percentage}%`;

  if (!isFinished) {
    uploadBar.innerHTML = `${percentage}%`;
  } else {
    uploadBar.innerHTML = 'Success!';
    uploadBar.style.backgroundImage = 'linear-gradient(90deg, #5e29b7 0%, #38d160 100%)';
  }
}

function onDownloadProgress(event, isFinished) {
  const percentage = Math.round(event.loaded / event.total * 100);
  downloadBar.style.width = `${percentage}%`;

  if (isFinished) {
    downloadBar.style.backgroundImage = 'linear-gradient(90deg, #5e29b7 0%, #38d160 100%)';
  }
}

function resetProgressBar(bar, backgroundColor) {
  bar.style.width = '0%';
  bar.innerHTML = '';
  bar.style.backgroundColor = backgroundColor;
  bar.style.backgroundImage = 'none';
}

function enableElement(elementID, style) {
  const element = document.getElementById(elementID);
  element.disabled = false;

  if (style) {
    element.className = style;
  }
}

document.getElementById('uploadForm').onchange = function() {
  resetProgressBar(uploadBar, '#5e29b7');
  enableElement('upload__button', 'button button--enabled');
};

document.getElementById('downloadForm').onchange = function() {
  resetProgressBar(downloadBar, '#5e29b7');
  enableElement('downloadButton', 'button button--enabled');
};

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const file = e.target.sampleFile.files[0];
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', file);
  // eslint-disable-next-line no-undef
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  xhr.post('/upload', { responseType: 'blob', onUploadProgress, data: form })
    .then(() => {
      enableElement('downloadText');
      createRequestForList();
    });
};

document.getElementById('downloadForm').onsubmit = function(e) {
  e.preventDefault();

  // eslint-disable-next-line no-undef
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  xhr.get(`/files/${e.target[0].value}`, { responseType: 'blob', onDownloadProgress })
    .then(data => {
      const dataType = data.type;

      if (isImageFormat(dataType)) {
        showImage(data, dataType);
      } else {
        downloadFile(data, dataType);
      }
    });
};

document.getElementById('download').onchange = function(e) {
  document.querySelector('.download-content').innerHTML = e.target.value.replace(/.*\\/, '');
};