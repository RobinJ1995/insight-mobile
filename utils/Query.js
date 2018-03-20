import Promise from 'bluebird';
import restRequest from './restRequest';

export default class Query {
  constructor(auth, logs, query = '', timeRange = 'Last 20 Minutes') {
    this.auth = auth;
    this.logs = logs;
    this.query = query;
    this.timeRange = timeRange;
  }

  run = () => {
    return this._startQuery();
  }

  _startQuery = () => {
    const paramLogs = this.logs.join(':');

    const paginate = !!(!this.query.includes('groupby(') && !this.query.includes('calculate('));
    const paramPaginate = paginate ? '&per_page=100' : '';

    return restRequest(restRequest.METHOD_GET, `/query/logs/${paramLogs}?time_range=${this.timeRange}&query=${this.query}&kvp_info=false${paramPaginate}`, this.auth).then(
      this._pollQuery
    );
  }

  _pollQuery = response => {
    console.log(response);
    return response.json().then(
      response => {
        const {
          progress,
          links,
          leql,
        } = response;

        console.log('Polling query', leql.statement, response);

        if (this.onPoll) {
          this.onPoll(progress);
        }

        if (progress !== undefined) {
          const continuationLink = links.filter(link => link.rel === 'Self')[0].href;

          return Promise.delay(2000).then(
            () => restRequest(restRequest.METHOD_GET, continuationLink, this.auth)
          ).then(
            this._pollQuery
          );
        }

        console.log('Query finished', response);

        return response;
      }
    );
  }
}