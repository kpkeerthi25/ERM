import React,{useEffect} from 'react'
import * as tf from '@tensorflow/tfjs';
import {bundleResourceIO,fetch,decodeJpeg} from  '@tensorflow/tfjs-react-native';
import { View,Text,Image } from 'react-native';
const img = require('../assets/keerthi-happy-crop.jpeg')
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js'


const modelJson = require('../assets/tf-js/model.json');
const modelWeights = require('../assets/tf-js/group1-shard1of1.bin');


console.log(img)
const Tfjs = (props) => {

  function imageToTensor(rawImageData){
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(48 * 48 * 3)
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]
      offset += 4
    }
    const data1 =  tf.tensor3d(buffer, [48,48,3])
    return data1.expandDims(0)
  }

  useEffect(() => {
    (async() => {
      await tf.ready()
      
      console.log("ready")
      fun()
    })();
  }, []);

  const fun = async()=>{
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    //const u = await ImageManipulator.manipulateAsync('../assets/keerthi-happy-crop.jpg')
    const imageAssetPath = Image.resolveAssetSource(require("../assets/keerthi-happy-crop.jpeg"))
const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
const rawImageData = await response.arrayBuffer()
const imageTensor = imageToTensor(rawImageData)
model.predict(imageTensor).print()

  }
  
  return(
    <View>
      <Text>modelllll</Text>
    </View>
  )
}

export default Tfjs