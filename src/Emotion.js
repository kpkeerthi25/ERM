import React, {useState,useEffect} from 'react'
import { StyleSheet, Text, View ,Image} from 'react-native'
import {Camera} from 'expo-camera'
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from 'expo-media-library';


const Emotion = (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null)
    const [faces,setFaces] = useState()
    const [uri, setUri] = useState("")
    const [isFaceDetected,setIsFaceDetected] = useState("face not detected")
    const [type, setType] = useState(Camera.Constants.Type.front);
    const [faceDet,setFaceDet]=useState()

    const faceDetected = async({faces}) => {
        setFaces({faces})
        if(faces&&faces.length){
            setFaceDet(faces[0].bounds)
            setIsFaceDetected("face detected")
            if(cameraRef){
            //     let photo = await cameraRef.takePictureAsync({
            //       quality:0
            //     });
            //     console.log(photo)
            //     console.log(faces[0])
            //     const u = await ImageManipulator.manipulateAsync(photo.uri,[{
            //       resize:{
            //         width:600,
            //         height:400
            //       },
            //       // crop:{
            //       //   originX:faces[0].bounds.origin.y,
            //       //   originY:faces[0].bounds.origin.x,
            //       //   height:faces[0].bounds.size.width,
            //       //   width:faces[0].bounds.size.height
            //       // }
            //     }
            //   ])
            //     // const cropped = await ImageManipulator.manipulateAsync(u.uri,[{
            //     //   crop:{
            //     //     originX:faces[0].bounds.origin.y-50,
            //     //     originY:faces[0].bounds.origin.x-50,
            //     //     height:200,
            //     //     width:200
            //     //   }
            //     // }])
            //     MediaLibrary.saveToLibraryAsync(u.uri).then(()=>{
            //       console.log("saved")
            //     })
            //     console.log(faces[0])
                //setUri(photo.uri)
                
                
                
            }
        }
        
        else{
            setIsFaceDetected("face not detected")
        }
      }

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
          //const {status2} = await MediaLibrary.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
      if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
    return(
        <View style={{flex:1}}> 
           
            <Camera style={{flex:1}}
            type={type}
            ref={ref => {
                setCameraRef(ref)}
            }
            onFacesDetected={faceDetected}
            faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.accurate,
            detectLandmarks: FaceDetector.Constants.Landmarks.all,
            runClassifications: FaceDetector.Constants.Classifications.none,
            minDetectionInterval: 100
            }}
            >
                <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'column-reverse'
          }}>
              <View 
                 style={{
                    flex: 0.3,
                    
                    backgroundColor:"blue",
                    alignItems: 'center',
                  }}
              >
              {{isFaceDetected}=="face detected" && <Image source={{uri:{uri}.uri}}  style={{ borderBottomRightRadius: 20 }} />}
              <Text style={{ fontSize: 18, color: 'white' }} >{isFaceDetected}</Text>
              
                {faceDet&&<Text style={{ fontSize: 18, color: 'white' }} >{faceDet.origin.x}   {faceDet.origin.y}  </Text>}
                {faceDet&&<Text style={{ fontSize: 18, color: 'white' ,marginTop:5}} >{ faceDet.size.width}   {faceDet.size.height}  </Text>}
              </View>
            
          </View>
            </Camera>
        </View>
    );
}



export default Emotion