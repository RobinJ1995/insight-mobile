import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';
import DashboardList from '../components/DashboardList';

export default class Dashboards extends Component {
  static navigationOptions = {
    title: 'Dashboards',
  }

  render() {
    const {
      navigation: {
        state: {
          params: {
            auth,
          },
        },
      },
    } = this.props;

    return (
      <View style={styles.container}>
        <DashboardList
          auth={auth}
        />
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});