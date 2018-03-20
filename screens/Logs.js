import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Body,
  Text,
  Title,
  Subtitle,
  Left,
  Icon,
  Button,
  Card,
  CardItem,
  List
} from 'native-base';
import LogSelector from '../components/LogSelector';
import LogQuery from '../components/LogQuery';
import LogSuggestions from '../components/LogSuggestions';
import LogEntry from '../components/LogEntry';
import StatisticsRow from '../components/StatisticsRow';
import Loading from '../components/Loading';
import StatisticsCountChart from '../components/StatisticsCountChart';
import Query from '../utils/Query';
import restRequest from '../utils/restRequest';

export default class Logs extends Component {
  static navigationOptions = {
    title: 'Logs',
  }

  constructor(props) {
    super(props);

    const {
      navigation: {
        state: {
          params: {
            logsets,
          },
        },
      },
    } = this.props;

    this.state = {
      logsets,
      selectedLogs: [],
      showLogSelector: false,
      loading: false,
      status: null,
      queryFailed: false,
      logEntries: [],
      progress: null,
      topkeys: {},
      query: '',
    }
  }

  getAuth = () => {
    const {
      navigation: {
        state: {
          params: {
            auth,
          },
        },
      },
    } = this.props;

    return auth;
  }

  submitQuery = (query) => {
    console.log('sq', query);
    this.setState({ query });
    this.startQuery(query);
  }

  startQuery = (query = '', timeRange = 'Last 20 Minutes') => {
    const {
      selectedLogs
    } = this.state;
    const auth = this.getAuth();

    this.setState({
      loading: true,
      status: 'Running query...',
      queryFailed: false,
      query,
    });

    const q = new Query(auth, selectedLogs, query, timeRange);
    q.onPoll = (progress) => this.setState({ progress });
    return q.run().then(
      result => this.setState({
        logEntries: result.events,
        statistics: result.statistics,
        loading: false,
        status: null,
        queryFailed: false,
        progress: null,
      })
    ).catch(
      () => this.setState({
        loading: false,
        status: null,
        queryFailed: true,
      })
    );
  }

  loadSuggestions = () => {
    const {
      selectedLogs,
    } = this.state;
    const auth = this.getAuth();

    return selectedLogs.forEach(
      logId => restRequest(restRequest.METHOD_GET, `/management/logs/${logId}/topkeys`, auth)
        .then(
          response => response.json()
        ).then(
          response => this.setState({
            topkeys: {
              ...this.state.topkeys,
              [logId]: response.topkeys,
            }
          })
        ).catch(
          error => console.error(error)
        )
    );
  }

  getAuth() {
    const {
      navigation: {
        state: {
          params: {
            auth,
          },
        },
      },
    } = this.props;

    return auth;
  }

  renderStatisticsStats() {
    const {
      logsets,
      selectedLogs,
      showLogSelector,
      loading,
      status,
      progress,
      queryFailed,
      logEntries,
      topkeys,
      query,
      statistics,
    } = this.state;

    console.log('renderStatisticsStats', statistics);

    if (!statistics.stats || !statistics.stats.global_timeseries) {
      return (
        <Card>
          <CardItem style={{ backgroundColor: 'red' }}>
            <Body>
              <Text>No renderable statistics data found</Text>
            </Body>
          </CardItem>
        </Card>
      );
    }

    return Object.keys(statistics.stats.global_timeseries).map(func => (
      <Card key={`global_timeseries:${func}`} style={{ alignItems: 'center' }}>
        <CardItem style={{ paddingBottom: 0, marginBottom: 0 }}>
          <Text
            style={{
              fontSize: 28,
              color: '#080',
              textAlign: 'center',
            }}
          >{func.toUpperCase()}</Text>
        </CardItem>
        <CardItem>
          <Text
            style={{
              fontSize: 96,
              textAlign: 'center',
            }}
          >{statistics.stats.global_timeseries[func]}</Text>
        </CardItem>
      </Card>
    ));
  }

