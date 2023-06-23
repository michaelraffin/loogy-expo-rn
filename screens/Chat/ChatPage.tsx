import React, { useEffect, useState, PureComponent, useRef, useContext } from 'react';
import {
	Alert,
	Modal,
	SectionList,
	Switch,
	ToastAndroid,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Image,
	ImageBackground,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	KeyboardAvoidingView,
	View,
	ActivityIndicator,
	Platform,
	Keyboard,
  TouchableWithoutFeedback,
  Vibration
} from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input, Toggle } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Clipboard from 'expo-clipboard';
var Image_Http_URL = { uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif' };
import { cart, Theme, CartContextAction } from '../../components/Utils/UserCart';
import ThemeColor from '../../constants/Colors';
import { saveEntry, getEntry, removeItem } from '../../components/Utils/StoreDetails';
import moment from 'moment';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import UserLocationUI from '../../components/Utils/UserLocation' 
import { CarMap, SmallArrow,Home } from '../../components/Svgs';
import { schedulePushNotification } from '../Cart/Notification';
import {Small,BigLoader,ButtonLoader,InstagramContent,ButtonLoaderStandard} from '../../components/Loader';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg, { Circle, Path, Line, Polyline, Rect ,SvgUri} from 'react-native-svg';
import Store from '../../components/Context/MapContext';
import { MapContext } from '../../components/Context/MapContext';
import DashedLine from 'react-native-dashed-line';
import { BookingContext } from '../../components/Context/UserBookingContext';
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places';
import { axios ,axiosV2} from '../../components/Utils/ServiceCall'; 
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { LoginRequired } from '../../components/Errors/LoginRequired';
import FloatingBar from '../../components/FloatingBar';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
import { notifyGroup,roomListenerStandard,getActiveUsers,setOnline,socket,dynamicEmit,notifyGroupStatsPayload} from '../../components/Utils/SocketManager';
import * as Haptics from 'expo-haptics';
import LocationPicker from '../../components/Utils/UserLocation'
import MapView, { Marker,PROVIDER_GOOGLE } from "react-native-maps"; 
import AvatarProfile  from '../../components/Profile/Avatar'
import { Gyroscope } from 'expo-sensors';
 const truck = require('../../assets/images/white-truck.png'); 
 const sendMessageIcon = require('../../assets/images/send-message.png'); 
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Dashboard({navigation}) {
  const isFocused = useIsFocused();
	const availableUsersV2 = useRef([]) 
  const [ availableLocalUsers, setUsers ] = useState([]);
    const [ messages, setMessage ] = useState([]);
  const [ bidValue, setBid ] = useState(0);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [isSheetDisplay,setisSheetDisplay] =  useState(true);
  const [typedMessage,setTypeMessage] =  useState(null);
  const snapPoints = React.useMemo(() => ['20%','30%'], []);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });


  const validateUsersScreenState = ()=>{
    if (isFocused === false) {
      bottomSheetRef.current.close()
    } else {

    }
  }
  useEffect (()=>{
    if(isFocused) {
      dynamicEmit("chatUser-Init",{payload:{idRoom: 'MICHAEL-xxAA21312'}})
    } else {
      dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
    }
  },[isFocused])
  useContext (()=>{
    // validateUsersScreenState()
    alert('e')
    // if(isFocused) {
    //   alert('e')
    //   dynamicEmit("chatUser-Init",{payload:{idRoom: 'MICHAEL-xxAA21312'}})
    // } else {
    //   dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
    // }
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
    });
    return unsubscribe;
  },[])
    
  const [subscription, setSubscription] = useState(null);

    useEffect(() => { 
    
    // socketListerner()
    getList()
    let userCoordinates = Platform.OS === 'android' ?[{lat:10.315699}, {long:123.885437}] : [{lat:14.514462}, {long:121.03785}]

    
        },[]);


        useEffect(() => { 
        console.log('i got rendered by availableLocalUsers')
       },[messages]);
 
      const _subscribe = () => {
        setSubscription(
          Gyroscope.addListener(gyroscopeData => {
            setData(gyroscopeData);
          })
        );
        try {
        
        notifyGroupStatsPayload('chatUser',{payload:{idRoom:'MICHAEL-xxAA21312',message:`Hi i   e details ${Date()}`}})
        // .then( response =>{
        //   console.log(response)
        // })
      } catch (error) {
        alert('error in chat user')
      }
      };
      const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
      };
      useEffect(() => {
        _subscribe();
        // dynamicEmit("chatUser-Init",{payload:{idRoom: 'MICHAEL-xxAA21312'}})
        return () => _unsubscribe();
      }, []);
    let socketListerner = ()=> { 
        try {
            let cebu = "davao-trucking"
              let id =  "D6ES6N"
            let payload = {reference:id,state:"didLogin",owner:"expo"}
            let xxx = {room:cebu,payload}
            let userCoordinates = Platform.OS === 'android' ?[{lat:10.315699}, {long:123.885437}] : [{lat:14.514462}, {long:121.03785}]

            // socket.emit("chatUser",{payload:{idRoom:'MICHAEL-xxAA21312',message:`Hi i   e details ${Date()}`}},(callback)=>{
            

          
            setOnline({
                room: 'davao-trucking',
                payload: { reference: 'D6ES6N', state: 'didOnline',source:"expo",coordinates:userCoordinates,country:Platform.OS === 'android' ? "ph" : "ph", 
              }
              })
              
   

        } catch (error) {
            console.log('error in',socketListerner)
        }
    } 

    let notifyUsers = (title,message)=>{
      
      var payload = {
        title: title,
        body:message 
      };
       schedulePushNotification(payload).then(() => {})
       return
    }

    const HideKeyboard = ({ children }) => (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    );
    let getList = async()=> { 
        try {
            roomListenerStandard("newJoiner",(data)=>{ 
              // if (10 >= availableLocalUsers ) {
                setUsers((prevVals) => [...prevVals,data.data.payload.coordinates])
              // }
                // Vibration.vibrate(5000)
                // Haptics.notificationAsync(
                //   Haptics.NotificationFeedbackType.Success
                // )
                // Vibration.vibrate(10000)
              })


              roomListenerStandard("userDidLoggedOut",(data)=>{ 
                // if (10 >= availableLocalUsers ) {
                //   setUsers((prevVals) => [...prevVals,data.data.payload.coordinates])
                // }
                  // Vibration.vibrate(5000)
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  )
                  // Vibration.vibrate(10000)
                })


                roomListenerStandard("bidSuccess",(data)=>{ 
                  console.log(data)
                  console.log('biddddd',Platform.OS)
                      Alert.alert(`New bidder found!`, `${data.owner} has place bid ${data.bidValue}`, [ 
                        { text: 'Accept', onPress: () => console.log('None') },
                        { text: 'Cancel', onPress: () => console.log('None') },
                        ],{
                        cancelable: true,
                        })
                          
                  notifyUsers('Bidder Found', `${data.owner} has place bid ${data.bidValue}`)
                  // Alert('Your bid has been accepted  ')
                  })


                  roomListenerStandard("messageChat",(data)=>{ 
                    console.log("messageChat",data.payload)
                    
                    setUsers((prevVals) => [...prevVals,data.payload])

                

                    setMessage((prevVals) => [...prevVals,data.payload]) 
                    notifyUsers('New Message', `${'Michael'} has sent message`)
                    if (Platform.OS === "ios") {

                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                      )
                    } 

                    })
        } catch (error) {
            console.log("error in useMemo",error)
        }
    }


