import * as WebBrowser from 'expo-web-browser';
import  React,{useEffect,useState,useContext,useRef,useMemo,useCallback}from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity,SafeAreaView, ScrollView,Dimensions,Image,View ,Vibration,ActionSheetIOS,InputAccessoryView, Alert} from 'react-native';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import { Button ,Text,Card,RadioGroup,Radio, Divider,Spinner,Layout,Calendar,Icon,Avatar, Tab, TabBar,ListItem,List} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';  
import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import CustomCard from './Card' 
import {UserContext} from '../Utils/UserContextAPI'
import {axios} from '../Utils/ServiceCall'
import { AsyncStorage } from 'react-native'; 
import { BottomTabView } from '@react-navigation/bottom-tabs';
import  moment from 'moment'
import CartItems from '../../components/Shop/Cart/CartItems'
import CartContext from "../Utils/CartContext";
import {TopNavigationActionSimpleUsageShowcase} from "../../components/header";
import CalendarPicker from "../../components/Shop/CalendarPicker";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import {Small,BigLoader,ButtonLoader} from '../../components/Shop/ProductDetails/Loader';
import {fetchData,fetchExisting} from '../Utils/StoreDetails' 
import { ThemeContexts, Themes } from '../Utils/Testcontext';
import { cart, Theme,CartContextAction } from '../Utils/UserCart'; 
import MapPicker from '../../components/MapPicker' 
import Svg,{Circle,Path,Line,Polyline,Rect} from "react-native-svg"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
 
