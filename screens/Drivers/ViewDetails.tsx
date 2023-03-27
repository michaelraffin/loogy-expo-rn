import  React,{componentDidMount,useEffect,useState,PureComponent,useRef, useContext,useMemo,useCallback}from 'react';
import {Animated, Easing,Alert,Switch,ToastAndroid,SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Tooltip,Button,Divider,Input,Toggle} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
import ThemeColor from '../../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../../components/Utils/StoreDetails'
import  moment from 'moment'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location"; 
import DateTimePicker from '@react-native-community/datetimepicker';
import QRCode from 'react-native-qrcode-svg';
// import Toast from 'react-native-toast-message'; 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import { useIsFocused } from '@react-navigation/native';
import {CheckMark,SmallArrow} from '../../components/Svgs'
import {schedulePushNotification} from '../Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg,{Circle,Path,Line,Rect} from "react-native-svg"
import Store from  '../../components/Context/MapContext'
import {MapContext} from '../../components/Context/MapContext'
import DashedLine from 'react-native-dashed-line'; 
import {BookingContext} from  '../../components/Context/UserBookingContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
// import Toast from 'react-native-simple-toast';

import Toast from 'react-native-toast-message';

import io  from "socket.io-client"
import {LoginRequired} from '../../components/Errors/LoginRequired'
import CardJourney from '../../components/Journey/Card'
import AvatarProfile  from '../../components/Profile/Avatar'
import MapView, { Marker,Polyline ,PROVIDER_GOOGLE} from "react-native-maps";
import { BigLoader,TinyLoader } from '../../components/Loader';
import NavigationSheet from '../../components/Journey/NavigationSheet'
import {ModifyThisLoad} from '../../components/Utils/UpdateLoad'
import BottomSheet,{BottomSheetFlatList} from '@gorhom/bottom-sheet';
import iconSet from '@expo/vector-icons/build/FontAwesome5';  
import { Small } from '../../components/Loader/Loader';

// const socket = ws('http://192.168.1.148:9093')
// exp://192.168.1.148:19000



// MapboxGL.setAccessToken('pk.eyJ1IjoibWFtbmlkeiIsImEiOiJjanZsNnhhZ24wdDE1NDlwYmRvczJzNDk2In0.Bl06Qp0TgR-KfisAsKbciQ');
// var ws = new WebSocket('http://192.168.1.148:3000'); 
// import MapboxGL from "@rnmapbox/maps";
// const mqtt = require('mqtt/dist/mqtt') 

