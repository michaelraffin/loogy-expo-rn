import * as WebBrowser from 'expo-web-browser';
import  React,{useEffect,useState,useContext,useRef,useMemo,useCallback}from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity,SafeAreaView,Linking, ScrollView,Dimensions,Image,View ,Vibration,ActionSheetIOS,InputAccessoryView, Alert,Platform, ActivityIndicator} from 'react-native';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import { Button ,Text,Card,RadioGroup,Radio, Divider,Spinner,Layout,Calendar,Avatar, Tab, TabBar,ListItem,List} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';     
import {UserContext} from '../Utils/UserContextAPI'
import {axios} from '../Utils/ServiceCall'
import { AsyncStorage } from 'react-native'; 
import { BottomTabView } from '@react-navigation/bottom-tabs';
import  moment from 'moment'
import CartItems from '../../components/Cart/CartItems'
import CartContext from "../Utils/CartContext"; 
import { EventRegister } from 'react-native-event-listeners'
import CalendarPicker from "../../components/CalendarPicker";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from "react-native-maps";
import {Small,BigLoader,ButtonLoader} from '../../components/Loader';
import {fetchData,fetchExisting,saveWishList, getWishList,getEntry} from '../Utils/StoreDetails' 
import { ThemeContexts, Themes } from '../Utils/Testcontext';
import { cart, Theme,CartContextAction } from '../Utils/UserCart'; 
import MapPicker from '../../components/MapPicker' 
import Svg,{Circle,Path,Line,Polyline,Rect} from "react-native-svg"
import CameraRecorded from '../../screens/Camera/CameraRecord' 
import { Video } from 'expo-av'; 
import Colors from '../../constants/Colors';
import VideoModal from '../../components/Modal/video'
import {currencyFormat} from '../../components/Utils/StoreDetails'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const mapIcon =()=> (   <Svg   width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.light.theme} color={Colors.light.theme}stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" className="feather feather-arrow-right-Circle"><Line x1="8" y1="12" x2="16" y2="12"></Line></Svg> )
export default function Cart ({ path, navigation,itemsList,cartContext}) {
  const [themes, setTheme] = React.useState(Themes.Light);
  const [selectedIndexTab, setSelectedIndexTab] = React.useState(0); 
  const [selectedAddress, setValueAddress] = useState('');
  const  [loadStat, setStatus] = useState(false);
  const [counter, setCounter] = useState(0);
  const   getPrice =   useRef(null);
  
  // [getPrice, setFinalPrice] = useRef(null);
  // const [borderColor, SetBorderColor] = useState("#f7f1e3");
  const [borderColor, SetBorderColor] = useState("");
  const [value, setValue] = useState('');
  const [activeKeyboard, currentActive] = useState(null);
  const [ReceiversName, setReceiversName] = useState('');
  const [sendersMobileNumber, setcustomersMobile] = useState('');
  const [consigeneeStatus,setconsigeneeStatus ] = useState(true);
  const [passCode, setPasscode] = useState(''); 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [spinStatus, submitBooking] = useState(false);
  const [productItems, setProducts] = useState(false);
  const [videoLinkUploaded, setVideoLink] = useState(null);
  const [cartItems, setCart] = useState([]);
  const [didFound, updateState] = useState([]);
  const [date, setDate] = useState(new Date());
  const [submitStatus, setOrder] = useState(false);
  const [address, setAddress] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [time, setTime] = useState('');
  const [list, cartAction] = useState([]); 
  const { cartDetails, updateDetails } = useContext(CartContext); 
  const [cartDetail, cartUpdate] = useState({});
  const [numberOfItems, setCount] = useState(0);
  const [didLoadDetails, updateSetDetails] = useState(false);
  const { Details, updateCart } = cart()
  const  [paymentDescription, setPaymentDetails ] =  useState(false);
  const myCart = useRef(itemsList);
  const  [deliveryFee, setDelivery ] =  useState(80); 
  const  [storeDetails, setStoreDetails ] =  useState(null); 
  const  [payments, setPaymentList ] =  useState([]);
  const  [viewerBottomSheet, setType ] =  useState(null);
  const  [wishList, setwishList ] =  useState(null);
  const  [videoUrl, setVideoUrl ] =  useState(Details.deliveryOption.videoURL);
  const paymentRef = useRef(null);
  const scrollViewRef = useRef(null);
  const videoURLRef = useRef(Details.deliveryOption.videoURL);
  const [didUpdateCalendar, setCalendar] = useState(false);
  const StatusCartFef = useRef(null);
const PaymentList = ['GCASH','PayPal','Bank Transfer','Cash']
const OrderType = ['Delivery','Store-Pickup']

const bottomSheetModalRef = useRef<BottomSheetModal>(null); 
const calendarDetailRef = useRef(undefined);
const snapPoints = React.useMemo(() => ['50%','95%'], []);   
const snapPointsCalendar = React.useMemo(() => ['50%','75%'], []);   


const handlePresentModalPress = React.useCallback(() => {
  bottomSheetModalRef.current?.present();
}, []);


function viewAddress(){  
  setType('ADDRESS')
  bottomSheetModalRef.current?.present();  
}
async function fetchProduct() {
  try {  

    const data =  { 
          "maxDistance" : 15000,
          "filter":"name",
          "by":"serviceDescription",
          "to":"souvenir",
              "coordinates": [121.03828331,14.57510479]
          } 
  const response = await axios.post('/smartSearch', data).catch((error)=>console.log(error))
  // alert('nice')
  // console.log('response.data.results',response.data.results[0].items)
    // setProducts(response.data.results)
    setProducts(response.data.results[0].items)
  }catch (error) {
      console.error(error);
      alert('error')
    }
}
async function placeOrderState(videoGreetings) {
  
  try {    
    let push = await getEntry("userPushToken")
    var dFee = OrderType[selectedIndexTab] === "Delivery"  ? deliveryFee : 0 
    var  details = storeDetails.storeOptions != undefined  ? storeDetails.storeOptions  : 0 
    var peakPrice = calendarDetailRef.current.slot.peakHours  ? details.deliveryFlatrate.peakHoursRate : 0 
    var totalDeliveryFee = dFee + peakPrice 
     const data =  { 
      "cartItems":Details.cartItems,
      "OrderType": OrderType[selectedIndexTab],
      "deliverySchedule":calendarDetailRef.current,
      "deliveryDetails":Details.deliveryOption, 
      "paymentDetails":paymentRef.current,
      "totalPrice":getPrice.current  + totalDeliveryFee,
      "videoGreetings" :videoGreetings,
      "userPushToken":push,
      "storeDetails":storeDetails,
      "cartTotal":getTotalPrice,
      "adminFees":grandTotalDeliveryFee()
          } 
      let response =  await axios.post('/placeOrder', data)
      return response

  }catch (error) {
    return error
      console.error(error);
      alert('Pleas Try again later')
    }
}
function autoScroll() {
  setTimeout(() => {     
      scrollViewRef.current.scrollToEnd({ animated: true })
    }, 500)
}

function submitOrder(){  
var isDelivery = selectedIndexTab === 0 ? true : false
var dateTitle = isDelivery ? 'Set your delivery Date' : 'Set your pickup Date & Time' 

try { 
  // Details.deliveryOption.consigneeDetails === null ||
  if (isDelivery && selectedAddress  === '' ){
  
    Alert.alert(
      'Missing Details',
      'Set your delivery address',
      [  { text: 'Ok', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    ) 
    return
  } else if (isDelivery &&  calendarDetailRef.current === undefined || calendarDetailRef.current == null) {
    console.log('2')
    Alert.alert(
      'Missing Date',
      dateTitle,
      [  { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false } 
      ) 
      return
  }else if (isDelivery === false && calendarDetailRef === undefined){
    console.log('3')
    Alert.alert(
      'Missing Date',
      dateTitle,
      [  { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false } 
      ) 
      return
  }

}catch {
  Alert.alert(
    'Something went wrong',
    'Please try again later',
    [  { text: 'OK', onPress: () => console.log('OK Pressed') }
    ],
    { cancelable: false } 
    ) 
    return
}
  if (value != '' && sendersMobileNumber !== ''  && calendarDetailRef.current !== undefined) {  
    setOrder(true)  
    if (Details.deliveryOption.videoURL === undefined){
        var content =   placeOrderState("none").then( (orderState) =>{ 
              navigation.navigate('SuccessPayment',{response:orderState.data.results}) 
          })  
    }else {
      uploadVideo().then( (videoLink)=> {  
       var content = placeOrderState(videoLink).then( (orderState) =>{ 
              navigation.navigate('SuccessPayment',{response:orderState.data.results}) 
          })   
       }) 
    } 
   }else {
    setconsigeneeStatus(true) 
    Alert.alert(
      'Missing Details',
      'Please check your delivery/pickup date or customer details',
      [ 
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
   }
 
}
const getMoviesFromApi = () => {
  const header = new Headers();
  header.append('Content-Type', 'multipart/form-data');
  header.append('Accept','application/json, text/plain, */*')
  var videoUrl =  Platform.OS === 'android' ? Details.deliveryOption.videoURL.uri : Details.deliveryOption.videoURL.uri.replace('file://', '')
  var nameExtension = Math.random() 
  let formData = new FormData();  
  formData.append("imageFile",{ uri: videoUrl, name: nameExtension + '-greetings.mp4', type: 'video/mp4' } ); 
  return fetch('https://www.smestoreph.com/upload',{ method: 'POST',
  body: formData,
  headers:header} )
    .then((response) => console.log(response))
};
const getMoviesFromApiAsync = async () => {
  try {

    const header = new Headers();
    header.append('Content-Type', 'multipart/form-data');

    
  var videoUrl =  Platform.OS === 'android' ? Details.deliveryOption.videoURL.uri : Details.deliveryOption.videoURL.uri.replace('file://', '')
  console.log('Details.deliveryOption.videoURL.uri',videoUrl)
  var nameExtension = Math.random() 
  let formData = new FormData();  
  formData.append("imageFile",{ uri: videoUrl, name: nameExtension + '-greetings.mp4', type: 'video/mp4' } ); 
  console.log(formData)
    let response = await fetch(
      'https://www.smestoreph.com/upload', {
        method: 'POST',
        body: formData,
      }
    );
    
    let json = await response.json().then(data => {
      console.log(data)
    });
  } catch (error) {
    console.error(error);
  }
};
const uploadRecordedVideo = async () => {

  try {
    const header = new Headers();
    header.append('Content-Type', 'multipart/form-data');
  var videoUrl =  Platform.OS === 'android' ? Details.deliveryOption.videoURL.uri : Details.deliveryOption.videoURL.uri.replace('file://', '')
  console.log('Details.deliveryOption.videoURL.uri',videoUrl)
  var nameExtension = Math.random() 
  let formData = new FormData();  
  formData.append("imageFile",{ uri: videoUrl, name: nameExtension + '-greetings.mp4', type: 'video/mp4' } ); 
    let response = await fetch(
      'https://www.smestoreph.com/upload'
      ,{ method: 'POST',
      body: formData} )
    let json = await response.json();
    return json.storage;
  } catch (error) {
    console.error(error);
  }
};
async function uploadVideo(){ 
  try {   
if (videoUrl === undefined && Details.deliveryOption.videoURL === undefined) {
  console.log(Details.deliveryOption.videoURL)
  return 'none'
}else {  
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
    
       var videoUrl =  Platform.OS === 'android' ? Details.deliveryOption.videoURL.uri : Details.deliveryOption.videoURL.uri.replace('file://', '')
      var nameExtension = Math.random() 
      let formData = new FormData();  
      formData.append("imageFile",{ uri: videoUrl, name: nameExtension + '-greetings.mp4', type: 'video/mp4' } ); 
      const response  =  await  axios.post('/upload', formData,{headers: { 'Content-Type': 'multipart/form-data' }})
      
      const newResponse = {}
      newResponse.link = response.data.storage.link
      return   newResponse //response.data.storage
  
}
  }catch (error) { 
    console.log(error)
     return 'none'
    }
  }


async function fetchCart(){ 
  try {
    const value = await cartDetails 
    return value
  } catch (error) {
  }
}

useEffect(() => {  
    fetchCart().then ((value) =>{  
      cartUpdate(value)
      setCount(Details.cartItems.length)
      setOrder(false)  
      setStatus(true)
      updateSetDetails(true)
      fetchData().then( (store) => { 
        setStoreDetails(store.data.results[0])
        setPaymentList(store.data.results[0].storeOptions.paymentOptions)
        setDelivery(0)
      })
     
    })  
}, [])
const  grandTotalDeliveryFee =()=>{
  
  var fee  =   OrderType[selectedIndexTab] === "Delivery"  ? deliveryFee : 0   
  try {
    var  details = storeDetails.storeOptions != undefined  ? storeDetails.storeOptions  : 0
    var peakPrice = OrderType[selectedIndexTab] === "Delivery" ? calendarDetailRef.current.slot.peakHours  ? details.deliveryFlatrate.peakHoursRate : 0 : 0
  return fee + peakPrice 
  }catch(error) {

    return  fee 
   }

}
function bottomView(){
  return(
    <React.Fragment>

<View style={{backgroundColor:'white',height:40}}> 
      <Layout style={styles.container} level="1">
        <Text style={styles.subTotal} category="label">
          Total
        </Text>
        <Text style={styles.subTotalItem} category="c1">
         
         {didLoadDetails ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(getTotalPrice + grandTotalDeliveryFee()) : '0.00'}
        </Text>
        
      </Layout> 
 
      </View>
      <Divider/> 
      <View > 
      {/* <Layout style={{margin:20}} level="1">
        <Card status='danger'> 
         <Text    category="c1"  >
         To process your order, please send us a proof of payment in Orders Tab. 
        </Text>
         </Card>  
      </Layout>  */}
 
 <Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
    <View style={{height:2,width:'100%',backgroundColor:Colors.light.tint,borderRadius:5}}/> 
        <View status='basic' style={{margin:20}}>

        <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
        Note:
        </Text>
         <Text    category="c1"style={{marginTop:5}}   >
         To process your order, please upload  <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >proof of payment</Text> in Orders Tab.
        </Text>
         </View>  
      </Layout> 


      </View>
    </React.Fragment>


  )
}


const  getTotalPrice = useMemo(()=> {
  
  let finalPrices =  Details.cartItems.reduce((a, b) => a + ((b.price * b.itemOptions.quantity )+  b.itemOptions.addons.price)  , 0)
  getPrice.current =  finalPrices
  return  finalPrices === undefined ? '0' :  finalPrices 
},[Details.cartItems])

const  validateAddons = useMemo(()=> {
  var required = 1
  // let allowed =  Details.cartItems.filter(item =>   item.type != "Food")
  let allowed =  Details.cartItems.filter(item =>   item.type != "Food" && item.type != "Gifts" )
  return  allowed.length  >= required ? true : false
},[Details.cartItems])

function deliveryRate(){
  var fee  =  deliveryFee 
  try {
    var  details = storeDetails.storeOptions != undefined  ? storeDetails.storeOptions  : 0 
    var peakPrice = calendarDetailRef.current.slot.peakHours  ? details.deliveryFlatrate.peakHoursRate : 0
    
  return deliveryFee 
  }catch(error) {

    return  deliveryFee
   }

}



function timeDifferenceContent(){ 
 
var type =  calendarDetailRef.current.peakHours 
// try {
//   var  details = storeDetails.storeOptions != undefined  ? storeDetails.storeOptions  : 0
//   var peakPrice = calendarDetailRef.current.peakHours ? 0 : details.deliveryFlatrate.peakHoursRate
  
// return fee + peakPrice 
// }catch(error) {

//   return  deliveryFee
// }

  var content =  (<React.Fragment> 
        <Layout style={styles.container} level="1">
        <Text style={styles.subTotal} category="c1">
          Time Difference applied
        </Text>
        <Text style={styles.subTotalItem}>(flat rate) P{ storeDetails.storeOptions.deliveryFlatrate.peakHoursRate}.00</Text>
      </Layout>
  </React.Fragment>)
  return  type === undefined || type === false ? null : content
}

function Voucher() {
  return (
    <React.Fragment >
      <View style={{backgroundColor:'white'}}> 
      <Layout style={styles.container} level="1">
        <Text style={styles.subTotal} category="c1">
          Voucher
        </Text>
        <Text style={styles.subTotalItem} category="c1">
        <Input
          onFocus={()=>SetBorderColor('#f8c291')}
          onBlur={()=>SetBorderColor('#f7f1e3')}
          style={{borderColor:borderColor}}
          placeholder="Sender's Full name"
          value={value}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'FullName') }
        /> 
        </Text>
        
      </Layout>  
      </View>
    
    </React.Fragment>
  );
}
function displayDeliveryFee(){
return <React.Fragment>
  <Layout style={styles.container} level="1">
  <Text style={styles.subTotal} category="c1">
    Delivery Fee
  </Text>
  <Text style={styles.subTotalItem}> 
  {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format( deliveryRate())} 
  </Text>
</Layout>

{pickHours()}
</React.Fragment>
}
function checkPeakHours(){
  try {
    if (OrderType[selectedIndexTab] === "Delivery") {
      var  details = storeDetails != null  ? storeDetails.storeOptions  : 0 
      var peakPrice = calendarDetailRef.current.slot.peakHours  ? details.deliveryFlatrate.peakHoursRate : 0  
      return peakPrice
    }else {
      return 0
    }
   
  } catch (error) {
    console.log(error)
    return 0
  }
  
}
function pickHours(){
  
  var  details = storeDetails != null  ? storeDetails.storeOptions  : 0 
  // details.deliveryFlatrate.peakHoursRate
  var peak = calendarDetailRef  === undefined ? false : true
  return <Layout style={styles.container} level="1">
    <Text style={styles.subTotal} category="c1" >
      Time Difference Fee
    </Text>
    <Text style={styles.subTotalItem}> 
   {OrderType[selectedIndexTab] === "Delivery" ? "" : "-" }{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(checkPeakHours())} 
    </Text>
   
  </Layout>
  }
function subTotalView() {
  return (
    <React.Fragment >
      <View style={{backgroundColor:'white'}}> 
      <Layout style={styles.container} level="1">
        <Text style={styles.subTotal} category="c1">
          Subtotal
        </Text>
        <Text style={styles.subTotalItem} category="c1">
          {/* P{didLoadDetails ? getTotalPrice : '0.00'} */}
          {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format( didLoadDetails ? getTotalPrice : 0)} 
        </Text>
        
      </Layout> 

      {OrderType[selectedIndexTab] === "Delivery"  ? displayDeliveryFee() : null}
  
      
{/* {pickHours()} */}
      <Input
          placeholder="Apply your Promo Code"
          style={{marginLeft:20,marginRight:20,marginBottom:20}}
        />
      </View>
    
    </React.Fragment>
  );
}

function paymentSelection(index){
  setSelectedIndex(index)
  Details.deliveryOption.paymentOption =   payments[index]
  paymentRef.current = payments[index]
  updateCart(Details)

  switch (index) {
    case 0:
      setPaymentDetails('Gcash Number : 09363673900')
     break;
     case 1:
      setPaymentDetails('Paypal Email : nidaflowershop@gmail.com')
      break;
      case 2:
        setPaymentDetails('BDO : 1321321321321, BDO : 1321321321321,BDO : 1321321321321')
        break;
        case 3:
          setPaymentDetails('')
      break;
        
     default:
      break;
  }


  
}
function deleteItemCart(selectedItem) { 



let updated = Details 
let newlist =   updated.cartItems.filter( data => data._id != selectedItem._id)
updated.cartItems = newlist    
myCart.current =  newlist
updateSetDetails(true)
cartAction(selectedIndex)  
setCount(Details.cartItems.length) 
setOrder( myCart.current?.length == 0 ? false :false ) 
if  (myCart.current .length == 0){
  setTimeout(() => {     
    Alert.alert(
      'Empty Cart',
      '',
      [
        {
          text: 'Continue Shopping',
          onPress: () => 
           navigation.navigate('Shop', { screen: 'TabOneScreen' })
        } 
      ],
      { cancelable: false }
    )
  }, 101)

} 
Vibration.vibrate(1)
}

function consigneeUpdate(Data,type) {
  
  switch (type) {
    case 'FullName':
     setValue(Data) 
    break;
     case 'Mobile':
     setMobile(Data)  
     
    break;
    case 'Address':
     setAddress(Data) 
     break;
     case 'MobilecustomersMobile':
      setcustomersMobile(Data) 
      break;
      case 'ReceiversName':
        setReceiversName(Data) 
        break;
    default:
      break;

  }
  Details.deliveryOption.consigneeDetails = {
    Address: address,
    Mobile:  sendersMobileNumber ,
    SenderName:value,
    Receiver: ReceiversName,
    ReceiverContactNumber: mobile 
  }
  updateCart(Details) 
  

}

function takeVideoRecording(){
  navigation.navigate('VideoRecoder')
  // setType('VIDEO')
  // bottomSheetModalRef.current?.present();  
}

function showCalendarBottomSheet(){
  setType('CALENDAR')
  bottomSheetModalRef.current?.present();  
}
function DeliveryContent() {
  return(
    <React.Fragment> 
<View style={{backgroundColor:'white',flex:1,alignContent:'center',justifyContent:'center',flexDirection: 'row',}}> 
    <Image
                style={{
                  height:150,width:'100%',
                  margin: 20
                }}
                size="giant"
                // https://iammarta.co.uk/wp-content/uploads/2018/07/van.gif
                // source={{ uri:'https://iammarta.co.uk/wp-content/uploads/2018/07/van.gif' }}
                source={
                  require('../../assets/images/deliverygif2.gif')
                    }
              />
               {/* <Text category='c1' >Added 100 to  </Text>   */}
              </View> 
              <Text style={styles.headerTitle}  category='h6' >Delivery Date  </Text> 
     <View style={{backgroundColor:'white'}}>  
     <Layout style={styles.container} level="1"> 
     <TouchableOpacity onPress={()=> showCalendarBottomSheet() }>
<Text style={{marginTop:20,marginBottom:20,color:Colors.buttonTheme}} category='label'><Svg  xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color={Colors.light.tint} stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" class="feather feather-calendar"><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect><Line x1="16" y1="2" x2="16" y2="6"></Line><Line x1="8" y1="2" x2="8" y2="6"></Line><Line x1="3" y1="10" x2="21" y2="10"></Line></Svg>   
{  calendarDetailRef.current != null  ?  
     moment(calendarDetailRef.current.date).format('ll') + ' at ' +  calendarDetailRef.current.slot.time   : '  Set Delivery date & time' } </Text>
</TouchableOpacity>
   {/* <Button  appearance='ghost'  style={{marginTop:20,color:'red'}} status='basic' >

     </Button>  */}
  </Layout> 
     {/* <Text   style={{margin:20}} category='p1'>{  calendarDetailRef.current !== 'Set Delivery date & time'  ?  
     moment(calendarDetailRef.current.date).format('ll') + ' at ' +  calendarDetailRef.current.slot.time   : moment(date).format('LLL')}</Text>  */}
    </View> 
     <Text style={styles.headerTitle}  category='h6' > Delivery Details </Text>  
   <View style={{
  width:width ,
  backgroundColor:'white',borderWidth:consigeneeStatus? 0 :2,borderColor:consigeneeStatus ? 'clear' :'red',borderRadius:5}}>
        <View style={{margin:20,backgroundColor:'white'}}>
        <Input
          placeholder="Sender's Full name"
          value={value}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'FullName') }
        /> 
          <Input
        keyboardType="numeric" 
          placeholder="Sender's Mobile number"
          value={sendersMobileNumber}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'MobilecustomersMobile')}
        />
        <Input
          placeholder="Receiver's Full name"
          value={ReceiversName}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'ReceiversName') }
        /> 
           <Input
        keyboardType="numeric" 
          placeholder="Receiver's Mobile number"
          value={mobile}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'Mobile')}
        />
        <TouchableOpacity onPress={()=> viewAddress() }>