const renderMarker =  React.useMemo(()=>{  
  
  console.log('renderMarker')
    try { 
      var e = availableLocalUsers //getAllAvailableUsers()
      const items = []
      e.map((data, index) => { 
        console.log('marker',data)
        var latitude = data[0].lat
        var longitude = data[1].long
        if (Platform.OS === "android") {
          items.push( 
//             <Marker
//             calloutOffset={{x: -20.0, y: 4.0}}
//             onCalloutPress={()=> console.log('onCalloutPress')}
//             // onSelect={()=> console.log('Marker')}
//             key={index}
//             coordinate = {{latitude: latitude,longitude:longitude}}
//             title= {`${latitude}`}
//               description= {`${longitude}`}
//             ><Svg height="50%" width="50%" viewBox="0 0 100 100" >
//             <Circle cx="50" cy="50" r="50" stroke="purple" strokeWidth=".5" fill="violet" />
//           </Svg>
// </Marker>
           
            <Marker
            onPress={e => bottomSheetTapped(true)}
            key={index}
            coordinate = {{latitude: latitude,longitude:longitude}}
              title= {`${latitude}`}
              description= {`${longitude}`}
            />
          ) 
        } else {
          items.push( 
        //     <MapView.Callout tooltip style={styles.customView}>
        //     <View style={styles.calloutText}>
        //        <Text>{marker.title}{"\n"}{marker.description}</Text>
        //     </View>
        // </MapView.Callout>

            <Marker
            calloutOffset={{x: -20.0, y: 4.0}}
            onCalloutPress={()=> console.log('onCalloutPress')} 
            onPress={e => bottomSheetTapped(true)}
            key={0}
            coordinate = {{latitude: latitude,longitude:longitude}}
            title= {`${latitude}`}
              description= {`${longitude}`}
            >
              <Image source={truck}
              style={{width:100,height:45,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,    
                }}
                 />
    {/* <View style={{borderColor:'black',borderWidth:1,backgroundColor:'black',height:20,width:20,borderRadius:20,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
          <View style={{backgroundColor:'white',height:10,width:10,borderRadius:2}}/>
        </View> */}
            </Marker>
          ) 
        }
     
      })
      console.log('list of marker',items.length)
      return items
    } catch (error){
      console.log('error in map marker',error)
    return    <Marker
    key={121}
    coordinate={{
      latitude:  8.228346   ,
      longitude:  124.243059  }}
    title={"Loogy" }
    description={"0917-843-4776"}
  />
  }
  },[availableLocalUsers])
 
