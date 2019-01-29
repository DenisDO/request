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