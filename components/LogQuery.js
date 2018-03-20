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
  Input,
  Item
} from 'native-base';

export default class LogQuery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.query) {
      this.setState({
        query: nextProps.query,
      });
    }
  }

  render() {
    const {
      onSubmitQuery,
    } = this.props;
    const {
      query,
    } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Query</Text>
        </CardItem>
        <CardItem>
          <Body style={{ alignItems: 'center' }}>
            <Item regular>
              <Input
                onChangeText={(query) => this.setState({ query })}
                value={query}
              />
            </Item>
            <Item>
              <Button
                onPress={() => onSubmitQuery(query)}
                style={{ marginTop: 2 }}
              >
                <Text>Submit query</Text>
              </Button>
            </Item>  
          </Body>
        </CardItem>
      </Card>
    );
  }
}