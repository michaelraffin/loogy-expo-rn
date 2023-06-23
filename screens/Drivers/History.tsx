import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Alert,Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input,Toggle} from '@ui-kitten/components'; 
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
import {CheckMark,SmallArrow} from '../../components/Svgs'
import FloatingBar from '../../components/FloatingBar'
import {schedulePushNotification} from '../Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg,{Circle,Path,Line,Polyline,Rect} from "react-native-svg"
import Store from  '../../components/Context/MapContext'
import {MapContext} from '../../components/Context/MapContext'
import UserLocationUI from '../../components/Utils/UserLocation'
import DashedLine from 'react-native-dashed-line'; 
import {BookingContext}from  '../../components/Context/UserBookingContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import {LoginRequired} from '../../components/Errors/LoginRequired'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CardJourney from '../../components/Journey/Card'
import { useIsFocused } from '@react-navigation/native';
import HeaderProfile  from '../../components/Profile/NavigationProfile'
import { WebView } from 'react-native-webview';

var scheduled = "On-Scheduled"
var cancelled = "Cancelled"
var inTransit = "In-Transit"
var completed = "Completed"
export default  function Dashboard({ route, navigation }){
  const isFocused = useIsFocused();
   const [checked, setChecked] = React.useState(false);
   const [category, setCategory] = useState('On-Scheduled');
   const [results, setResult] = useState([]);
   const [value, setSearchItem] = useState('');
   const [statusV2, setStatusV2] = useState(false);
   const [status, setStatus] = useState(false);
   const {setUserVehicle,getCurrentUser,getCurrentUserLocation,driverDetails} = useContext(BookingContext);

  

   useEffect(() => { 
    fetchProduct(scheduled)
  }, [])

  useEffect(() => { 
  }, [isFocused])



const modifyThisLoad =(e,modifyStatus)=>{
  setStatus(true)
  modifyLoad(e,modifyStatus).then(item =>{
    sendSMS(e,modifyStatus).then(stauts =>{
      fetchProduct(category) 
    })

  })
  // console.log(response.data.results)
  // setResult(response.data.results)
}
async function sendSMS(e,modifyStatus) { 
  try {    
    const data =   {id:e.item.referenceOrder,queryType:'custom' ,storeOwner:'storeOwner',isAPI:true, status:modifyStatus,taker:getCurrentUser().data, takerLocation:getCurrentUserLocation()} 
    var ownesMobileNumber = '09363673900'//e.item.user.user_details.contactNumber
    var bodyMessage = modifyStatus === 'Completed' ? 'Hi! load has been completed' : 'Hi! your load has been'
    var dynamicMessage = `Hi! Your load tracking:${e.item.referenceOrder} has been ${modifyStatus}`
    var message =   {"mobile":ownesMobileNumber,"message":dynamicMessage}
     const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post('/sendMessage', data)
     
     return  response
  }catch (error) { 
    console.log('ERRORSMS', error)
  }
}
async function modifyLoad(e,modifyStatus) { 
    try {    
      const data =   {id:e.item.referenceOrder,queryType:'custom' ,storeOwner:'storeOwner',isAPI:true, status:modifyStatus,taker:getCurrentUser().data, takerLocation:getCurrentUserLocation()} 
       const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post('/Loogy/modifyLoad', data)
       
       return  response
    }catch (error) { 
      if (error.response.data.stack.includes('InvalidTokenError')) {
        LoginRequired()
      }else {
        alert('Pleas try again...')
      }
    }
}

   async function fetchProduct(e) { 
    setStatus(true)
    try {  
      var type =  e === '' ? 'On-Scheduled':  e  
      var query = {
        status:type,
        // takerID:getCurrentUser().id,
        userReference:getCurrentUser().id
      }
      const data =   {id:type,queryType:'custom' ,storeOwner:'storeOwner',isAPI:true,queryData:query}
      // queryData:{status:orderStatus,userReference: e}

      // if (type === 'user-id') {
			// 	type = 'custom' 
			// } 


      
       const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().application_info.email).post('/store/LoogyPooling', data)
       setStatus(false)
      setResult(response.data.results)
       return  response
    }catch (error) { 
      const err = error as AxiosError 
      setStatus(false)
      if (error.response.data.stack.includes('InvalidTokenError')) {
        LoginRequired()
      }else {
        alert('Pleas try again...')
      }
    }
  }
  function fetchNewCategory(e){
    setStatus(true)
    setResult([])
    setCategory(e)
    fetchProduct(e)
  }

   async function onCheckedChange  (isChecked) {
      var data = {
         title:'You made it! Order Accepted!',
         body: `You will ${isChecked ?  'received ' : 'Not'} gonna received a orders`,
       }
       let notif =   schedulePushNotification(data).then(()=>{
       
       }) 
       setChecked(isChecked);
   }

   const _handlePress = () => {
    // Linking.openURL('https://waze.com/ul?ll=10.315699%2C123.885437&navigate=yes&zoom=17');
    
  };
  const didLoad =(e)=>{ 
    setStatus(true)
    takeLoadService(e.item).then ((data) => {
      // var param = {
      //   title:`L-[${haulDetails.item.referenceOrder}] Load has been Accepted!`,
      //   body: `You will received any updates before the loading schedule`,
      // }
      // let notif =   schedulePushNotification(param).then(()=>{
      // }) 
      setStatus(false)
      // navigation.goBack()
    })
   }
  async function takeLoadService(e) {
    try {  
     
    const parameter = {
      _id:e.referenceOrder,
      status:'Completed',
      taker:"XXXXXXXX"
    }
    const response = await axios.post('/Loogy/load', parameter).catch((error)=>console.log(error))
     return response
    }catch (error) {
        alert('Please Try again...')
    }
  }

  const validateUser =(data)=>{
    var userNotFound = true
    if (userNotFound) {
      LoginRequired()
    }else {
     alert('proceed')
    }
  }


  const validateInTransitButton =(data)=>{
    try {
      if (data.item.takerID === getCurrentUser().id) {
        return (
          <TouchableOpacity  disabled={status} onPress={()=> modifyThisLoad(data,completed) }>
          <Button onPress={()=> modifyThisLoad(data,completed)} disabled={status} style={{opacity:status? 0.1 : 1,backgroundColor:'black',borderColor:'black',borderRadius:30,width:width-40,marginRight:20}}>
          <Text style={{color:'white',fontWeight:'bold'}}>
          Complete this load
          </Text> 
        </Button>
        </TouchableOpacity>
        )
      }else {
        return (
          <TouchableOpacity disabled={status} >
          <View style={{width:width,alignContent:'flex-start',alignItems:'flex-start',justifyContent:'center',marginLeft:20}}>
          <View style={{alignContent:'center',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
           <Image  source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYH_VDaGfxQ_cPhkgDPyoxXJgnnKHzEw7kdg&usqp=CAU'}}  style={{width:25,height:25  ,borderRadius:15,borderWidth:1,borderColor:'black'}}/>
           <Text category='c1' style={{marginLeft:8,fontWeight:'bold'}}>{data.item.transactionLogs[0].taker.name}</Text>
           
           </View>
           </View>
           </TouchableOpacity>
        )
      }
    }catch(error){
      return (<View/>)
      // return (  <TouchableOpacity disabled={status} >
      //   <View style={{width:width,alignContent:'flex-start',alignItems:'flex-start',justifyContent:'center',marginLeft:20}}>
      //   <View style={{alignContent:'center',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
      //    <Image  source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYH_VDaGfxQ_cPhkgDPyoxXJgnnKHzEw7kdg&usqp=CAU'}}  style={{width:25,height:25  ,borderRadius:15,borderWidth:1,borderColor:'black'}}/>
      //    <Text category='c1' style={{marginLeft:8,fontWeight:'bold'}}>Error Found</Text>
      //    </View>
      //    </View>
      //    </TouchableOpacity>)
    }
   
  }
  const navigateToLoadDetails =(data)=>{
    navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: data,type:'readOnly' ,viewType:"dashboard"} } )
    // navigation.navigate('LoadDetails', { screen: 'LoadDetails',referneceOrder: { item:data},viewType:"dashboard" })
  }
  const inProgressContent =(data,index)=>{
 
    return   <TouchableOpacity disabled={status} onPress={()=>modifyThisLoad(data,completed)}   activeOpacity={1}>
 <TouchableOpacity ><View style={{ backgroundColor:  'white' ,  marginLeft:20,width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === scheduled ? '#6ab04c' : '#6ab04c' }} category='c2' >In-progress</Text></View></TouchableOpacity>
  <CardJourney 
   journey={data.item.trips[0]}
    details={data.item} 
    didView={()=>
      navigateToLoadDetails(data)
      // navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: data,type:'readOnly' } ,viewType:"dashboard"} )
      // navigation.navigate('LoadDetails', { screen: 'LoadDetails',referneceOrder: { item:data},viewType:"dashboard" })
    }
    badgeStyle={{ width: 30, height: 30, borderRadius: 15 ,backgroundColor:'#f5f6fa',justifyContent:'center',alignContent:'center',alignItems:'center'}}/>
      <View style={{marginLeft:20,marginRight:20,marginBottom:20}}>
      {/* <Text category="h5" style={{fontWeight:'bold'}}>Your about to pickup</Text>
      <Text category="p1" style={{color:'#747d8c'}}>I have a function that I need to create an object. That object uses variables for both its keys and values, and then return that single object. Example:</Text> */}
      {/* <View style={{height:100,width:200,backgroundColor:'black',margin:20}}></View> */}
      <View style={{flexDirection: 'row',marginTop:5}}> 
          

          {/* didLoad(data) DOUBLE CHECK IT HERE */}
         {/* <View style={{width:width - 40 ,height:45,borderRadius:50,opacity:status ? 0.5: 1 ,backgroundColor:  'white',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
             
             <Text 
          category="6"
        > {status ? 'Loading...':'Complete this Load'}
        </Text>
         </View> */}

         {validateInTransitButton(data)}
   {/* (e.item.takerID === getCurrentUser().id){       */}
  {/* <Button onPress={()=> modifyThisLoad(data,completed)} disabled={status} style={{opacity:status? 0.1 : 1,backgroundColor:'black',borderColor:'black',borderRadius:30,width:width-40,marginRight:20}}>
    <Text style={{color:'white',fontWeight:'bold'}}>
    Complete this load
    </Text> 
  </Button> */}
         {/* <View style={{flexDirection: 'row', alignContent: 'center',justifyContent:'flex-start',alignItems:'center' ,marginLeft:30,marginBottom:30,backgroundColor:'black',borderRadius:20}}>
     <Text style={{marginRight:5,color:'white',margin:5}} category={"h6"}> {status ? 'Loading...':'Complete this Loads'}</Text>
     <Image  source={{uri:'https://cdn-icons-png.flaticon.com/512/2438/2438002.png'}}  style={{width:25,height:25  }}/>
     </View> */}
          
      </View>
      </View>
      {/* <Divider style={{marginBottom:20,marginTop:20}}/> */}
    </TouchableOpacity>
  }
