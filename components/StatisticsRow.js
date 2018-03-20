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

export default class StatisticsRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      kvpKey,
      value,
      count,
      average,
      max,
      median,
      min,
      sum,
      unique,
      submitQuery,
    } = this.props;

    return (
      <Touchable
        key={value}
        onPress={() => submitQuery(`where(${kvpKey}="${value}")`)}
      >
        <Card>  
          <CardItem style={{ paddingTop: 2, paddingBottom: 0 }}>
            <Text
              style={{ fontFamily: 'monospace' }}
            >
              {value}
            </Text>
          </CardItem>
          <CardItem style={{ paddingTop: 0, flexDirection: 'row', paddingBottom: 2 }}>
            {['count', 'max', 'min', 'average'].map(
              func => ([
                <Text
                  key={`${value}:${func}:n`}
                  style={{
                    fontSize: 10,
                    color: '#080',
                    marginRight: 2,
                  }}
                >
                  {func.toUpperCase()}:
                </Text>,
                <Text
                  key={`${value}:${func}:v`}
                  style={{
                    fontSize: 10,
                    color: '#000',
                    marginRight: 4,
                    fontWeight: 'bold',
                  }}
                >
                  {this.props[func]}
                </Text>
              ])
            )}
          </CardItem>
        </Card>
      </Touchable>  
    );
  }
}