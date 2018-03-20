import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  WebView,
  ActivityIndicator
} from 'react-native';
import CookieManager from 'react-native-cookies';
import Promise from 'bluebird';
import { INSIGHT_LOGIN_URL } from '../config';
import restRequest from '../utils/restRequest';
import Loading from '../components/Loading';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      status: null,
    };
  }

  getSession = (navState) => {
    if (matches = navState.url.match(/^https\:\/\/([^\.\/]+)\.([^\.\/]+)\.insight\.rapid7\.com\/([^\.\/]+)\/([^\.\/]+)/)) {
      const [
        url,
        region,
        product,
        product2,
        productToken,
      ] = matches;

      console.log({ region, product, product2, productToken });

      if (product !== 'ops') {
        return this.setState({ error: 'Not an InsightOps account' });
      }

      this.setState({
        loading: true,
        status: 'Getting IPIMS session...',
      });

      Promise.delay(1600).then(() => CookieManager.get(url)).then(
        cookie => {
          if (!cookie.IPIMS_SESSION) {
            return this.setState({
              loading: false,
              error: 'Could not find IPIMS session',
            });
          }

          console.log('IPIMS session', cookie.IPIMS_SESSION);

          return this.getApiKey(productToken, cookie.IPIMS_SESSION);
        }
      );
    }
  }

  getApiKey = (productToken, ipimsSession) => {
    const {
      onLogin,
    } = this.props;

    this.setState({
      loading: true,
      status: 'Attempting to get an API key...',
    });

    return Promise.delay(800).then(() => restRequest(restRequest.METHOD_GET, '/management/accounts/00000000-0000-0000-0000-000000000000/apikeys', null, null, {
      headers: {
        'X-ORGPRODUCT-TOKEN': productToken,
        'Cookie': `IPIMS_SESSION=${ipimsSession}`,
      },
    })).then(
      response => response.json()
    ).then(
      response => {
        const apiKey = (response.apikeys || []).find(apiKey => apiKey.api_key).api_key;

        return onLogin(productToken, ipimsSession, apiKey);
      }
    ).catch(() => onLogin(productToken, ipimsSession));
  }

  render() {
    const {
      error,
      loading,
      status,
    } = this.state;

    return (
      <View style={{
        flex: 1,
        backgroundColor: (loading || error) ? 'white' : 'rgb(65, 77, 88)',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        {loading && (
          <Loading
            status={status}
          />
        )}  
        {!error && !loading && (<WebView
          style={{ width: 320 }}
          source={{ uri: INSIGHT_LOGIN_URL }}
          onNavigationStateChange={this.getSession}
        />)}
        {error && (
          <Text style={{ color: 'white', backgroundColor: 'red' }}>
            {error}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
