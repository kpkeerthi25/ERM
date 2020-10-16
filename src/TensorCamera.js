import React,{useState,useEffect} from 'react'
import * as tf from '@tensorflow/tfjs';
import {View,Text,StyleSheet} from 'react-native'
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as FaceDetector from 'expo-face-detector';


import * as blazeface from '@tensorflow-models/blazeface';

const TensorCameraModule = cameraWithTensors(Camera);

import {bundleResourceIO,fetch,decodeJpeg} from  '@tensorflow/tfjs-react-native';
const modelJson = require('../assets/tf-js/model.json');
const modelWeights = require('../assets/tf-js/group1-shard1of1.bin');
const modelJson1 = require('../assets/face/model.json');
const modelWeights1 = require('../assets/face/group1-shard1of1.bin');
let model = undefined
let face_model = undefined

const previewLeft = 40;
const previewTop = 20;
const previewWidth = 300;
const previewHeight = 400;

const TensorCamera = () => {
  const [faces,setFaces] = useState()
  const [isFaceDetected,setIsFaceDetected] = useState(false)
  const [topLeft,setTopLeft] = useState()
  const [bottorRight, setBottomRight] = useState()
  const [emotion, setEmotion] = useState()
   
  const getEmotion= (id) =>{
    names = ['anger','contempt','disgust','fear','happy','sadness','surprise']
    return names[id];
  }
  const  loadBlazefaceModel=async()=> {
    const model =  await blazeface.load();
    return model;
  }

    useEffect(() => {
        (async() => {
          
          await tf.ready()
          
          fun()
          console.log("ready")
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

    const fun = async(tensor)=>{
        model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        face_model = await loadBlazefaceModel()
        
        
        
        //face_model = await tf.loadLayersModel(bundleResourceIO(modelJson1,modelWeights1));
        
    }
    
    
    const handleCameraStream=(images, updatePreview, gl) =>{
        const loop = async () => {
          const nextImageTensor =images.next().value
          //const nextImageTensor = tf.div(nextImageTensor,255)
          if(face_model){
            const pred = await face_model.estimateFaces(nextImageTensor)
            if(pred.length>0){
              setTopLeft(pred[0].topLeft)
              setBottomRight(pred[0].bottomRight)
              setIsFaceDetected(true)
              const em = await model.predict(nextImageTensor.expandDims(0))
             
              const emo = em.argMax(1)

              emo.data().then(data=>setEmotion(data))
              
              
            }
            else{
              setIsFaceDetected(false)
            }
          }
            
            requestAnimationFrame(loop);
        }
       
        loop();
    }




   // Currently expo does not support automatically determining the
   // resolution of the camera texture used. So it must be determined
   // empirically for the supported devices and preview size.

   let textureDims;
   if (Platform.OS === 'ios') {
    textureDims = {
      height: 1920,
      width: 1080,
    };
   } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };
   

   return <View style={{flex:1}}>

     {{face_model} && 
       
        <TensorCameraModule
        // Standard Camera props
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
           
       
  }
  <View style={{flex:0.3, marginTop:500}}>

     
     {/* {topLeft && <Text style={{ fontSize: 18, }} >{topLeft[0]}   {topLeft[1]}</Text>}
      {bottorRight && <Text style={{ fontSize: 18, marginTop:10}} >{bottorRight[0]-topLeft[0]}   {bottorRight[1]-topLeft[1]}</Text>} */}
{isFaceDetected && emotion &&<Text style={{ marginLeft:40 ,fontSize: 28, marginTop:10}} >{getEmotion(emotion[0])}</Text>}
{!isFaceDetected && <Text style={{ marginLeft:40 ,fontSize: 28, marginTop:10}} >Face not detected</Text>}
   </View>
   </View>
  }
}

const styles = StyleSheet.create({
    camera : {
        position:'absolute',
        left: previewLeft,
        top: previewTop,
        width: previewWidth,
        height: previewHeight,
        zIndex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 0,
      },
})

export default TensorCamera