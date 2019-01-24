// responseType: const [arraybuffer, blob, document, json, text, stream]
// responseType: 'json', // default
// requestURL.toString(); // http://localhost:8000/user/12345?ID=12345&name=Den&surname=Derkach&age=21

const [GET, POST] = ['GET', 'POST'];

function setHeaders(xhr, headers) {
  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }
}

function generateURL(constructorURL, methodURL, parameters) {
  const url = new URL(constructorURL + methodURL);

  for (const key in parameters) {
    url.searchParams.set(key, parameters[key]);
  }

  return url;
}

class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  get(url, config) {
    const { transformResponse, headers, params, responseType = 'text' } = config;
    const requestURL = generateURL(this.baseUrl, url, params);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(GET, requestURL);
      xhr.responseType = responseType;

      setHeaders(xhr, this.headers);
      setHeaders(xhr, headers);

      xhr.send();
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(transformResponse(xhr.responseText));
        } else {
          reject(xhr.status);
        }
      };
    });
  }

  post(url, config) {
    const { transformResponse, headers, params, data, responseType = 'text' } = config;
    const requestURL = generateURL(this.baseUrl, url, params);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(POST, requestURL);
      xhr.responseType = responseType;

      setHeaders(xhr, this.headers);
      setHeaders(xhr, headers);

      xhr.send(data);

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(transformResponse(xhr.responseText));
        } else {
          reject(xhr.status);
        }
      };
    });
  }
}

// const request = new HttpRequest({
//   baseUrl: 'http://localhost:8000'
// });

// function onDownloadProgress() {
//   console.log('LOADING...');
// }

// request.get('/user/12345', { onDownloadProgress, headers: { contentType: undefined } })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(e => {
//     console.log(e)
//   });

/*
request.post('/save', { data: formdata, header, onUploadProgress })
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
