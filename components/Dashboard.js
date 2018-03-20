import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import DashboardItem from './DashboardItem';

export default class Dashboard extends Component {
  render() {
    const {
      name,
      cards,
      auth,
    } = this.props;

    return (
      <View>
        {cards.map(card => (
          <View style={styles.card} key={card.name}>
            <Text style={{fontSize: 22, textAlign: 'center'}}>{name}</Text>
            <DashboardItem
              auth={auth}
              {...card}
            />
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 400,
  },
});