<Text style={{marginTop:20,color:Colors.buttonTheme}} category='label'>  <Svg xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill={Colors.light.tint} color="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></Path><Circle cx="12" cy="10" r="3"></Circle></Svg>  {selectedAddress === '' ? "Set Delivery address" : selectedAddress }   </Text>
  </TouchableOpacity>
      
        </View> 
    </View>  



{/* //DatePicker */}
 
    </React.Fragment>
  )
}


// const PickupContent = useMemo(()=> { 
//   return  (

//     <React.Fragment>
// <View style={{backgroundColor:'white',flex:1,alignContent:'center',justifyContent:'center',flexDirection: 'row'}}> 
//     {/* <Image
//                 style={{
//                   height:100,width:100,
//                   margin: 20
//                 }}
//                 size="giant"
//                 source={{
//                   uri:
//                     "https://i.pinimg.com/originals/6b/15/25/6b1525302df7a2226bdd0b586712110a.gif" }}
//               /> */} 
// <MapView
// mapType={"mutedStandard"}
//         showsBuildings={true} 
//         provider={null}
//         showsIndoors={true}
//         // rotateEnabled={true}   
//           showsCompass={true}
//           showsPointsOfInterest={true}
//           zoomTapEnabled={true}  
//           initialRegion={{
//              heading: 20,
//             pitch: 20,
//             zoom: 10000,
//             altitude: 100,
//             latitude:8.2283,
//             longitude: 235.7570,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05
//           }}
//           // initialCamera={{
//           //   center: {
//           //     latitude: 8.2225,
//           //     longitude: 124.2378
//           //   }
//           //   ,
//           //   heading: 20,
//           //   pitch: 20,
//           //   zoom: 10000,
//           //   altitude: 100
//           // }}
          
