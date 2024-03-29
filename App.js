import { StatusBar } from "expo-status-bar";

import { StyleSheet } from "react-native";

import TensorCamera from "./src/TensorCamera";

import Home from "./src/Home";

import Emotion from "./src/Emotion";
import Face from "./src/Face";

// export default function App() {
//   return (
//     <View style={{ flex: 1 }}>
//       <Text>hello</Text>
//       <Face />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>hello</Text>
      <Face />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Lets Train!</Text>
      <Home />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
