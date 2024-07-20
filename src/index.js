import {StyleSheet, StatusBar, LogBox} from 'react-native';
import React, {useEffect} from 'react';
import StackNavigator from './Navigation/StackNavigation';
import {PaperProvider} from 'react-native-paper';
import Notification from './components/Notification';

const index = () => {
  // StatusBar.setHidden(true);

  console.disableYellowBox = true;

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  LogBox.ignoreLogs(['Warning: ...']);

  return (
    <PaperProvider>
      <StackNavigator />
      <Notification />
    </PaperProvider>
  );
};

export default index;

const styles = StyleSheet.create({});