  renderStatistics() {
    const {
      logsets,
      selectedLogs,
      showLogSelector,
      loading,
      status,
      progress,
      queryFailed,
      logEntries,
      topkeys,
      query,
      statistics,
    } = this.state;

    console.log('renderStatistics', statistics);

    if (!statistics.groups || statistics.groups.length === 0) {
      if (statistics.stats && Object.keys(statistics.stats).length) {
        return this.renderStatisticsStats();
      }

      return (
        <Card>
          <CardItem style={{ backgroundColor: 'red' }}>
            <Body>
              <Text>No groups found</Text>
            </Body>
          </CardItem>
        </Card>
      );
    }

    return [
      <StatisticsCountChart
        key="statisticsChart"
        groups={statistics.groups}
      />,
      statistics.groups.map(
        group => Object.keys(group).map(value => (
          <StatisticsRow
            key={value}
            submitQuery={query => this.submitQuery(query)}
            kvpKey={/groupby\(([^\)]+)\)/.exec(query)[1]}
            value={value}
            {...group[value]}
          />
        ))
      ),
    ]
  }

  render() {
    const {
      logsets,
      selectedLogs,
      showLogSelector,
      loading,
      status,
      progress,
      queryFailed,
      logEntries,
      topkeys,
      query,
      statistics,
    } = this.state;
    const auth = this.getAuth();

    if (showLogSelector) {
      return (
        <LogSelector
          logsets={logsets}
          selectedLogs={selectedLogs}
          onClose={
            selectedLogs => this.setState({
              showLogSelector: false,
              selectedLogs,
            }, () => {
              this.startQuery();
              this.loadSuggestions();
            })
          }
        />  
      );
    }

    return (
      <Container>
        <TouchableOpacity
          onPress={() => this.setState({ showLogSelector: true })}
        >  
          <Header
            androidStatusBarColor="#212933"  
            style={{ backgroundColor: '#212933' }}
          >
            <Left>
              <Icon ios="ios-list" android="md-list" style={{ color: 'white' }} />
            </Left>
            <Body>
              <Title>{selectedLogs.length} logs selected</Title>
              <Subtitle>Tap to change selection</Subtitle>
            </Body>
          </Header>
        </TouchableOpacity>  
        <Content>
          <LogQuery
            onSubmitQuery={this.startQuery}
            query={query}
            topkeys={topkeys}
          />
          <LogSuggestions
            selectedLogs={selectedLogs}
            logsets={logsets}
            topkeys={topkeys}
            submitQuery={query => this.submitQuery(query)}
          />
          {(
            () => {
              if (loading) {
                return (
                  <Loading
                    loading={loading}
                    status={progress ? `${progress}%` : status}
                  />
                );
              }

              if (queryFailed) {
                return (
                  <Card>
                    <CardItem style={{ backgroundColor: 'red' }}>
                      <Body>
                        <Text>Query failed</Text>
                      </Body>
                    </CardItem>
                  </Card>
                );
              }
              
              if (!logEntries) {
                if (statistics) {
                  return this.renderStatistics();
                }

                return null;
              }

              if (selectedLogs.length !== 0 && logEntries.length === 0) {
                return (
                  <Card>
                    <CardItem style={{ backgroundColor: 'red' }}>
                      <Body>
                        <Text>Query returned no results</Text>
                      </Body>
                    </CardItem>
                  </Card>
                );
              }

              const logs = logsets.reduce(
                (logs, logset) => {
                  logs.push(...logset.logs_info.map(
                    log => ({
                      ...log,
                      logset: {
                        ...logset,
                        logs_info: null,
                      }
                    })
                  ));

                  return logs;
                },
                [],
              );

              return (logEntries || []).map(
                entry => <LogEntry
                  {...entry}
                  logs={logs}
                  selectedLogs={selectedLogs}
                  key={entry.sequence_number}
                />
              );
            }
          )()}
        </Content>
      </Container>
    );
  }
}