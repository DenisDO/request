const uploadBar = document.getElementById('uploadProgress-bar');
const downloadBar = document.getElementById('downloadProgress-bar');
const isImageFormat = function(data) {
  return data.includes('image');
};

function showImage(data, imageType, fileName) {
  const imageURL = window.URL.createObjectURL(data, { type: imageType });
  const image = document.getElementById('myImage');
  image.src = imageURL;
  image.alt = fileName;
}

function downloadFile(data, fileType) {
  const downloadElement = document.createElement('a');
  downloadElement.style.display = 'none';
  document.body.appendChild(downloadElement);
  const downloadURL = window.URL.createObjectURL(data, { type: fileType });
  downloadElement.href = downloadURL;
  // element.download = filename;
  downloadElement.target = '_blank';
  downloadElement.click();
  document.body.removeChild(downloadElement);
}

function showFilesList(files) {
  const container = document.getElementById('filesCintainer');
  const button = document.getElementById('listButton');
  container.removeChild(button);
  const list = document.createElement('ul');
  list.className = 'filesList__container';

  for (const key in files) {
    const item = document.createElement('li');
    item.innerHTML = `${files[key]}`;
    list.appendChild(item);
  }
  container.style.textAlign = 'left';
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

document.getElementById('uploadForm').onsubmit = function(e) {
  e.preventDefault();
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);

  // eslint-disable-next-line no-undef
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  xhr.post('/upload', { responseType: 'blob', onUploadProgress, data: form });
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

document.getElementById('listButton').onclick = function(e) {
  // eslint-disable-next-line no-undef
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  xhr.get('/list', { responseType: 'json' })
    .then(data => showFilesList(data));
};