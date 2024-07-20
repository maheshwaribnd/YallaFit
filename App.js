import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Index from './src/index';
import { Provider } from 'react-redux';
import myStore from './src/Redux/Store/store';

const App = () => {
  return (
    <Provider store={myStore}>
      <Index />
    </Provider>
  )
};

export default App;

const styles = StyleSheet.create({});
