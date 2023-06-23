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
import CardJourney from '../../components/Journey/Card2'
import { CarMap, SmallArrow,Home } from '../../components/Svgs';
import { schedulePushNotification } from '../Cart/Notification';
import {Small,BigLoader,ButtonLoader,InstagramContent,ButtonLoaderStandard} from '../../components/Loader';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg, { Circle, Path, Line, Polyline, Rect ,SvgUri} from 'react-native-svg';
import Store from '../../components/Context/MapContext';
import { MapContext } from '../../components/Context/MapContext';
import PulseAnimation from '../../components/Utils/PulseAnimation';
import DashedLine from 'react-native-dashed-line';
import { BookingContext } from '../../components/Context/UserBookingContext';
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places';
import { axios ,axiosV2} from '../../components/Utils/ServiceCall';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { LoginRequired } from '../../components/Errors/LoginRequired';
import FloatingBar from '../../components/FloatingBar';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
import { notifyGroup,roomListenerStandard,getActiveUsers,setOnline,socket,dynamicEmit,onlinePhase3} from '../../components/Utils/SocketManager';
import * as Haptics from 'expo-haptics';
import LocationPicker from '../../components/Utils/UserLocation'
import MapView, { Marker,PROVIDER_GOOGLE } from "react-native-maps"; 
import AvatarProfile  from '../../components/Profile/Avatar'
import { useNavigation } from '@react-navigation/native';
import { Gyroscope } from 'expo-sensors';
import {ModifyThisLoad} from '../../components/Utils/UpdateLoad'
 const truckIcon = require('../../assets/images/truck-new.png'); 
 const boxIcon = require('../../assets/images/box-icon.png'); 
 const loadIcon = require('../../assets/images/customer-load-icon.png'); 
 const youarehere = require('../../assets/images/youarehere.png'); 

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Dashboard(props) {

	const {setUserVehicle,getCurrentUser,getCurrentUserLocation} = React.useContext(BookingContext);
  const navigation = useNavigation();   

  const isFocused = useIsFocused();
	const availableUsersV2 = useRef([]) 
  const [ availableLocalUsers, setUsers ] = useState([]);
  const [ bidValue, setBid ] = useState(1222);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [isSheetDisplay,setisSheetDisplay] =  useState(true);
  const [isEnabled,setIsEnabled] =  useState(false);
  const [selectedDriver,setSelectedDriver] =  useState(null);
  const snapPoints = useRef([ '15%']);
  // const snapPoints = React.useMemo(() => isEnabled ?  [ '30%','50%' ] :  [ '15%'], []);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  
  const validateUsersScreenState = ()=>{
    if (isFocused === false) {
      bottomSheetRef.current?.expand()
    } else {
      // snapPoints.current =
      bottomSheetRef.current.close()
    }
  }
  useEffect (()=>{
    if(isEnabled && selectedDriver != null) {
      bottomSheetRef.current?.expand()
    } if(isEnabled === false && selectedDriver == null) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    } 
    console.log('getCurrentUser()',getCurrentUser().extendProfile)
    // if (isFocused) {
    // let id =  "D6ES6N"
    // let payload = {reference:id,state:"didLogin",owner:"expo"}
    // let xxx = {room:cebu,payload}
    // let userCoordinates = Platform.OS === 'android' ?[{lat: getCurrentUserLocation().coordinates.latitude}, {long: getCurrentUserLocation().coordinates.longitude}] : [{lat:14.514462}, {long:121.03785}]
    //  setOnline({
    //       room: 'davao-trucking',
    //       payload: { reference: 'D6ES6N', state: 'didOnline',source:"expo",coordinates:userCoordinates,country:Platform.OS === 'android' ? "ph" : "ph", 
    //     }
    //     })
    //     dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
    // } else {
    //   console.log('getCurrentUserLocation()',getCurrentUserLocation()) 
    //   dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
    //   dynamicEmit("dynamic-leave-room",{payload:{room: 'davao-trucking'}})
    //   dynamicEmit("dynamic-leave-room",{payload:{room: 'room-onlineUser-ph'}})
    // }

  },[isFocused])
  // useContext (()=>{
  //   console.log('getCurrentUserLocation()',getCurrentUserLocation())
  //   validateUsersScreenState()
  //   dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
  // },[isFocused])
    
  const [subscription, setSubscription] = useState(null);

    useEffect(() => { 
    
    // socketListerner()
    getList()
    newJoiner()
    let userCoordinates = Platform.OS === 'android' ?[{lat:10.315699}, {long:123.885437}] : [{lat:14.514462}, {long:121.03785}]
       },[]);


        useEffect(() => { 
        console.log('i got rendered by availableLocalUsers')
       },[availableLocalUsers]);
 
      const _subscribe = () => {
        setSubscription(
          Gyroscope.addListener(gyroscopeData => {
            setData(gyroscopeData);
          })
        );
      };
      const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
      };
      useEffect(() => {
        _subscribe();
        
        // dynamicEmit("chatUser",{payload:{idRoom: 'MICHAEL-xxAA21312'}}).then((callback) =>{
        //   console.log('callback',callback)
        // })

        return () => _unsubscribe();
      }, []);
    let socketListerner = ()=> { 
        try {
            let cebu = "davao-trucking"
              let id =  "D6ES6N"
            let payload = {reference:id,state:"didLogin",owner:"expo"}
            let xxx = {room:cebu,payload}
            let userCoordinates = Platform.OS === 'android' ?[{lat:10.315699}, {long:123.885437}] : [{lat:14.514462}, {long:121.03785}]

            setOnline({
                room: 'davao-trucking',
                payload: {
                  user:getCurrentUser().extendProfile,
                  reference: 'D6ES6N', state: 'didOnline',source:"expo",coordinates:userCoordinates,country:Platform.OS === 'android' ? "ph" : "ph", 
              }
              })
              
   

        //   getActiveUsers().then(item=>{
        //         console.log('online user',item)
        //         let newUsers = availableUsers
        //         newUsers.push(item.data.payload.coordinates)
        //         setUsers(newUsers)
        // })


        } catch (error) {
            console.log('error in',socketListerner)
        }
    } 


    const updateNowService = (type,source)=>{
  
      // setStatus(true)
      let  haulDetails = {
        item:source
      }
      ModifyThisLoad(haulDetails,type,getCurrentUser(),getCurrentUserLocation()).then(item=>{
        // setStatus(false)
        var param = {
          title:`You have some updates from your load`,
          body: `[${haulDetails.item.referenceOrder}] Load has been updated!`,
        }
        let notif =   schedulePushNotification(param).then(()=>{
        }) 
        ToastAndroid.show('Item has been successfully loaded!', ToastAndroid.LONG);
        // navigation.goBack()
      })
    
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

    const mapList = async()=>{
      try {
        availableLocalUsers.map((information, index) => {
          console.log("MAP",information.type)
           if (information.type === "driver") {
            console.log('Driver --->>> ', information.userProfile)
           }
        })
      } catch (error) {
        
      }
    }
    let newJoiner = async()=>{
      try {
        roomListenerStandard("newJoiner",(data)=>{ 
          console.log("newJoiner")
            // if (availableLocalUsers.length === 0) {
            // setUsers([data.data.payload])  
            // console.log('SET',data.data.payload)
            // }else {
            console.log('PUSH',data.data.payload)
              setUsers((prevVals) => [...prevVals,data.data.payload])  
            // }
            // setUsers([])
          // }
            // Vibration.vibrate(5000)
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            )
            // Vibration.vibrate(10000)
          })

      } catch (error) {
        
      }
    }
    let getList = async()=> { 
        try {
              roomListenerStandard("userDidLoggedOut",(data)=>{ 
                let typeOfLoad = data.data.type
                mapList()
           if (typeOfLoad === "driver") {
            let driverId = data.data.userProfile.id
            let newOrderList = []
            setUsers(availableLocalUsers.filter(item=> item.id != data.data.id))
           }       else {
            // let userID = data.data.id
            // let filtered =  availableLocalUsers.filter(item=> item.id != userID)
            // console.log('userDidLoggedOut  yyyy',filtered)
            // setUsers(filtered)
           }
              }
              )


                roomListenerStandard("bidSuccess",(data)=>{ 
                  console.log(data)
                  console.log('biddddd',Platform.OS)
                      Alert.alert(`New bidder found!`, `${data.owner} has place bid ${data.bidValue} you only 5 seconds left.`, [ 
                        { text: 'Accept', onPress: () => console.log('None') },
                        { text: 'Cancel', onPress: () => console.log('None') },
                        ],{
                        cancelable: true,
                        })
                          
                  notifyUsers('Bidder Found', `${data.owner} has place bid ${data.bidValue}`)
                  // Alert('Your bid has been accepted  ')
                  })

                  roomListenerStandard("load-watcher",(data)=>{  
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    )
                    // if (availableLocalUsers.length === 0) {
                    //   setUsers([data.payload])  
                    //   }else {
                      console.log('PUSH',data.payload)
                        setUsers((prevVals) => [...prevVals,data.payload])  
                      // }
                  })

                  
                  // roomListenerStandard("chatUser-Init",{payload:{idRoom: 'MICHAEL-xxAA21312'}},(data)=>{ 
                  //   // if (10 >= availableLocalUsers ) {
                  //   //   setUsers((prevVals) => [...prevVals,data.data.payload.coordinates])
                  //   // }
                  //     // Vibration.vibrate(5000)
                  //     console.log('chatUser-Init data',data)
                  //     Haptics.notificationAsync(
                  //       Haptics.NotificationFeedbackType.Success
                  //     )
                  //     // Vibration.vibrate(10000)
                  //   })

                    


        } catch (error) {
            console.log("error in useMemo",error)
        }
    }