//           showsUserLocation 
//           style={{
//             width: Dimensions.get("window").width,
//             height: 150,  }}
//         >  
//           <MapView.Marker
//       coordinate={{
//         latitude: 10.31122,
//         longitude:123.89234,}}
//       title={"The Flower Luxe Cebu"}
//       description={"0917-843-4776"}
//     /></MapView>     
//               </View> 
//               <Text style={styles.headerTitle}  category='h6' >Customer Details  </Text>  

//    <View style={styles.buttonView}>
//         <View style={{margin:20,backgroundColor:'white'}}>
//         <Input
//         //  onFocus={()=>SetBorderColor('#f8c291')}
//         //  onBlur={()=>SetBorderColor('#f7f1e3')}
//         //  style={{borderColor:activeKeyboard === 'FullName' ?  borderColor: '#f7f1e3'}}
        
//          inputAccessoryViewID={"numberID"}
//           placeholder="Customer's Full name"
//           value={value}
//           onChangeText={nextValue =>  consigneeUpdate(nextValue,'FullName') }
//         /> 
//         <Input
//           //  onFocus={()=>SetBorderColor('#f8c291')}
//           //  onBlur={()=>SetBorderColor('#f7f1e3')}
//           //  style={{borderColor:borderColor}}
//          inputAccessoryViewID={"numberID"}
//         keyboardType="numeric" 
//           placeholder="Customer's Mobile number"
//           value={sendersMobileNumber}
//           onChangeText={nextValue =>  consigneeUpdate(nextValue,'MobilecustomersMobile')}
//         /> 
//         </View> 

       
//     </View>  