const journeyContennt =(data,index)=>{
  try {
    return (
      // <View style={{backgroundColor:'red',height:100,width:200}}/> 
      <TouchableOpacity   activeOpacity={1}>
   <React.Fragment> 
     <View style={{marginTop:index === 0 ? 0: 20}}>
   <CardJourney 
   journey={data.item.trips[0]}
    details={data.item} 
    didView={()=>
      navigateToLoadDetails(data)
      // navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: data,type:'readOnly' } } )
    }
    badgeStyle={{ width: 30, height: 30, borderRadius: 15 ,backgroundColor:'#f5f6fa',justifyContent:'center',alignContent:'center',alignItems:'center'}}/>
  {category ==='On-Scheduled' ? startContent(data) : null}
  </View>
  </React.Fragment>
  </TouchableOpacity>
  
  )
  }catch(error)
  {console.log('ERRORR ',error)
    return <View style={{backgroundColor:'black',height:100,width:200}}/>
  }

  {/* {category ==='Completed' ?<TouchableOpacity  onPress={()=>didLoad(data)}><Text>Write a review</Text></TouchableOpacity> : null} */}
}
const rightContents =(e)=>{
  return (
  <TouchableOpacity >
     {/* onPress={()=>modifyThisLoad(e,completed)} */}
     <View style={{flexDirection: 'row', alignContent: 'center',justifyContent:'flex-start',alignItems:'center' ,marginLeft:30,marginBottom:30}}>
     <Text style={{marginRight:5}} category={"c1"}>Write a review</Text>
     <Image  source={{uri:'https://cdn-icons-png.flaticon.com/512/2438/2438002.png'}}  style={{width:25,height:25  }}/>
     </View>
     </TouchableOpacity>
     )
}
const prompUserStartLoading = (e) =>

