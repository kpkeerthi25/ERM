import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


import TensorCamera from './src/TensorCamera'

import Emotion from './src/Emotion'
import Face from './src/Face'


export default function App() {
  return (
     //<Emotion/>
     <View>
    
     <Face/>
     </View>
  //   <View>
  //     <Text>hello</Text>
  //     <Tfjs/>

  //   </View>
  //<MyComponent/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
