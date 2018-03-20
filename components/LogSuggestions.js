import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
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
  Input,
  Item
} from 'native-base';

export default class LogSuggestions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      topkeys,
      selectedLogs,
      logsets,
      submitQuery,
    } = this.props;

    if (!selectedLogs.some(logId => topkeys[logId] && topkeys[logId].length)) {
      return null;
    }

    return (
      <Card>
        <CardItem>
          <ScrollView>
            <Body style={{ alignItems: 'center', flexDirection: 'row' }}>
              {(() => {
                return selectedLogs.map(logId => {
                  if (!topkeys[logId]) {
                    return;
                  }

                  return topkeys[logId].map(topkey => (
                    <Button
                      small
                      rounded
                      key={topkey.key}
                      onPress={() => submitQuery(`groupby(${topkey.key})`)}
                    >
                      <Text>{((keyName) => {
                        if (keyName.startsWith('json.')) {
                          return keyName.substring(5);
                        }

                        return keyName;
                      })(topkey.key)}</Text>  
                    </Button>
                  ));
                })
              })()}
            </Body>
          </ScrollView>  
        </CardItem>
      </Card>
    );
  }
}