Alert.alert(`Are you sure?`, `You are about to load this with booking reference ${e.item.referenceOrder}`, [
  {
    text: 'Cancel',
    onPress: () => console.log('Cancel Pressed'),
    style: 'cancel',
  },
  { text: 'Okay, Load this item', onPress: () => modifyThisLoad(e,inTransit) },
],{
  cancelable: true,
})


const startContent =(e)=>{
  try {

  //Validate the ownerShip of this load
  if (e.item.takerID === getCurrentUser().id){
    return ( 
      <TouchableOpacity disabled={status} onPress={()=> prompUserStartLoading(e)} >
         {/* <View style={{width:width/3,flexDirection: 'row',backgroundColor:'white',borderRadius:30, alignContent: 'center',justifyContent:'flex-end',alignItems:'center' ,marginRight:30,marginBottom:30,marginLeft:50}}>
         <Text style={{marginRight:5,fontWeight:'bold',color:'#6ab04c',fontSize:17,margin:10 , opacity:status ? 0.2: 1}} >Start Loading</Text>
         <Image  source={{uri:'https://cdn-icons-png.flaticon.com/512/2312/2312798.png'}}  style={{width:25,height:25 ,marginRight:20 }}/>
         </View> */}
         <Button onPress={()=> prompUserStartLoading(e)} disabled={status} style={{opacity:status? 0.1 : 1,backgroundColor:'black',borderColor:'black',borderRadius:30,width:width-40,marginRight:20,marginLeft:20}}>
        <Text style={{color:'white',fontWeight:'bold'}}>
        Start Loading
        </Text> 
      </Button>
         </TouchableOpacity>
         )
  }else {
    return (
      // didView={()=>navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: data,type:'readOnly' } } )}
      <TouchableOpacity disabled={status} onPress={()=>navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: e,type:'readOnly' } } ) } >
      <View style={{width:width,alignContent:'flex-start',alignItems:'flex-start',justifyContent:'center',marginLeft:30}}>
      <View style={{alignContent:'center',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
       <Image  source={{uri:'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8='}}  style={{width:25,height:25  ,borderRadius:15,borderWidth:1,borderColor:'black'}}/>
       <Text category='c1' style={{marginLeft:8,fontWeight:'bold'}}>{e.item.transactionLogs[0].taker.name}</Text>
       {/* <Text category='c1' style={{marginLeft:8}}>(Your loader)</Text> */}
       <View style={{ backgroundColor:  '#f1f2f6',  width: 90, height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center',marginLeft:30,alignItems:'center' }}><Text style={{ marginLeft: 10, marginRight: 20,  color:'#0652DD' ,fontWeight:'bold',width:'auto'}} category='c2' >{'Carrier'}</Text></View>
       </View>
       </View>
       </TouchableOpacity>
    )
    // return ( 
    //   <TouchableOpacity disabled={status} onPress={()=> prompUserStartLoading(e)} >
    //     <View style={{alignContent:'center',alignItems:'center',justifyContent:'center'}}>
    //      <Text category='c1'>***You can only view this item***</Text>
    //      </View>
    //      </TouchableOpacity>
    //      )
  }
  }catch(error) {
return ( 
      <TouchableOpacity disabled={status}  >
        <View style={{alignContent:'center',alignItems:'center',justifyContent:'center'}}>
         {/* <Text category='c1'>Tap to start your journey</Text> */}
         </View>
         </TouchableOpacity>
         )
  }

}
  const displayItems=(e)=>{
   const content = [<View/>]
   
   e.map((data, index) => {
     
     content.push(
       <React.Fragment>
       <View style={{backgroundColor:'white',borderColor:'white',borderWidth:0.5,borderRadius:10,margin:10,marginRight:30,marginLeft:30,elevation: 2}}>
        <View style={{backgroundColor:'black',height:10,width:10,position:'absolute',left:16,top:15, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
       <View style={{backgroundColor:'#C4E538',height:'40%',width:1,position:'absolute',left:20,top:25, opacity:1,    borderWidth: 1,borderRadius:1,zIndex:1,elevation: 1,}}/>
       <View style={{backgroundColor:'#dcdde1',height:10,width:10,position:'absolute',left:16,top:59, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
 
 
      <View style={{backgroundColor:'black',height:25,width:25,position:'absolute',right:-4,top:-12, borderRadius: 25,alignItems:'center'}}><Text style={{fontWeight:'bold',color:'white',marginTop:3}}>{(index + 1)}</Text></View>
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
     }}>{'Ayala Alabang, MNL'}</Text>
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
     }}>{'Cagaya de Oro - CGY'}</Text>
     </TouchableOpacity>
   </Layout>
   </View>
   {/* <View style={{height:2,width:30,backgroundColor:'gray',marginLeft:'10%',borderWidth:2,borderRadius:20}}/> */}
   </React.Fragment>
    
     )
   })
   return content
   }

   const location =()=>{
    return (
    <TouchableOpacity>
       <View style={{flexDirection: 'row', alignContent: 'center',justifyContent:'center',alignItems:'center',marginTop:10 }}>
       <Text style={{marginRight:5,color:'white'}} category="c1">Quezon City, Luzon, PH</Text>
       {/* <Image  source={{uri:'https://static.thenounproject.com/png/4404538-200.png'}}  style={{width:25,height:25  }}/> */}
       </View>
       </TouchableOpacity>
       )
 }
 const userType =()=> {
  try {
    if (getCurrentUser().user_details.applicantType === "Shipper") {
      return 0
    } else {
      return  1
    }
  } catch (error) {
    return 1
  }
  // 0 == Customer
  // 1 == Driver

}
const HeaderContent =()=>{
   return <View style={{width:width,height:'auto',backgroundColor:'white'}}>
       <View style={{flexDirection:'row',marginTop:60}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Your</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >{userType() === 0 ? 'Transactions': 'Task' }</Text>
				</View>
        <UserLocationUI errorMessage={"For tracking drivers location, allow Loogy to access your location"}/>
   </View>
}
const rightContent =()=>{
   return (
   <TouchableOpacity onPress={()=>fetchProduct(value) }>
      <View style={{flexDirection: 'row', alignContent: 'center',justifyContent:'center',alignItems:'center' }}>
      <Text style={{marginRight:5}}>Scan by QR</Text>
      <Image  source={{uri:'https://static.thenounproject.com/png/4404538-200.png'}}  style={{width:25,height:25  }}/>
      </View>
      </TouchableOpacity>
      )
}
// {status ? <ActivityIndicator  style={{display: "flex",marginTop:120}} size="small" color="gray" />  : null}
const renderList = ()=> { 
  return (<FlatList
  style={{backgroundColor:'white',paddingBottom:120,marginBottom:70,opacity:status?0.2:1}}
    ListHeaderComponent={headerDetails()}
    maxToRenderPerBatch={5}
    data={results}
    extraData={status}
    renderItem={(item) =>  status ?  <ActivityIndicator  style={{display: "flex",marginTop:120}} size="small" color="gray" />: category === 'In-Transit'  ? inProgressContent(item) :   journeyContennt(item)   } 
     ListEmptyComponent={()=>
      <Layout style={styles.layout} level="1">
      <View
        style={{
          height: 400,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 20,
          marginRight: 20,
          marginTop:0
        }}
      >
    <Image source={{ uri: 'https://cdn.dribbble.com/users/1113690/screenshots/6231933/empty_state_bino_4x.jpg?compress=1&resize=1600x1200'}} style={{ width:300,
        height:250,
        resizeMode: 'cover'}}/>
      <Text 
          category="6"
        > {value} {status ? "loading...": "No records found"}
        </Text>
        
      </View>
    </Layout>
    }
    ></FlatList>)
}
const headerDetails = ()=> { 
return (
  <View style={{backgroundColor:'white'}}>
{/* {status ? } */}
 {/* {status ? <ActivityIndicator  style={{display: "flex",marginTop:120}} size="small" color="gray" />  : null} */}
  {HeaderContent()}
  <View style={{marginTop:5}}/>
  <ScrollView horizontal={true} style={{height:90,paddingLeft:10,showsHorizontalScrollIndicator:false}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
    <View onPress={() => console.log('')} style={{ height: 50, width: width, justifyContent: 'center', flexDirection: 'row', alignSelf: 'auto', alignContent: 'center', marginTop: 20 }} >
    <TouchableOpacity disabled={false} onPress={() => fetchNewCategory(scheduled)}><View style={{ backgroundColor: category === scheduled ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === scheduled ? 'white' : 'black' }} category='c2' >Scheduled</Text></View></TouchableOpacity>
      <TouchableOpacity disabled={false} onPress={() => fetchNewCategory(cancelled)} ><View style={{ backgroundColor: category === cancelled ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === cancelled ? 'white' : 'black' }} category='c2' >Cancelled</Text></View></TouchableOpacity>
      <TouchableOpacity disabled={false} onPress={() => fetchNewCategory(inTransit)}><View style={{ backgroundColor: category === inTransit ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === inTransit ? 'white' : 'black' }} category='c2' >In Transit</Text></View></TouchableOpacity>
      <TouchableOpacity disabled={false} onPress={() => fetchNewCategory(completed)}><View style={{ backgroundColor: category === completed ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === completed ? 'white' : 'black' }} category='c2' >Completed</Text></View></TouchableOpacity>
      {/* <TouchableOpacity disabled={status} onPress={() => fetchNewCategory(scheduled)}><View style={{ backgroundColor: category === scheduled ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === scheduled ? 'white' : 'black' }} category='c2' >Scheduled</Text></View></TouchableOpacity>
      <TouchableOpacity disabled={status} onPress={() => fetchNewCategory(cancelled)} ><View style={{ backgroundColor: category === cancelled ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === cancelled ? 'white' : 'black' }} category='c2' >Cancelled</Text></View></TouchableOpacity>
      <TouchableOpacity disabled={status} onPress={() => fetchNewCategory(inTransit)}><View style={{ backgroundColor: category === inTransit ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === inTransit ? 'white' : 'black' }} category='c2' >In Transit</Text></View></TouchableOpacity>
      <TouchableOpacity disabled={status} onPress={() => fetchNewCategory(completed)}><View style={{ backgroundColor: category === completed ? 'black' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === completed ? 'white' : 'black' }} category='c2' >Completed</Text></View></TouchableOpacity> */}
     </View>
  </ScrollView>
  <View/>
</View>
)
}
 const content =()=>{
    return  <> 
    {renderList()}
    </>
 }   
return  <React.Fragment>
  <StatusBar style={ "dark" }/>
  <SafeAreaProvider>
  {/* <WebView
      style={{width:width,height:height,paddingTop:20}}
      source={{ uri: 'https://theflowerluxecebu.com/' }}
    /> */}
  <View style={{backgroundColor:'white',height:height}}>{content()}</View>
  <FloatingBar index={2} navigation={navigation} showAccount={true} userProfile={getCurrentUser()}/> 
</SafeAreaProvider>
  </React.Fragment>
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
  