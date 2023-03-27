import React, { Component,useState } from "react";
import { View, TouchableOpacity ,Platform,StyleSheet,PermissionsAndroid,Dimensions,Linking,Alert} from "react-native";
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library'; 
import { Camera } from 'expo-camera'; 
import {
  Button, 
  Spinner, 
  Text
} from "@ui-kitten/components";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native'; 
import FormData from 'form-data';
import {Retake,Forward,Recorder,Back} from '../../components/Svgs'
import {axios} from '../../components/Utils/ServiceCall' 
import Colors from '../../constants/Colors'
// const isFocused = useIsFocused(); 
import MediaHelper from 'react-native-media-helper'
import Rocoder from '../../components/Video/Recoder'
import { Video } from 'expo-av'; 
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
 import Tour2 from '../Tour2'
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {saveEntry2,getEntry,RemoveData} from '../../components/Utils/StoreDetails'
class MyCam extends Component {
    state = {
      video: null,
      picture: null,
      recording: false,
      showVideo:false,
      uploadingStatus:false,
      cameraFront:true,
      didLoad:false,
      counter:0
    };
  
 makeid = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZa0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
    _saveVideo = async () => {
      var self = this
      self.setState({
        uploadingStatus:true
      })
      const { video } = this.state;
      const asset = await MediaLibrary.createAssetAsync(video.uri) 
      return asset
  //     const formData = new FormData(); 
  //     var videoUrl =  Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '')
  //     formData.append('videoFile', {
  //       uri: videoUrl,
  //       type: 'video/mp4',
  //       name: this.makeid(7)
  //   });
  //    const videoDetails = {
  //     link:videoUrl,
  //     uri:video.uri
  //       }
  //   this.setState({
  //      uploadingStatus:false
  //  })
  //     self.props.saveVideoMessage(videoDetails)
 
    // const formData = new FormData(); 
    //   var videoUrl =  Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '')
    //   formData.append('videoFile', {
    //     uri: videoUrl,
    //     type: 'video/mp4',
    //     name: this.makeid(7)
    // });

    // const videoDetails = {
    //   link:videoUrl,
    //   uri:video.uri
    //     }
    //     try {
    //       this.setState({
    //         uploadingStatus:true
    //       }).then(()=> self.props.saveVideoMessage(videoDetails))
    //     } catch (error) {
    //       this.setState({
    //         uploadingStatus:false
    //       })
    //     }
 
   




// self.uploadVideo(videoUrl).then((status) => { 
//   console.log('uplading',status.data)
//   if (status) {
//     self.props.uploadedLink(status.data.storage)
//     self.setState({
//       videoUrls:videoUrl,
//       uploadingStatus:false,
//       video:null,
//       recording:false,
//       showVideo:true,
//       link:status.data.storage.link
//     })
//   }   
// })
      
    };
  


    flipCamera = async () => { 
      const self = this
      self.setState(prevState => ({
        cameraFront: !prevState.cameraFront 
      }));
      console.log('camera is facing to ',self.state.cameraFront)
    }

   uploadVideo = async (data) => { 
  try {  
    const headers = {
      'Accept': 'application/json', 
      'Content-Type': 'multipart/form-data'
    }
   var nameExtension = Math.random() 
          let formData = new FormData(); 
          var imagePath = data
          formData.append("imageFile",{ uri: imagePath, name: nameExtension + '-greetings.mp4', type: 'video/mp4' }  ); 
   
     const response = await axios.post('/upload', formData,{headers: {
      'Content-Type': 'multipart/form-data'
    }})
     return  response
  }catch (error) { 
      alert('something went wrong')
    }
  }

    _StopRecord = async () => {
      // alert('s')
      const self = this
      // this.setState({ recording: false }); 
      this.setState({ recording: false }, () => {
        this.cam.stopRecording();
      });
      // const video = await self.cam.recordAsync(options);
    };
    testt = async () => {
      this.setState({ recording: false })
    };
  
    _StartRecord = async () => {

      const self = this
      console.log('recoding' )
      const options = {
        orientation: 'portrait', 
        maxDuration:15,
        quality: 2, base64: true 
      } 
      if (self.cam) {
        self.setState({ video:null}, async () => {
          const video = await self.cam.recordAsync(options);
          console.log('i am stop',video)
          self.setState({ video ,recording:false});
          // self.setState({ video :video,recording:false});
          self.cam.stopRecording();
        }); 
      }
    };
  
  runTimer = () => {
    setInterval(() =>  this.setState(prevstate => ({ counter: prevstate.counter + 1})), 1000)
   
  }

  toogleStopRecord = () => {
    const { recording } = this.state;
    const self = this
    self._StopRecord(); 
      }
    toggleStartRecord = () => {
      const { recording } = this.state;
      const self = this 
      self.setState(prevState => ({
        recording:true,
        video:null
      }),() => { 
       this._StartRecord();
          })




      // this.runTimer()
    //   this.setState({
    //     video:null,
    //     recording:true
    //   },() => { 
    // console.log("recording",recording)
    // if (recording) {
    //   alert('STOP')
    //     // this._StopRecord();
    //   } else {
    //     alert('start')
    //     // this._StartRecord();
    //   }
    //   })
    };
 
