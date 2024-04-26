import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigator from './Frontend/navigation/RootNavigator';
import { UserContextProvider } from './Backend/UserContext';

const Stack = createStackNavigator();

const App = () => {
  return (

        <RootNavigator />
  
  );
};

export default App;
