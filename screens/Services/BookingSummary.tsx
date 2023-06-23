import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,Alert,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input,Radio, RadioGroup} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
import ThemeColor from '../../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../../components/Utils/StoreDetails'
import  moment from 'moment'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location"; 
import Toast from 'react-native-toast-message'; 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {CheckMark} from '../../components/Svgs'
import {schedulePushNotification} from '../Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg,{Circle,Path,Line,Polyline,Rect} from "react-native-svg"
import Store from  '../../components/Context/MapContext'
import {MapContext} from '../../components/Context/MapContext'
import DashedLine from 'react-native-dashed-line'; 
import {BookingContext}from  '../../components/Context/UserBookingContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import {Cities} from '../../components/Utils/ListOfCities'
import Axios from 'axios'; 
import {LoginRequired} from '../../components/Errors/LoginRequired' 
import { StatusBar } from 'expo-status-bar';
import BottomSheet,{BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
import {Small,BigLoader,ButtonLoader,InstagramContent} from '../../components/Loader';
import { notifyGroup,roomListenerStandard,getActiveUsers,setOnline,socket,dynamicEmit} from '../../components/Utils/SocketManager';
let paymentOptions =  [
  // {
  //   "itemName": "Bank Deposit",
  //   "itemDetails": "1923-2392-2932",
  //   "status": true,
  //   "items": [
  //     {
  //       "itemName": "PNB",
  //       "itemDetails": "4107-1004-4056",
  //       "status": false,
  //       "icon_url": "https://cdn6.aptoide.com/imgs/8/b/e/8be51499bebc917bde5f956937d66879_icon.png"
  //     },
  //     {
  //       "itemName": "BPI",
  //       "itemDetails": "9359-599-568",
  //       "status": false,
  //       "icon_url": "https://play-lh.googleusercontent.com/mjHDhET2n67GSZpmQtEBejwbXIkc5MtwrlmjhgMKoSMZkMbvb4XZmCikZNIOYo0Ur3CG"
  //     }
  //   ],
  //   "key": "xx1"
  // },
  {
    "itemName": "GCash",
    "key": "xx2",
    "itemDetails": "0975-365-3640",
    "status": false,
    "icon_url": "https://getcash.ph/wp-content/uploads/2021/01/Gcash-logo-Transparent-500x500-1.png"
  },
  {
    "itemName": "Paymaya",
    "key": "xxx2",
    "itemDetails": "0965-548-1821",
    "status": false,
    "icon_url": "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/leeoq9lzt4bhvqnkl0kb"
  },
  {
    "itemName": "Paypal",
    "key": "xxx6",
    "itemDetails": "0975-365-3640",
    "status": false,
    "icon_url": "https://cdn-icons-png.flaticon.com/512/174/174861.png"
  },
  {
    "itemName": "Cash on Delivery",
    "key": "xx4",
    "itemDetails": "COD",
    "status": true,
    "icon_url": "https://www.iconbunny.com/icons/media/catalog/product/2/9/2906.10-cash-icon-iconbunny.jpg"
  }
]
export default  function BookingSummary({ route, navigation }){
  const [initialPrice, setInitialPrice] = useState(0);
  const [items, setItems] = useState([1,2,3,4,5]);
  const {setUserVehicle,getCurrentUser,driverDetails,getSelectedVehicle,userTrips,loadType,isBackload,getUpdateState} = useContext(BookingContext);
  const [status, setStatus] = useState(false);
  const [isReady, setReady] = useState(false);
  const [teams, setTeam] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef();

  const [selectedIndex, setSelectedIndex] = useState(3);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [isSheetDisplay,setisSheetDisplay] =  useState(false);
  const [isDataReady,setDataReady] =  useState(true);
	const snapPoints = React.useMemo(() => ['25%',Platform.OS === 'android'  ? '50%' :'45%'], []);
  const [shipperName, setShipperName] = useState(null);
  const [shipperMobile, setShipperMobile] = useState(null);
  function currencyFormat(num) {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  function getCitiID (){
    try {
      let citiObject = Cities()
      let regionID  =  citiObject.filter(item => item.name === userTrips[0].departDetails.meta_details.city)[0]
      return  regionID
    } catch (error) {
      return 'Philippines'
    }
  }
  useEffect(() => {
    try {
      if(isFocused) {
  //     dynamicEmit("load-booking-watcher",{payload:{
  //       room: "checkAllBookings"},
  //       room:"checkAllBookings"
  //     })  
  // dynamicEmit("notify-city-group",{payload:{
  //   type:"load",
  //   room: "checkAllBookings",
  //   bookingReference:"aYZA5H",
  //   trips:userTrips,
  //   loadDetails:userTrips,
  //   userTrip:userTrips},
  //   meta_data:null
  // })
      }

      console.log('citiessss',getUpdateState())
    } catch (error) {
      console.log('citiessss',error)
    }
},[isFocused ])
  useEffect(() => {
      // console.log('fetchMatrix',fetchMatrix())
     if (isFocused){
      fetchListofGroups()
      setShipperName(getCurrentUser().application_info.full_name)

    //  let city = `${getCitiID().province}-trucking` // Get Pickup Region /Cebu/
    //  let id =  "D6ES6N"
    // console.log('userTrips[0].departDetails.meta_details',getCitiID())
    // let payload = {reference:id,state:"didLogin",owner:"expo"}
    // let xxx = {room:city,payload}
     }

    //  notifyRegion({data:true})
  },[isFocused ])
  
  useEffect(() => {
    console.log('selectedGroup',selectedGroup)
      
},[selectedGroup])
  

const notifyRegion = (data)=>{
  try {
  
  let city = `${getCitiID().province}-trucking` // Get Pickup Region /Cebu/
   let id =  "D6ES6N"
  console.log('userTrips[0].departDetails.meta_details',getCitiID())
  let payload = {reference:id,state:"didLogin",owner:"expo",type:"load"}
  let xxx = {room:city,payload}
   // set City
   // assign payload
   // await success response
//  dynamicEmit("load-state-follow",{payload:{room: city}})
dynamicEmit("load-booking-watcher",{payload:{
  room: "checkAllBookings"},
  room:"checkAllBookings"
})
  dynamicEmit("notify-city-group",{payload:{
    type:"load",
    room: "checkAllBookings",
    loadDetails:data,
    userTrip:userTrips},
    meta_data:data
  })
  // dynamicEmit("dynamic-leave-room",{payload:{room: 'room-checkAllBookings'}})
    // setOnline({
    //     room: 'davao-trucking',
    //     payload: { reference: 'D6ES6N', state: 'didOnline',source:"expo",coordinates:userCoordinates,country:"ph", 
    //   }
    //   })
  } catch (error) {
    console.log('notifyRegion errorr',error,userTrips)
  }
}
function loadPaymentContent(){
  try {
  var radioList = []
        paymentOptions.map( data=> { 
          if (data.itemName === 'Bank Deposit') { 
               data.items.map( bank=> {
              radioList.push(<Radio  key={bank.key}  status='danger' key={bank.itemName} disabled={!bank.status} > 
              {bank.itemName}</Radio>)
            })
          }else {

            radioList.push(<Radio  key={data.key}  status='danger' key={data.itemName} disabled={!data.status} > 
            {data.itemName}</Radio>)
          }
        }) 
  return radioList
  } catch (error) {
    return <Radio   status='danger' > 
    Empty Error </Radio>
  }
}

function displayRadioList () {
  try {
    
  return ( <React.Fragment>
    <View style={{marginLeft:20}}>
    <RadioGroup 
        selectedIndex={selectedIndex} 
        onChange={index => setSelectedIndex(index)}
        >{loadPaymentContent()} 
        </RadioGroup>
        </View>
        {/* {displayPaymentDetailss()} */}
      </React.Fragment>)
  } catch (error) {
    console.log('error displayRadioList',error)
  }
} 

  
   function  fetchMatrix (){
    fetchMatrixService().then(item=>{
      console.log('ASYNC',item.summary)
      return item.summary.lengthInMeters 
      setDataReady(true)
    })
  }
  async function fetchMatrixService (){
    try {
      const response = await Axios.get('https://api.tomtom.com/routing/1/calculateRoute/14.652937%2C121.034437%3A10.30984%2C123.893107/json?travelMode=truck&key=1hAGLyVpeOqc154z5brx2rls2WmqYtnG');
      console.log('matrix',response.data.routes[0])
      return response.data.routes[0]
      
    } catch (error) { 
      console.log('error matrix',error)
      return 'ERROR'
    }
  }

  const displayItems=(e)=>{
    // Loogy/Matrix
    
  const content = [<View/>] 
  e.map((data, index) => { 
    content.push(
      <React.Fragment>
      <View style={{backgroundColor:'white',borderColor:'white',borderWidth:0.5,borderRadius:10,margin:10,marginRight:30,marginLeft:30,elevation: 2}}>
       <View style={{backgroundColor:'black',height:10,width:10,position:'absolute',left:16,top:15, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
      <View style={{backgroundColor:'#C4E538',height:'40%',width:1,position:'absolute',left:20,top:25, opacity:1,    borderWidth: 1,borderRadius:1,zIndex:1,elevation: 1,}}/>
      <View style={{backgroundColor:'#dcdde1',height:10,width:10,position:'absolute',left:16,top:59, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
    {/* <View style={{backgroundColor:'black',height:25,width:25,position:'absolute',right:-4,top:-12, borderRadius: 25,alignItems:'center'}}><Text style={{fontWeight:'bold',color:'white',marginTop:3}}>{(2)}D</Text></View>
    <View style={{backgroundColor:'black',height:25,width:25,position:'absolute',right:-4,top:-40, borderRadius: 25,alignItems:'center'}}><Text style={{fontWeight:'bold',color:'white',marginTop:3}}>{(1)}/k</Text></View> */}
<Layout style={styles.containerMultiDate} level='1'>
  <TouchableOpacity   style={styles.input} >
    <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold',
      color:'#747d8c'
    }}>Pickup From</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={undefined === null ? true:false}  style={styles.inputRoundTripTouchable} >
        <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold' 
    }}>{data.departDetails.address.substring(0, 20)}</Text>
    </TouchableOpacity>
  </Layout>
  
  <Layout style={styles.containerContent} level='1'>
    {/* <View style={{backgroundColor:'#A3CB38',height:,width:2,position:'absolute',left:5,top:-60,borderStyle:'dotted', opacity:0.5,    borderWidth: 1,
    borderRadius:1}}/> */}
  <TouchableOpacity   style={styles.input} >
    <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold',
      color:'#747d8c'
    }}>Delivery To</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={undefined === null ? true:false}  style={styles.inputRoundTripTouchable} >
        <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold'
    }}>{data.arrivalDetails.address.substring(0, 20)}</Text>
    </TouchableOpacity>
  </Layout>
  </View>
  {/* <View style={{height:2,width:30,backgroundColor:'gray',marginLeft:'10%',borderWidth:2,borderRadius:20}}/> */}
  </React.Fragment>
   
    )
  })
  // {isDataReady ?  displayItems(items.userTrips) : <BigLoader/>}
  return  isDataReady ?  content : <BigLoader/>
  }

  function EmptyState() {
    return (
      <Layout style={styles.layout} level="1">
        <View
          style={{
            height: 400,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop:80
          }}
        >
     <Image source={{ uri: 'https://cdn.dribbble.com/users/2058104/screenshots/4198771/dribbble.jpg?compress=1&resize=800x600'}} style={{ width:300,
          height:250}}/>

        <Text 
            // onChangeText={nextValue => setMobile(nextValue)} 
            category="h5"
          > Not found
          </Text>
          <Button style={{marginTop:20,backgroundColor:'#f8c291',borderColor:'#f8c291'}} onPress={()=> resultType('LANDING')}>Search again</Button>
        </View>
      </Layout>
    );
  }
  const displayVehicleType = (data) => {
    return (
      <TouchableOpacity
     
        >
        <View style={{
            flexDirection:'row',
              height:'auto',
              borderRadius:20,
              margin:20,
              // borderWidth:data.id === selectedVehicle ? 1.5:0
         
          }}>
          <View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
            
                <Image    resizeMode='contain' source={{uri:data.imageUrl}} style={{width:'100%',height:100,marginLeft:20}}/>
              </View>  
           
              
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'700'}} category='h6' >{data.name !== undefined ? data.name : data.name}</Text>
                <Text style={{marginLeft:20,marginTop:10,marginRight:20}} category='c1'  >{'data.id '=== 'selectedVehicle'  ? data.description.substring(0, 20)  :data.description }</Text> 
              
              </View>    
          </View> 
          </TouchableOpacity>
    )
  }
  const convertPrice = (e)=>{
    // let price =
    // setInitialPrice(price)
    
  }
  const checkButtonValidaity = ()=>{
    if (initialPrice != 0 && shipperName === null && shipperMobile.length > 8) {
    return  true
    }else {
      return false
    }
  }
  const displayTeamItems = ()=>{
    
    var renderedItem = []
    teams.map(item =>{
      console.log('renderedItem',item)
      renderedItem.push(<Radio key={item.groupID}>
          <Text    category="p1" style={{fontWeight:'bold',marginTop:10,marginBottom:10,marginLeft:20}}>@{item.data.title}</Text>
        </Radio>)
    })
// return  <View style={{marginLeft:20}}>
//   <BottomSheetFlatList
// data={teams}
// keyExtractor={i => i}
// renderItem={(item)=>}
// />
// </View>
return  <BottomSheetFlatList
data={[teams]}
keyExtractor={i => i}
renderItem={(item)=>
  <View style={{marginLeft:20}}>
      <Text category='h6' style={{fontWeight:'bold'}}>{teams.length ? 'Your current teams':'Your list of team' }</Text>
  <Text category='c1' style={{marginBottom:10}}>Post it in your team</Text>
  <RadioGroup
selectedIndex={selectedGroup}
onChange={index =>  setSelectedGroup(index)}>
  {renderedItem} 
  <Radio key={'none'} ><Text category="p1" style={{fontWeight:'bold',marginTop:10,marginBottom:10,marginLeft:20}}>None</Text>
  </Radio>
</RadioGroup>
</View>
}
/>

  }
  const teamListingContent = (e)=>{
    console.log('Indexxx',e)
    return (    <TouchableOpacity key={e.index} onPress={()=> setSelectedGroup(e.item)}>
      <View key={e.index} style={{ marginLeft: 30, marginTop: 2 ,alignItems:'flex-start',backgroundColor:selectedGroup === e.item ? '#dfe6e9' : 'white',borderRadius:5}}>
      {selectedGroup === e.item ?   <Image  source={{uri:'https://icon-library.com/images/green-check-mark-icon-png/green-check-mark-icon-png-13.jpg'}}  style={{width:30,height:30  ,position:'absolute',top:10,right:20}}/> : null}
      <Text key={e.index} category="h6" style={{fontWeight: selectedGroup === e.item ? 'bold' :'100',marginTop:20,marginLeft:20}}>{'TEST'}</Text>
      <Text key={e.index} category="p1" style={{fontWeight:'bold',marginTop:10,color:'#0652DD',marginBottom:10,marginLeft:20}}>@{'TEST'}</Text>
      </View>
  </TouchableOpacity>)
  }
  const fullLoader = ()=>{
    return (<>
    <BigLoader/>
    <BigLoader/>
  </>)
  }
  const fetchListofGroups=()=>{
    setReady(false)
    fetchListofGroupsService().then(item =>{
      console.log('FETCH TEAM RESPONSE',item)
      if (item !== null){
        setTeam(item.results)
        
      }else {
        setTeam([])
      }
      setReady(true);
    })
    }
  async function fetchListofGroupsService (){
    // console.log('getCurrentUsergetCurrentUsergetCurrentUsergetCurrentUser',getCurrentUser().user_details.teamIDs[0].groupID)
// console.log('getCurrentUser().',getCurrentUser())
    try {
      
      var  data =   {
                    queryType: "customV2",
                    queryData: [
                      { "data.admin": getCurrentUser().id  },
                      { "groupID": getCurrentUser().user_details.teamIDs[0].groupID}
                      ]
                    }

     const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post('/store/LoogyGroup', data);
     return response.data;
    } catch (error) { 
      console.log('error',error)
      return null
      
    } 
  }
  const displayFooter = (price) => {
    return (
      <React.Fragment>
    <View style={{backgroundColor:'white',height:40}}> 
          <Layout style={styles.container} level="1">
            <Text style={styles.subTotal} category="h6">
              Total (Set your initial budget)
            </Text>
          </Layout>  
          </View>
          <Input
          keyboardType="number-pad"
          // autoFocus={true}
            onSubmitEditing={() => convertPrice()}
            // onChange={(e)=>setInitialPrice(e)}
            onChange={(e)=>setInitialPrice(e.nativeEvent.text)}
            // onChange={(e) => setSearchItem(e.nativeEvent.text)}
	        	style={{width:width-40,marginLeft:20,marginBottom:20}}  
            placeholder={'Add your initial price'}
            // placeholder={currencyFormat(price.priceRange)}
            value={initialPrice}
					/>
        </React.Fragment>
    )
  } 
  const checkCurrentUser = () =>{

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
  function getUserGroup (){
    try {
      return [teams[selectedGroup].groupID]
    } catch (error) {
  return []
}
  }
  const axiosV3 = (token,id)=>  Axios.create({
    baseURL:"http://192.168.1.148:9091",
    timeOut:3000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "userID":id
    }
});
  async function placeOrderService(data) {
    try {  
      const user = getCurrentUser()
      if (getOriginAccount() === "email" ) {
        user.application_info = driverDetails.user_details
      }
      const parameter = {
      isBackload:isBackload,
      loadType:loadType, //data.
      trips:userTrips, //data.
      selectedVehicle:getSelectedVehicle(),
      userReference:user.id,
      offeredPrice:initialPrice,
      date:new Date(),
      userEmail:getUsersEmail(),//getOriginAccount() === "email" ? driverDetails.email :  user.application_info.email ,
      user:getCurrentUser(),
      shippersName:shipperName,
      shippersMobile:shipperMobile,
      ownerID:getCurrentUser().id
      ,teamID:getUserGroup(),
      paymentOptions: paymentOptions[selectedIndex]
        } 
       
     console.log('parameter,',getCurrentUser())
     console.log('PAYLOAD',parameter)
    const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post('/Loogy/placeOrder', parameter)
    console.log('response place',response)
    return response
    }catch (error) {
      
      setStatus(false)
      
      
      const err = error as AxiosError
      console.log('errerrerrerr',error)
      Alert.alert(`Network error`, `Please try again later.`, [
        {text: 'Okay', onPress: () => console.log('OK Pressed')}
        ], {
        cancelable: false,
      })
      return null 
    }
  }
  const getUsersEmail = ()=> {
    if (getCurrentUser().email === undefined) {
      return getCurrentUser().application_info.email
    }else {
      return getCurrentUser().email
    }
  }
  const placeOrder = (e)=>{
    console.log('getCurrentUser()',getCurrentUser())
    setStatus(true)
    placeOrderService(e).then( status => {
      console.log('copy response',status)
   
      notifyRegion(status.data.results)
    
      setTimeout(()=>{
        var param = {
          title:`L-[${status.data.results.referenceOrder}] Load has been Created!`,
          body: `A copy of your itinerary has been sent to ${getUsersEmail()}`,
        }
        let notif =   schedulePushNotification(param).then(()=>{
          setStatus(false)
          if  (status != null ){
            // navigation.navigate('Success',{orderDetails:status.data.results})
            navigation.navigate('Home',{screen:'Success',params: { orderDetails: status.data.results}})
            // navigation.navigate('Success',{orderDetails:status.data.results})
          }  
        }) 
      }, 1000);
    
    })
  }


  const mapTrips = (e)=>{
   let list =  e.reduce((prevValue,currentValue) => prevValue + currentValue.departDetails.coordinates,[])
  }
    return (
      <React.Fragment>
          <BookingContext.Consumer> 
    {items =>
    <ScrollView  
     ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      contentContainerStyle={{marginBottom:120}}
      contentInset={{bottom:120}}
    style={{ backgroundColor: 'white',height:height+120,paddingBottom:120 }}> 
      <View style={{marginTop:120}}/> 
           <View style={{flexDirection:'row',marginTop:10}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Booking</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Summary</Text>
				</View>
           <View style={{marginTop:32}}/> 
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Shippers Details</Text> 
           <Input placeholder='Set your name'
           value={shipperName}
           onChange={(e)=> setShipperName(e.nativeEvent.text)}
           style={{flex:1,marginTop:20,marginLeft:20,marginRight:20}}
           textStyle={{color:'black'}}
           />
           <Input placeholder='Mobile'
           keyboardType='numeric'
           value={shipperMobile}
           onChange={(e)=> setShipperMobile(e.nativeEvent.text)}
           style={{flex:1,marginTop:2,marginLeft:20,marginRight:20}}
           textStyle={{color:'black'}}
           />
           <View style={{marginBottom:32}}/> 
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Payment Option</Text>
           <View style={{marginBottom:15}}/> 
           {displayRadioList()}
           <View style={{marginBottom:32}}/> 
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Journey Details</Text>  
           {displayItems(items.userTrips)}
           {mapTrips(items.userTrips)}
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Selected Vehicle</Text>
           {displayVehicleType(items.getSelectedVehicle())}
           {/* {displayFooter(items.getSelectedVehicle())} */}
           
           <ActivityIndicator  style={{display:status ? "flex":"none"}} size="small" color="#0000ff" />
      {/* <View style={{opacity:initialPrice === 0 ? 0.7:status ? 0.7 : 1}}>
       <Button  status="basic" 
       disabled={initialPrice === 0 ? true: status} onPress={()=> placeOrder(items)}  
       style={{ borderRadius: 40, width: width - 40, 
       marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'selectedVehicle' === null ?'#dcdde1' :  'black', 
       borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{status ?"Processing..." : "Place Order"}</Text>
    </Button>
    </View> */}
    <View style={{marginBottom:100}}/> 
    </ScrollView>
}
</BookingContext.Consumer>
<BottomSheet
 ref={bottomSheetRef}
 index={1}
 style={{shadowColor: "#000",
 shadowOffset: {
	 width: 0,
	 height: 2,
   
 },
 shadowOpacity: 1,
 shadowRadius: 3.84,
 elevation: 5, }}
 snapPoints={snapPoints}
>{displayFooter(null)}
{true?  displayTeamItems() : fullLoader()}
<View style={{opacity:initialPrice === 0 ? 0.7:status ? 0.7 : 1}}>
       <Button  status="primary" 
       disabled={checkButtonValidaity() ? true: status} onPress={()=> placeOrder(items)}  
       style={{ borderRadius: 40, width: width - 40, 
       marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'selectedVehicle' === null ?'#dcdde1' :  'black', 
       borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{status ?"Processing..." : "Place Order"}</Text>
    </Button>
    </View>
</BottomSheet>
        <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity: status? 0.2:1,backgroundColor:'white',borderRadius:30}} >
          <TouchableOpacity disabled={status} onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
        <StatusBar style={'dark'} />
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
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
      marginRight: 150,
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
  