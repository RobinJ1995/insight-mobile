import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import Promise from 'bluebird';
import { NavigationActions } from 'react-navigation';
import Login from '../components/Login';
import DashboardList from '../components/DashboardList';
import Loading from '../components/Loading';
import restRequest from '../utils/restRequest';

export default class Authentication extends Component {
  static navigationOptions = {
    title: 'Authentication',
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      status: null,
      auth: null,
    };
  }

  componentWillMount = () => this.tryAuthenticate();

  tryAuthenticate = (auth) => {
    const {
      navigation: {
        navigate,
        dispatch,
      },
    } = this.props;

    this.setState({
      loading: true,
      status: 'Authenticating...',
    });

    // auth = {
    //   apiKey: '4f462a7d-61b9-49b2-ba11-8bb1f6ab524c',
    //   headers: {
    //     'X-API-KEY': '4f462a7d-61b9-49b2-ba11-8bb1f6ab524c',
    //   },
    // };

    return (auth ? Promise.resolve(auth) : AsyncStorage.getItem('auth').then(
      auth => JSON.parse(auth)
    )).then(
      auth => {
        if (!auth) {
          throw new Error('No saved credentials found');
        }

        this.setState({ auth });

        return restRequest(restRequest.METHOD_GET, '/management/logsets', auth);
      }  
    ).then(
      response => {
        if (response.status !== 200) {
          throw new Error('Authentication failure');
        }

        return response.json();
      }
    ).then(
      ({ logsets }) => this.setState({
        logsets,
        loading: false,
        status: null,
      })
    ).then(
      () => dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Overview',
            params: {
              auth: this.state.auth,
              logsets: this.state.logsets,
            },
          }),
        ],
      }))
    ).catch(
      () => {
        AsyncStorage.removeItem('auth');
        this.setState({
          auth: null,
          loading: false,
          status: null,
        });
      }
    );
  }

  onLogin = (productToken, ipimsSession, apiKey) => {
    const auth = {
      productToken,
      ipimsSession,
      apiKey,
      headers: {
        ...(apiKey ? {
          'X-API-KEY': apiKey,
        } : {
          'X-ORGPRODUCT-TOKEN': productToken,
          'Cookie': `IPIMS_SESSION=${ipimsSession}`,
        }),
      }
    };
    this.setState({ auth });

    console.log('Credentials found', auth);

    return AsyncStorage.setItem('auth', JSON.stringify(auth)).then(
      () => this.tryAuthenticate(auth)
    );
  }

  render() {
    const {
      loading,
      status,
      auth,
    } = this.state;

    console.log(this.state);

    if (loading) {
      return <Loading {...{ loading, status }} />;
    }

    if (!auth) {
      return (
        <View style={styles.container}>
          <Login
            onLogin={this.onLogin}
          />
        </View>  
      );
    }

    return <Text>Authentication succesful</Text>;
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
