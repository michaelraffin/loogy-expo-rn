import React, { useEffect, useState,useRef,useMemo, PureComponent,useCallback ,useContext} from 'react';
import {Switch, Platform,ToastAndroid, StyleSheet, ScrollView, Image, Vibration,TextInput, ImageBackground, RefreshControl, Dimensions, TouchableOpacity, KeyboardAvoidingView, View, Alert,FlatList } from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Clipboard from 'expo-clipboard';
var Image_Http_URL = { uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif' };
import { cart, Theme, CartContextAction } from '../../components/Utils/UserCart';
import ThemeColor from '../../constants/Colors'
import { saveEntry, getEntry, removeItem } from '../../components/Utils/StoreDetails'
import moment from 'moment'
import Toast from 'react-native-toast-message';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import { CheckMark } from '../../components/Svgs'
import { schedulePushNotification } from '../../screens/Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WebView } from 'react-native-webview';
import DateTimePicker from '@react-native-community/datetimepicker';
import Store from  '../../components/Context/MapContext'
import {MapContext}from  '../../components/Context/MapContext'
import DynamicForm from  '../../components/DynamicForm'
import StoreContext from  '../../components/Context/MapContext'
import {BookingContext} from  '../../components/Context/UserBookingContext'
import BookingContextProvider from  '../../components/Context/UserBookingContext'
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FloatingBar from '../../components/FloatingBar'
import {axios} from '../../components/Utils/ServiceCall'
import MainCSS from  '../../components/MainServiceCSS'
import {Small,BigLoader,ButtonLoader,InstagramContent} from '../../components/Loader';
import ConfettiCannon from 'react-native-confetti-cannon';
import PickerImage from "../../components/ImagePicker";
import Axios from 'axios'; 
const departedAddress = "Departed"
const arrivalAddress = "Arrival"
const dateDeparted = "Pickup Date from"
const arrivalDate = "Date to"
export default function MainService({ route, navigation }) {
console.log('SERVICE MAIN MICHAEL')
  const isFocused = useIsFocused();
  const [addresssss,setAddddddress] = useState('false');
  const [status,setStatus] = useState(true);
  const [isLoading,setLoading] = useState(false);
  const [showCalendar,setCalendarContent] = useState(false);
  const [fromValue, setFrom] = useState('Iligan City - Cebu CEB');
  const [toValue, setTo] = useState('Quezon City - Manila MNL');
  const [switcher, setSwitch] = useState(false);
  const [currentIndex, setSelectedIndex] = useState(0);
  const [calendarType, setCalendarType] = useState('from');
  const [category, setCategory] = useState('One-Way');
  const {address}  = useContext(MapContext);
  const [selecttttt, setCategorsy] = useState(MapContext);
  const {setTrips,userAccount,getCurrentUser,userTrips,getSelectedVehicle,setBackload} = useContext(BookingContext);
  const [mapType, selectMapType] = useState(null);
  const [matrixList, setMatrix] = useState(null);
  const [trips, setMultiTrip] = useState([{
    "depart": null,
    "arrival": null,
    "selectedDate": moment(new Date()).add(1, 'd').format('LL').toString(),
    "id": 1,
    "returnedDate":moment(new Date()).add(2, 'd').format('LL').toString(),
    "departDetails":  {
      "address": '',
      "coordinates":[],
      "matrix":null
    },   
    "arrivalDetails":  {
      "address": '',
      "coordinates":[],
      "matrix":null
    },
    "shipperNotes":""
  }, {
    "depart": null,
    "arrival": null,
    "selectedDate": moment(new Date()).add(2, 'd').format('LL').toString(),
    "id": 2,   
    "departDetails":{
      "address": '',
      "coordinates":[],
      "matrix":null
    },
     "arrivalDetails":  {
      "address": '',
      "coordinates":[],
      "matrix":null
    },
    "shipperNotes":"" 
  }]);

  
  const [isEnabled, setIsEnabled] = useState(false);
  const  [userEmail,setUserEmail] = useState('')
  const  [profile,setProfile] = useState(null)
  const  [warehouse,setWarehouse] = useState(null)
  const  [membersName,setName] = useState(null)
  const  [mobile,setMobileNumber] = useState(null)
  const  [address1,setLocation] = useState(null)
  const  [logisticName,setLogisticName] = useState(null)
  const [isNew,setUser] = useState(false)
  const { Details, updateCart } = cart()
  var empty = []
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    setBackload(isEnabled)
  };
  useEffect(() => {
    setStatus(true)
    if (isFocused){
      setStatus(false)
    }
    
   },[isFocused])

  useEffect(() => {
   setAddress(addresssss)
  },[addresssss])

  // useEffect(() => {
  //   if (trips[0].arrivalDetails.coordinates.length != 0 && trips[0].departDetails.coordinates.length != 0) {
  //     fetchMatrix()
  //   }
  //  },[trips])
  
  const updateProfileSettings =()=>{
    setLoading(true)
    ToastAndroid.show('Saving your profile...', ToastAndroid.LONG);   
    updateProfileService().then(profile=> {
      setLoading(false)
      setUser(false)
      setProfile(profile.data.data[0])
      setWarehouse(profile.data.data[0].warehouse)
      setMobileNumber(profile?.data.data[0].user_details.contactNumber)
      setName(profile?.data.data[0].user_details.name)
      setLogisticName(profile?.data.data[0].user_details.logisticName)
    })
  }
  async function updateProfileService(){ 
    try {
      const response = await axios.post('/user/Loogy/update_profile',{"id":getCurrentUser().data.id,warehouse:warehouse,user_details:{
        name:membersName,
        contactNumber:mobile,
        logisticName:logisticName
      } });
        return response
    }  catch (error){
        console.log(error)
        alert('ERRPR')
    }
  }


  async function getProfileAccount(){ 
    try {
      const response = await axios.post('/user/Loogy/profile',{"id":getCurrentUser().data.id });
        return response
    }  catch (error){
        console.log(error)
      alert('ERRPR')
    }
  }
const isButtonDisabled = ()=>{
  if (category === 'One-Way'){
    var isAllowed = (trips[0].arrival === null ||  trips[0].depart === null) 
   
    return   isAllowed
  } else if (category === 'Round-Trip'){
    var isAllowed = (trips[0].arrival === null ||  trips[0].depart === null ||  trips[0].returnedDate === null) 
    return   isAllowed 
  } else if (category === 'Multi-Trip'){
    var setOfTrips = []
    var isAllowed = (trips[0].arrival === null ||  trips[0].depart === null) 
    trips.map((trip =>{
      if (trip.arrival === null || trip.depart === null) {
        setOfTrips.push(false)
      }
    }))
    return  setOfTrips.includes(false) ? true : false
  }

}

  function multiDidSwtich(index) {

    const newTodos = [...trips]
    var parent = newTodos[index]
    var arrival = parent.arrivalDetails
    var depart = parent.departDetails
    if ( arrival !== null || depart !== null) {
      parent.departDetails =  arrival
      parent.arrivalDetails = depart
      setMultiTrip(newTodos)
    }
  }

  function didSwitch() {
    if (category !== 'One-Way') {
      var newFromValue = toValue
      var newToValue = fromValue
      setFrom(newFromValue)
      setTo(newToValue)
    }
  }
  const decrementTrip = (index) => {
    console.log(index)
    setMultiTrip(trips.filter((item) => item.id != index))

  }

  const didType = (e, index, type) => {
    const newTodos = [...trips];
    var parent = newTodos[index]
     parent[type] = e;
    setMultiTrip(newTodos)
  }
  const incrementTrips = () => {

    var preferredDate =  moment( trips[trips.length - 1].selectedDate).add(1, 'd').format('LL').toString()
    if (trips.length + 1 <= 11) {
      var journeyData = {
        "depart": null,
        "arrival": null,
        "selectedDate":preferredDate === 'Invalid date' ? moment( trips[0].selectedDate).add(1, 'd').format('LL').toString() : preferredDate,
        "id": trips.length + 1,
        "shipperNotes":"",
        "departDetails":{
          "address": '',
          "coordinates":[]
        },
         "arrivalDetails":  {
          "address": '',
          "coordinates":[]
        }
      }
      //FALL BACK if preffered date is EMPTY will get the FIRST working selected date from array
      setMultiTrip(journey => [...journey, journeyData]);
    }

  }

function selectCalendar(e,selectedDate) {
  var index = currentIndex
  console.log('selectedDate,',selectedDate)
  setCalendarContent(false)
  //FOR MULTI TRIP
  // RESET THE NEXT selectedDate if LESS THAN THE CURRENT INDEX
  switch (e.type) {
    case 'set':
      const newTodos = [...trips];
      var parent = newTodos[index]
      if (calendarType === 'from' && category === 'Round-Trip') {
        parent['selectedDate'] =   moment(selectedDate).format('LL')
        parent['returnedDate'] =   null
      }else if (calendarType === 'to' && category === 'Round-Trip') {
        parent['returnedDate'] =   moment(selectedDate).format('LL')
      }else if (category === 'Multi-Trip') {
        parent['selectedDate'] =   moment(selectedDate).format('LL')

        if (currentIndex < trips.length - 1) {
          trips.slice(currentIndex + 1).map((data, index) => {
           if (!moment(data.selectedDate).isSameOrAfter(selectedDate)) {
            data.selectedDate = null
            }
          })
        }

      } else {
        parent['selectedDate'] =   moment(selectedDate).format('LL')
      }


      setMultiTrip(newTodos)
      break;
      case 'dismissed':

        break;
    default:
      break;
  }

  // moment(androidDate).format('ll')

}
const  displayAndroidCalendar = useCallback(()=>{
  if (category === 'Round-Trip' && calendarType === "to") {

    return (<DateTimePicker
      is24Hour={true}
      display="default"
      minimumDate={moment(trips[0].selectedDate).toDate()}
      mode={"date"}
      value={moment(new Date()).add(1, 'd').toDate()}
      onChange={(date,selectedDate)=> selectCalendar(date,selectedDate)  }

    /> )
  }else if (category === 'Multi-Trip') {
    var multiTripIndex = currentIndex === 0 ? 0 : currentIndex - 1

    return (<DateTimePicker
      is24Hour={true}
      display="default"
      minimumDate={moment(trips[multiTripIndex].selectedDate).toDate()}
      mode={"date"}
      value={moment(new Date()).add(1, 'd').toDate()}
      onChange={(date,selectedDate)=> selectCalendar(date,selectedDate)  }

    /> )
  }else {
    return (<DateTimePicker
      is24Hour={true}
      display="default"
      minimumDate={moment(new Date()).add(1, 'd').toDate()}
      mode={"date"}
      value={moment(new Date()).add(1, 'd').toDate()}
      onChange={(date,selectedDate)=> selectCalendar(date,selectedDate)  }

    /> )
  }
   },[showCalendar])

const calendarEvent = (index,type) => {
  setSelectedIndex(index)
  setCalendarContent(!showCalendar)
  if (type != undefined) {
    setCalendarType(type)
  }
}
  const renderAddButton = (index) => {
    if ( trips.length === index + 1  &&  index + 1 <= 9) {
      return (<TouchableOpacity onPress={incrementTrips} ><Text style={{ color: '#54a0ff',marginLeft:20 }}>+ Add Trip </Text></TouchableOpacity> )
    }
 }
  const renderTrips = (selectionType: string,prefferedAddress:String) => {
    console.log('renderTrips')
    var content: JSX.Element[] = []
    var limitPerCategory = 0
    switch (selectionType) {
      case 'Round-Trip':
        limitPerCategory = 1
        break;
        case 'Multi-Trip':
          limitPerCategory = 10
          break;
          case 'One-Way':
            limitPerCategory = 1
            break;
      default:
        break;
    }
    trips.map((data, index) => {
      var multTripContent = (<React.Fragment><TouchableOpacity  key={index}><Text style={{ marginLeft: 15 ,opacity:0.5}}> Trip #{index + 1} </Text></TouchableOpacity>
        {index >= 2 ? <View  style={{backgroundColor:'white',borderRadius:20,width:70,marginLeft:18,alignContent:'center'}}><TouchableOpacity onPress={() => decrementTrip(data.id)}><Text style={{  color: '#c23616',margin:3,marginLeft:2 }}>Remove</Text></TouchableOpacity></View> : null}
  </React.Fragment>)

  var roundTripDatePickerContent = ( <React.Fragment><Layout style={styles.containerMultiDate} level='1'>
    <View style={{backgroundColor:'gray',height:276,width:2,position:'absolute',left:5,top:-60,borderStyle:'dotted', opacity:0.5,    borderWidth: 1,
    borderRadius:1}}/>
  <TouchableOpacity  key={index} style={styles.input} onPress={() => calendarEvent(index,'from')}> 
    {/* <Inputs */}
    
    </TouchableOpacity>
    <TouchableOpacity disabled={data.selectedDate === null ? true:false}  style={styles.inputRoundTripTouchable} onPress={() => calendarEvent(index,'to')}>
    <Input
    textStyle={{color:'black'}}
      label={arrivalDate}
      style={styles.inputRoundTripTouchable}
      value={data.returnedDate}
      placeholder={dateDeparted}
      disabled={true}
    />
    </TouchableOpacity>
    
  </Layout></React.Fragment>
      )
      var oneWayMultiDatePicker = ( <Layout style={styles.containerMultiDate} level='1'>
        <View style={{backgroundColor:'gray',height:276,width:2,position:'absolute',left:5,top:-60,borderStyle:'dotted',opacity:0.5,    borderWidth: 1,
    borderRadius:1}}/>
      <TouchableOpacity   style={styles.input} onPress={() => calendarEvent(index)}>
       {/* <View style={{backgroundColor:'red'}}> */}
       <DynamicForm placeHolder={dateDeparted} label={dateDeparted} value={data.selectedDate}/>
       {showCalendar ? displayAndroidCalendar() : null}
        {/* <Input
        textStyle={{color:'black'}}
          label={dateDeparted}
          style={styles.input}
          value={data.selectedDate}
          placeholder={dateDeparted}
          disabled={true}
        /> */}
        {/* </View> */}
        </TouchableOpacity>
      </Layout>
          ) 
//This Control number of render items for all Category
if (limitPerCategory >= index+ 1 ){
  content.push(
    <React.Fragment key={index}> 
      {selectionType === 'Multi-Trip' ? multTripContent: null}
      <Layout style={styles.containerMulti} level='1'>
        <TouchableOpacity  onPress={()=>selectMap(index,'Depart')}   style={styles.input}>
       
          {/* <View style={styles.input}>
          <Text category="c1" style={{color:'#dcdde1'}}>{departedAddress}</Text>
          <View style={{borderWidth:1,borderColor:'#dcdde1',borderRadius:8,height:40,marginTop:5,flexDirection: 'row',justifyContent:'flex-start',alignContent:'center',alignItems:'center'}}>
          <Text style={{marginLeft:10}} numberOfLines={1}>{data.departDetails.address}</Text>
          </View>
          </View> */}
          <DynamicForm    placeHolder='From' label={departedAddress} value={data.departDetails.address}/>
          {/* {dynamicForm(data.departDetails.address,departedAddress)} */}
        {/* <Input
        disabled={true}
        textStyle={{color:'black'}}
          label={departedAddress}
          style={styles.input}
          value={data.departDetails.address}
          placeholder='From'
          onChangeText={nextValue => didType(nextValue, index, 'depart')}
        /> */}
        </TouchableOpacity>
        <TouchableOpacity    onPress={()=>selectMap(index,'Arrival')}    style={styles.input}>
        {/* {dynamicForm(data.arrivalDetails.address,arrivalAddress)} */}
        <DynamicForm placeHolder='To' label={arrivalAddress} value={data.arrivalDetails.address}/>
        {/* <DynamicForm /> */}
        {/* <Input
          onPress={()=>alert('sss')}
          disabled={true}
          textStyle={{color:'black'}}
          label={arrivalAddress}
          style={styles.inputRight}
          value={data.arrivalDetails.address}
          placeholder='To'
          onChangeText={nextValue => didType(nextValue, index, 'arrival')}
        /> */}
         </TouchableOpacity>
        <TouchableOpacity style={{ width: 50, height: 50, position: 'absolute', right: '40%', top: 25,justifyContent:'center',alignContent:'center' }} onPress={() => multiDidSwtich(index)}><View onPress={() => multiDidSwtich(index)} style={{ width: 20, height: 20, position: 'absolute', right: '48%', top: 5 }}><View style={{ width: 20, height: 20, position: 'absolute',  borderRadius: 20,marginLeft:1.8}}><Image  style={{height:23,width:23}} source={{ uri: "https://static.thenounproject.com/png/382531-200.png" }} /></View></View></TouchableOpacity>
      </Layout>
      {selectionType === 'Round-Trip' ? roundTripDatePickerContent : oneWayMultiDatePicker}
      <Text category="c1" style={{marginLeft:38,opacity:0.4}}>Describe load or remarks</Text> 
       <TextInput   
    returnKeyType = {"next"}
    inputAccessoryViewID={"xxx"}
     multiline
     value={data.shipperNotes}
     onChangeText={nextValue => didType(nextValue, index, 'shipperNotes')}
     numberOfLines={4}
     style={{padding:10,backgroundColor:'#f5f6fa',borderWidth:1,borderColor:'#f5f6fa',borderRadius:5,height:100,marginRight:20,marginLeft:38,marginTop:10,marginBottom:20}}
     placeholder="e.g. Not yet paid, No Receipt and others"
     editable
     maxLength={200}/>
       {renderAddButton(index)}
    </React.Fragment>
  )
}

    })
    return content
  }
  const dynamicForm = (data,label) =>{
    return (
      <View style={styles.input}>
      <Text category="c1" style={{color:'#dcdde1'}}>{label}</Text>
      <View style={{borderWidth:1,borderColor:'#dcdde1',borderRadius:8,height:40,marginTop:5,flexDirection: 'row',justifyContent:'flex-start',alignContent:'center',alignItems:'center'}}>
      <Text style={{marginLeft:10}} numberOfLines={1}>{data}</Text>
      </View>
      </View>
    )
  }
  const copyToClipboard = () => {
  }
  function renderFields(prefferedAddress) {
    var type = category
    var content = null
    var oneway = 'One-Way'
    var twoway = 'Round-Trip'
    var multi = 'Multi-Trip'
    setAddddddress(prefferedAddress)
    console.log('prefferedAddress',prefferedAddress)
    switch (type) {
      case oneway:
        content = (
          <React.Fragment>
            <View style={{ marginLeft: 18, marginBottom: 20 }}>
            </View>
            {renderTrips(category,prefferedAddress)}
          </React.Fragment>
        )
        break;
      case twoway:
        content = (
          <React.Fragment>
            <View style={{ marginLeft: 18, marginBottom: 20 }}>
            </View>
            {renderTrips(category,prefferedAddress)}
          </React.Fragment>
        )
        break;
      case multi:
        content = (
          <React.Fragment>
            <View style={{ marginLeft: 18, marginBottom: 20 }}>
            </View>
            {renderTrips(category,prefferedAddress)}
          </React.Fragment>
        )
        break;
      default:
        break;
    }

    return content


  }
  function navigateToPop() {
    deleteContent()
    navigation.navigate('Shop', { screen: 'TabOneScreen' });

  }
  function nextServiceDetails() {
    if (category === 'Multi-Trip') {
      setTrips(trips,category)
    }else {
      setTrips(trips.slice(0, 1),category)
    }

    navigation.navigate('Load', { screen: 'ServiceDetails' });
  }
  
  function deleteContent() {
    Details.cartItems = []
    Details.deliveryOption = {}
    Details.deliveryOption.consigneeDetails = null
    updateCart(Details)
    navigation.goBack()
  }
  function trackOrder() {
    // deleteContent()
    // navigation.navigate('Events', { screen: 'Services' })
    navigation.navigate('Load',{screen:'Map'})

  }
  function selectMap(index,type) {
    setSelectedIndex(index)
    selectMapType(type)
    var journeyType = type === 'Depart' ? 'From' : 'To'
    // navigation.navigate('Load',{screen:'Map',productID:type,params: { journeyType:  journeyType}})
    navigation.navigate('MapTab',{screen:'Map',productID:type,params: { journeyType:  journeyType}})
  }
  const disectMatrix =(e)=>{
    try {
      fetchMatrix(e).then(result =>{
        console.log('waiting----->>',result)
        return "Waiting"
      })
      // if (fetchMatrix(e).arrivalTime != undefined){
      //   return  fetchMatrix(e).arrivalTime
      // }else {
      //   return "Waiting"
      // }
      
    } catch (error) {
      return "error"
    }
  }
 async  function  fetchMatrix (item){
    try {
    // console.log('is now fetching?',trips[0].arrivalDetails.coordinates.length != 0 && trips[0].departDetails.coordinates.length != 0)

//  let list =  trips.map( async item => {
        if (item.departDetails.coordinates.length >= 1 && item.arrivalDetails.coordinates.length >= 1){
          let depart = item.departDetails.coordinates.reverse()
          let arrival = item.arrivalDetails.coordinates.reverse()
          // const matrixResult = await fetchMatrixService(depart,arrival)
          // console.log('matrixResult',matrixResult.summary)
          // item.departDetails.matrix =  matrixResult.summary.arrivalTime
          // return   disectMatrix(matrixResult.summary.arrivalTime)
          let result =  await fetchMatrixService(depart,arrival)
          console.log('ohhh',result.summary.arrivalTime)
        return  result.summary
        }
    // })
    // console.log('my Listttttt',list)
    } catch (error) {
      console.log('error',error)
    }
  }

  async function fetchMatrixService (depart,arrival){
    try {
      let composedUrl = `https://api.tomtom.com/routing/1/calculateRoute/${depart}:${arrival}/json?travelMode=truck&key=1hAGLyVpeOqc154z5brx2rls2WmqYtnG`
      // 'https://api.tomtom.com/routing/1/calculateRoute/14.652937%2C121.034437%3A10.30984%2C123.893107/json?travelMode=truck&key=1hAGLyVpeOqc154z5brx2rls2WmqYtnG'

      console.log('finalURL',composedUrl)
      const response = await Axios.get(composedUrl);
      return response.data.routes[0]
    } catch (error) { 
      console.log('error matrix',error)
      return 'ERROR'
    }
  }

  const setAddress =(e)=>{
    const newTodos = [...trips];
    var parent = newTodos[currentIndex]
    if (mapType === 'Arrival') {
      parent['arrival'] = e.place_name
      parent['arrivalDetails'] =  {
        coordinates : e.geometry.coordinates,
        address:e.place_name
      } 
    }else if (mapType === 'Depart') {
      parent['depart'] = e.place_name
      parent['departDetails'] = {
        coordinates : e.geometry.coordinates,
        address:e.place_name
      }
    }
    setMultiTrip(newTodos)
  }
  function checkMark() {
    return (
      <CheckMark />
    )
  }
  function noticeContent() {
    return (<View style={{
      backgroundColor: '#f7f1e3',
      width: 300,
      height: 70,
      borderRadius: 20,
      marginLeft: 20,
      marginRight: -20,
      marginTop: 20
      // justifyContent: 'center',
      // alignItems: 'center',
    }}>
      <StoreContext>
      <Text style={{ color: 'black', marginLeft: 20, marginTop: 10, fontWeight: 'bold' }} category="h5">Delay ahead notice</Text>
      <Text style={{ color: 'black', marginLeft: 20, marginTop: 5 }} category="c1">For Bicol please avoid distance near the port</Text>
      </StoreContext>
    </View>
    )
  }

  // const FloatingBar = () =>{
  //   var borderRadius = 20
  //   return  (
  //     <View style={{shadowColor: "#000",
  //     shadowOffset: {
  //       width: 0,
  //       height: 1,
  //     },
  //     shadowOpacity: 0.20,
  //     shadowRadius: 1.41,
  //     elevation: 0.2,width:width,height:60,position:'absolute',bottom:10,backgroundColor:'white',borderBottomLeftRadius:borderRadius,borderBottomRightRadius:borderRadius,alignContent:'flex-start',flexDirection: 'row',justifyContent:'space-evenly'}}>
  //    <TouchableOpacity onPress={()=>navigation.navigate('Load',{screen:'Service'})}>
  //      <View style={{width:'auto',height:30,marginLeft:40,marginTop:10,alignContent:'center',justifyContent:'center',alignItems:'center',flexDirection: 'row',backgroundColor:'#dcdde1',borderRadius:15}}>
  //      <Image source={{uri:"https://cdn-icons-png.flaticon.com/512/25/25694.png" }}style={{width:20,height:20,marginLeft:10}}/>
  //      <Text style={{marginLeft:10,marginRight:10}}>Load</Text>
  //      </View>
  //    </TouchableOpacity>
  //    <TouchableOpacity onPress={()=>navigation.navigate('Cart',{screen:'Cart'})}>
  //      <View style={{width:40,height:40,marginLeft:40,marginTop:4,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
  //      <Image source={{uri:"https://www.seekpng.com/png/full/1-11418_png-file-sugar-icon-png.png" }}style={{width:25,height:20}}/>
  //      </View>
  //    </TouchableOpacity>
  //    <TouchableOpacity onPress={()=>navigation.navigate('History',{screen:'DriverHistory'})}>
  //      <View style={{width:40,height:40,marginLeft:40,marginTop:4,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
  //      <Image source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGzZ-N4XBk1pmKmyCoJUoudghQYjEKoyOE4gGf-h1P5Nu1LlGknEtG8C5U3lIyyjqQj78&usqp=CAU" }}style={{width:20,height:20}}/>
  //      {/* <Text>Orders</Text> */}
  //      </View>
  //    </TouchableOpacity>
  //  </View> 
  //   )
  // }


const displayLoginButton = () =>{
  if (getCurrentUser().user === null) {
    return (
      <View style={{backgroundColor:'#0652DD',height:25,width:'auto',position:'absolute',right:20,top:30,zIndex:1, borderRadius: 25,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity  onPress={()=>navigation.navigate('Account', { screen: 'Login' })} style={{zIndex:1}}>
      <View style={{flexDirection: 'row', alignContent: 'center',justifyContent:'center',alignItems:'center' }}>
         <Text style={{marginRight:15,fontWeight:'bold',color:'white',marginLeft:15}}>Login now</Text>
         {/* <Image  source={{uri:'https://cdn.iconscout.com/icon/free/png-256/account-269-866236.png'}}  style={{width:18,height:18  }}/> */}
         </View></TouchableOpacity>
   </View>
    
    )
  }
}

const validateTrip = ()=>{
  if (trips[0].arrivalDetails === null && trips[0].departDetails === null) {
    return false
  }else {
    return true
  }
}
const renderMainContent = ()=> { 
  try {
    return (
      <>{renderBackButton()}
        <FlatList
      contentContainerStyle={{paddingBottom:120}} 
      style={{backgroundColor:'white'}}
      ListHeaderComponent={renderHeaderContent()}
      ListFooterComponent={renderFooterContent()}
      maxToRenderPerBatch={5}
      data={[1]}
      renderItem={(item) =>  
        <MapContext.Consumer>
        {items =>
        (renderFields(items.address))
        }
      </MapContext.Consumer>
      } 
      />
      </>
   )
  } catch (error) {
    console.log('error  renderMainContent',error)
    return null
  }
}
const renderFooterContent =()=>{
  return <>
    <View style={{backgroundColor:'white',borderColor:'#dcdde1',borderWidth:0.5,alignItems:'center',alignContent:'center',justifyContent:'space-between',flexDirection: 'row',marginTop:20}}>
         <Text style={{marginLeft:25  }}>{isEnabled?'Backload' : 'Not a backload'}</Text>
         <Switch
         style={{marginRight:20}}
        trackColor={{ false: "#767577", true: "#ced6e0" }}
        thumbColor={isEnabled ? "#6ab04c" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      /></View>
      <Button status="primary"  disabled={isButtonDisabled()} onPress={()=>nextServiceDetails()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 40,marginBottom:32, backgroundColor:  isButtonDisabled()  ? 'gray' : 'black', borderColor:  isButtonDisabled()  ? 'gray' : 'black',opacity:isButtonDisabled() ? 0.8 : 1 }}>
             <Text style={{ color: 'white', fontWeight: 'bold' }}>Select Vehicle</Text>
           </Button>
 </>
}
const renderHeaderContent =()=>{
  return <React.Fragment>
          <View style={{backgroundColor:'white'}}> 
          <View style={{flexDirection:'row',marginTop:60}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Create</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Load</Text>
				</View>
            {displayLoginButton()}
          <View onPress={() => console.log('')} style={{ height: 50, backgroundColor: 'white', width: width, justifyContent: 'center', flexDirection: 'row', alignSelf: 'auto', alignContent: 'center', marginTop: 20,marginBottom:40 }} >
            <TouchableOpacity onPress={() => setCategory('One-Way')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' }} category='c2' >One Way</Text></View></TouchableOpacity>
            
            <TouchableOpacity onPress={() => setCategory('Multi-Trip')}><View style={{ backgroundColor: category === 'Multi-Trip' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'Multi-Trip' ? 'white' : 'black' }} category='c2' >Multi Trip</Text></View></TouchableOpacity>
          </View>
          <Image source={{ uri: 'https://cdn.dribbble.com/users/214038/screenshots/14606225/media/ca4b995c15e520f491c3fbea9aeada7d.jpg?compress=1&resize=1600x1200' }} style={{height:90,width:width,marginBottom:60 }} />
      </View>
        <Text category="h5" style={{fontWeight:'bold',opacity:0.5,marginLeft:20}}>For {category}</Text>
        {/* <View onPress={() => console.log('')} style={{ height: 50, backgroundColor: 'white', width: width, justifyContent: 'flex-start', flexDirection: 'row', alignSelf: 'auto', alignContent: 'center'}} >
            <TouchableOpacity onPress={() => setCategory('One-Way')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' }} category='c2' >One Way</Text></View></TouchableOpacity>
            
            <TouchableOpacity onPress={() => setCategory('Multi-Trip')}><View style={{ backgroundColor: category === 'Multi-Trip' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'Multi-Trip' ? 'white' : 'black' }} category='c2' >Multi Trip</Text></View></TouchableOpacity>
          </View> */}
        <Text category="c1" style={{marginTop:10,marginLeft:20}}>{category ==='One-Way'?'Create single trip for your load' : 'Create 2-10 journey for your load'}</Text>
   </React.Fragment>
}
///TOBE REMOVE
const mainContent =()=>{
  return (
    <>
    <SafeAreaProvider>
    <StatusBar barStyle={'dark'}/> 
        <ScrollView  style={{ backgroundColor: 'white' ,height:height,marginBottom:0,flex:1}}  
          contentContainerStyle={{paddingBottom:getCurrentUser().user === null? 0: 60}}
           >
            {/* REMOVE */}
          <View style={{backgroundColor:'white'}}> 
          <View style={{flexDirection:'row',marginTop:110}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Create</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Load</Text>
				</View>
            {displayLoginButton()}
          <View onPress={() => console.log('')} style={{ height: 50, backgroundColor: 'white', width: width, justifyContent: 'center', flexDirection: 'row', alignSelf: 'auto', alignContent: 'center', marginTop: 20,marginBottom:40 }} >
            <TouchableOpacity onPress={() => setCategory('One-Way')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' }} category='c2' >One Way</Text></View></TouchableOpacity>
            
            <TouchableOpacity onPress={() => setCategory('Multi-Trip')}><View style={{ backgroundColor: category === 'Multi-Trip' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'Multi-Trip' ? 'white' : 'black' }} category='c2' >Multi Trip</Text></View></TouchableOpacity>
          </View>
          <Image source={{ uri: 'https://cdn.dribbble.com/users/214038/screenshots/14606225/media/ca4b995c15e520f491c3fbea9aeada7d.jpg?compress=1&resize=1600x1200' }} style={{height:90,width:width,marginBottom:60 }} />
      </View>
          {/* REMOVE */}
          
        <Text category="h5" style={{fontWeight:'bold',opacity:0.5,marginLeft:20}}>For {category}</Text>
        <Text category="c1" style={{marginTop:10,marginLeft:20}}>{category ==='One-Way'?'Create single trip for your load' : 'Create 2-10 journey for your load'}</Text>
        {showCalendar ? displayAndroidCalendar() : null}
        <MapContext.Consumer>
            {items =>
            (renderFields(items.address))
            }
          </MapContext.Consumer>

         <View style={{backgroundColor:'red',alignItems:'center',alignContent:'center',justifyContent:'center',flexDirection: 'row'}}>
         <Text style={{marginLeft:20}}>{isEnabled?'Backload' : 'Not a backload'}</Text>
         <Switch
         style={{marginLeft:20}}
        trackColor={{ false: "#767577", true: "#ced6e0" }}
        thumbColor={isEnabled ? "#6ab04c" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      /></View>
      <Button status="primary"  disabled={isButtonDisabled()} onPress={()=>nextServiceDetails()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 40,marginBottom:32, backgroundColor:  isButtonDisabled()  ? 'gray' : 'black', borderColor:  isButtonDisabled()  ? 'gray' : 'black',opacity:isButtonDisabled() ? 0.8 : 1 }}>
             <Text style={{ color: 'white', fontWeight: 'bold' }}>Select Vehicle</Text>
           </Button>
        </ScrollView>
        <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity:status ? 0.2 : 1}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
      
        {/* {<FloatingBar index={0} navigation={navigation} showAccount={getCurrentUser().user === null ? null : true}/>} */}
        </SafeAreaProvider>
        </>
      );
}

const customerAddress =(e)=>{
      
  try {
    setWarehouse(e.address.place_name )
    return(
      <Input
      // disabled={true}  
      onPressIn={()=>navigation.navigate('Load',{screen:'Map',productID:'Depart',params: { journeyType:  'To'}})}
value={e.address.place_name}
label="Warehouse"
style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
placeholder="Ex. Metro Manila, Luzon"
// onChange={(e) => setWarehouse(e.nativeEvent.text)}
/>
    )
  }catch(error) { 
    
    return(
      <Input
      onPressIn={()=>navigation.navigate('Load',{screen:'Map',productID:'Depart',params: { journeyType:  'To'}})}
value={warehouse}
label="Warehouse"
style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
placeholder="Ex. Metro Manila, Luzon"
onChange={(e) => setWarehouse(e.nativeEvent.text)}
/>
    )
  }
  
}
const continueProfile =()=>{
  return(
        <React.Fragment>
        <ScrollView style={{height:height,backgroundColor:'#f5f6fa',opacity: status ? 0.1 : 1,paddingBottom:100}}>
        <View style={{
            height : 300,
            width : '100%',
            alignContent:'center',
            alignItems:'center', 
            transform : [ { scaleX :2.2 } ],
            borderBottomStartRadius : 200,
            borderBottomEndRadius : 200,
            overflow : 'hidden',
            backgroundColor:'black',
            borderColor:'white',
            borderWidth:1
        }}> 
          <Image  source={{ uri: 'https://cdn.dribbble.com/users/7831180/screenshots/15641971/media/4fda4547e5a26974564b08bbd8753b4f.jpg?compress=1&resize=1200x900&vertical=top' }} style={{
    
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  flex : 1,
      transform : [ { scaleX : 0.5 } ],
      backgroundColor : 'white',
      alignItems : 'center',
      justifyContent : 'center'
  
  }} />
    </View>
        <View style={{backgroundColor:'white',borderRadius:20,marginLeft:20,marginRight:20,marginBottom:20,paddingTop:-60}}>
        <Text category="h6" style={{marginTop:20,marginLeft:20,fontWeight:'bold'}}>Complete your profile</Text>
        <Input
						value={membersName}
						label="Full name"
						style={{ marginTop: 20,marginLeft:20 ,marginRight:20}}
						placeholder="Juan Dela Cruz"
						onChange={(e) => setName(e.nativeEvent.text)}
					/>
              <Input
            value={userEmail}
      disabled={true}
						label="Email"
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
              placeholder="jaun@delacruz.com"
						onChange={(e) => setUserEmail(e.nativeEvent.text)}
					/>
                     <Input
						value={mobile}
            label="Contact Number"
            keyboardType={"numeric"}
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
						placeholder="09** **** ***"
						onChange={(e) => setMobileNumber(e.nativeEvent.text)}
					/>
          <MapContext.Consumer>
          {items =>
          customerAddress(items)
        }</MapContext.Consumer>
          <Input
						value={logisticName}
						label="Logistic Name"
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
						placeholder="Juan Delacruz Forwarder"
						onChange={(e) => setLogisticName(e.nativeEvent.text)}
					/>
      <View style={{opacity:isLoading ? 0.7 : 1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
       <Button onPress={()=>updateProfileSettings()}   status="basic" style={{ borderRadius: 40, width: width - 60,  marginTop: 20,marginBottom:8, backgroundColor:isLoading === false ?'black' :  '#dcdde1', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Set Profile </Text>
    </Button>
    </View>
    </View>
    
              <StatusBar style={'dark'} />
              </ScrollView> 
         {status ?  <View style={{marginTop:120, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View> : null}    
         {isNew ? <ConfettiCannon fadeOut={true} count={200} origin={{x: -10, y: 0}} /> :null }        
    </React.Fragment>
  )
}
const loaderContent =()=>{
  
  
  try {
    return (
      <React.Fragment>
        <StatusBar barStyle={'dark'}/>
        <FlatList
            
              maxToRenderPerBatch={5}
              extraData={(e) => console.log('e', e)}
              data={[1]}
              ListHeaderComponent={()=> (
                status ? <React.Fragment>
                <BigLoader/>
                <BigLoader/>
                <BigLoader/>
                <InstagramContent/>
                <ButtonLoader/>
             </React.Fragment>: <React.Fragment>
                  <View style={{
                height : 300,
                width : '100%',
                alignContent:'center',
                alignItems:'center', 
                transform : [ { scaleX :2.2 } ],
                borderBottomStartRadius : 200,
                borderBottomEndRadius : 200,
                overflow : 'hidden',
                backgroundColor:'black',
                borderColor:'white',
                borderWidth:1
            }}>  
              <Image  source={{ uri: 'https://cdn.dribbble.com/users/415089/screenshots/12399858/media/49e07acb03edb5d4ba5a059047be7816.png?compress=1&resize=800x600&vertical=top' }} style={{
        
        width: '100%',
        height: 400,
        resizeMode: 'cover',
      flex : 1,
          transform : [ { scaleX : 0.5 } ],
          backgroundColor : 'white',
          alignItems : 'center',
          justifyContent : 'center'
      
      }} />
        </View>
                </React.Fragment>
                )
              }
              style={{paddingBottom:90}}
              renderItem={(item) => {
                return(
                 <React.Fragment>
                    <BigLoader/>
                    <BigLoader/>
                    <BigLoader/>
                    <InstagramContent/>
                    <ButtonLoader/>
                 </React.Fragment>
                )
              }}
            /> 
      </React.Fragment>
    )
  
  
    
} catch (error) {
    console.log("error rendering content",error)
}
}
const renderBackButton =()=>{
  return (
    <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity:status ? 0.2 : 1}} >
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
      </TouchableOpacity>
  </View>
  )
}
  return <React.Fragment>
   <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex:1}} 
    >
      {/* {loaderContent()} */}
    {renderMainContent()}
    {/* {status ?  loaderContent()  :renderMainContent()} */}
  {/* // mainContent()  */}

  <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',right:20,opacity:1}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8AAACJiYmGhoaLi4v29vbn5+cgICD6+vpoaGh2dnZYWFgjIyNvb2+tra0zMzObm5u9vb3h4eGkpKQuLi5eXl7v7+/b29uYmJhpaWm4uLgnJyfIyMh0dHSysrLOzs5DQ0M7Ozt/f39HR0dDz+qsAAAGxElEQVR4nO2da3ejOAyGSyeEhIYAuV+bpPv//+MOm+k2JAasiy3B+Pk452TgrYxkSb68vQUCgUAgEAgEAoFAIBAIBAKDYXM5zEfZxzU/zpIkOa7y6zrdzQ+XWPrF6Ew2ZZEeo2ZWaXHaTKRfE0m8LfarFnE/5Nly2ztzjj/XMyt138zWn2Ppl7ZnvGsbmM2sil6IHBc5St6dq3qR5Zog78601Ot54lFC1leR7HT6nUXKIu9Oqm+wbjNGfRXZQlpSjcWUWV/FWY/GDef4fORLx/c4KRzpq1hKq/vNiRL+urldhPXFZ6f6KlLR8Fg611dxEtPnwYB3voTMeIFlDxTyrYTAnTd9Ff6davzhVWAU7T2P1K2/EfpN7nWq6seHPuMxNC5FBEbRpy+Bv4QERtHOj0BX82wbfvkQ6CJRsid1L9B3lHhmOnSBziXSS2l0vlwKlHQyPzh0N1/S2v7gLGhIBfpXHIV+mamaGScTuK20qhoOpuGx/2yijZw/mZIPhHX23AL9ZvQ2MGf9F2k9BlhrNxuethkvrJ8id2OJB8bpm6ZI+AhbqTiWVtII1zjVOUYrmMbpSVpHCyyzt4ndwiYZbhwKXTZA6TDE/Y20hg7ozkZHWt8M2dkspBV0Qs2j9tICOiFWUHWlvWZoy270BvsfMopA/V9hBeVL7IMJSe5U75S7Dj4m6itdmEFXiCeozD5J5+USE2T2y3Ke4h6JVYhKfP+s7x1D24zTu7+IUeMGmwpjGk2H/38N64X/dFsOiKciO25jxKMev4gR4HfvD7/DWBEXMBBpU1Jb8movsdYvixHfYoFSeIM/6GmO+G75s/f6zxDpzBUjEDOfmT/9H3ZWfBL4Nkc8GTNMMZ9D+fyf2FjxpaWL8eGYYYopz7zWFLolPlsQ14ldwQViPKnJa3dJNDTlUSt24MMU8zEYn9P+LY6Y/raIxjduXYkp9LZZ0bSsArfoChz0sS1f0ys3S3z9BtHrAo/Q3Sfo8oXppZskmv4ckJlQDWg7EV8Htn9t0x8DLRBcGyZk97YvzisQWq4hNSvsBiqzQGhLmFbLt3l5yPdqxwakkNhR6359VidzB5YGUxtOXQL4LQh1NeQyomGu8hDpHFgQWlSkd0XbRLTLxwKbfJMf1zYQnVjwNxCBLG3RJiEuvsH/gMzbeBZ5mYOGKwvC5m2Yip4Bk8SD4d9YLPhYyewGlxy+YpLoTOBLlagNnlET2UlkexikfcHXVeveOcBlQVhAZFwQ3GVFNgtG0Rqg8Mr32A4r8lkwiv4BKGQ9J6HNiowWhC0Bw53z1ESzFTktCJu2MS96brIiqwWj6CinsMGKzAJBrWD2heum6Qb72mpJhYO3oafvcAZQ2E9fCvE0/YyHOUDh8Oc0/ZyXfgAU9jO3gNT1h58fcuX4dvvKuSRCcvzh12nc1dreHdbaIFuEhl8vHX7N+y/oW5BP0xPoPcG2lvSxfwhb2jb8HjDNmdq8vnQff0LJn+xWWXBbEbo9f/DraQiuxv7FeQcqdE3U8Ne1xchSDeylJdcm9m59KaTxdGf4a4RRzzEc/KN3nTfTWv1uxyG2Vp9nv4WNZ3yxImbKiNmCKLdnBlNDQW3ovsGfI7bvCXcCCHnvmv38pCYRs00At3dt+PsPhfaQYhqn8HCPf5bMPuAXH24JYS83JmhPl6dDitqqg97LPfz9+L05U4Fw4Y72A4buUE6o6cfZJqQDamQPYLeDdD5NL84YIp7yqf+cKOphtPq/RPLtbFpOKW+Cfjik9jP3YLV8I7rPTcSlTXVILQzX8JwlrPn8UqZzdvWeaXbmEah4As52x6XWs6Cxia8BneOUNiGto+xihDsz1ntYNZ6rz3yLh76CBkesr6HtfgvIgmA7lH2K8JZvN7ryKCc3WmuKioyR8BE99z05u3eVe6MSFofXkvm64rgdp3cgaqguOr4eUD4s8gdCZRKdC5QeqM4v6ayQbNd4uGi1Qi5oeLkst0Iq9Hu8YF2m/OZoqmZm4f8itiPrTXLdxL6jxoeDdKkDv9V+T3eO17n4y4kTJzerdhP7KjJmDA0mJH6SYq8+9JnYfT6V+XcxdU5um28rtlsc8UxcOtWC/9pfDLGrXn8q52GeWbjwqnsnFUM0W+6FN5nnSZoFC868MdNlv2/iHc98PNlJB4hmJiVuQ9gj61KH/2xkXNwI8m6Fg4vv+RnvcAcW5DudX5+R8ecatkXzuJ73wnqPxNsis5vRrbLlVq9vaWeyOS3TtiGbn4tyo9yz2LC5HOaj8/qar2bJbDY75teP82h+uOiZlAUCgUAgEAgEAoFAIBAIBAJk/gW6FYc1PfHkyQAAAABJRU5ErkJggg=='}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView> 
  </React.Fragment>


}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    // borderRadius:400,
    width: '100%',
    height: 400,
    resizeMode: 'cover',

    // {
      flex : 1,
      transform : [ { scaleX : 0.5 } ],
      backgroundColor : 'white',
      alignItems : 'center',
      justifyContent : 'center'
  // }

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    marginRight: 150,
    marginLeft: 20
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20
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
  }, containerMultiDate: {
    marginTop: 0,
    flexDirection: 'row',
    marginRight: 16,
    marginLeft: 16, marginBottom: 20
  },
  input: {
    flex: 1,
    margin: 2,
    marginLeft:11
  }, 
  inputTouchableRight: {
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
});