const mapViewContent = React.useMemo(()=>{  
   try {
    return (<React.Fragment>
      <MapView
      showsBuildings={true}
      showsIndoors={true}
      rotateEnabled={false} 
  showsScale = {true} 
        showsMyLocationButton={true}
        showsCompass={true}
        showsPointsOfInterest={true}
        zoomTapEnabled={true} 
        onLayout={()=>console.log('pressed')}
        initialCamera={{
          center: {
            latitude: 8.2225,
            longitude: 124.2378
          }
          ,
          heading: 20,
          pitch: 20,
          zoom: 10000,
          altitude: 100
        }}
        // getMarkersFrames={true}
        showsUserLocation
        style={styles.map}
      >{renderMarker}
      </MapView>
         {/* <FlatList
        data={availableLocalUsers}
        renderItem={({item}) =>
      <View style={{height:100,width:'100%'}}>
         <Text>dsadsadsa</Text>
      </View>
      }
        keyExtractor={item => item.id}
      /> */}
      <View style={{marginTop:40,width:'auto',right:20,position:'absolute'}}>
        <TouchableOpacity>
        <View style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1.2,
            
          },
          shadowOpacity: 0.3,
          shadowRadius: 5.84,
          elevation: 0.2,
          backgroundColor:'white',alignContent:'center',justifyContent:'center',alignItems:'center',height:45,borderRadius:50,flexDirection:'row'}}>
         <View style={{backgroundColor:'black',borderRadius:50,width:30,height:30,marginLeft:5,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white',fontSize:9}}>{availableLocalUsers.length}</Text></View><Text style={{color:'black',fontWeight:'bold',fontSize:11,margin:5}}>Available Drivers</Text>
         {/* <Text >x: {x}</Text> */}
        </View>
        </TouchableOpacity>
      </View>
  </React.Fragment>)
   } catch (error) {
    console.log('error in map',error)
   }
  },[availableLocalUsers])

    const placeBidService = async ()=>{
      if (bidValue === 0) {
        return
      }
      dynamicEmit("placeBid",{bidValue:bidValue,owner:Platform.OS})
      setBid(0)
      Keyboard.dismiss()
      ToastAndroid('dsadsa')
    }
  const renderBiddingComponent =()=>{
    return (
      <View style={{marginTop:height / 9,alignContent:'center',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
           <Image source={{ uri: 'https://cdn.dribbble.com/users/331579/screenshots/17202812/media/dc042b92e1e042006f6965c482e6a6a8.jpg?compress=1&resize=1600x1200&vertical=top'}} style={{ width:300,
        height:250,
        resizeMode: 'cover'}}/>
        <Text style={{marginBottom:20,fontSize:24,fontWeight:'bold'}}> Enter your bid</Text>
        <Input
        value={bidValue}  
        label="Bid amount"
        keyboardType='numeric'
        tapp
        style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
        placeholder="P 0.000"
        onChange={(e) => setBid(e.nativeEvent.text)}
      />
        <Text style={{marginBottom:20}}> You will have 5 mns to accept before expires.</Text>
        <TouchableOpacity>
       <Button  status="primary" 
       onPress={()=>placeBidService()}
       style={{ borderRadius: 40, width: width - 40, 
       marginLeft: 20, marginBottom:32 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{ "Place Bid"}</Text>
    </Button>
    </TouchableOpacity>
    </View>
    )
  }

  const backButton =()=>{
    return (
      <React.Fragment>
          <View  style={{ height: 30,width:30, top:40,position:'absolute', alignSelf:'flex-end',left:20,opacity: 1}} >
                <TouchableOpacity onPress={() => 
        dynamicEmit("chatUser",{payload:{idRoom: 'MICHAEL-xxAA21312'}}).then((callback) =>{
          console.log('callback',callback)
        })}>
                <Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:'100%',height:30  }}/>
                </TouchableOpacity>
              </View>
         </React.Fragment>
    )
  }
  const bottomSheetTapped = (show)=>{
    try {
      if (!show) {
        bottomSheetRef.current.close()
      } else {
        bottomSheetRef.current?.expand()
    }
    } catch (error) {
      
    }
}
const ownerMessage = (item) =>{
  try {
    <TouchableOpacity key={item.id}>
    <View key={item.id} style={{height:'auto',width:'80%',borderBottomLeftRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,marginTop:20,backgroundColor:'#64fc4c',justifyContent:'center'}}>
     <Text key={item.id} style={{marginLeft:20,fontSize:13,marginTop:20,marginBottom:10}}>{item.Message}</Text>
     <Text key={item.id} style={{marginLeft:20,fontSize:9,marginTop:2,marginBottom:10}}>{moment(item.time).format('MMMM DD YYYY, h:mm:ss A').toString()}</Text>
    </View>
    </TouchableOpacity>
  } catch (error) {
    <TouchableOpacity key={item.id}>
  <View key={item.id} style={{height:'auto',width:'80%',borderBottomLeftRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,marginTop:20,backgroundColor:'#64fc4c',justifyContent:'center'}}>
   <Text key={item.id} style={{marginLeft:20,fontSize:13,marginTop:20,marginBottom:10}}>{item.Message}</Text>
   <Text key={item.id} style={{marginLeft:20,fontSize:9,marginTop:2,marginBottom:10}}>{moment(item.time).format('MMMM DD YYYY, h:mm:ss A').toString()}</Text>
  </View>
  </TouchableOpacity>
  }
}
const senderMessage = (item) =>{
  try {
   return ( <TouchableOpacity key={item.id}>
    <View style={{width:'100%',alignContent:'flex-end',alignItems:'flex-end'}}>
    <View key={item.id} style={{height:'auto',width:'80%',borderBottomLeftRadius:10,borderBottomRightRadius:10,borderTopLeftRadius:10,marginTop:20,backgroundColor:'#ffffff',justifyContent:'center'}}>
     <Text key={item.id} style={{marginLeft:20,fontSize:14,marginTop:20,marginBottom:10}}>{item.Message}</Text>
     <Text key={item.id} style={{marginLeft:20,fontSize:9,marginTop:2,marginBottom:10}}>{moment(item.time).format('MMMM DD YYYY, h:mm:ss A').toString()}</Text>
    </View>
    </View>
    </TouchableOpacity>)
  } catch (error) {
  return <Text>Error in render</Text>
  }
}
const validateContent = (item)=>{
try {
  if (item.owner === "ios") {

 return ( senderMessage(item) )
  } else {
   return  <TouchableOpacity key={item.id}>
   <View key={item.id} style={{height:'auto',width:'80%',borderBottomLeftRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,marginTop:20,backgroundColor:'#dfe4ea',justifyContent:'center'}}>
    <Text key={item.id} style={{marginLeft:20,fontSize:13,marginTop:20,marginBottom:10,color:'black'}}>{item.Message}</Text>
    <Text key={item.id} style={{marginLeft:20,fontSize:9,marginTop:2,marginBottom:10,color:'black'}}>{moment(item.time).format('MMMM DD YYYY, h:mm:ss A').toString()}</Text>
   </View>
   </TouchableOpacity>
  }
} catch (error) {
  <Text>Error</Text>
}
}
const messageComponent = React.useMemo (()=>{
return(
  <FlatList
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{paddingBottom:140}}
  ListFooterComponentStyle={{height:100}}
  ListHeaderComponent={()=> <>
    {backButton()}
    <View>
      <TouchableOpacity>
  <AvatarProfile profileName="Michael" hideContact={true} profileAvatar="https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"  />
  <View style={{height:1,width:width,backgroundColor:'#dcdde1'}}/>
  </TouchableOpacity>
  </View>
  </>
  }
  style={{marginBottom:10,height:'80%'}}
  data={messages}
  renderItem={({item}) =>
  // {Platform.OS}
 validateContent(item)
}
keyExtractor={item => item.Message}
/> 
)
},[messages])
const renderWriteText =()=>{
  try {
    return (<View style={{marginBottom:10,flexDirection:'row',alignContent:'space-around',alignItems:'center'}}>
      <TextInput   
      editable={true}
     multiline
     onChange={(e)=>setTypeMessage(e.nativeEvent.text)}
     value={typedMessage}
     scrollEnabled={true}
     numberOfLines={2 }
     style={{fontSize:13,height:40,padding:10,backgroundColor:'#f5f6fa',borderWidth:1,borderColor:'#bdc3c7',borderRadius:50,width:'80%',paddingTop:10,paddingLeft:15}}
     placeholder="Type your message here"
     maxLength={200}/>
     <TouchableOpacity onPress={() => sendMessage()} >
       {/* <Button title="Submit" style={{width:'auto',borderRadius:50,marginLeft:10,marginRight:10}} onPress={() => sendMessage()} > */}
       <Image source={sendMessageIcon}
              style={{width:25,height:25,marginLeft:25,marginRight:10
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 1 },
                // shadowOpacity: 0.5,
                // shadowRadius: 2,    
                }}
                 />
                 </TouchableOpacity>
                 {/* </Button> */}
    </View>)
  } catch (error) {
    console.log('renderWriteText error',error)
  }
}
function UUID(digits) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
  let uuid = [];
  for (let i = 0; i < digits; i++) {
      uuid.push(str[Math.floor(Math.random() * str.length)]);
  }
  return uuid.join('');
}
function sendMessage(){
  if (typedMessage != null) {
    let payload =  {idRoom:'MICHAEL-xxAA21312',Message:typedMessage,time:Date(),id: UUID(10),owner:Platform.OS}
     dynamicEmit("chatUser",{payload:payload}).then(() =>{
      
        setMessage((prevVals) => [...prevVals,payload])
        setTypeMessage(null)
        Keyboard.dismiss()
     })
  }
}
  return ( 
<KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
          {messageComponent}
     
            {/* <Text style={styles.header}>Header</Text>
            <TextInput placeholder="Username" style={styles.textInput} /> */}
            <View style={styles.btnContainer}>
            {renderWriteText()}
            
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    // backgroundColor: 'white',
    marginTop: 12,
  },
});

// const styles = StyleSheet.create({
  
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//     layout: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     container: {
//       flex: 1,
//       marginTop: 20,
//       // flex: 1,
//       backgroundColor: "#fff"
//       // alignItems: 'center',
//       // justifyContent: 'center',
//     },
//     map: {
//       width: Dimensions.get("window").width,
//       height: height ,  
//       //   width: Dimensions.get("window").width,
//       // height: 500,
//       // backgroundColor: '#EE5407',
//       justifyContent: 'center',
//       alignItems: 'center',
//       position: 'absolute', //Here is the trick
//     }
//   });
  