//     <Text style={styles.headerTitle}  category='h6' >Pickup Date  </Text> 
//      <View style={{backgroundColor:'white'}}>  
//      {/* <Text   style={{margin:20}} category='p1'>{  Details.deliveryOption.deliverySchedule !== undefined  ?  moment(Details.deliveryOption.deliverySchedule).format('LLL') : moment(date).format('LLL')}</Text>  */}
//      <Layout style={styles.container} level="1"> 
//      <TouchableOpacity onPress={()=> showCalendarBottomSheet() }>
// <Text style={{marginTop:20,marginBottom:20,color:Colors.buttonTheme}} category='label'><Svg  xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color={Colors.buttonTheme} stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" class="feather feather-calendar"><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect><Line x1="16" y1="2" x2="16" y2="6"></Line><Line x1="8" y1="2" x2="8" y2="6"></Line><Line x1="3" y1="10" x2="21" y2="10"></Line></Svg>   
// {  calendarDetailRef.current != null  ?  
//      moment(calendarDetailRef.current.date).format('ll') + ' at ' +  calendarDetailRef.current.slot.time   : ' Set Pickup date & time' } </Text>
// </TouchableOpacity>
//        </Layout> 
//      </View> 
//     </React.Fragment>

//   )
// },[])
function PickupContent() { 
const latitude = 8.228346 ;
const longitude = 124.243059;
const label = "B aseline Residences, Juana Osmeña Street, Cebu City";

const url = Platform.select({
  ios: "maps:" +`daddr=${latitude},${longitude}`, // latitude + "," + longitude,
  android: "geo:" + latitude + "," + longitude + "?q=" + label
});
  return (

    <React.Fragment>
<View style={{backgroundColor:'white',flex:1,alignContent:'center',justifyContent:'center',flexDirection: 'row'}}> 
   
<MapView
mapType={"mutedStandard"}
        showsBuildings={true} 
        provider={null}
        showsIndoors={true}
          showsCompass={true}
          showsPointsOfInterest={true}
          zoomTapEnabled={true}  
          initialRegion={{
             heading: 20,
            pitch: 20,
            zoom: 10000,
            altitude: 100,
            latitude:8.2283,
            longitude: 235.7570,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
          
          style={{
            width: Dimensions.get("window").width,
            height: 150,  }}
        ><MapView.Marker
      coordinate={{
        latitude:  8.228346   ,
        longitude:  124.243059  }}
      title={storeDetails.storeName === undefined ? "The Flower Luxe Cebu" : storeDetails.storeName}
      description={"0917-843-4776"}
 onPress={() => Linking.openURL(url)} 

    /></MapView>     
              </View> 
              <Text style={styles.headerTitle}  category='h6' >Customer Details  </Text>  

   <View style={styles.buttonView}>
        <View style={{margin:20,backgroundColor:'white'}}>
        <Input
        //  onFocus={()=>SetBorderColor('#f8c291')}
        //  onBlur={()=>SetBorderColor('#f7f1e3')}
        //  style={{borderColor:activeKeyboard === 'FullName' ?  borderColor: '#f7f1e3'}}
        
         inputAccessoryViewID={"numberID"}
          placeholder="Customer's Full name"
          value={value}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'FullName') }
        /> 
        <Input
          //  onFocus={()=>SetBorderColor('#f8c291')}
          //  onBlur={()=>SetBorderColor('#f7f1e3')}
          //  style={{borderColor:borderColor}}
         inputAccessoryViewID={"numberID"}
        keyboardType="numeric" 
          placeholder="Customer's Mobile number"
          value={sendersMobileNumber}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'MobilecustomersMobile')}
        /> 
        </View> 

       
    </View>  


    <Text style={styles.headerTitle}  category='h6' >Pickup Date  </Text> 
     <View style={{backgroundColor:'white'}}>  
     {/* <Text   style={{margin:20}} category='p1'>{  Details.deliveryOption.deliverySchedule !== undefined  ?  moment(Details.deliveryOption.deliverySchedule).format('LLL') : moment(date).format('LLL')}</Text>  */}
     <Layout style={styles.container} level="1"> 
     <TouchableOpacity onPress={()=> showCalendarBottomSheet() }>
