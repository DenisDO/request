const uploadBar = document.getElementById('uploadProgress-bar');

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

// function onDownloadProgress(event) {
//   console.warn('onDownloadProgress');
//   console.info(event.loaded, ' / ', event.total);
//   console.warn('onDownloadProgress');
// }

// document.getElementById('uploadForm').onsubmit = function(e) {
//   e.preventDefault();
//   const form = new FormData();
//   const myHeaders = new Headers();
//   myHeaders.append('Content-Type', 'multipart/form-data');
//   form.append('sampleFile', e.target.sampleFile.files[0]);
//   //   fetch('http://localhost:8000/upload', {
//   //     method: 'POST',
//   //     body: form
//   //   });

//   const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
//   xhr.post('/upload', { onUploadProgress, data: form });
// };

// document.getElementById('downloadForm').onsubmit = function(e) {
//   e.preventDefault();

//   const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
//   xhr.get('/files/basketball.png', { onDownloadProgress });
// };

// function transformResponse(text) {
//     console.log('transformResponse');
//     console.log(text + '\n_____________________________');
//     console.log('transformResponse');
// }

// function transformRequest() {
//     console.log('transformRequest');
// }

// const reuest = new HttpRequest({
//   baseUrl: 'http://localhost:8000'
// });

// reuest.get('/form', { transformResponse })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(e => {
//     console.log(e);
//   });