class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  static generateURL(baseURLobject, urlString, parameters) {
    const url = new URL(urlString, baseURLobject);

    for (const key in parameters) {
      url.searchParams.set(key, parameters[key]);
    }

    return url;
  }

  __request(method, url, config) {
    const {
      headers,
      params,
      data = null,
      responseType = 'json',
      onDownloadProgress = null,
      onUploadProgress = null,
      transformResponse
    } = config;

    const requestURL = HttpRequest.generateURL(this.baseUrl, url, params);
    const xhrHeaders = { ...this.headers, ...headers };
    const xhr = new XMLHttpRequest();
    xhr.open(method, requestURL);
    xhr.responseType = responseType;
    xhr.onprogress = onDownloadProgress;
    xhr.upload.onprogress = onUploadProgress;

    Object.entries(xhrHeaders).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          let { response } = xhr;

          if (transformResponse) {
            response = transformResponse.reduce((acc, f) => f(acc), response);
          }

          return resolve(response);
        }

        reject(xhr);
      };

      xhr.send(data);
    });
  }

  get(url, config) {
    return this.__request('GET', url, config);
  }

  post(url, config) {
    return this.__request('POST', url, config);
  }
}