<Text style={{marginTop:20,marginBottom:20,color:Colors.buttonTheme}} category='label'><Svg  xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color={Colors.light.tint} stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" class="feather feather-calendar"><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect><Line x1="16" y1="2" x2="16" y2="6"></Line><Line x1="8" y1="2" x2="8" y2="6"></Line><Line x1="3" y1="10" x2="21" y2="10"></Line></Svg>   
{  calendarDetailRef.current != null  ?  
     moment(calendarDetailRef.current.date).format('ll') + ' at ' +  calendarDetailRef.current.slot.time   : ' Set Pickup date & time' } </Text>
</TouchableOpacity>
       </Layout> 
     </View> 
    </React.Fragment>

  )
}
function loadPaymentContent(){
  var radioList = []
  payments.map( data=> { 
radioList.push(<Radio  key={data.key}  status='danger' key={data.itemName} disabled={!data.status} > 
  {data.itemName}</Radio>)
  }) 


  paymentRef.current = payments[selectedIndex]
  return radioList
}
function displayPaymentDetails(){
  var content = (<View></View>)
  var itemBankList = []
  if (payments?.length) {
    if (payments[selectedIndex].itemName === 'Bank Deposit') { 
      const renderItem =  payments[selectedIndex].items.map( data =>{ 
      itemBankList.push(<Text  category='c1' > {data.itemName} -   {data.itemDetails}</Text>)
      })
      content = itemBankList
    }else {
      content =  <Text  category='c1' > {payments[selectedIndex].itemName} -   {payments[selectedIndex].itemDetails}</Text>
    } 
  }

 return content
}