export default  function fallBackScreen(props,{route}){
  let  urlphone  = "172.20.10.3"
  let lan = "192.168.1.148"
  const socket = io(`http://${urlphone}:9093`);  
  var route = props.route	 
	var navigation = props.navigation 

  const isFocused = useIsFocused();
  const  [isReady,setDataReady] = useState(false)
  const [backloadDate, setBackloadDate] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [calendarStatus, setCalendar] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [category, setCategory] = useState('One-Way');
  const [results, setResult] = useState('One-Way');
  const [status, setStatus] = useState(true);
  const [userProfile, setUserProfile] = useState({user_details :{applicantType:''}});
  const {referneceOrder,type,viewType} = route.params;
  const [haulDetails, setLoadDetails] = useState(null);
  const [currentRoute, setSelectedRoute] = useState(null);
  const [didViewAs, setUserTypeView] = useState(type);
  const scrollViewRef = useRef(null);
  const [isSameLoad,setSameLoad] = useState(false);
  const {setUserVehicle,getCurrentUser,getCurrentUserLocation,driverDetails} = useContext(BookingContext);
  const [profile, setProfile] = useState({profileID:'C07-0508'});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigatedDirection = useRef(null); 
  const [sheetIndexRef,setSsheetIndexRef] =  useState(1);
  const [isSheetDisplay,setisSheetDisplay] =  useState(false);
  const [isNavigateContent,setNavigateContent] =  useState(false);
  const snapPoints = useMemo(() => ['10%','50%',Platform.OS === 'android'  ? '95%' :'35%'], []); 
  const completedPoints = useMemo(() => ['75%','76%'],[]); 
  const navigationOptionPoints = useMemo(() => ['10%','20%'], []); 
  let opacity = new Animated.Value(1);
  let opacityV2 = useRef(new Animated.Value(0)).current 
  let showHideView = useRef(new Animated.Value(0)).current 
  const [isDidload,setDidLoad] = useState(false);
  const listener = (...args) => {
      
    var param = {
      title:`LOAD-${args[0].reference} update`,
      body: `Sorry, load has been taken by someone by ${args[0].viewedBy}`,
    }
    let notif =   schedulePushNotification(param).then(()=>{
    }) 
      // ToastAndroid.show(`${args[0].viewedBy} is wiewing`, ToastAndroid.SHORT);
  }
  
  console.log('route.params',viewType)
  const initiateSocketConnection = () => {
    getProfileAccount().then(profile=> {
      var profileS =  profile.data.data[0].user_details
      // socket.on("connect", (connectSocket) => {
      //   connectSocket.on("view_delivery", listener);
      // socket.emit("view_delivery", {data:haulDetails,user:userProfile})
      // }) 
    })
  }
  const scannedData = async (data)=>{

    var payload = {
      "queryType":"custom",
      "isAPI":true,
      "queryData":{"$or": 
    [
    {"referenceOrder": data},
    {"referenceOrder": data}
    ]}
    }
    try {
      const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post("/store/LoogyPooling", payload);
      console.log('resposne',response.data.results[0])
      let params = {referneceOrder: { item:response.data.results[0]},viewType:"camera"}
       
    } catch (error) {
      
    }
  }
  const testSocket = ()=>{
    socket.emit("room_view_details"+referneceOrder, {data:haulDetails,user:userProfile});
  }

  useEffect(() => {   
    if(isFocused){
        socket.on("connect", (connectSocket) => {
      
         // Notify Socket 
        socket.emit('room_view_details',  {data:haulDetails,user:userProfile});
        // socket.emit('room_view_details-callback',  ({data:haulDetails,user:userProfile},message) =>{
        //   console.log('callback succesfully joined',message)
        // });

       // Observed Socket
        // socket.on(referneceOrder)
        socket.on("room_view_details", listener);
      }) 
      if (haulDetails != null ) {
        console.log('soccket')
        // socket.on(haulDetails.item.referenceOrder, listener);
        socket.on('room_view_details', listener);
      }
    }else {
      socket.disconnect()
      socket.close()
    }
    
    // socket.on("view_delivery-"+referneceOrder, listener); 
  },[referneceOrder,userProfile])


  // useEffect(() => {   
  //   if (haulDetails != null ) {
  //     console.log('soccket')
  //     // socket.on(haulDetails.item.referenceOrder, listener);
  //     socket.on('room_view_details', listener);
  //   }
  // },[socket])


  useEffect(() => {   
    
    try {
      //  console.log('referneceOrder miks',referneceOrder,viewType)
       if (viewType == 'camera') {
        scannedData(referneceOrder.item).then(result =>{ 
          setLoadDetails({item:result})
          setDataReady(true)
        })
       }else {
        setLoadDetails(referneceOrder)
      setStatus(false)
      setDataReady(true)
       } 
      
      getProfileAccount().then(profile=> {
        setUserProfile(profile.data.data[0].user_details)
      })
      Animated.spring(opacityV2,{toValue:1,useNativeDriver:true}).start();
    } catch (error) {
      console.log('error useEffect',error)
      return alert('errro found in useEffect')  
    }

    
}, [referneceOrder])

  const deleteLoad = ()=>{
    console.log(getCurrentUser().authToken,getCurrentUser().id)
    // Toast.show({
    //   type: 'tomatoToast',
    //   // And I can pass any custom props I want
    //   props: { uuid: 'bba1a7d0-6ab2-4a0a-a76e-ebbe05ae6d70' }
    // });
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });

    ToastAndroid.show('Please wait, load has been processing....', ToastAndroid.SHORT);
  
      setStatus(true)
      deleteLoadService(haulDetails.item).then(item=>{
        setStatus(false)
        navigation.goBack()
        ToastAndroid.show('Load has been deleted...', ToastAndroid.LONG);
      })
  }
  async function deleteLoadService(e){
    var payload = {
      "_id":e._id,
      "reference":e.referenceOrder
    }
    try {
      const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post("/deleteProduct", payload);
      console.log('resposne',response.data.results[0])
      return 
       
    } catch (error) {
      
    }
  }
  const handleSheetChanges = useCallback((index: number) => {
    if ( haulDetails === null || haulDetails.item.status === 'Completed') {
      return
    }
  setSsheetIndexRef(index)
  Animated.spring(opacityV2,{toValue:index === 0 ? 0 :1,useNativeDriver:true}).start();
  }, []);

  
  const getBackgroundLevel = () =>{
    switch (sheetIndexRef) {
      case 0:
        return 1
      case 1:
          return 1
        break;
      default:
        return 0.2
        break;
    }
  }
  const didTappedDisplaySheet = (e)=>{
    console.log('selected navia',e)
    
    setSelectedRoute(e)
    navigatedDirection.current = e
    setNavigateContent(true)
    bottomSheetRef.current?.snapToIndex(1)




    // bottomSheetRef.current?.snapToIndex(1)
    // setisSheetDisplay(true)
    
  }
  const displayGoButton =(e)=>{
    return <Button 
    onPress={()=>  didTappedDisplaySheet(e)}  
    accessoryLeft={()=><Image  source={{uri:'https://localflowershop.sgp1.digitaloceanspaces.com/product/1653673788322-icons8-navigation-50%20%281%29.png'}}  style={{width:18,height:18 }}/>} status='success' style={{backgroundColor:'#0652DD',borderColor:'#0652DD',width:width/4,borderRadius:5,marginRight:40}}>GO</Button>
  }
  const displayItems=(e)=>{
    const content = [<View/>] 
    try { 
     e.trips.map((data, index) => {
      {console.log(e)}
       content.push(
         <>
         <CardJourney journey={data} referenceOrder={e.referenceOrder}/>
         <Text category='c1' style={{marginLeft:24}}>Notes</Text>
         <TextInput   
         editable={false}
     multiline
     scrollEnabled={true}
     value={data.shipperNotes}
     numberOfLines={data.shipperNotes === "" ?1 :3 }
     style={{padding:10,backgroundColor:'#f5f6fa',borderWidth:1,borderColor:'#f5f6fa',borderRadius:5,marginRight:24,marginLeft:24,marginTop:10,marginBottom:20}}
     placeholder="No details were added"
  
     maxLength={200}/>
         <TouchableOpacity
          onPress={()=> didTappedDisplaySheet(data) } 
         >
           <View style={{alignContent:'center',alignItems:'flex-end',backgroundColor:'white'}}>
         {haulDetails.item.transactionLogs === undefined ? null :haulDetails.item.status === 'On-Scheduled' ? displayGoButton(data) : null }
         {haulDetails.item.transactionLogs === undefined ? null :haulDetails.item.status === 'In-Transit' ? displayGoButton(data) : null }
         <Divider/>
         </View>
         </TouchableOpacity>
         </>
       ) 
     })
     return content
    }catch (error){
      console.log('error display journey',error)
      return <View/>
    }
    }

  const displayVehicleType = (data) => {
    try {
      return (
        <TouchableOpacity
          >
          <View style={{
              flexDirection:'row',
                height:'auto',
                borderRadius:20,
                margin:20,
            }}>
            <View style={{width:100,
              alignItems:'center',
              justifyContent:'center'}}>
                  <Image    resizeMode='contain' source={{uri:data.imageUrl}} style={{width:'100%',height:100,marginLeft:20}}/>
                </View>  
                  <View style={{flex:1,width:'70%'}}>
                  <Text style={{marginLeft:20,marginTop:10,fontWeight:'700',  color:'#747d8c',}} category='h6' >{data.name !== undefined ? data.name : data.name}</Text>
                  <Text style={{marginLeft:20,marginTop:10,marginRight:20}} category='c1'  >{'data.id '=== 'selectedVehicle'  ? displayDescription(data.description)  :data.description }</Text> 
                
                </View>    
            </View> 
            </TouchableOpacity>
      )
    }catch {
      return <Text>Error displayVehicleType </Text>
    }
    
  }

  function currencyFormat(num) {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  const getLastDateService=(e)=>{
    try {
    var data =  haulDetails.item.trips[haulDetails.item.trips.length - 1]
    } catch (error) {
      return moment(new Date() ).add(1, 'd').toDate()
    }
  }
  const displayFooter = (price) => {
    try {
      return (
        <React.Fragment >
      <View style={{backgroundColor:'white',height:40,marginTop:0}}> 
            <Layout style={styles.container} level="1">
              <Text style={styles.subTotal} category="h6">
                Offered Price
              </Text>
              <Text style={styles.subTotalItem} category="c1">
               {true ? Platform.OS === 'android' ? currencyFormat(Number(haulDetails.item.offeredPrice)) : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(haulDetails.item.offeredPrice)) : '0.00'}
              </Text>
            </Layout> 
            </View>
            <Divider/> 
            <View >
              {checked ?  <Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
              <View status='control' style={{margin:20}}>
              <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
              Backload Note:
              </Text>
               <Text    category="c1"style={{marginTop:5}}   >
               Backload is activated, your warehouse address :<Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >Main avenue 5th Ave.Quezon City, Metro Manila, PH</Text>
               </Text>
               {Platform.OS === 'android' ?    <TouchableOpacity  onPress={()=>setCalendar(!calendarStatus)}>
           <View style={{marginTop:20,width:'auto',height:40,borderRadius:50,opacity:status ? 0.5: 1 ,backgroundColor:'white',flexDirection:'row',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
               <Text style={{color:'black',fontWeight:'bold'}}> {backloadDate === null ?'Set your Backload Date':backloadDate}</Text> 
              <TouchableOpacity  disabled={status} onPress={()=>setCalendar(!calendarStatus)} style={{zIndex:1}}><View style={{backgroundColor:'white',marginLeft:20,height:25,width:25,zIndex:1, borderRadius: 25}}>
              <View style={{width:30,height:30,borderRadius:50/2}}>
              <Svg  xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color={'black'} stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" class="feather feather-calendar"><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect><Line x1="16" y1="2" x2="16" y2="6"></Line><Line x1="8" y1="2" x2="8" y2="6"></Line><Line x1="3" y1="10" x2="21" y2="10"></Line></Svg>  
              </View>
              </View></TouchableOpacity>
           </View>
              </TouchableOpacity> :  displayAndroidCalendar() }
               </View>  
            </Layout>  : null}
            {Platform.OS === 'android'  ? calendarStatus ?  displayAndroidCalendar() : null : null}
            </View>
            {displayDeletContent()}
          </React.Fragment>
      )
    } catch (error) {
      console.log('error displayFooter',error)
      return <Text>displayFooter error </Text>
    }
  } 
  const displayDeletContent =()=>{
    try {
      // haulDetails.item.status === 'In-Transit'
      // haulDetails.item.transactionLogs === undefined ? null :haulDetails.item.status
      // && haulDetails.item.ownerID === userProfile.id
      // && haulDetails.item.userReference === 
      if (haulDetails.item.status === 'Pending' && haulDetails.item.userReference === getCurrentUser().authToken,getCurrentUser().id ) {
        return (
          <View style={{width:width,justifyContent:'center',alignItems:'center',marginTop:20}}>
          <TouchableOpacity onPress={()=>deleteLoad()}>
            <View style={{width:width,justifyContent:'center',alignItems:'center',height:60}}>
          <Text category='p1' style={{color:'#dcdde1'}}>Delete this Load</Text>
          </View>
          </TouchableOpacity>
            </View>
        )
      } 
    } catch (error) {
      
    }
  }
  // display:sheetIndexRef === 2 ? 'flex' : 'none', transition: "all 1s ease-in"
  const mapContentFallback =()=>{
    return (
      <MapView
      style={{
        zIndex:-1,
        width:Dimensions.get("window").width,
        height: height 
      }} 
        showsBuildings={true} 
      rotateEnabled={false}
      fillColor="rgba(255,0,0,0.5)"
      showsIndoors={true}
        showsCompass={true}
        showsPointsOfInterest={true}
        zoomTapEnabled={true}  
        strokeWidth={2}
        strokeColor="red"
        region={{  
      zoom:6,
      longitudeDelta: 4,
    latitudeDelta:1,
    latitude: 11.6978352,
   longitude:   122.6217542}}
      
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  />
    )
  }
const mapContentService =()=>{
  try {
    const coordinates = {
      latitude:haulDetails.item.trips[0].departDetails.coordinates[1],
      longitude: haulDetails.item.trips[0].departDetails.coordinates[0],
      latitudeDelta:0.04,
      longitudeDelta: 0.05
    }
    return  <MapView
        
        showsBuildings={true} 
        rotateEnabled={false}
        fillColor="rgba(255,0,0,0.5)"
        showsIndoors={true}
          showsCompass={true}
          showsPointsOfInterest={true}
          zoomTapEnabled={true}  
          strokeWidth={2}
          strokeColor="red"
          region={{  
        zoom:6,
        longitudeDelta: 4,
      latitudeDelta:1,
      latitude: 11.6978352,
     longitude:   122.6217542}}
      style={{
        zIndex:-1,
        width:Dimensions.get("window").width,
        height: height 
      }}
    >
  {renderMarker()}
  </MapView>
  
  } catch (error) {
    return <Text>error in map servie</Text>
  }
}
const mapContent = () =>{
  try { 
    if (haulDetails != null){
      return  (
        <>
        <Animated.View style={{height:50,width:width,backgroundColor:'white'}}/>
      {mapContentService()}
      {/* {mapContentFallback()} */}
            </>
      )
    }
 
  }catch(error){
    console.log('error in map',error)
    //  <View style={{backgroundColor:'red',width:width,height:200}}/>
  }

}


const renderMarker = () => {
 
  try { 
    var e = haulDetails.item
    const items = []
    e.trips.map((data, index) => {
      var latitude = data.departDetails.coordinates[0]
      var longitude = data.departDetails.coordinates[1]
 
      console.log("data.arrivalDetails.coordinates[1",data.arrivalDetails.coordinates[1])
     

      items.push(
        <Marker coordinate = {{latitude: data.departDetails.coordinates[1],longitude:data.departDetails.coordinates[0]}}
        title={data.depart }
        isPreselected={true}
        description={`Departure`}
        >
<View style={{borderColor:'#6ab04c',borderWidth:1,backgroundColor:'#6ab04c',height:20,width:20,borderRadius:20,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
      <View style={{backgroundColor:'white',height:10,width:10,borderRadius:2}}/>
    </View>
        </Marker>
      )

      items.push(
        <Marker coordinate = {{latitude: data.arrivalDetails.coordinates[1],longitude:data.arrivalDetails.coordinates[0]}}
 title={data.arrival }
    description={'Arrival'}
        >
<View style={{borderColor:'black',borderWidth:1,backgroundColor:'black',height:20,width:20,borderRadius:20,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
      <View style={{backgroundColor:'white',height:10,width:10,borderRadius:2}}/>
    </View>
        </Marker>
      ) 
    })
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
}


  async function getProfileAccount(){ 
    try {
      const response = await axios.post('/user/Loogy/profile',{"id":getCurrentUser().id });
        return response
    }  catch (error){
        console.log(error)
      alert('ERRPR')
    }
  }
  

  //ANIMATION
  const animate = easing => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      easing
    }).start();
  };
  


  const  setCalendarData = (e)=>{
    try {
      if (moment(e).isSameOrAfter(haulDetails.item.trips[haulDetails.item.trips.length - 1].returnedDate)){
        setCalendar(false)
        setBackloadDate(e)
      }else{
        setCalendar(false)
      }
    }catch{
      console.log('setCalendarData setCalendarData')
    }
  }




const updateNowService = (type)=>{
  
  setStatus(true)
  ModifyThisLoad(haulDetails,type,getCurrentUser(),getCurrentUserLocation()).then(item=>{
    setStatus(false)
    var param = {
      title:`You have some updates from your load`,
      body: `[${haulDetails.item.referenceOrder}] Load has been updated!`,
    }
    let notif =   schedulePushNotification(param).then(()=>{
    }) 
    ToastAndroid.show('Item has been successfully loaded!', ToastAndroid.LONG);
    navigation.goBack()
  })

}
const completedContent =()=>{
  try {
    return (
      <React.Fragment>
        <View style={{alignContent:'center',alignItems:'center',justifyContent:'center',width:width,height:height / 3,backgroundColor:'white'}}>
        <Image  source={{uri:'https://cdn.dribbble.com/users/1275019/screenshots/6269490/______8_4x.png?compress=1&resize=1600x1200&vertical=top'}}  style={{width:200,height:200  }}/>
        </View>
      </React.Fragment>
    )
  } catch (error) {
    return <View style={{height:200,width:width,backgroundColor:'red'}}/>
  }
}
const displayTypeOfButton = ()=>{
  var type = haulDetails.item.status
  switch (type) {
  case 'Pending':
      return (<TouchableOpacity disabled={checked ? backloadDate  === null ? true :false : false} onPress={()=>updateNowService('On-Scheduled')} >
        <View style={{width:width / 2,height:45,borderRadius:50,opacity:status ? 0.5: 1 ,backgroundColor: checked ? backloadDate  === null ? 'gray': 'black' : 'black',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
           <Text style={{color:'white',fontSize:18}}> {status ? 'Loading...':'Accept Load'}</Text>
        </View>
           </TouchableOpacity>)
      break
      case 'On-Scheduled':
        return (<TouchableOpacity disabled={checked ? backloadDate  === null ? true :false : false} onPress={()=>updateNowService('In-Transit')} >
          <View style={{width:width / 2,height:45,borderRadius:50,opacity:status ? 0.5: 1 ,backgroundColor: checked ? backloadDate  === null ? 'gray': '#6ab04c' : '#6ab04c',alignContent:'center',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
          {/* <Image  source={{uri:'http://cdn.onlinewebfonts.com/svg/img_106572.png'}}  style={{width:18,height:18 ,backgroundColor:'white',borderRadius:18}}/> */}
             <Text style={{color:'white',fontSize:18}}> {status ? 'Loading...':'Start Loading'}</Text>
              
          </View>
             </TouchableOpacity>)
      break
      case 'In-Transit':
        return (<TouchableOpacity disabled={checked ? backloadDate  === null ? true :false : false} onPress={()=>updateNowService('Completed')} >
          <View style={{width:width / 2,height:45,borderRadius:50,opacity:status ? 0.5: 1 ,backgroundColor: checked ? backloadDate  === null ? 'gray': '#6ab04c' : '#6ab04c',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
             <Text style={{color:'white',fontSize:18}}> {status ? 'Loading...':'Complete'}</Text>
          </View>
             </TouchableOpacity>)
      break
      case 'Completed':
        return (
          <TouchableOpacity disabled={checked ? backloadDate  === null ? true :false : false} >
          <View style={{width:width / 2,height:35,borderRadius:50,opacity:status ? 0.5: 1,alignContent:'center',justifyContent:'center',alignItems:'center',flexDirection:'row',borderWidth:0.2,borderColor:'black'}}>
          <Image
              source={{ uri: 'https://img.icons8.com/color/344/26e07f/approval--v1.png' }}
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <Text category="c1">Load Complete</Text>
          </View>
             </TouchableOpacity>
        )
      break
      default:
        return (
          <TouchableOpacity disabled={checked ? backloadDate  === null ? true :false : false}  >
      <Text>Waiting...</Text>
      </TouchableOpacity>
        )
      break
  }
}

const contentLogsMaker = (e) =>{
  try {
      var content = []
    e.map((data, index) => {
      content.push(
        <TouchableOpacity>
        <View style={{marginLeft:20}}>
          <Text    category="c1"style={{marginTop:5,fontWeight:'bold'}}   >
          {data.title}
      </Text>
      <View  style={{backgroundColor:'white', flexDirection:'row',left:0,alignContent:'center',justifyContent:'space-between',alignItems:'center'}} >
      <Text    category="c1"style={{marginTop:5}}   >
      {data.description}
      </Text>
      <Text    category="c1"style={{marginTop:5,color:'#6ab04c',marginRight:20}}   >
      {moment(data.date).format('MMMM Do YYYY, h:mm:ss A')} 
      </Text>
        </View>
        <Text    category="c1"style={{marginTop:5,fontStyle:'italic'}}   >
      {moment(data.date).startOf('minute').fromNow()}
      </Text>
          
      <Text    category="c1"style={{marginTop:5,marginBottom:10}}>
      {locatinTracker(data)}
      </Text>
      <Divider/>
        </View>
        </TouchableOpacity>
      )
    })
    return <View style={{marginBottom:20,marginTop:20}}>{content}</View>  
  } catch (error) {
    console.log('error i n content logs maker',error)
   return <BigLoader/> 
  }
}


const locatinTracker = (data)=>{
  try {
    return `in  ${data.takerLocation.region}, ${data.takerLocation.city}, ${data.takerLocation.country}`
  } catch (error) {
    return "Carrier Location was disabled " 
  }
}

const displayTakerAvatarProfile =() =>{
  try {
        var takerProfile = haulDetails.item.transactionLogs[0].taker
        console.log('takerProfile',haulDetails.item.transactionLogs[0])
        var name = takerProfile === null ? 'Person is not available' : takerProfile.name 
        var mobile = takerProfile === null ? '0000' : takerProfile.contactNumber 
        console.log('mobile number here',mobile)
        return   <AvatarProfile contact={'ssss'} profileName={name} profileEmail={ mobile} profileAvatar={'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8='} />
  }catch(error){
    console.log(haulDetails.item.transactionLogs)
    console.log('error avatar profile',error)
  return <View/>
  }
}

const displayTransactionlogs = (logs) => {
  try {
    var content = []
    return (
      <React.Fragment >
    <View style={{backgroundColor:'white',height:40,marginTop:20}}> 
          <Layout style={styles.container} level="1">
            <Text style={styles.subTotal} category="h6">
              Transaction Logs
            </Text>
          </Layout> 
          </View>
          <Divider/> 
          <View > 
              {contentLogsMaker(logs)}
          </View>
        <View style={{marginLeft:20,marginBottom:20,marginTop:10}}>
        <Text style={styles.subTotal} category="h6">
                      Carrier Details
                    </Text>
            {displayTakerAvatarProfile()}
                  </View>
        </React.Fragment>
    )
  } catch (error) {
    console.log('error i n content logs maker',error)
    return <BigLoader/>
  }
}
  const  displayAndroidCalendar = React.useCallback(()=>{
    try {
      var preferedDate = haulDetails.item.trips[haulDetails.item.trips.length - 1].returnedDate
      return  <DateTimePicker
        is24Hour={true}
        display="default"
        minimumDate={moment(haulDetails.item.trips[haulDetails.item.trips.length - 1].returnedDate).toDate() }
        mode={"date"}
        value={ backloadDate === null ? moment(preferedDate ).toDate() : moment(backloadDate).toDate() }
        onChange={(date,selectedDate)=>  setCalendarData(moment(selectedDate).format('LL'))  }
        /> 
      } catch {
        return <BigLoader/>
      } 

    },[backloadDate])
  
const ProfileContent =()=>{
  try {
    return <View style={{height:'auto',top:5,backgroundColor:'white',marginBottom:20}}>
    <AvatarProfile   profileName={haulDetails.item.user.user_details.name} profileEmail={haulDetails.item.user.user_details.contactNumber} profileAvatar={haulDetails.item.user.application_info.picture}/>
      <View style={{position:'absolute',top:20,right:30,width:'auto',height:150,backgroundColor:'white',alignContent:'center',alignItems:'center'}}>
    <TouchableOpacity onPress={()=>  	navigation.navigate('ViewQRDetails', { screen: 'ViewQRDetails',referenceOrder: { item:haulDetails} }) }>
      <View style={{backgroundColor:'white',alignContent:'center',alignItems:'center'}}>
      <QRCode
      size={60}
        logo={{uri: "https://localflowershop.sgp1.digitaloceanspaces.com/product/1651903967051-512.png"}}
      value={haulDetails.item.referenceOrder}
    />
    </View>
    <Text category="c1" style={{marginLeft:0,marginTop:8}}>Tap to share details</Text>
    </TouchableOpacity>
    </View></View>
  }catch (error) {
    console.log('error rendering profile',error)
    return (<View style={{height:'auto',top:5,backgroundColor:'white',marginBottom:20}}>
   
    <AvatarProfile  profileName={getDynamicProfile().name} profileEmail={getDynamicProfile().contactNumber} profileAvatar={getDynamicProfile().avatar}/>
      <View style={{position:'absolute',top:20,right:30,width:'auto',height:150,backgroundColor:'white',alignContent:'center',alignItems:'center'}}>
    <TouchableOpacity onPress={()=>  	navigation.navigate('ViewQRDetails', { screen: 'ViewQRDetails',referenceOrder: { item:haulDetails} }) }>
      <View style={{backgroundColor:'white',alignContent:'center',alignItems:'center'}}>
      <QRCode
      size={60}
        logo={{uri: "https://localflowershop.sgp1.digitaloceanspaces.com/product/1651903967051-512.png"}}
      value={haulDetails.item.referenceOrder}
    />
    </View>
    <Text category="c1" style={{marginLeft:0,marginTop:8}}>Tap to share details</Text>
    </TouchableOpacity>
    </View>
    </View>)
  } 
}

const navigationitems =()=>{
       try {
        var details = currentRoute //navigatedDirection.current
        console.log('INFOUUND',details)
        var coordaintesGoogle = encodeURI(`https://www.google.com/maps/dir/?api=1&origin=${currentRoute.departDetails.coordinates[1]},${currentRoute.departDetails.coordinates[0]}&destination=${currentRoute.arrivalDetails.coordinates[1]},${currentRoute.arrivalDetails.coordinates[0]}&travelmode=driving`)
        var icons = [{
          image:'https://cdn141.picsart.com/338356866082211.png',
          title:'Open Waze App',
          navigationLink:`https://waze.com/ul?saddr=${currentRoute.arrivalDetails.coordinates[1]},${currentRoute.arrivalDetails.coordinates[0]}&daddr=${currentRoute.departDetails.coordinates[1]},${currentRoute.departDetails.coordinates[0]}&z=10&t=s`
        },{
          image:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Maps_icon_%282015-2020%29.svg/2048px-Google_Maps_icon_%282015-2020%29.svg.png',
          title:'Open Google Map',
          navigationLink:encodeURI(`https://www.google.com/maps/dir/?api=1&origin=${details.depart}&destination=${details.arrival}&travelmode=driving`) //Convert this to Coordinates
          }
        ]
        if (Platform.OS === 'ios'){
          icons.push({
            title:'Open iOS Map',
            image:'https://www.apple.com/v/maps/d/images/overview/intro_icon__dfyvjc1ohbcm_large.png',
            navigationLink:`http://maps.apple.com/?saddr=${currentRoute.arrivalDetails.coordinates[1]},${currentRoute.arrivalDetails.coordinates[0]}&daddr=${currentRoute.departDetails.coordinates[1]},${currentRoute.departDetails.coordinates[0]}&z=10&t=s`
            })
        }
        var navigationSheetItems = []
        icons.map( item=>{
          navigationSheetItems.push(
              <View style={{margin:10,backgroundColor:'white',width:width}}>
              <TouchableOpacity onPress={()=> Linking.openURL(item.navigationLink)}>
              <View style={{flexDirection:'row',alignContent:'flex-start',alignItems:'center',backgroundColor:'white',marginLeft:20}}>
            <Image  source={{uri: item.image}}  style={{width:25,height:25  }}/>
             <Text style={{marginLeft:20,fontWeight:'bold'}}>{item.title}</Text>
           </View>
            </TouchableOpacity>
            </View>
          )
        }
        )
        return  <View>
              <View  style={{ height: 30,width:30,  alignSelf:'flex-start',left:20,opacity:status ? 0.2 : 1}} >
            <TouchableOpacity onPress={() =>setNavigateContent(false)}>
                <Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:'100%',height:30  }}/>
              </TouchableOpacity>
          </View>{navigationSheetItems}
            </View> 

       } catch (error) {
        console.log('error in rendering map detials',haulDetails)
        console.log('error in rendering map detials',error)
        
        return <TouchableOpacity onPress={()=>setNavigateContent(false)}><View style={{width:20,height:20,backgroundColor:'red'}} /></TouchableOpacity>
       }
      }

      const getOriginAccount =()=>{
   
        try {
          //SUPABASE AUTH ACCOUNT
          return driverDetails.app_metadata.provider
        } catch (error) {
          //EMAIL LOGIN TYPE
          return getCurrentUser().app_metadata.provider
        }
      }
      const getDynamicProfile = () =>{
        try {
          if (getOriginAccount() === "email"){
            return haulDetails.item.user.application_info
         }else {
           return haulDetails.item.user.application_info
         }
        }catch(error){
          return {name:'Not available',
          contactNumber:'',
          avatar:'https://localflowershop.sgp1.digitaloceanspaces.com/product/1651903967051-512.png'
          }
          console.log('error',error)
        }
      }
      
    const content =()=>{
      if (haulDetails === null){
        return <Small/>
      }
        try {
          console.log('haulDetails.item',haulDetails.item.user.user_details.contactNumber)
        return  <React.Fragment>
          {mapContent()}
                  {/* { haulDetails.item.status === 'Completed' ? completedContent()  :   mapContent()} */}
                  <BottomSheet
              ref={bottomSheetRef}
              index={1}
              snapPoints={isNavigateContent ? navigationOptionPoints :haulDetails.item.status === 'Completed'  ? completedPoints:  snapPoints}
              onChange={handleSheetChanges}
              >{isNavigateContent ?  navigationitems()  :<View style={styles.contentContainer}>
              <View  style={{ height: 30,width:30, top:10,position:'absolute', alignSelf:'flex-end',left:20,opacity:status ? 0.2 : 1}} >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:'100%',height:30  }}/>
                </TouchableOpacity>
              </View>
              {displayTypeOfButton()}
              <BottomSheetFlatList
              data={ [1] }
              style={{marginTop:10}}
              keyExtractor={i => i}
              renderItem={(item)=>
              <Animated.View style={{opacity:opacityV2}}>
              {ProfileContent()}
              {haulDetails.isBackload ?<Text style={{marginLeft:20,fontWeight:'bold'}} category='h6'>Backload</Text> : null }
              <View style={{marginTop:20}}/> 
              <View style={{flexDirection:'row',width:width-20,justifyContent:'space-between'}}>
              <Text style={{marginLeft:20,fontWeight:'bold'}} category='h6'>Journey Details</Text>
              <View style={{ backgroundColor:  'white', marginBottom:20, width: 90, height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center',marginLeft:20,alignItems:'center' }}><Text style={{ marginLeft: 10, marginRight: 20,  color:'#0652DD' ,fontWeight:'bold',width:'auto'}} category='c2' >{haulDetails.item.loadType}</Text></View>
              </View>
              {haulDetails != null ? sheetIndexRef !== 0 ?   displayItems(haulDetails.item) : null  : null }
              <Text style={{marginTop:40,marginLeft:20,fontWeight:'bold',marginBottom:0}} category='h6'>Transportation</Text>
              {displayVehicleType(haulDetails.item.selectedVehicle)}
              { haulDetails.item.transactionLogs === undefined ? null:displayTransactionlogs(haulDetails.item.transactionLogs)}
              {displayFooter(haulDetails.item.selectedVehicle)}
              {getLastDateService(haulDetails.item.trips)}
              {calendarStatus ?  displayAndroidCalendar() : null} 
              
              </Animated.View>
              }
              > 
              </BottomSheetFlatList>
              </View>}
              </BottomSheet>
              </React.Fragment>
       } catch (error) {
        console.log('error',error)
         return <React.Fragment>
           <BigLoader/><BigLoader/>
           <BigLoader/>
         </React.Fragment>
       }
     }  
     
  return  <React.Fragment>
  {haulDetails === null ?   <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity:status ? 0.2 : 1}} >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:'100%',height:30  }}/>
                </TouchableOpacity>
              </View> : content()} 
  <StatusBar style={'dark'}/></React.Fragment>
  
}



































const stylesMap = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
  height: '100%',
    width: '100%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1
  }
});
const styles = StyleSheet.create({
  box: {
    marginTop: 32,
    borderRadius: 4,
    backgroundColor: "blue"
  },
  contentContainer: {
    flex: 1,
    width:width,
    alignItems: 'center',
  },
    image: {
      width: '100%',
      height: 300,
      resizeMode: 'cover',
      
  
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      margin: 2,
      marginTop: 20,
      fontWeight: 'bold',
      marginRight: 130,
      marginLeft: 20
    },
    containesr: {
      backgroundColor: 'white',
      flex: 1,
      flexDirection: 'column',
      marginLeft: 20,
      marginRight: 20
    },

  container: {
    marginLeft:20,
    marginRight:20,
    marginBottom:5,
    marginTop:5,
    flexDirection: 'row',
  },
    layout: {
  
      backgroundColor: 'white',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }, container2: {
      marginTop: 30,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16
    }, containerMulti: {
      marginTop: 10,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, marginBottom: 0
    }, 
    containerMultiDate: {
      marginTop: 12,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, 
      marginBottom: 12,
      // backgroundColor:'red'
    },
    containerContent: {
      marginTop: 0,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, 
      marginBottom: 12,
    },
    input: {
      flex: 1,
      margin: 2,
      marginLeft:11,
      
    },  inputTouchableRight: {
      flex: 1,
      margin: 2,
  marginRight:20,
  marginLeft:15
    },
    inputRoundTripTouchable: {
      flex: 1,
      marginTop:2
    },
    inputRight: {
      flex: 1,
      margin: 2,
    }, InActiveinputRight: {
      flex: 1,
  
      margin: 2,
      opacity: 0.3
    },
    subTotal:{
      flex: 1,
      margin: 2,
      fontWeight:'bold'
    },
    subTotalItem:{
      fontWeight:'bold',
      fontSize:23,
      alignContent:'flex-end',
      margin: 2,
    },
  });
  