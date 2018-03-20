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
  List,
  ListItem,
  CheckBox,
} from 'native-base';
import Touchable from 'react-native-platform-touchable';

export default class LogSelector extends Component {
  constructor(props) {
    super(props);

    const {
      selectedLogs,
    } = this.props;

    this.state = {
      pendingSelection: [...selectedLogs],
    }
  }

  toggleSelected = (logId) => {
    const {
      pendingSelection,
    } = this.state;

    if (pendingSelection.includes(logId)) {
      pendingSelection.splice(pendingSelection.indexOf(logId), 1);
    } else {
      pendingSelection.push(logId);
    }

    return this.setState({ pendingSelection });
  }

  render() {
    const {
      logsets,
      selectedLogs,
      onClose,
    } = this.props;
    const {
      pendingSelection,
    } = this.state;

    return (
      <Container>
        <TouchableOpacity
          onPress={() => onClose(pendingSelection)}
        >
          <Header
            androidStatusBarColor="#212933"
            style={{ backgroundColor: '#212933' }}
          >
            <Left>
              <Button
                transparent
                onPress={() => onClose(pendingSelection)}
              >
                <Icon ios="ios-close" android="md-close" style={{ color: 'white' }} />
              </Button>
            </Left>
            <Body>
              <Title>{pendingSelection.length} logs selected</Title>
              <Subtitle>Tap to apply selection</Subtitle>
            </Body>
          </Header>
        </TouchableOpacity>  
        <Content>
          <List style={{ backgroundColor: 'white' }}>
            {logsets.map(this.renderLogset)}
          </List>
        </Content>
      </Container>
    );
  }

  renderLogset = (logset) => {
    const {
      pendingSelection,
    } = this.state;
    const {
      name,
      logs_info: logs,
    } = logset;

    return [
      <ListItem itemDivider>
        <Text>{name}</Text>  
      </ListItem>,
      ...logs.map(
        ({ id, name }) => (
          <ListItem
            onPress={() => this.toggleSelected(id)}  
          >
            <CheckBox checked={pendingSelection.includes(id)} />
            <Body>
              <Text>{name}</Text>
            </Body>
          </ListItem>
        )
      ),
    ]
  }
}