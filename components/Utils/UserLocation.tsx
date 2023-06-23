import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Alert,Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input,Toggle} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import  moment from 'moment'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location";
import {Small,BigLoader,ButtonLoader,InstagramContent,TinyLoader} from '../../components/Loader';
import Toast from 'react-native-toast-message'; 
import {BookingContext} from  '../../components/Context/UserBookingContext'
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default  function Dashboard({ route, navigation,errorMessage,hide }){
    const {setLocation,getCurrentUserLocation} = React.useContext(BookingContext);
    const [value, setSearchItem] = useState(''); 
    const [status, setStatus] = useState(true); 
    const [denied, setDenied] = useState(null); 
    const [address, setAddress] = useState({
     "city":null,
     "country": "",
     "district": "...",
     "isoCountryCode": "",
     "name": "",
     "postalCode": "",
     "region": "...",
     "street": "",
     "streetNumber": "",
     "subregion": null,
     "timezone": null
   });
useEffect(() => { 
  
  try {
    console.log('API')
    
  // console.log('User Location Comonent details',getCurrentUserLocation())
    if (getCurrentUserLocation() === null || getCurrentUserLocation() === null) { 
      console.log('API')
      getUserLocation().then(item =>{
        if (item != null) {
          console.log('michael reverrse location ',item)
          setDenied(false)
          getReverse(item).then(userLocation =>{

          var convertedData = {} 
          convertedData = userLocation[0]
          convertedData.coordinates =  item
            setAddress(convertedData)
            setLocation(convertedData)
          })
        }else { 
          setStatus(false)
          setDenied(true)
        }
      })
    } else {
      console.log('CACHE')
      // console.log('User Location Comonent details',getCurrentUserLocation())
      setDenied(false)
          getReverse(getCurrentUserLocation().coordinates).then(userLocation =>{

            console.log('async resylt',userLocation[0])
          var convertedData = {} 
          convertedData = userLocation[0]
          convertedData.coordinates =  getCurrentUserLocation().coordinates
            setAddress(convertedData)
            setLocation(convertedData)
            setStatus(false)
          })
    }
  } catch (error) {
    console.log('error state useEffect',error)
Alert.alert(`Opps...Sorry`, `Please try again later`, [ 
	{ text: 'Okay', onPress: () => console.log('None') },
  ],{
	cancelable: true,
  })
  }
  }, [])

  async function getReverse(item){
     
    let keys = {
      latitude : item.latitude,
      longitude :  item.longitude
  }
    let address =  await Location.reverseGeocodeAsync(keys);
    return address
  }
  async function getUserLocation() {
    try {
      const {status} = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND)
      if (status != 'granted'){
        return null
      }
      const {coords} = await Location.getCurrentPositionAsync()
      setDenied(false)
      setStatus(false)
      return coords 
    }catch {
      var convertedData = {latitude:14.5976408,longitude:121.0415411}
      setLocation(convertedData)
      setStatus(false)
      setDenied(true)
      getHeading()
      watchHeadingUser()
      
      return null
    }
 
  }

  async function getHeading(){
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('status requestForegroundPermissionsAsync',status)
      if (status == 'granted') {
       
      
      }else {
        console.log('get Locatin heading')
      }
    } catch (error) {
      console.log('error',error)
    }
        }
    
    
       async function watchHeadingUser(){
    try {
      let location = await Location.getCurrentPositionAsync({});
      console.log("Loc ",location);
      let watchHeading = await Location.watchHeadingAsync((watch)=>{
        console.log('watch heading' ,watch)
      })
    } catch (error) {
      console.log('error',error)
    }
        }
  const userLocationUI = ()=>{
    // setAddress(getCurrentUserLocation())
    // console.log('User Location Comonent details',getCurrentUserLocation())
    if (status){
      return  <><Text>Loading..</Text></>
    }else { 
      if (denied ) {
        return   (<>
          <TouchableOpacity>
          <Text style={{marginLeft:20,fontSize:13}} category="p1">{errorMessage}</Text>
          </TouchableOpacity>
                     </>)
      }else {
        if (address.city === undefined || address === null  ) {
          return  <></>
        }else {
          return (<>
              <TouchableOpacity>
                     <View style={{flexDirection:'row',marginTop:5,marginLeft:20,alignContent:'center',alignItems:'center'}}>
                     <Image  source={{uri:'https://www.seekpng.com/png/full/802-8020358_hexagym-transparent-pin-drop-icon.png'}}  style={{width:10,height:15,marginRight:5 }}/>
                     <Text 
                     ellipsizeMode="tail"
                     numberOfLines={1} 
                     category='p1' style={{fontWeight:'bold',width:width / 2}}>{address.region}, {address.district}, {address.city}</Text>
                     </View>
                     </TouchableOpacity>
                     </>)
        }
      }
    }
  }
  return hide != undefined ? <View/>: userLocationUI()
}