import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Clipboard
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Body,
  Text,
  ListItem,
  Card,
  CardItem
} from 'native-base';
import Touchable from 'react-native-platform-touchable';

export default class LogEntry extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      timestamp,
      log_id,
      message,
      logs,
      selectedLogs,
    } = this.props;

    const date = new Date(timestamp);
    const log = logs.find(({ id }) => id === log_id);

    return (
      <Card>
        <CardItem style={{ paddingBottom: 0 }}>
          <Text
            style={{
              fontSize: 10,
              color: '#7a858d',
            }}
          >
            {date.toLocaleString()}
          </Text>
        </CardItem>
        <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Touchable
            onPress={() => Clipboard.setString(`${date.toLocaleString()} ${message}`)}
          >
            <Text
              style={{ fontFamily: 'monospace' }}
            >
              {message}
            </Text>
          </Touchable>
        </CardItem>
        {selectedLogs.length !== 1 && (
          <CardItem style={{ paddingTop: 0 }}>
            <Text
              style={{
                fontSize: 10,
                color: '#080',
              }}
            >
              {log.logset.name}/{log.name}
            </Text>
          </CardItem>
        )}
      </Card>
    );
  }
}