const renderMarker =  React.useMemo(()=>{  
    try { 
      var e = availableLocalUsers //getAllAvailableUsers()
      const items = []
      e.map((information, index) => { 
        

      if (information.type === "load") {
        let data = information.userTrip[0].departDetails.coordinates
        var latitude = data[1]
        var longitude = data[0]
        var assinedIcon = loadIcon
          // if (Platform.OS === "android") {
          //   items.push(<Marker
          //     tracksViewChanges={false} 
          //     key={index}
          //     onPress={(e)=> bottomSheetTapped(true,information)}
          //     coordinate = {{latitude: latitude,longitude:longitude}}
          //     description = {`Scheduled Depart: ${information.userTrip[0].selectedDate}`}
          //     title= {`${information.userTrip[0].depart } - ${information.userTrip[0].arrival}`}
          //     ><Image source={assinedIcon}
          //     style={{width:67,height:74,
          //       shadowColor: '#000',
          //       shadowOffset: { width: 0, height: 1 },
          //       shadowOpacity: 0.5,
          //       shadowRadius: 2,    
          //       }}
          //       />
          //     </Marker>)
          // } else {
            items.push(<Marker
              tracksViewChanges={false} 
              key={index}
              onPress={(e)=> bottomSheetTapped(true,information)}
              coordinate = {{latitude: latitude,longitude:longitude}}
              description = {`Scheduled Depart: ${information.userTrip[0].selectedDate}`}
              title= {`${information.userTrip[0].depart } - ${information.userTrip[0].arrival}`}
              ><Image source={assinedIcon}
                style={{width:67,height:74, 
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,    
                  }}
                  />
              </Marker>)
          // }
          // (information.type === "driver")
        }  else {
          let data = information.coordinates
          var latitude = data[0].lat
          var longitude = data[1].long
          var assinedIcon = truckIcon 
             items.push(<Marker
              tracksViewChanges={false} 
              // onPress={(e)=> bottomSheetTapped(true,information)} 
              key={index}
              coordinate = {{latitude: latitude,longitude:longitude}}
               ><Image source={getCurrentUser().id === information.id ?youarehere : assinedIcon}
                style={{width:67,height:74,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,    
                  }}
                   />
               </Marker>)
          }
     
      })
      return items
    } catch (error){
      console.log(availableLocalUsers,'error in map marker',error)
    return   null
  }
  },[availableLocalUsers])

 function setDefaultSheetIndex(type){
  if (type === 0) {
    snapPoints.current = ['1%','45%' ]
  }else {
    snapPoints.current =[ '15%','45%' ]
  }
  bottomSheetRef.current?.close()
  // isEnabled ?  [ '15%','45%' ] :  [ '2%','15%']
 }
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
        
        onRegionChangeComplete={()=>setDefaultSheetIndex(0)}
        onRegionChange={()=> setDefaultSheetIndex(1)}
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
      <View style={{marginTop:60,width:'auto',right:20,position:'absolute',opacity:isEnabled ? 1:0}}>
        <TouchableOpacity>
        <View style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1.2
          },
          shadowOpacity: 0.3,
          shadowRadius: 5.84,
          elevation: 0.2,
          backgroundColor:'white',alignContent:'center',justifyContent:'center',alignItems:'center',height:45,borderRadius:50,flexDirection:'row'}}>
         <View style={{backgroundColor:'black',borderRadius:50,width:30,height:30,marginLeft:5,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white',fontSize:9}}>{availableLocalUsers.length}</Text></View><Text style={{color:'black',fontWeight:'bold',fontSize:11,margin:5}}>Found</Text>
         </View>
        </TouchableOpacity>
      </View>
      {/* <View style={{marginTop:110,width:'auto',right:20,position:'absolute',opacity:isEnabled ? 1:0}}>
        <TouchableOpacity>
        <View style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1.2
          },
          shadowOpacity: 0.3,
          shadowRadius: 5.84,
          elevation: 0.2,
          backgroundColor:'white',alignContent:'center',justifyContent:'center',alignItems:'center',height:45,borderRadius:50,flexDirection:'row'}}>
         <View style={{backgroundColor:'black',borderRadius:50,width:30,height:30,marginLeft:5,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white',fontSize:9}}>{availableLocalUsers.length}</Text></View><Text style={{color:'black',fontWeight:'bold',fontSize:11,margin:5}}>Available Load</Text>
         </View>
        </TouchableOpacity>
      </View> */}
  </React.Fragment>)
   } catch (error) {
    console.log('error in map',error)
   }
  },[availableLocalUsers,isEnabled])
  const openCall = (e) => {
    try {
      const operator = Platform.OS === 'android' ? '?' : '&'
      console.log('profileEmail',operator)
      Linking.openURL(`tel:${+e.userProfile.meta_details.contactNumber}`);
    } catch (error) {
      console.log('error openCall',e,error)
    }

  }
    const placeBidService = async ()=>{
      // if (bidValue === 0) {
      //   return
      // }


      // dynamicEmit("placeBid",{bidValue:bidValue,owner:Platform.OS})
      // setBid(0)
      // Keyboard.dismiss()
    }
    // const journeyContent = () =>{
    //     try {
    //       return 
    //     } catch (error) {
          
    //     }
    // }
    const navigateToLoadDetails =(data)=>{
      navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: data,type:'readOnly' ,viewType:"dashboard"} } )
    }
    function currencyFormat(num) {
      try {
        if (num != null) {
          return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') 
        }
        return "No amount delacred " 
      }catch {
        return "No amount delacred "
      }
 
    }

  const openSMS = () => {
    const operator = Platform.OS === 'android' ? '?' : '&'
    // Linking.openURL(`sms:${+profileEmail}${operator}body=Hi ${profileName}! Kumusta po.`);
  }
  // const openCall = () => {
  //   const operator = Platform.OS === 'android' ? '?' : '&'
  //   console.log('profileEmail',operator)
  //   Linking.openURL(`tel:${+profileEmail}`);
  // }
    const renderLoadComponent = ()=>{
      try {
        console.log('selectedDriver',selectedDriver)
     
        return <><View style={styles.contentContainer}>
                    </View>
               <View style={{position:'absolute',top:0,right:20 }}>
               <Text style={{marginLeft:20,fontSize:24,fontWeight:'bold'}}>{currencyFormat(200)}</Text>
  </View>
  <View style={{width:10,height:40}}/>
 <CardJourney 
   journey={selectedDriver.trips[0]}
    details={selectedDriver} 
    didView={()=>
      navigateToLoadDetails({item:selectedDriver})
    }
    />
    <Text style={{marginLeft:24}} category='c1'>Shipper notes:</Text>
     <TextInput   
     
         editable={false}
     multiline
     scrollEnabled={true}
     value={selectedDriver.trips[0].shipperNotes}
     numberOfLines={selectedDriver.trips[0].shipperNotes === "" ?1 :3 }
     style={{fontSize:12,padding:10,backgroundColor:'#ffffff',color:'black',borderWidth:1,borderColor:'#f5f6fa',borderRadius:5,marginRight:24,marginLeft:24,marginTop:10,marginBottom:20}}
     placeholder="No details were added"
  
     maxLength={200}/>
      <View style={{width:10,height:40}}/>
        <View style={{flexDirection:'row',justifyContent:'center',alignContent:'space-between'}}>
        {/* <TouchableOpacity  onPress={()=>  openCall({contactNumber:'09363673900'})} >
            <View style={{width:width / 2.5,height:45,borderRadius:50,opacity:false ? 0.5: 1 ,backgroundColor: false ? false  === null ? 'gray': '#f1f2f6' : '#f1f2f6',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'black',fontSize:11,fontWeight:'bold'}}> Call </Text>
            </View>
               </TouchableOpacity> */}
               <View style={{width:10,height:10}}/>
               <TouchableOpacity  onPress={()=> updateNowService('On-Scheduled',selectedDriver)}  >
            <View style={{width:width / 2.5,height:45,borderRadius:50,opacity:false ? 0.5: 1 ,backgroundColor: false ? false  === null ? 'gray': '#0652DD' : '#0652DD',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'white',fontSize:11,fontWeight:'bold'}}>  {false ? 'Loading...':'Get this load'}</Text>
            </View>
               </TouchableOpacity> 
          </View>
          <TouchableOpacity  onPress={()=>  bottomSheetRef.current.close()} >
            <View style={{
              marginLeft:20,
              marginTop:16,
              marginBottom:24,
              width:width - 48 ,height:45,borderRadius:50,opacity:false ? 0.5: 1 ,backgroundColor: false ? false  === null ? 'gray': 'white' : 'white',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
               <Text style={{color:'black',fontSize:11,fontWeight:'bold'}}> {false ? 'Loading...':'Close'}</Text>
            </View>
               </TouchableOpacity>
          </>
      } catch (error) {
        console.log('error render load',error)
        return null
      }
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
  const navigateToChat = ()=>{
      try {
        navigation.navigate('PrivateChatMessage');
      } catch (error) {
        console.log('error ',error)
        alert('error')
      }
  }
  const backButton =()=>{
    return (

      <React.Fragment>
          <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity: 1}} >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:'100%',height:30  }}/>
                </TouchableOpacity>
              </View>
         </React.Fragment>
    )
  }
  
  const bottomSheetTapped = (show,driver)=>{
    console.log('bottomSheetTapped driver',driver.type) 

    let newDetails = {}
    try {
      // if (driver.type === undefined ) { 
      //    if (driver.type === "load") {
      //     driver  = driver.loadDetails
      //     driver.type = driver.loadDetails.type
    
      //     newDetails = driver
      //    }
 
      // } else {

        newDetails  = driver
        // newDetails.type = driver.type 
      // }

      console.log('dsadsa',newDetails)
      setSelectedDriver(newDetails)
      if (!show) {
        bottomSheetRef.current.close()
      } else {
        bottomSheetRef.current?.expand()
    }
    } catch (error) {
      console.log('error bottomSheetTapped',error,"driver",driver)
    }
}
const validateContent =()=>{
try {
  if (isEnabled) {
    return selectedDriver.type === "load" ?  renderLoadComponent() : onlineContent()
    // 
   } else {
  
    return offLineContent()
   }
} catch (error) {
  console.log(selectedDriver,'error validateContent')
}
}
const offLineContent =()=>{
  return <>
  
  <View style={{alignContent:'center',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
        {/* <Switch
        style={{marginRight:20}}
       trackColor={{ false: "#767577", true: "#ced6e0" }}
       thumbColor={isEnabled ? "#6ab04c" : "#f4f3f4"}
       ios_backgroundColor="#3e3e3e"
       onValueChange={setIsEnabled}
       value={isEnabled}
     /><Text>{isEnabled ? 'set offline':'set online' }</Text>  */}
       <Text style={{fontSize:24,fontWeight:'bold',marginBottom:10,color:'#2f3640'}}>You're offline</Text> 
     <Text>Switch to online and receive active loads</Text> 
     <Image source={{ uri: 'https://cdn.dribbble.com/users/1696284/screenshots/6305013/landing_page_4x.jpg?compress=1&resize=1600x1200&vertical=center' }} style={{ borderRadius: 75, width: 250, height: 250, marginBottom: 10}} />
     </View>
  </>
}
const onlineContent = ()=>{
try {
  if (selectedDriver === null) {
    return  <><View style={styles.contentContainer}>
<Text>Choose a loads in the map</Text>
      </View>
    </>
  }else {

    return  <><View style={styles.contentContainer}>
    {/* <TouchableOpacity  onPress={() => bottomSheetTapped(false)}>
                  <View
                    style={{
                      backgroundColor: 'One-Way' === 'One-Way' ? '#dfe4ea' : 'white',
                      top:120,
                      left:20,
                      width: 55,
                      marginBottom:20,
                      height: 25,
                      borderRadius: 50 / 2,
                      justifyContent: 'center',
                      alignContent: 'center'
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 0,
                        color: 'One-Way' === 'One-Way' ? 'black' : 'black'
                      }}
                      category="c2"
                    >
                    Close
                    </Text>
    
                  </View>
                </TouchableOpacity> */}
                </View>
           {/* <View style={{marginTop:20}}/>
                <TouchableOpacity  >
        <View style={{width:width / 2,height:45,borderRadius:50,opacity:false ? 0.5: 1 ,backgroundColor: false ? false  === null ? 'gray': 'black' : 'black',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
           <Text style={{color:'white',fontSize:18}}> {false ? 'Loading...':'Contact Driver'}</Text>
        </View>
           </TouchableOpacity> */}
           <View style={{position:'absolute',top:0,right:20 }}>
            <Image source={{ uri: 'https://media.istockphoto.com/id/1323991184/vector/white-van-box-cargo-truck-with-refrigerator-concept-isometric-3d-illustration-isolated-on.jpg?s=612x612&w=0&k=20&c=RiftUyV36lQpu-X0QfXzOzbOyfVVWErasa6L35tQJjU=' }} style={{ borderRadius: 75, width: 100, height: 100, marginBottom: 10}} />
            </View>
    <AvatarProfile dateJoined={Date()} hideContact={true} profileAvatar={'https://ui-avatars.com/api/?background=0D8ABC&color=fff'} profileEmail={'michaelraffinpaculba@gmail.com'} profileName={selectedDriver.name}/>
    <TextInput   

    returnKeyType = {"next"}
    inputAccessoryViewID={"xxx"}
     multiline
     value={'Open for any spots from Manila to Davao Pasabay or any'}
    //  onChangeText={nextValue => didType(nextValue, index, 'shipperNotes')}
     numberOfLines={2}
     style={{padding:10,backgroundColor:'#f5f6fa',borderWidth:1,borderColor:'#f5f6fa',borderRadius:5,height:50,marginRight:20,marginLeft:38,marginTop:10,marginBottom:20}}
     placeholder="e.g. Not yet paid, No Receipt and others"
     editable={false}
     maxLength={200}/>
    {/* <Text category='c2' style={{marginLeft:20,fontWeight:'bold',color:'#2f3542'}}>Pickup Load</Text>
    <Text category='c2' style={{marginLeft:20,fontWeight:'normal'}}>Iligan City</Text>
    <View style={{marginTop:20}}/>
    <Text category='c2' style={{marginLeft:20,fontWeight:'bold',color:'#2f3542'}}>Drop Load</Text>
    <Text category='c2' style={{marginLeft:20,fontWeight:'normal'}}>Cebu City, Tagoloan River side</Text> */}
    {/* <View style={{marginTop:20}}/> */}
    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'space-between'}}>
    <TouchableOpacity onPress={()=>openCall(selectedDriver)}  >
        <View style={{width:width / 2.5,height:45,borderRadius:50,opacity:false ? 0.5: 1 ,backgroundColor: false ? false  === null ? 'gray': '#6ab04c' : '#6ab04c',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
           <Text style={{color:'white',fontSize:18}}> {false ? 'Loading...':'Call this person'}</Text>
        </View>
           </TouchableOpacity>
           <View style={{marginLeft:10,marginRight:10}}/>
           {/* <TouchableOpacity onPress={()=>navigateToChat(selectedDriver)}  >
        <View style={{width:width / 2.5,height:45,borderRadius:50,opacity:false ? 0.5: 1 ,backgroundColor: false ? false  === null ? 'gray': '#6ab04c' : '#6ab04c',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
           <Text style={{color:'white',fontSize:18}}> {false ? 'Loading...':'Book'}</Text>
        </View>
           </TouchableOpacity> */}
           
      </View></>
  }
} catch (error) {
  console.log('error')
  return  null
}
}
function convertUserstoJson(e){
  try {
  console.log('convertUserstoJson',e.length)

    e.map(item =>{
      console.log('users',  JSON.parse(item))
      if ( JSON.parse(item).type === 'driver') {
       if ( JSON.parse(item).id!=  getCurrentUser().id) {
        setUsers((prevVals) => [...prevVals, JSON.parse(item)])  
       }
      } else {
        if ( JSON.parse(item).id!=  getCurrentUser().id) {
        setUsers((prevVals) => [...prevVals, JSON.parse(item)])  
        }
      }
    
    })
  } catch(error){

  }
}
function updateOffline(e){
  console.log('updateOffline',e)
  setIsEnabled(e)
  // setUsers([])
  let id =  "D6ES6N"
  let cebu = "davao-trucking"
  let userID = getCurrentUser().id
  try {
  if (e) {
    bottomSheetRef.current?.close()
    let payload = {reference:id,state:"didLogin",owner:"expo"}
    let xxx = {room:cebu,payload}
    // console.log('getCurrentUserLocation().coordinates',getCurrentUserLocation().coordinates)
    // let userCoordinates =  [{lat:14.514462}, {long:121.03785}]
  
    // let userCoordinates = Platform.OS === 'android' ? [{lat: getCurrentUserLocation().coordinates.latitude}, {long: getCurrentUserLocation().coordinates.longitude}] : [{lat:14.514462}, {long:121.03785}]
    let userCoordinates = [{lat: getCurrentUserLocation().coordinates.latitude}, {long: getCurrentUserLocation().coordinates.longitude}]  
    onlinePhase3("onlineUser",{payload:{
      type:'driver',
      id:userID,
      userProfile:{id:userID,meta_details:getCurrentUser().extendProfile}, 
      room:cebu,
      reference: 'D6ES6N', 
      state: 'didOnline',
      source:`expo-${Platform.OS}`,
      coordinates:userCoordinates,
      country:Platform.OS === 'android' ? "ph" : "ph", 
  }},(e)=>{
    // console.log('here your data',e.online)
    convertUserstoJson(e.online)
  })

  // .then((response)=>{
  //   console.log('here your data',response.online)
    
  // })
  dynamicEmit("load-booking-watcher",{payload:{room: 'checkAllBookings'},room:'checkAllBookings'})

    //  setOnline({
    //       room: 'davao-trucking',
    //       payload: { reference: 'D6ES6N', state: 'didOnline',source:"expo",coordinates:userCoordinates,country:Platform.OS === 'android' ? "ph" : "ph", 
    //     }
    //     })
        // dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})

    } else {
     bottomSheetRef.current?.expand()
     let filtered =  availableLocalUsers.filter(item=> item != userID)
  
      console.log('getCurrentUserLocation()',getCurrentUserLocation()) 
      dynamicEmit("dynamic-leave-room",{payload:{room: 'room-checkAllBookings'}})  // Received all bookings

      // dynamicEmit("dynamic-leave-room",{payload:{room: 'load-booking-watcher'}})
      // dynamicEmit("dynamic-leave-room",{payload:{room: 'notify-city-group'}})




      dynamicEmit("dynamic-leave-room",{payload:{room: 'checkAllBookings'}})
      dynamicEmit("dynamic-leave-room",{payload:{room: 'room-chatUser-MICHAEL-xxAA21312'}})
      dynamicEmit("dynamic-leave-room",{payload:{room: 'davao-trucking'}})
      dynamicEmit("dynamic-leave-room",{payload:{room: 'room-onlineUser-ph'}})
      dynamicEmit("userLoggedOut",{
        payload: 
        {type:'driver',
        id:userID,
          userProfile:{id:userID,meta_details:getCurrentUser().extendProfile},
         room:cebu, reference: 'D6ES6N', state: 'didOnline',source:`expo-${Platform.OS}`,country:Platform.OS === 'android' ? "ph" : "ph", 
    }}) 
    setUsers([])
    }

  } catch (error) {
    console.log('error updateOffline',error)
    alert('error')
  }

}
 
const renderBottomSheetContent = React.useMemo(()=>{
    try {
      return <>
      <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose={isEnabled ? true:false}
      animateOnMount={true}
      style={{shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, }}
      snapPoints={snapPoints.current }
      onChange={(e)=>console.log(e)}
    ><View>{validateContent()}
       </View>
    </BottomSheet>
    </>
    } catch (error) {
      
  }
},[selectedDriver,isEnabled,snapPoints])
  return (
    <>
    <View style={styles.container}>
    {mapViewContent}
    <View style={{marginTop:60,width:'auto',right:width / 2.5,position:'absolute'}}>
       <Switch
        style={{marginRight:20}}
       trackColor={{ false: "#767577", true: "#ced6e0" }}
       thumbColor={isEnabled ? "#6ab04c" : "#f4f3f4"}
       ios_backgroundColor="#3e3e3e"
       onValueChange={(e)=>updateOffline(e)}
       value={isEnabled}
     />
       </View>
    {/* <PulseAnimation/> */}
    {renderBottomSheetContent}
    {backButton()}
    <LocationPicker hide={true} errorMessage={'To get accurate loads, allow Loogy to access your location'}/>
  </View>
  </>
  )
    // return <View style={styles.container}>
    //   {/* {backButton()}
    //   {renderBiddingComponent()}
    //   <View style={{marginTop:120,width:'auto',right:20,position:'absolute'}}>
    //     <TouchableOpacity>
    //     <View style={{
    //       shadowColor: "#000",
    //       shadowOffset: {
    //         width: 0,
    //         height: 1.2,
    //       },
    //       shadowOpacity: 0.3,
    //       shadowRadius: 5.84,
    //       elevation: 0.2,
    //       backgroundColor:'white',alignContent:'center',justifyContent:'center',alignItems:'center',height:45,borderRadius:50,flexDirection:'row'}}>
    //      <View style={{backgroundColor:'black',borderRadius:50,width:30,height:30,marginLeft:5,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white',fontSize:9}}>
    //       {availableLocalUsers.length}</Text></View><Text style={{color:'black',fontWeight:'bold',fontSize:11,margin:5}}>X10321</Text>
    //       </View>
    //     </TouchableOpacity>
    //   </View> */}
    //   {/* {mapViewContent} 
    //   {renderBiddingComponent()} */}
    //   <BottomSheet
		// 		ref={bottomSheetRef}
    //     index={1}
		// 		style={{shadowColor: "#000",
		// 		shadowOffset: {
		// 			width: 0,
		// 			height: 2,
		// 		},
		// 		shadowOpacity: 0.25,
		// 		shadowRadius: 3.84,
		// 		elevation: 5, }}
		// 		snapPoints={snapPoints}
		// 		><View style={{height:200,width:width}}>
    //       <Text>WELCOME TO BOTTOM SHEET</Text>
    //       </View></BottomSheet>
    //       {mapViewContent} 
    //   <LocationPicker hide={true} errorMessage={'To get accurate loads, allow Loogy to access your location'}/>
    // </View>

    
  
}


const styles = StyleSheet.create({ 
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
    layout: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      marginTop: 0,
      // flex: 1,
      backgroundColor: "#fff"
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    map: {
      width: Dimensions.get("window").width,
      height: height ,  
      //   width: Dimensions.get("window").width,
      // height: 500,
      // backgroundColor: '#EE5407',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', //Here is the trick
    }
  });
  
      //   if (Platform.OS === "android") {
      //     items.push( 
      //       <Marker
      //       tracksViewChanges={false} 
      //       onPress={e => bottomSheetTapped(true,information.userProfile.meta_details)}
      //       key={index}
      //       coordinate = {{latitude: latitude,longitude:longitude}}
      //         title= {`${information.userProfile.meta_details.name}`}
      //         description= {`${information.userProfile.meta_details.logisticName}`}
      //        ><Image source={truck}
      //         style={{width:100,height:45,
      //           shadowColor: '#000',
      //           shadowOffset: { width: 0, height: 1 },
      //           shadowOpacity: 0.5,
      //           shadowRadius: 2,    
      //           }}
      //            />
      //        </Marker>
      //     ) 
      //   } else {
      //     let user = information.userProfile.meta_details
      //     items.push( 
      //       <Marker
      //       calloutOffset={{x: -20.0, y: 4.0}}
      //       onCalloutPress={()=> console.log('onCalloutPress')} 
      //       onPress={e => bottomSheetTapped(true,information.userProfile.meta_details)}
      //       key={0}
      //       coordinate = {{latitude: latitude,longitude:longitude}}
      //       title= {`${user.name}`}
      //        description= {`${user.contactNumber}`}
      //       ><Image source={truck}
      //         style={{width:100,height:45,
      //           shadowColor: '#000',
      //           shadowOffset: { width: 0, height: 1 },
      //           shadowOpacity: 0.5,
      //           shadowRadius: 2,    
      //           }}
      //            />
      //       </Marker>
      //     ) 
      //   }