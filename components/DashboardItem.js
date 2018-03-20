import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Promise from 'bluebird';
import Chart from './Chart';
import Loading from './Loading';
import dashboardRequest from '../utils/dashboardRequest';

export default class DashboardItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      progress: 0,
    };
  }

  componentWillMount() {
    const {
      queries,
      interval,
      logSets,
      auth,
    } = this.props;

    const promises = [];

    queries.forEach(statement => {
      const to = new Date().getTime();
      const from = to - interval;
      const logs = Object.values(logSets).reduce((arr, logs) => arr.concat(logs), []);
      const body = {
        leql: {
          during: {
            from,
            to,
          },
          statement
        },
        logs
      };

      console.log('Starting query', body);

      promises.push(
        dashboardRequest(dashboardRequest.METHOD_POST, '/query/logs', auth, JSON.stringify(body)).then(
          this.poll
        )
      );
    });

    Promise.all(promises).then(
      data => this.setState({
        data,
        loading: false,
      })
    ).catch (
      console.error
    );
  }

  poll = response => {
    const {
      auth,
    } = this.props;
    console.log('res', response);

    return response.json().then(
      response => {
        const {
          progress,
          links,
          leql,
          statistics,
        } = response;

        console.log('Polling query', leql.statement, response);

        if (progress !== undefined && !statistics) {
          this.setState({ progress });
          const continuationLink = links.filter(link => link.rel === 'Self')[0].href;

          return Promise.delay(2000).then(
            () => dashboardRequest(dashboardRequest.METHOD_GET, continuationLink, auth)
          ).then(
            this.poll
          );
        }

        console.log('Query finished', response);

        return response;
      }
    );
  }

  render() {
    const {
      name,
    } = this.props;
    const {
      loading,
      progress,
      data,
    } = this.state;

    return (
      <View>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>{name}</Text>
        {loading ? (
          <Loading {...{ loading }} />
        ) : (
          <Chart data={data} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
