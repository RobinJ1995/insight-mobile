/*
 * "TEMPORARY" WORKAROUND
 * **********************
 * This should just work via the REST API, only it's been broken for the past few months...
 */

import { REST_ENDPOINT } from '../config';

const dashboardRequest = (method, url, auth, body, data = {}) => {
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
        'X-API-KEY': '<PUT-YOUR-API-KEY-HERE>',
        ...data.headers,
      },
      body,
    },
  })
};
dashboardRequest.METHOD_GET = 'GET';
dashboardRequest.METHOD_POST = 'POST';
dashboardRequest.METHOD_PUT = 'PUT';
dashboardRequest.METHOD_PATCH = 'PATCH';
dashboardRequest.METHOD_DELETE = 'DELETE';

export default dashboardRequest;