    displayControls(){
      const { recording, video } = this.state;
      return(
        <React.Fragment>
           {/* <TouchableOpacity
            onPress={this.flipCamera}
            style={{backgroundColor:'red',
              padding: 20,
              width: "100%",
            }}
          > 
          </TouchableOpacity>
          */}
          {recording === false ? (
          <TouchableOpacity
          onPress={this.flipCamera} 
            style={{
              padding: 20,
              width: "30%", 
            }}
          >
            <View style={{ flex: 1,
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',marginBottom:40,}}>
               <Retake/>
           </View>
          </TouchableOpacity>
        ): null}
        {console.log(this.state.recording,this.state.video)}
        <TouchableOpacity
          onPress={()=> this.state.recording   ?    this.toogleStopRecord():  this.toggleStartRecord() } 
          // this.toogleRecord
          style={{
            padding: 20,
            width: "100%",
           //  backgroundColor: recording ? "#ef4f84" : "#b13636gbf
          }}
        > 
          <View style={{ flex: 1,
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',marginBottom:70,}}> 
          {recording ?  null :  video ?  <View style={{width:50,height:50,backgroundColor:'white',borderRadius:50/2}}/> : <View style={{width:50,height:50,backgroundColor:'white',borderRadius:50/2}}/> }
         {recording ? <View style={{width:25,height:25,backgroundColor:'red',borderRadius:5}}/> : null} 
         </View>

        </TouchableOpacity>
        </React.Fragment>
      )
    }

 returnProps() { 
   var self = this
   self.setState({
    didLoad:true
  })
  setTimeout(()=> {
    self.props.returnScreen()
  }, 1000) 
}
process = async ()=>{
  const self = this
  const {video} = this.state
  const {link} = self.state
  self._saveVideo().then((videoLink)=>{ 
    var videoUrl =  Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '')
    const videoDetails = {
      link:videoUrl,
      uri:self.state.video.uri
        }
    self.props.saveVideoMessage(videoDetails)

  })
  // alert('s')
}
cameraContent(){ 
  const { recording,video,link} = this.state;
  return (<React.Fragment>  
    {this.state.showVideo   ?  
<Video
 source={{ uri: this.state.link }}
 rate={1.0}
 volume={1.0}
 isMuted={false}
 resizeMode="cover"
 shouldPlay
 isLooping
 style={{ width: width, height: height }}
/>
: <React.Fragment>
  
          <Camera 
       useCamera2Api={true}
    type={this.state.cameraFront ? Camera.Constants.Type.front :Camera.Constants.Type.back }
      ref={cam => (this.cam = cam)} 
      style={{
        opacity:this.state.uploadingStatus ? 0.5 : 1,
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1,
        width: "100%",
        // marginBottom:  video === null  ?  0 : 0
      }}
    >
      
 
   { this.state.video === null ?   null :  <View style={{ position:'absolute',top:60,right:40}}> 
              <TouchableOpacity
                 onPress={()=> this.process()} 
           style={{
             
             // padding: 20,
            //  width: "90%",
            borderRadius:5,
             backgroundColor: Colors.buttonTheme
           }}
         >
           <Text category="p1" style={{color:'white', 
        //  textShadowColor: 'black', 
        //  textShadowOffset: { width: -1, height: 0 },
        //  textShadowRadius: 5, 
         margin:5,
         fontWeight: '800'}}>Next</Text>
      
         </TouchableOpacity> 
            
          </View> }
          {this.state.recording ? null :    <View style={{ position:'absolute',top:60,left:40}}> 
              <TouchableOpacity
           onPress={(e)=> this.returnProps()}
           style={{
             // padding: 20,
             width: "100%",
            //  backgroundColor: "#fff"
           }}
         > 
       <Back/>
         </TouchableOpacity>
           
          </View>
            
          } 
      {this.state.uploadingStatus ?  <Text style={{ textAlign: "center",color:'white',marginBottom:120}}>Processing...</Text>  : this.displayControls()}
    </Camera>
    {console.log('alinga',this.state.video )}
    {video === null ? null :  <Video
        ref={video}
        style={{ width: 200, height: this.state.video === null ? 0:  200}}
        source={{
          uri: video.uri,
        }}
        rate={1.0}
   volume={1.0}
   isMuted={true}
   useNativeControls={true}
   resizeMode="contain"
   shouldPlay={true}
        resizeMode="contain"
        isLooping
        // onPlaybackStatusUpdate={status => setStatus(() => status)}
      />}
   
    {/* <View style={{ flex: 1,
    position:'absolute',top:60,
        backgroundColor: "red",
         justifyContent: 'right',
         alignItems: 'right'
         ,marginBottom:40,}}>
           
           </View> */}
{/*   
<Video
   source={{ uri: link}}
   rate={1.0}
   volume={1.0}
   isMuted={true}
   useNativeControls={true}
   resizeMode="contain"
   shouldPlay
   isLooping
   style={{ width: 200, height: 200}}
   /> */}
  </React.Fragment>}
 
       </React.Fragment>)
}
    render() { 
      return (
        this.state.didLoad  ?   <Spinner><Text style={{color:'white',marginBottom:20}}>processing...</Text></Spinner>  :  this.cameraContent()
      );
    }
  }
  


  
export default function CameraRecorded({navigation}) {
const [showCamera,set] = useState(false) 
const [isLoading,setLoading] = useState(false) 
const isFocused = useIsFocused();
const [hasPermission, setHasPermission] = useState(null);
const [mediaPermession, setPermission] = useState(null);
const { Details, updateCart } = cart()
const [newUser, setUser] = useState(true); 
 
const iosRequestCamera = async () => {
  console.log(Permissions.CAMERA)
  try {
    const granted = await Permissions.CAMERA.askAsync()
    (
      Permissions.CAMERA,
      {
        title: "Nidz Flowershop Camera Permission",
        message:
          "Nidz Flowerhop App needs access to your camera " ,
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
  } catch (err) {
    console.warn(err);
  }
};


async function saveVideoContext(e)  {
setLoading(true)
Details.deliveryOption.videoURL = e
updateCart(Details) 
navigation.goBack()
}
 async function showCameraRecorder   ()  {
  const { status } = await Camera.requestPermissionsAsync();
  // set(false)
  console.log(status)
//  if (status === "granted") {
//     set(true)
//   }
}
function backers(){
  setLoading(true)
  navigation.goBack()
}
 function returnScreenEvent() {
  //  this.state.video === null ?   null :  <View style={{ position:'absolute',top:60,right:40}}> 
  // if (this.state.video !== null)  {
    // Alert.alert(
    //   "Are you sure?",
    //   "Your Video will be lost, do you want to continue?",
    //   [
         
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "OK", onPress: () => 
    //     backers()
    //   }
    //   ],
    //   { cancelable: false }
    // );
  // }else {
    navigation.goBack()
    setLoading(true)
  // }
  
 }
async function askPmersion (){
  const { status } = await  Camera.requestPermissionsAsync();  //Camera.requestPermissionsAsync();
  return status 
}


getEntry('@scanVideoRecorderLoad').then((value) => { 
  if (value != null || value !== undefined){
    setUser(false)
  }else{
    setUser(true)
  }
})

React.useEffect(() => {
  (async () => {
    getEntry('@scanVideoRecorderLoad').then((value) => {
      if (value != null || value !== undefined){
        setUser(false)
      }else{
        setUser(true)
      }
    })


    const { status } = await Camera.requestPermissionsAsync();
    var type =  await MediaLibrary.requestPermissionsAsync()
    console.log('media permission',type)
    if (type.status !== "granted"){
      // alert('Please allow Nidz app to access Photos and Camera')
      setPermission(false)
      set(false)
    }else {
      setPermission(true)
    }
    setHasPermission(status === 'granted');
    // set(type == "granted"  && status === 'granted')
  })();
  // iosRequestCamera()
  // askPmersion().then( (status) => {
  //   setHasPermission(status === 'granted')
  // } )
set(isFocused ? true : false)
}, [isFocused])
// const displayCameraModal =   <TouchableOpacity onPress={()=>showCameraRecorder()}>
// <Button>Show Camera</Button>
// </TouchableOpacity>

const handlePress = React.useCallback(async () => {
  await Linking.openURL('app-settings:');
}, []);
function unValidatedView() {
  return ( <View style={{   flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',width:width}}>
            <Text >Please allow us to access Camera and Photos</Text>
          <TouchableOpacity onPress={()=>handlePress()}><Text category="c2" style={{color:'#00a8ff',marginTop:20}} >Allow here</Text></TouchableOpacity> 
</View>)
}
function validateView(){ 
console.log(isFocused ? 'camere recoder focused' : 'camere recoder unfocused') 
 return isFocused ?  showCamera ?  <MyCam   saveVideoMessage={(e)=>saveVideoContext(e)}   returnScreen={()=> returnScreenEvent() }  uploadedLink={(e)=> console.log('foloating',e)}/> :unValidatedView()  : null
} 

function tour() {
  return <Tour2/>
}

function didPressed() {
  saveEntry2('true','@scanVideoRecorderLoad').then((status) => { 
    setUser(false)
  })
}
function cameraSetup(){
  return (
    <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    width: "100%"
    ,backgroundColor:'black'
    }}
  > 

  { hasPermission === false  ? <Text>processing...</Text>: null}

  {validateView()}
  </View>
  )
}
return  newUser ? <Tour2 didPressed={()=>didPressed()} navigation={navigation}/> : cameraSetup()
} 
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});