const [GET, POST] = ['GET', 'POST'];

function setHeaders(xhr, headers) {
  for (const key in headers) {
    // eslint-disable-next-line no-prototype-builtins
    if (headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }
}

function generateURL(constructorURL, methodURL, parameters) {
  const url = new URL(constructorURL + methodURL);

  for (const key in parameters) {
    url.searchParams.set(key, parameters[key]);
  }

  return url;
}

function createRequest(elements) {
  const {
    xhr,
    transformResponse,
    data,
    resolve,
    reject,
    responseType
  } = elements;
  xhr.responseType = responseType;
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = transformResponse
        ? transformResponse.reduce((acc, f) => f(acc), xhr.response)
        : xhr.response;
      resolve(response);
    } else {
      reject(xhr);
    }
  };

  if (!data) {
    xhr.send();
  } else {
    xhr.send(data);
  }
}