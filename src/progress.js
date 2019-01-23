/* eslint-disable no-undef */
// document.getElementById('uploadForm').onsubmit = function(e) {
//   e.preventDefault();
//   const form = new FormData();
//   const myHeaders = new Headers();
//   myHeaders.append('Content-Type', 'multipart/form-data');
//   form.append('sampleFile', e.target.sampleFile.files[0]);
//   fetch('http://localhost:8000/upload', {
//     method: 'POST',
//     body: form
//   });
// };


// const reuest = new HttpRequest({
//   baseUrl: 'http://localhost:8000',
// });

// reuest.get('/ping')
//   .then(response => {
//     console.log(response);
//   })
//   .catch(e => {
//     console.log(e)
//   });