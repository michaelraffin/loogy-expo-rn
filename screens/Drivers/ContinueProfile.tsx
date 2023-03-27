import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input,Toggle} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
import ThemeColor from '../../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../../components/Utils/StoreDetails'
import  moment from 'moment'
import { useIsFocused } from '@react-navigation/native';
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
import DashedLine from 'react-native-dashed-line'; 
import {BookingContext}from  '../../components/Context/UserBookingContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import {axios} from '../../components/Utils/ServiceCall'
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import {LoginRequired} from '../../components/Errors/LoginRequired'
import ConfettiCannon from 'react-native-confetti-cannon';


export default  function ProfileUser({ route, navigation }){
  const [ status, setStatus ] = useState(false);
  const  [userEmail,setUserEmail] = useState('')
  const  [profile,setProfile] = useState(null)
  const  [warehouse,setWarehouse] = useState(null)
  const  [membersName,setName] = useState(null)
  const  [mobile,setMobileNumber] = useState(null)
  const  [address,setLocation] = useState(null)
  const  [logisticName,setLogisticName] = useState(null)
  const  [isReady,setDataReady] = useState(null)
  const  [viewingType,setViewingType] = useState(route.params.viewingType)
  const isFocused = useIsFocused();
  const {setUserAccountContext,getCurrentUser} = useContext(BookingContext);
 
  async function signOutAccount(){ 
    try {
      const response = await axios.post('/user/Loogy/signout',{"email":getCurrentUser().data.email });
        return response
    }  catch (error){
        console.log(error)
      alert('ERRPR')
    }
  }


  const updateProfile =()=>{
    setStatus(true)
    updateProfileService().then(profile=> {
      setStatus(false)
      console.log(profile.data)
      setProfile(profile.data.data[0])
      setWarehouse(profile.data.data[0].warehouse)
      setMobileNumber(profile?.data.data[0].user_details.contactNumber)
      setName(profile?.data.data[0].user_details.name)
      setLogisticName(profile?.data.data[0].user_details.logisticName)
      viewingType === 'continueProfile' ? navigation.goBack() : null
      // let stringDate =  JSON.stringify(profile.data)
      
      // saveEntry(stringDate,'@userProfile').then(profile =>{
      //   console.log('user Profile',profile)
      //   setTimeout(() => {
      //     setUserAccountContext(data?.data)
      //     navigation.goBack()
      //     setStatus(false)
      //     }, 5000);
      // })

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
  useEffect(() => { 

    setStatus(true)
    const user = getCurrentUser().data 
    setUserEmail(user.email)
    console.log('userProfile')
    if(isFocused) {
      getEntry('@userProfile').then(profile =>{
        // var jsonData = JSON.parse(profile)
        console.log('userProfile',profile)
      })

      getProfileAccount().then(profile=> {
        console.log('profilessss',profile.data.data[0].application_info)
        
        setStatus(false)
        
        if (profile?.data.data[0].user_details !== undefined) {
          var details = profile.data.data[0].user_details
          setDataReady(true)
          setMobileNumber(details.contactNumber)
          setName(details.name)
          setProfile(profile.data.data[0])
          setWarehouse(profile.data.data[0].warehouse)
          setLogisticName(details.logisticName)
          // setName(details.logisticName)
        }
          
        
      })

    }else{
      getEntry('@userProfile').then(profile =>{
        // var jsonData = JSON.parse(profile)
        console.log('userProfile',profile)
      })
    }
  }, [])
// }, [isFocused])
  const sendMagicLink = ()=>{
    setStatus(true)
    signOutAccount().then( (data) =>{
      if(data.data.message != null) {
        alert(data.data.message.message) 
        setStatus(false)
      }else {
        setUserAccountContext({user:null})
        ToastAndroid.show('Signing off...', ToastAndroid.LONG);
        setTimeout(() => {
          navigation.navigate('Load', { screen: 'Service' })
         setStatus(false)
          }, 1000);
      }
    })

}

    const ProfileContent =()=>{
        try {
          return <View style={{width:width-40,height:150,backgroundColor:true ? 'white' :'white'}}>
          <Text style={{marginLeft:20,marginTop:20,color:'black',fontWeight:'bold'}} category='h1'>{logisticName}</Text>
          <Text style={{marginLeft:20,marginTop:5,color:'black',fontSize:16,fontWeight:'bold'}} category='c2'>{membersName}</Text> 
          <View style={{position:'absolute',top:70,right:30,height:150,width:150,backgroundColor:'black',borderRadius:75}}>
            <TouchableOpacity>
          <Image  source={{uri:profile === null ? '' : profile.application_info.userDetails.avatar + '&size=300'}}  style={{borderRadius:75,width:150,height:150  }}/>
          </TouchableOpacity>
          </View>
          <View style={{position:'absolute',top:190,right:65}}><TouchableOpacity><View style={{ backgroundColor:  'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center',marginLeft:20 }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color:'#6ab04c' ,fontWeight:'bold'}} category='c2' >Verified</Text></View></TouchableOpacity></View>
          {/* <View style={{ backgroundColor:  '#192a56', margin: 10, width: 100, height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center',marginLeft:20 ,alignItems:'center'}}><Text style={{ marginLeft: 10, marginRight: 10,width:'auto', marginTop: 0, color:'white' ,fontWeight:'bold'}} category='c2' >{profile !=-  null ? profile.member_details.level : null } Account</Text></View> */}
      </View>
        }catch {
          return <View style={{width:width,height:150,backgroundColor:true ? 'white' :'white'}}>
          <Text style={{marginLeft:20,marginTop:120,color:'black',fontWeight:'bold'}} category='h1'>...</Text>
      </View>
        }
      }


    const mainProflile =()=>{
      return (
        <React.Fragment>
        <ScrollView style={{height:height,backgroundColor:'#f5f6fa',opacity: status ? 0.1 : 1}}>
        
        <View style={{backgroundColor:'white',borderRadius:20,margin:20}}>
        {ProfileContent()}
        <Input
						value={membersName}
						// onSubmitEditing={() => fetchProduct(value)}
						// accessoryRight={rightContent}
						label="Name"
						style={{ marginTop: 90,marginLeft:20 ,marginRight:20}}
						placeholder="L-XAX10"
						onChange={(e) => setName(e.nativeEvent.text)}
					/>
              <Input
            value={userEmail}
      disabled={true}
						// onSubmitEditing={() => fetchProduct(value)}
						// accessoryRight={rightContent}
						label="Email"
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
              placeholder="jaun@delacruz.com"
						onChange={(e) => setUserEmail(e.nativeEvent.text)}
					/>
                     <Input
						value={mobile}
						// onSubmitEditing={() => fetchProduct(value)}
						// accessoryRight={rightContent}
						label="Contact Number"
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
						placeholder="0913214231"
						onChange={(e) => setMobileNumber(e.nativeEvent.text)}
					/>
                      <Input
						value={warehouse}
						// onSubmitEditing={() => fetchProduct(value)}
						// accessoryRight={rightContent}
						label="Warehouse"
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
						placeholder="0913214231"
						onChange={(e) => setWarehouse(e.nativeEvent.text)}
					/><Input
            value={logisticName}  
						label="Logistic Name"
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
						placeholder="Add your Logistic name"
						onChange={(e) => setLogisticName(e.nativeEvent.text)}
					/>
      <View style={{opacity:false ? 0.7 : 1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
       <Button  onPress={()=>updateProfile()} status="basic" style={{ borderRadius: 40, width: width - 60,  marginTop: 20,marginBottom:8, backgroundColor:status === false ?'black' :  '#dcdde1', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Profile </Text>
    </Button>
       <Button   onPress={()=>sendMagicLink()}   style={{ borderRadius: 40, width: width - 40,  marginTop: 20,marginBottom:32, backgroundColor:  'white', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
      <Text style={{ color: 'black', fontWeight: 'bold' }}>{false ?"Processing..." : "Sign Out"}</Text>
    </Button>
    </View>
    </View>
              <StatusBar style={'dark'} />
              </ScrollView> 
         {status ?  <View style={{marginTop:120, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View> : null}    
              {/* {!status ? <FloatingBar index={3} navigation={navigation} showAccount={true}/> : null } */}
    </React.Fragment>
      )
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
          // disabled={true}  
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
      return (
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
						label="Name"
						style={{ marginTop: 20,marginLeft:20 ,marginRight:20}}
						placeholder="L-XAX10"
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
						style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
						placeholder="0913214231"
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
      <View style={{opacity:false ? 0.7 : 1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
       <Button  onPress={()=>updateProfile()} status="basic" style={{ borderRadius: 40, width: width - 60,  marginTop: 20,marginBottom:8, backgroundColor:status === false ?'black' :  '#dcdde1', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Set Profile </Text>
    </Button>
       {/* <Button   onPress={()=>sendMagicLink()}   style={{ borderRadius: 40, width: width - 40,  marginTop: 20,marginBottom:32, backgroundColor:  'white', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
      <Text style={{ color: 'black', fontWeight: 'bold' }}>{false ?"Processing..." : "Sign Out"}</Text>
    </Button> */}
    </View>
    {isReady ? <ConfettiCannon fadeOut={true} count={200} origin={{x: -10, y: 0}} /> :null }
    </View>
    
              <StatusBar style={'dark'} />
              </ScrollView> 
         {status ?  <View style={{marginTop:120, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View> : null}    
              {/* {!status ? <FloatingBar index={3} navigation={navigation} showAccount={true}/> : null } */}
    </React.Fragment>
      )
    }
    
    return viewingType === 'continueProfile' ? continueProfile() :  mainProflile()
}