import { REST_ENDPOINT } from '../config';

const restRequest = (method, url, auth, body, data = {}) => {
  if (url.startsWith('/')) {
    url = `${REST_ENDPOINT}${url}`;
  }

  return fetch(url, {
    method,
    ...{
      ...data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(auth && auth.headers),
        ...data.headers,
      },
      body,
    },
  })
};
restRequest.METHOD_GET = 'GET';
restRequest.METHOD_POST = 'POST';
restRequest.METHOD_PUT = 'PUT';
restRequest.METHOD_PATCH = 'PATCH';
restRequest.METHOD_DELETE = 'DELETE';

export default restRequest;