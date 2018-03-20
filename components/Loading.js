import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

export default class Loading extends Component {
  render() {
    const {
      loading,
      status,
    } = this.props;

    if (loading === false) {
      return null;
    }

    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size={Platform.OS === 'ios' ? 'large' : 120}
        />
        <Text style={{ fontSize: 28, textAlign: 'center' }}>{status}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
