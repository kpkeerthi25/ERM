import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import {
  bundleResourceIO,
  fetch,
  decodeJpeg,
} from "@tensorflow/tfjs-react-native";
import { loadGraphModel, ResizeBilinear, scalar } from "@tensorflow/tfjs";
const modelJson = require("../assets/AI_tfjs/model.json");
const modelWeights = require("../assets/AI_tfjs/group1-shard1of1.bin");
const test = require("../assets/icon.png");

const Home = () => {
  const JX_train = require("./X_train.json");
  const JY_train = require("./Y_train.json");
  const JZ_train = require("./Z_train.json");
  const X = tf.tensor(JX_train);
  const Y = tf.tensor(JY_train);
  const Z = tf.tensor(JZ_train);
  console.log(X.shape);
  

  const [tfReady, setTfReady] = useState(false);

  useEffect(() => {
    const tf_load = async () => {
      await tf.ready();
      await loadModel();

      setTfReady(true);
    };

    tf_load();
  }, []);

  const loadModel = async () => {
    const model = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    );

    function onBatchEnd(batch, logs) {
      console.log(logs);
    }
    // console.log(model);
    model.compile({
      optimizer: "sgd",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
    model
      .fit([Z, X], Y, {
        epochs: 5,
        batchSize: 32,
        callbacks: { onBatchEnd },
      })
      .then((info) => {
        console.log("Final accuracy", info.history.acc);
      });
  };

  return (
    <View>
      <Text>HomePage, {tfReady}</Text>
      {tfReady ? <Text>true</Text> : <Text>False</Text>}
    </View>
  );
};

export default Home;
