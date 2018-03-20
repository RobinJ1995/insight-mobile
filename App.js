import {
  StackNavigator,
} from 'react-navigation';
import Authentication from './screens/Authentication';
import Overview from './screens/Overview';
import Logs from './screens/Logs';
import Dashboards from './screens/Dashboards';

export default App = StackNavigator({
  Authentication: {
    screen: Authentication,
  },
  Overview: {
    screen: Overview,
  },
  Logs: {
    screen: Logs,
  },
  Dashboards: {
    screen: Dashboards,
  },
})