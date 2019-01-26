const uploadBar = document.getElementById('uploadProgress-bar');
const downloadBar = document.getElementById('downloadProgress-bar');

function onUploadProgress(event, isFinished) {
  const percentage = Math.round(event.loaded / event.total * 100);
  uploadBar.style.width = `${percentage}%`;

  if (!isFinished) {
    uploadBar.innerHTML = `${percentage}%`;
  } else {
    uploadBar.innerHTML = 'Success!';
    uploadBar.style.backgroundColor = '#38d160';
  }
}

function onDownloadProgress(event, isFinished) {
  const percentage = Math.round(event.loaded / event.total * 100);
  downloadBar.style.width = `${percentage}%`;

  if (isFinished) {
    downloadBar.style.backgroundColor = '#38d160';
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
  xhr.post('/upload', { onUploadProgress, data: form });
};

document.getElementById('downloadForm').onsubmit = function(e) {
  e.preventDefault();

  // eslint-disable-next-line no-undef
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  xhr.get(`/files/${e.target[0].value}`, { responseType: 'arraybuffer', onDownloadProgress })
    .then(data => {
      const imageURL = window.URL.createObjectURL(new Blob([new Uint8Array(data)], { type: 'image/jpeg' }));
      document.getElementById('myImage').src = imageURL;
    });
};