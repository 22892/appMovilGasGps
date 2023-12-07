
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler'


const App = () => {

  return (
    <NavigationContainer>

      <Navigation/> 
      <Toast />
    
    </NavigationContainer>
  );
};


export default App;
