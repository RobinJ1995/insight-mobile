import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Button
} from 'react-native';
import Dashboard from './Dashboard';
import Loading from './Loading';
import dashboardRequest from '../utils/dashboardRequest';

export default class DashboardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      status: null,
      loadingDashboardsFailed: false,
      dashboards: [],
    };
  }

  componentWillMount = () => this.loadDashboards()

  loadDashboards = () => {
    const {
      auth,
    } = this.props;

    this.setState({
      loading: true,
      status: 'Fetching dashboards...',
    });

    return dashboardRequest(dashboardRequest.METHOD_GET, '/management/dashboards/decks?type=DASHBOARD', auth).then(
      response => response.json()
    ).then(
      dashboards => this.setState({
        loading: false,
        status: null,
        dashboards,
      })
    ).catch((e) => {
      console.error(e);
      this.setState({
        loading: false,
        status: null,
        loadingDashboardsFailed: true,
      })
    });
  }

  render() {
    const {
      auth,
    } = this.props;
    const {
      loading,
      status,
      loadingDashboardsFailed,
      dashboards,
    } = this.state;

    if (loadingDashboardsFailed) {
      return (
        <View>
          <Text>Dashboards failed to load.</Text>
          <Button
            title="Retry"
            onPress={() => this.loadDashboards()}
          />
        </View>
      );
    }

    if (loading) {
      return <Loading {...{ loading, status }} />;
    }

    if (dashboards.length === 0) {
      return (
        <View>
          <Text>Your account does not appear to contain any dashboards.</Text>
          <Text>Log in to the Insight Platform to manage your dashboards.</Text>
          <Button
            title="Go to Insight Platform"
            onPress={() => Linking.openURL('https://insight.rapid7.com/login')}
          />
        </View>
      );
    }

    return (
      <ScrollView>
        {dashboards.map(dashboard => <Dashboard key={dashboard.name} auth={auth} {...dashboard} />)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
});
