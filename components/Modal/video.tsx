import React,{useState,useEffect,useCallback} from 'react';
import Modal from 'react-native-modal'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Image,
    TouchableHighlight,
    Vibration,
    ActivityIndicator
  } from "react-native";
  import { Video } from 'expo-av'; 
import { useTimer } from 'use-timer';
  import CachedImage from 'react-native-expo-cached-image';
  import {fetchData} from '../Utils/StoreDetails'
import {Card,RadioGroup,Radio, Button,Divider,Spinner,Layout,Calendar,Avatar,Text, Tab, TabBar,ListItem,List} from '@ui-kitten/components';
  import { ApplicationProvider, Input } from "@ui-kitten/components";
  var width = Dimensions.get('window').width;
  var height = Dimensions.get('window').height;
 
export default function Shop() {
    const [isModalVisible, setModalVisible] = useState(true);
    const [showButtonStatus, showButton] = useState(true);
    const [PopupData, setModal] = useState(null);
    const [isReady, setReady] = useState(false);
    const [tick, setTick] = useState(5);
  const timerValue = React.useRef(5);
    const { time, start, pause, reset, status } = useTimer({
      endTime: 0,
      timerType: 'DECREMENTAL',
      initialTime: timerValue.current,
    });
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };

     function fetchAPI(){
      fetchData().then((data)=>{  
        console.log("BANNER DATA",data.data.results[0].PopUpCartAdds)
        timerValue.current = 20
        setModal(data.data.results[0].PopUpCartAdds)
        setReady(true)
        setModalVisible(data.data.results[0].PopUpCartAdds.display)
        start()
        })
      }      
       function runTimer(){
         console.log(status)
        if (isReady && isModalVisible) {
          start()
        }
       }
      useEffect(() => { 
        fetchAPI() 
     }, [])  
      return    <SafeAreaView>
        {isReady && isModalVisible ?  <Modal isVisible={true}>
              <ScrollView> 
        <View style={{margin:20,backgroundColor:'white',borderRadius:5,height:500,marginTop:height/7,borderRadius:20}}>
          {/* <Image    style={{height:440,width:'auto',borderTopLeftRadius:5,borderTopRightRadius:5}} source={{uri:PopupData.imageLink}}/> */}
          <Video
   source={{ uri: PopupData.videoLink}}
   rate={1.0}
   volume={1.0}
   isMuted={true}
   useNativeControls={true}
   resizeMode="contain"
   shouldPlay
   isLooping
   style={{ width: 300, height: 450,borderRadius:0,marginBottom:20}}
   />
       <Button disabled={status === 'RUNNING' ? true: false}   onPress={()=>toggleModal()} style={{backgroundColor:'white',color:'black',borderColor:'white'}}><Text>{status === 'RUNNING' ?time:"Dismiss"}</Text></Button>
         </View>
        </ScrollView>
      </Modal>  : null }
      </SafeAreaView>
  }
