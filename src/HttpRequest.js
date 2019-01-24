// responseType: const [arraybuffer, blob, document, json, text, stream]
// responseType: 'json', // default
// requestURL.toString(); // http://localhost:3000/user/12345?ID=12345&name=Den&surname=Derkach&age=21

const [GET, POST] = ['GET', 'POST'];

// const setHeaders = function(xhr, headers) {
//   for (const key in headers) {
//     xhr.setRequestHeader(key, headers[key]);
//   }
// };

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config) {
    const [transformResponse, headers, params, responseType = 'json'] = config;
    const requestURL = new URL(this.baseUrl + url);

    for (const key in params) {
      requestURL.searchParams.set(key, params[key]);
    }
    return new Promise(() => {
      const xhr = new XMLHttpRequest();
      xhr.open(GET, requestURL, false);
      xhr.responseType = responseType;

      for (const key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key]);
      }

      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }

      xhr.send();
    });
  }

  // post(url, config) {
  // // write code this
  // }
}

// const reuest = new HttpRequest({
//   baseUrl: 'http://localhost:3000',
//   headers: {
//     'Accept': 'text/plain',
//     'Cache-Control': 'no-cache',
//     'Transfer-Encoding': 'chunked'
//   }
// });

/*
reuest.get('/user/12345', { onDownloadProgress, headers: {contentType: undefined} })
.then(response => {
  console.log(response);
})
.catch(e => {
  console.log(e)
});

reuest.post('/save', { data: formdata, header, onUploadProgress })
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e)
  });

config = {

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer

  data: {
    firstName: 'Fred'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
}
*/
