import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import {
  List,
  ListItem,
  Text,
  Container,
  Content
} from 'native-base';

export default class Overview extends Component {
  static navigationOptions = {
    title: 'Overview',
  }

  render() {
    const {
      navigation: {
        navigate,
        state: {
          params: {
            auth,
            logsets,
          },
        },
      },
    } = this.props;

    return (
      <List style={{ backgroundColor: 'white' }}>
        <ListItem
          onPress={() => navigate('Logs', {
            auth,
            logsets,
          })}
        >
          <Text>{logsets.length} log sets</Text>
        </ListItem>
        <ListItem
          onPress={() => navigate('Dashboards', {
            auth,
          })}
        >
          <Text>Dashboards</Text>
        </ListItem>
      </List>
    );
  }
}