const displayPaymentDetailss =()=> { 
  console.log('displayPaymentDetails')
  var content = (<View></View>)
  var itemBankList: JSX.Element | JSX.Element[] = []
  if (payments?.length) {
    if (payments[selectedIndex].itemName === 'Bank Deposit') { 
      const renderItem =  payments[selectedIndex].items.map( (data: { icon_url: any; itemName: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | TextElement | (string & {}) | (string & React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>) | (string & React.ReactNodeArray) | (string & React.ReactPortal) | (number & {}) | (number & React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>) | (number & React.ReactNodeArray) | (number & React.ReactPortal) | (TextElement & string) | (TextElement & number) | (TextElement & false) | (TextElement & true) | (TextElement & React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>) | (TextElement & React.ReactNodeArray) | (TextElement & React.ReactPortal) | null | undefined; itemDetails: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | TextElement | (string & {}) | (string & React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>) | (string & React.ReactNodeArray) | (string & React.ReactPortal) | (number & {}) | (number & React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>) | (number & React.ReactNodeArray) | (number & React.ReactPortal) | (TextElement & string) | (TextElement & number) | (TextElement & false) | (TextElement & true) | (TextElement & React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>) | (TextElement & React.ReactNodeArray) | (TextElement & React.ReactPortal) | null | undefined; }) =>{ 
      itemBankList.push(
      <React.Fragment><View style={{flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start'}}><Image source={{uri:data.icon_url}} style={{width:20,height:20,borderRadius:10,marginRight:5,marginBottom:5}}/>
        <Text  category='c1' > {data.itemName} -   {data.itemDetails}</Text></View>
      </React.Fragment>
      )
      })
      content = itemBankList
    }else {
      content =  <React.Fragment>
        <View style={{flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start'}}>
        <Image source={{uri:payments[selectedIndex].icon_url}} style={{width:20,height:20,borderRadius:10,marginRight:5,marginBottom:0}}/><Text  category='c1' > {payments[selectedIndex].itemName} -   {payments[selectedIndex].itemDetails}</Text></View></React.Fragment>
    } 
  }

 return <React.Fragment>
   <Divider/>
   <Text  category='p2' style={{marginBottom:5,marginTop:10}}> Payment Details</Text>
   {content}
 </React.Fragment>
}

function displayRadioList () {
  return ( <React.Fragment>
<RadioGroup 
    selectedIndex={selectedIndex} 
    onChange={index => paymentSelection(index)}>
      {loadPaymentContent()} 
    </RadioGroup>
    {displayPaymentDetailss()}
  </React.Fragment>)
} 

function RenderItemCart(){
//   EventRegister.addEventListener('AddCart', (data) => { 
//     myCart.current = data.cartItems 
//     updateCart(data)
//     paymentRef.current = paymentRef.current + 1
//     console.log('datadatadatadata',data)
// })
return <CartItems  viewItem={(data)=>console.log(data)}  deleteCart={(deleteItem)=>deleteItemCart(deleteItem)}/> 
// return (
//   {didLoadDetails ?  <CartItems count={myCart.current?.length} viewItem={(data)=>console.log(data)}  deleteCart={(deleteItem)=>deleteItemCart(deleteItem)}/> :   <ButtonLoader/>}
// )
}


const wishListContent = ()=>{
  var content = (
    <React.Fragment>
        <Text style={styles.headerTitle}  category='h6' >Send Audio/Video Greetings </Text>  
      <TouchableOpacity onPress={()=>setwishList(!wishList)}>
       <View style={{backgroundColor:'white'}}> 
       <View style={{borderColor:'black',backgroundColor:'black',color:'white',borderRadius:5,margin:20,flex: 1,
              justifyContent: 'center',
              alignItems: 'center'}} >
        <Text style={{margin:10,color:'white'}} >
        {wishList ? 'Added to Wish List': 'Add to Wish List' } {wishList  ?  <Icon name="check" size={15} color="white" /> :null }
          </Text> 
          </View> 
        </View>
      </TouchableOpacity>
    </React.Fragment>
      
    )
   getWishList().then( (status)=> {
    console.log('getWishList',status)
    return status === 'null' ?  content : content
  })  

}
function deleteVideo(){
  Details.deliveryOption.videoURL =  undefined
  updateCart(Details)
  setVideoUrl(undefined)
}
function videoContent(){

if (videoUrl !== undefined)  {
return (
<ScrollView 
horizontal={true} style={{width:width,height:videoUrl ===  undefined ? 60 : 170}} >
  <Video
source={{ uri: videoUrl.uri}}
rate={1.0}
volume={1.0}
usePoster={true}
useNativeControls={true}
isMuted={true}
resizeMode="cover"
shouldPlay
isLooping
style={{ width: 150, height: 150,borderRadius:5,margin:5 ,display:videoUrl.uri ===  undefined  ? 'none' : 'flex'}}
/><TouchableOpacity activeOpactity={1} ><View style={{width: 150, height: 150,borderRadius:5,margin:5,  flex: 1,
     alignItems: 'center',
     justifyContent: 'center'}}>
       <Button style={{marginBottom:60,backgroundColor:Colors.buttonTheme,borderColor:Colors.buttonTheme,width:'90%',marginLeft:10,marginRight:10}} onPress={()=>deleteVideo()}>Delete</Button>
       <Button status="basic"  onPress={()=>  takeVideoRecording() }  >{videoUrl.uri === null ||  videoUrl === undefined ? "Record Video" : "Retake Video"} </Button></View></TouchableOpacity>
 </ScrollView>
)
  }else {
return  (<React.Fragment>
<Button   style={{width:  width / 2 ,marginRight:50,backgroundColor:'black',borderColor:'black',color:'white'}} onPress={()=>  takeVideoRecording() }  >{videoUrl === null ||  videoUrl === undefined ? "Record Video" : "Retake Video"} </Button> 

{/* <Image  source={{uri:'https://i.pinimg.com/originals/8b/8b/3e/8b8b3e550d67fed27a6e334a08b3faae.gif'}} style={{width:200,
        height:200}}/> */}

</React.Fragment>) }
}

function setTabSelectedIndex(index){
  setSelectedIndexTab(index)
  bottomSheetModalRef.current?.dismiss()
}
function CartItemContent() { 
var cartContent =  (
  <React.Fragment>  
    <View style={{marginBottom:90}}> 
     <ScrollView   
        pointerEvents= {submitStatus ? "none" :"" }
     alwaysBounceVertical
     style={{opacity:submitStatus ? 0.5 : 1}}
       ref={scrollViewRef}>  
       <TabBar 
     indicatorStyle={{backgroundColor:Colors.light.tint, height: 4}}
       style={{height:50}}
      selectedIndex={selectedIndexTab}
      onSelect={index => setTabSelectedIndex(index)}>
      <Tab title='DELIVERY'/>
      <Tab title='STORE-PICKUP'/> 
    </TabBar>  
       

    <Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
    <View style={{height:2,width:'100%',backgroundColor:Colors.light.tint,borderRadius:5}}/> 
        <View status='basic' style={{margin:20}}>
          
        <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
        Note:
        </Text>
         <Text    category="c1" style={{marginTop:5}}  >
         For video greetings, please upload your video first before filling-up order details.
        </Text>
         </View>  
      </Layout> 
 {didLoadDetails ?  selectedIndexTab === 0 ? DeliveryContent() : PickupContent() :   <ButtonLoader/>}


 <Text style={styles.headerTitle}  category='h6' >Video Greetings</Text>  
 <View style={{backgroundColor:'white'}}>  
 <View style={{margin:20,backgroundColor:'white'}}>   
{videoContent()}
 </View> 
 



 </View> 
  <Text style={styles.headerTitle}  category='h6' >Mode of Payment  </Text>  
 <View style={{backgroundColor:'white'}}>  
 <View style={{margin:20,backgroundColor:'white'}}>  
 {/* {payments?.length?   displayRadioList()  : <BigLoader/>  } */}
{ displayRadioList() }
 </View> 
 </View> 


 {/* backgroundColor:Colors.buttonTheme,
    color:'white',
    borderColor:Colors.buttonTheme, */} 
      <Text style={{margin:20}}  category='h6' >Cart Items </Text>  
<View style={{backgroundColor:'white'}}> 

<View style={{margin:20,backgroundColor:'white'}}>
{RenderItemCart()}
 
</View>
</View> 

{/* {Voucher()}

<Divider/>  */}
{subTotalView()} 
    <Divider/> 
        {bottomView()}
      
    </ScrollView>   

{/* {didLoadDetails ? displayButton() :<ButtonLoader/>}  */}
</View>
  </React.Fragment>
  )
  
  return  cartContent
}

function EmptyCart() { 
  return (
   <ScrollView  style={{height:height,backgroundColor:'white'}}>
      <Layout style={styles.layout} level='1'>
            <View style={{height:500, flex: 1,
                justifyContent: 'center',
                alignItems: 'center',marginLeft:20,marginRight:20}}>
                    <Image source={{ uri: 'https://i.pinimg.com/originals/81/c4/fc/81c4fc9a4c06cf57abf23606689f7426.jpg'}} style={{ width:400,
        height:200}}/>

          <Text   value={mobile} 
                    onChangeText={nextValue => setMobile(nextValue)}
                    style={styles.text} category='s1'>Your cart is empty</Text>
      <Button style={styles.button} onPress={()=>   navigation.navigate('Shop', { screen: 'TabOneScreen' })} status='primary'>
     Back to store {myCart.current?.length}
  </Button>
            </View>
         
            </Layout>
   </ScrollView>
  )
}

function setDeliverySchedule(date,slot){ 
  try {
    Details.deliveryOption.deliverySchedule = date
    Details.deliveryOption.time = slot
    var data =  {
      date:date,
      slot:slot
    }
    console.log('selected',slot)
    calendarDetailRef.current = data
    updateCart(Details)  
    bottomSheetModalRef.current?.dismiss() 
    setCalendar(!didUpdateCalendar) 
  }catch {
    console.log('error')
  }

}
function UserLocation(e,address,locationType){ 
  Details.deliveryOption.consigneeDetails = {
     Address: e,
     locationType:locationType,
      Mobile:  sendersMobileNumber ,
      SenderName:value,
      Receiver: ReceiversName,
      ReceiverContactNumber: mobile,
      fulladdress:address,
      deliveryLocale:e //List of deliveryRate

  }
  console.log(e,address)
  setDelivery(e.price)
  updateCart(Details) 
  setAddress({
    coordinates:e,
    address:address,
    deliveryLocale:e
  }) 
  setValueAddress(address) 
  bottomSheetModalRef.current?.dismiss()
}

function validateContent(){
  // cartUpdate(value)
  // setCount(Details.cartItems.length)
  setOrder(false) //Details.cartItems.length >= 1 ? true : false
  setStatus(true)
  updateSetDetails(true) 
  return  CartItemContent() //loadStat ? myCart.current?.length !== 0  ? CartItemContent() :EmptyCart() :  <React.Fragment><ScrollView style={{backgroundColor:'white'}}><BigLoader/><BigLoader/></ScrollView></React.Fragment>

}

function validateBottomSheetType(){
  switch (viewerBottomSheet) {
    case 'CALENDAR':
      return (<CalendarPicker type={OrderType[selectedIndexTab]}   storeDetails={storeDetails}  deliverySchedule={(date,slot)=>setDeliverySchedule(date,slot)}/> )
      break;
      case 'ADDRESS':
      return (<MapPicker  storeDetails={storeDetails}  dismiss={()=>  bottomSheetModalRef.current?.dismiss()} getSetLocation={(e,address,locationType)=>UserLocation(e,address,locationType)}/>)
        break;
        case 'VIDEO':
        return <CameraRecorded/>
          break;
    default:
      break;
      
  }
  console.log('B OTTOM TYPE',viewerBottomSheet)
  // {viewerBottomSheet === 'CALENDAR' ?<CalendarPicker  storeDetails={storeDetails}  deliverySchedule={(date,slot)=>setDeliverySchedule(date,slot)}/>   : <MapPicker dismiss={()=>  bottomSheetModalRef.current?.dismiss()} getSetLocation={(e,address,locationType)=>UserLocation(e,address,locationType)}/>} 
 
}

  return (
    <ApplicationProvider  {...eva} theme={eva.light}>    
     {/* <CartContextAction.Consumer> 
       { (xxxx,ccc) => 
      //  {console.log('michael',cartContext)}
       alert('www')
      //  <Text>WES{xxxx}</Text> 
       }
     </CartContextAction.Consumer> */}
    <View style={{marginTop:40,backgroundColor:'#f5f6fa'}}  >  

<VideoModal/>
{CartItemContent() }

{ displayButton()}  
    <BottomSheetModalProvider>
    <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={viewerBottomSheet === 'CALENDAR'  ? snapPointsCalendar : snapPoints} 
        > 
      <View> 
       {validateBottomSheetType()}
       </View>
        </BottomSheetModal> 
    </BottomSheetModalProvider>
    </View> 
    </ApplicationProvider>
 );
 let priceElement = (e)=> (
  <Text category="h4" style={{color:Colors.buttonTheme}}>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(e)}</Text>
)
function displayButton(){
  return( 
    <View style={{shadowColor: "#000", 
    justifyContent: "center", 
    backgroundColor:'white', 
    position:'absolute',
    bottom:0,
    width:width,
    height:90,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5,}}> 
 <ActivityIndicator style={{display:submitStatus ? "flex":"none"}}/>
 


{validateAddons ?   <Button style={styles.button} disabled={submitStatus}  onPress={()=>submitOrder()} status='primary'>
  {submitStatus ?  'Loading...'  : 'Submit Order ' } { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(getTotalPrice + grandTotalDeliveryFee() )}
         </Button> : <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              ><Button disabled={true}  status='primary' style={{width:width-40}}>
              FLOWERS REQUIRED
                      </Button>
                      <Text category="c1"style={{marginTop:10}}>Sorry, you can't purchase without flowers.</Text>
                      </View> }




   
    </View>
  )
  }
}
function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
}



var Image_Http_URL = {
  uri:
    "https://scontent.fmnl9-2.fna.fbcdn.net/v/t1.0-9/133062997_670673320292451_3457467490911310937_n.jpg?_nc_cat=107&ccb=2&_nc_sid=8bfeb9&_nc_ohc=Ea26CBOdayIAX-1P_pp&_nc_ht=scontent.fmnl9-2.fna&oh=408eae8f0c4de050398ccf808ad3983a&oe=600D4A80"
};  
  const stylesCart = StyleSheet.create({
    container: {
      marginBottom: 20,
      flex: 1,
      flexDirection: "row"
    },
    layoutAvatar: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start"
    },
    layout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start"
    }
  });
  










const stylesGridCard = StyleSheet.create({
  modalContainer:{
    flex: 1,
    //backgroundColor: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    layout: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  button:{
    backgroundColor:Colors.buttonTheme,
    color:'white',
    borderColor:Colors.buttonTheme,
  margin:20 
  },
  buttonView:{
  width:width ,
  backgroundColor:'white'
  },
  text: {
    margin: 2,
  },
  headerTitle: {
    margin: 20,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },

  container: {
    marginLeft:20,
    marginRight:20,
    marginBottom:5,
    marginTop:5,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    margin: 2,
  },

  subTotalItem:{
    fontSize:14,
    alignContent:'flex-end',
    margin: 2,
  },
  subTotal:{
    flex: 1,
    margin: 2,
  },
  Total:{
    fontSize: 24,
    flex: 1,
    margin: 2,
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    // alignItems: 'flex-start',
    // marginHorizontal: 50,
    marginLeft:20,
    // marginRight:20,

    width:width - 40
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});


 