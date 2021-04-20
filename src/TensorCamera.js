import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

import { View, Text, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import * as FaceDetector from "expo-face-detector";

import * as blazeface from "@tensorflow-models/blazeface";

const TensorCameraModule = cameraWithTensors(Camera);

import {
  bundleResourceIO,
  fetch,
  decodeJpeg,
} from "@tensorflow/tfjs-react-native";
import { ResizeBilinear, scalar } from "@tensorflow/tfjs";
const modelJson = require("../assets/fer-tfjs/model.json");
const modelWeights = require("../assets/fer-tfjs/group1-shard1of1.bin");
const modelJson1 = require("../assets/face/model.json");
const modelWeights1 = require("../assets/face/group1-shard1of1.bin");
let model = undefined;
let face_model = undefined;

const previewLeft = 40;
const previewTop = 20;
const previewWidth = 300;
const previewHeight = 400;
const scaleX = 1;
const scaleY = 1;

const TensorCamera = () => {
  const [faces, setFaces] = useState();
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [topLeft, setTopLeft] = useState();
  const [bottorRight, setBottomRight] = useState();
  const [emotion, setEmotion] = useState();
  const [percent, setPercent] = useState();

  const getEmotion = (id) => {
    names = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"];
    return names[id];
  };
  const loadBlazefaceModel = async () => {
    const model = await blazeface.load();
    return model;
  };

  useEffect(() => {
    (async () => {
      await tf.ready();

      fun();
      console.log("ready");
    })();
  }, []);

  //   const faceDetected = ({faces}) =>{
  //     if(faces.length){
  //       setIsFaceDetected(true)
  //       console.log(isFaceDetected)
  //     }
  //     else{
  //       setIsFaceDetected(false)
  //       console.log(isFaceDetected)
  //     }
  //     //console.log(faces[0])
  // }

  const fun = async (tensor) => {
    face_model = await loadBlazefaceModel();
    model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));

    //face_model = await tf.loadLayersModel(bundleResourceIO(modelJson1,modelWeights1));
  };

  const handleCameraStream = async (images, updatePreview, gl) => {
    const loop = async () => {
      const nextImageTensor = images.next().value;

      //const nextImageTensor = tf.div(nextImageTensor,255)
      if (face_model) {
        var startDate = new Date();
        const pred = await face_model.estimateFaces(nextImageTensor);
        if (pred.length > 0 && model) {
          // save predictions to test_face_extract folder
          // pred.forEach(async (prediction, index) => {
          const [y1, x1] = pred[0].topLeft;
          const [y2, x2] = pred[0].bottomRight;

          const x1s = Math.floor(x1 * scaleX);
          const y1s = Math.floor(y1 * scaleY);
          const x2s = Math.floor(x2 * scaleX);
          const y2s = Math.floor(y2 * scaleY);

          //  var faceTensor = nextImageTensor.slice([x1s, y1s], [x2s - x1s, y2s - y1s]);
          //     faceTensor = tf.image.resizeBilinear(faceTensor,[48,48])
          //const data12 = await tfn.node.encodeJpeg(faceTensor);

          //fs.writeFile(`./test_face_extract/F${index}.jpeg`, data);
          setTopLeft(pred[0].topLeft);
          setBottomRight(pred[0].bottomRight);
          setIsFaceDetected(true);
          //console.log(faceTensor)
          var img = nextImageTensor
            .mean(2)
            .toFloat()
            .expandDims(-1)
            .expandDims(0)
            .div(scalar(255));

          function indexOfMax(arr) {
            if (arr.length === 0) {
              return -1;
            }

            var max = arr[0];
            var maxIndex = 0;

            for (var i = 1; i < arr.length; i++) {
              if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
              }
            }

            return maxIndex;
          }

          const em = await model.predict(img);
          // em.print()
          if (em && em.data) em.data().then((d) => console.log(d));

          if (em && em.data)
            em.data().then((data) => {
              var temp_arr = [...new Set(data)].slice(0); //clone array
              var second_largest_value = temp_arr.sort()[temp_arr.length - 2];
              var index_of_largest_value = data.indexOf(second_largest_value);
              console.log(index_of_largest_value);
              setEmotion(index_of_largest_value);
            });

          var endDate = new Date();
          var seconds = endDate.getTime() - startDate.getTime();
          console.log("latency = ", seconds, " ms");
          // })
        }
        // if(pred.length>0){
        //   setTopLeft(pred[0].topLeft)
        //   setBottomRight(pred[0].bottomRight)
        //   setIsFaceDetected(true)
        //   const em = await model.predict(nextImageTensor.expandDims(0))

        //   const emo = em.argMax(1)

        //   emo.data().then(data=>setEmotion(data))

        // }
        else {
          setIsFaceDetected(false);
        }
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  let textureDims;
  if (Platform.OS === "ios") {
    textureDims = {
      height: 1920,
      width: 1080,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };

    return (
      <View style={{ flex: 1 }}>
        {{ face_model } && (
          <TensorCameraModule
            style={styles.camera}
            type={Camera.Constants.Type.front}
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={48}
            resizeWidth={48}
            resizeDepth={3}
            onReady={handleCameraStream}
            autorender={true}
          />
        )}
        <View style={{ flex: 0.3, marginTop: 500 }}>
          {isFaceDetected && (
            <Text style={{ marginLeft: 40, fontSize: 28, marginTop: 10 }}>
              face
            </Text>
          )}
          {isFaceDetected && (
            <Text style={{ marginLeft: 40, fontSize: 28, marginTop: 10 }}>
              emotion: {emotion ? getEmotion(emotion) : 0}
            </Text>
          )}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  camera: {
    marginTop: 10,
    position: "absolute",
    left: previewLeft,
    top: previewTop,
    width: previewWidth,
    height: previewHeight,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
});

export default TensorCamera;
