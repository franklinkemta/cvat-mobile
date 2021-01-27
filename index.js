/**
 * @format
 */

import 'react-native-gesture-handler'; // gesture hanlder
import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
export default App;