const mapIcon =()=> (   <Svg   width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b13636" color="#b13636" stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" className="feather feather-arrow-right-Circle"><Line x1="8" y1="12" x2="16" y2="12"></Line></Svg> )
export default React.memo (({ path, navigation,itemsList}: { path: string }) => {
  const [themes, setTheme] = React.useState(Themes.Light);
  const [selectedIndexTab, setSelectedIndexTab] = React.useState(0); 
  const [selectedAddress, setValueAddress] = useState('');
  const  [loadStat, setStatus] = useState(false);
  const [counter, setCounter] = useState(0);
  const [value, setValue] = useState('');
  const [ReceiversName, setReceiversName] = useState('');
  const [customersMobile, setcustomersMobile] = useState('');
  const [consigeneeStatus,setconsigeneeStatus ] = useState(true);
  const [passCode, setPasscode] = useState(''); 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [spinStatus, submitBooking] = useState(false);
  const [productItems, setProducts] = useState(false);
  const [cartItems, setCart] = useState([]);
  const [didFound, updateState] = useState([]);
  const [date, setDate] = useState(new Date());
  const [submitStatus, setOrder] = useState(false);
  const [address, setAddress] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [time, setTime] = useState('');
  const [list, cartAction] = useState([]);
  // const [selectedIndex, setSelectedIndexX] = useState(0);
  const { cartDetails, updateDetails } = useContext(CartContext); 
  const [cartDetail, cartUpdate] = useState({});
  const [numberOfItems, setCount] = useState(0);
  const [didLoadDetails, updateSetDetails] = useState(false);
  const { Details, updateCart } = cart()
  const  [paymentDescription, setPaymentDetails ] =  useState(false);
  const myCart = useRef(itemsList);
  const  [deliveryFee, setDelivery ] =  useState(80); 
  const  [payments, setPaymentList ] =  useState([]);
  const  [viewerBottomSheet, setType ] =  useState(null);
  const paymentRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [didUpdateCalendar, setCalendar] = useState(false);
 
const PaymentList = ['GCASH','PayPal','Bank Transfer','Cash']
const OrderType = ['Delivery','Store-Pickup']

const bottomSheetModalRef = useRef<BottomSheetModal>(null); 
const calendarDetailRef = useRef(null);
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
async function placeOrderState() {

  try {   
    const data =  { 
      "cartItems":Details.cartItems,
      "OrderType": OrderType[selectedIndexTab],
      "deliverySchedule":calendarDetailRef.current,
      "deliveryDetails":Details.deliveryOption,
      "paymentDetails":paymentRef.current
          } 
 let response =  await axios.post('/placeOrder', data)
return response



 

  }catch (error) {
    return error
      console.error(error);
      alert('error')
    }
}
function autoScroll() {
  setTimeout(() => {     
      scrollViewRef.current.scrollToEnd({ animated: true })
    }, 500)
}

function submitOrder(){  
var isDelivery = selectedIndexTab === 0 ? true : false
var dateTitle = isDelivery ? 'Set your delivery Date' : 'Set your Pickup Date' 
try { 

  if (isDelivery && Details.deliveryOption.consigneeDetails === null ){
    Alert.alert(
      'Missing Details',
      'Set your delivery address',
      [  { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    ) 
    return
  } else if (isDelivery &&  calendarDetailRef.current === undefined || calendarDetailRef.current == null) {
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

  if (value != null && mobile !== null  ) { 
    // setconsigeneeStatus(false)
    setOrder(true) 
   var content =   placeOrderState().then( (orderState) =>{
    //  alert('wow')
    // console.log(orderState.data.results)
  //   setTimeout(() => {  
    navigation.navigate('SuccessPayment',{response:orderState.data.results})
  // }, 500)
    setTimeout(() => {  
    calendarDetailRef.current = null 
    scrollViewRef.current = null
    myCart.current = null
    setOrder(false)
    setValueAddress('')
    Details.deliveryOption = {}
    Details.deliveryOption.consigneeDetails = null
    updateCart(Details)
    setMobile(null)
    setAddress(null)
    setValue(null) 
     setMobile(null)   
     setAddress(null)  
      setcustomersMobile(null)  
     setReceiversName(null) 
    }, 500)
   })
   }else {
    setconsigeneeStatus(true)
    // alert('Please complete the details')
    Alert.alert(
      'Missing Details',
      'add mobile number/full name',
      [
        // {
        //   text: 'Ask me later',
        //   onPress: () => console.log('Ask me later pressed')
        // },
        // {
        //   text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        //   style: 'cancel'
        // },
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
   }
 
}
async function fetchCart(){ 
  try {
    const value = await cartDetails
    cartUpdate(value)
    setCount(Details.cartItems.length)
    setOrder(false) //Details.cartItems.length >= 1 ? true : false
    setStatus(true)
    updateSetDetails(true)
  } catch (error) {
    // Error retrieving data
  }


  var getDetails = fetchExisting().then ( status => {
    var paymentList = status.results[0].storeOptions.paymentOptions 
    var flatRate = status.results[0].storeOptions.deliveryFlatrate 
    setPaymentList(paymentList)
    setDelivery(flatRate.flatrate)
    // paymentList.map( items => {
    //   console.log(items)
    // })
  })


}

useEffect(() => { 
  // setTimeout(() => {  
    fetchCart(); 
  // }, 100)

//   fetchProduct();
}, [])

function bottomView(){
  return(
    <React.Fragment>

<View style={{backgroundColor:'white',height:40}}> 
      <Layout style={styles.container} level="1">
        <Text style={styles.subTotal} category="label">
          Total
        </Text>
        <Text style={styles.subTotalItem} category="c1">
          P{didLoadDetails ? getTotalPrice() + deliveryFee : '0.00'}
        </Text>
        
      </Layout> 
 
      </View>
      <Divider/> 
      <View > 
      <Layout style={{margin:20}} level="1">
        <Card status='danger'> 
         <Text   category="c1">
         To process your order, please send us proof of payment thru our facebook messenger.
           {/* For faster faster transaction, please you may send your proof payment thru facebook. */}
        {/* **  Your order will not be processed untill submission  prof of payment **
        You will not be charge untill then. */}
   
        </Text>
         </Card>
       
        {/* <Text style={styles.subTotalItem} category="c1">
          P{didLoadDetails ? getTotalPrice() + deliveryFee : '0.00'}
        </Text> */}
        
      </Layout> 
 
      </View>
    </React.Fragment>


  )
}


function  getTotalPrice() {
 
  let finalPrices =  Details.cartItems.reduce((a, b) => a + ((b.price * b.itemOptions.quantity )+  b.itemOptions.addons.price)  , 0)
console.log("total is : " +  Details.cartItems );
  return  finalPrices === undefined ? '0' :  finalPrices 
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
          P{didLoadDetails ? getTotalPrice() : '0.00'}
        </Text>
        
      </Layout> 

      <Layout style={styles.container} level="1">
        <Text style={styles.subTotal} category="c1">
          Delivery Fee
        </Text>
        <Text style={styles.subTotalItem}>(flat rate) P{deliveryFee}.00</Text>
      </Layout>
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
    Mobile:  mobile,
    Receiver: value
  }
  updateCart(Details) 
  

}


function showCalendarBottomSheet(){
  setType('CALENDAR')
  bottomSheetModalRef.current?.present(); 
  // navigation.navigate('TimePicker')
}
function DeliveryContent() {
  return(
    <React.Fragment> 
<View style={{backgroundColor:'white',flex:1,alignContent:'center',justifyContent:'center',flexDirection: 'row',}}> 
    <Image
                style={{
                  height:100,width:100,
                  margin: 20
                }}
                size="giant"
                source={{
                  uri:
                    "https://lh3.googleusercontent.com/-j-hhrMMqnbs/X-8LWaqSyXI/AAAAAAAARJU/9Z4YSVLOcqgbGQLNr09u1pOKaiJ75Y9UQCK8BGAsYHg/s512/2021-01-01.png"     
                    }}
              />
               {/* <Text category='c1' >Added 100 to  </Text>   */}
              </View> 
              <Text style={styles.headerTitle}  category='h6' >Delivery Date  </Text> 
     <View style={{backgroundColor:'white'}}>  
     <Layout style={styles.container} level="1"> 
     <TouchableOpacity onPress={()=> showCalendarBottomSheet() }>
<Text style={{marginTop:20,marginBottom:20,color:'#b13636'}} category='label'><Svg  xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color="#b13636" stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" class="feather feather-calendar"><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect><Line x1="16" y1="2" x2="16" y2="6"></Line><Line x1="8" y1="2" x2="8" y2="6"></Line><Line x1="3" y1="10" x2="21" y2="10"></Line></Svg>   
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
          placeholder="Sender's full name"
          value={value}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'FullName') }
        /> 
          <Input
        keyboardType="numeric" 
          placeholder='Mobile number'
          value={customersMobile}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'MobilecustomersMobile')}
        />
        <Input
          placeholder="Receiver's full name"
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
<Text style={{marginTop:20,color:'#b13636'}} category='label'>  <Svg xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="#b13636" color="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></Path><Circle cx="12" cy="10" r="3"></Circle></Svg>  {selectedAddress === '' ? "Set Delivery address" : selectedAddress }   </Text>
  </TouchableOpacity>
      
        </View> 
    </View>  



{/* //DatePicker */}
 
    </React.Fragment>
  )
}
function PickupContent() {
  return (

    <React.Fragment>
<View style={{backgroundColor:'white',flex:1,alignContent:'center',justifyContent:'center',flexDirection: 'row'}}> 
    <Image
                style={{
                  height:100,width:100,
                  margin: 20
                }}
                size="giant"
                source={{
                  uri:
                    "https://lh3.googleusercontent.com/-K9X-y_q7oLA/X-8LcR9Z49I/AAAAAAAARJY/8XY2FswOtX8Z9jpTnda88_ClEw04szdOwCK8BGAsYHg/s512/2021-01-01.png" }}
              />
             
              </View> 
              <Text style={styles.headerTitle}  category='h6' >Customer Details  </Text>  

   <View style={styles.buttonView}>
        <View style={{margin:20,backgroundColor:'white'}}>
        <Input
         inputAccessoryViewID={"numberID"}
          placeholder="Customer's full name"
          value={value}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'FullName') }
        /> 
        <Input
         inputAccessoryViewID={"numberID"}
        keyboardType="numeric" 
          placeholder='Mobile number'
          value={mobile}
          onChangeText={nextValue =>  consigneeUpdate(nextValue,'Mobile')}
        /> 
        </View> 

       
    </View>  


    <Text style={styles.headerTitle}  category='h6' >Pickup Date  </Text> 
     <View style={{backgroundColor:'white'}}>  
     {/* <Text   style={{margin:20}} category='p1'>{  Details.deliveryOption.deliverySchedule !== undefined  ?  moment(Details.deliveryOption.deliverySchedule).format('LLL') : moment(date).format('LLL')}</Text>  */}
     <Layout style={styles.container} level="1"> 
     <TouchableOpacity onPress={()=> showCalendarBottomSheet() }>
<Text style={{marginTop:20,marginBottom:20,color:'#b13636'}} category='label'><Svg  xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color="#b13636" stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" class="feather feather-calendar"><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect><Line x1="16" y1="2" x2="16" y2="6"></Line><Line x1="8" y1="2" x2="8" y2="6"></Line><Line x1="3" y1="10" x2="21" y2="10"></Line></Svg>   
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
radioList.push(<Radio  key={data.key}  status='danger' key={data.itemName} disabled={!data.status}> 
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


function displayRadioList () {
  return ( <React.Fragment>
<RadioGroup 
    selectedIndex={selectedIndex} 
    onChange={index => paymentSelection(index)}>
      {loadPaymentContent()} 
    </RadioGroup>
    {displayPaymentDetails()}  
  </React.Fragment>)
} 

function CartItemContent() {
var cartContent =  (
  <React.Fragment    >  
     <ScrollView   
  pointerEvents= {submitStatus ? "none" :"" }
     alwaysBounceVertical
     style={{opacity:submitStatus ? 0.5 : 1}}
       ref={scrollViewRef}>  
       <TabBar 
       style={{height:50}}
      selectedIndex={selectedIndexTab}
      onSelect={index => setSelectedIndexTab(index)}>
      <Tab title='DELIVERY'/>
      <Tab title='STORE-PICKUP'/> 
    </TabBar>     
 {didLoadDetails ?  selectedIndexTab === 0 ? DeliveryContent() : PickupContent() :   <ButtonLoader/>}
  <Text style={styles.headerTitle}  category='h6' >Payment Detailsss  </Text>  
 <View style={{backgroundColor:'white'}}>  
 <View style={{margin:20,backgroundColor:'white'}}>  
 {payments?.length?   displayRadioList()  : <BigLoader/>  }

 </View> 
 </View> 
      <Text style={styles.headerTitle}  category='h6' >Cart Items  </Text>  
<View style={{backgroundColor:'white'}}> 

<View style={{margin:20,backgroundColor:'white'}}>

 {didLoadDetails ?  <CartItems count={myCart.current?.length} viewItem={(data)=>console.log(data)}  deleteCart={(deleteItem)=>deleteItemCart(deleteItem)}/> :   <ButtonLoader/>}
</View>
</View> 
{subTotalView()} 
    <Divider/> 
        {bottomView()}
    </ScrollView> 

    {didLoadDetails ? displayButton() :<ButtonLoader/>} 
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
     Back to store
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
    calendarDetailRef.current = data
    updateCart(Details)  
    bottomSheetModalRef.current?.dismiss() 
    setCalendar(!didUpdateCalendar) 
  }catch {
    console.log('error')
  }

}
function UserLocation(e,address){
  Details.deliveryOption.consigneeDetails = {
    Address: e,
    Mobile:  mobile,
    Receiver: value
  }
  updateCart(Details) 
  setAddress({
    coordinates:e,
    address:address
  }) 
  setValueAddress(address) 
  bottomSheetModalRef.current?.dismiss()
}

function validateContent(){
  // cartUpdate(value)
  // setCount(Details.cartItems.length)
  // setOrder(false) //Details.cartItems.length >= 1 ? true : false
  // setStatus(true)
  // updateSetDetails(true)

  return  loadStat ? myCart.current?.length != 0  ? CartItemContent() :EmptyCart() :  <React.Fragment><ScrollView style={{backgroundColor:'white'}}><BigLoader/><BigLoader/></ScrollView></React.Fragment>

}



  return (
    <ApplicationProvider  {...eva} theme={eva.light}>   
    <View style={{marginTop:40,backgroundColor:'#f5f6fa'}}  >   

    {validateContent()}
    <BottomSheetModalProvider>
    <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={viewerBottomSheet === 'CALENDAR'  ? snapPointsCalendar : snapPoints} 
        > 
      <View> 
       {viewerBottomSheet === 'CALENDAR' ?<CalendarPicker deliverySchedule={(date,slot)=>setDeliverySchedule(date,slot)}/> : <MapPicker dismiss={()=>  bottomSheetModalRef.current?.dismiss()} getSetLocation={(e,address)=>UserLocation(e,address)}/>} 
     </View>
        </BottomSheetModal> 
    </BottomSheetModalProvider>
    </View> 
    </ApplicationProvider>
 );

function displayButton(){
  return( 
    <View style={{shadowColor: "#000", 
    justifyContent: "center", 
    backgroundColor:'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5,}}> 
 
    <Button style={styles.button} disabled={submitStatus}  onPress={()=>submitOrder()} status='primary'>
          {submitStatus ?  'Loading...'  : 'Submit Order ' +'P'+ (getTotalPrice() + deliveryFee) +'.00' } 
    </Button>
  
    </View>
  )
  }

})
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
    backgroundColor:'#b13636',
    color:'white',
    borderColor:'#b13636',
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


 