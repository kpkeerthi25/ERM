import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

import TensorCamera from "./TensorCamera";

const Face = (props) => {
  const [hasPermission, setHasPermission] = useState(null);

  const faceDetected = () => {
    console.log("faced");
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      //const {status2} = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Text>test</Text>

      <TensorCamera style={{ flex: 1 }}></TensorCamera>
    </View>
  );
};

export default Face;
