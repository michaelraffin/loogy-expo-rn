import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Alert,Switch,ToastAndroid,BackHandler, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input,CheckBox} from '@ui-kitten/components'; 
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
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import axiosMain from 'axios';
import { axios } from '../../components/Utils/ServiceCall';
import { useIsFocused } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';

const appVersion = 1
export default  function BookingSummary({ route, navigation }){


  const [mobile, setValue] = useState('');
  const [name, setName] = useState('');
  const [passwordPrimary, setPassword] = useState(null);
  const [passwordSecondary,setPasswordSecondary] = useState(null);
  const [lastName, setLastname] = useState();
  const [activeChecked,setActiveChecked] = useState(false);
  // const [mobile, setValue] = useState('');
  // const [mobile, setValue] = useState('');
  const [applicationType, setApplicationType] = useState('Driver');
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordShowSecond, setPasswordShowSecond] = useState(false);
  
  const [registrationType, setType] = useState(['Mobile','Applicant','Information',"Processing",'Success']);
  const [currentIndex, setIndex] = useState(0);
  const [status, setStatus] = useState(false);
  
  const mobileTheme = ()=>{
    return (
      <React.Fragment>
        <View style={{flex:1,alignSelf:'flex-start', flexDirection: "row",marginBottom:5}}>
        {/* <Image  source={{uri:'https://cdn.countryflags.com/thumbs/philippines/flag-round-250.png'}}  style={{width:20,height:20,marginRight:5  }}/> */}
        {/* <Text>Ph Mobile number</Text> */}
        <Text>E-mail Address</Text>
        </View>
      </React.Fragment>
    )
  }
  const assignedNumber = (e) =>{
    console.log(mobile.length )
   if ( 11 <  mobile.length ) {
    setValue(e.nativeEvent.text)
   } 
  }

  const isFocused = useIsFocused();
  useEffect(()=>{
    if(!isFocused) {
      setIndex(0)
   }
  },[isFocused])

function submitForm(){ 
  setStatus(true)
  setIndex(currentIndex + 1)
  registrationService().then((data)=>{

    console.log('response',data.data.status)
    var showOTP  = data.data.showOTP
    setStatus(false)
    console.log('PROCESSING.')
    if(data.data.status) {
      setValue('')
      setPassword(null)
      setPasswordSecondary(null)
      setApplicationType(null)
      setIndex(4)
      console.log('registrationType[currentIndex]',registrationType[currentIndex])
      ToastAndroid.show('Your account has been successfully created!', ToastAndroid.LONG);
      // ToastAndroid.show('Account has been successfully registered!', ToastAndroid.SHORT);
      // sendSMS()
    }else {
      setIndex(0)
      // setIndex(4) 
    }
  })
}


async function sendSMSservice () { 
  try {
    const response = await axios.post('/Loogy/SMSAuth',{ 
      "requestedBy":mobile});
      return response
  }  catch {
    alert('ERRPR')
    // setIndex(3)
  }
}
  async function registrationService () { 
    try {
      const response = await axios.post("/signup/Loogy", {
        "email": mobile,
        "mobile":`+${mobile}`,
        "password": passwordPrimary,
        "data": {
        "aplicantType":applicationType,
        "appVersion":appVersion,
        "userDetails":{
          "firstName":null,
          "lastName":null,
          "email":mobile,
          "avatar":`https://img.buymeacoffee.com/api/?background=ecf0f1&color=00000&name=${mobile}`
        },
      }
      });
      console.log('SUCCESS',response.data)
      setIndex(4)
      return response
    }catch(error) {
      const err = error as AxiosError
      console.log(err.response.data.message.message)
      console.log('ERROR')
      Alert.alert(`Registration Failed!`,`${err.response.data.message.message}.`, [
        {
          text: 'Cancel',
          onPress: () => setIndex(0),
          style: 'cancel',
        },
        { text: "Okay, I'll try again", onPress: () => setIndex(0) },
      ],{
        cancelable: false,
      })
      return  err.response
    }
  
    // try {
    //   const response = await axiosMain.post("https://florist-app.auth0.com/dbconnections/signup", {
    //     "client_id": "aRYtW1JGuVRz7bJXti6YHyp6IAy9wx1m",
    //     "email": `winx.r@${name}.com`,
    //     "password": "Passworewqewqd$#11",
    //     "connection": "LoogyCo-Users",
    //     "username": "johndoe",
    //     "given_name": "John",
    //     "family_name": lastName,
    //     "name": "John Doe",
    //     "nickname": "johnny",
    //     "picture": "http://example.org/jdoe.png",
    //     "user_metadata": { "plan": "free","aplicantType":applicationType,"mobile":mobile}
    //   });
    //   console.log(response)
    //   return response
    // }catch {
    //   alert('ERRPR') 
    // }
  
  }

  const rightContent = () => {
		return (
			<TouchableOpacity onPress={() => setPasswordShow(!passwordShow) }>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					{/* <Text style={{ marginRight: 5 }}>Scan by QR</Text> */}
					<Image
						source={{ uri: 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699007-icon-21-eye-hidden-512.png' }}
						style={{ width: 25, height: 25 ,opacity:passwordShow? 1:0.5}}
					/>
				</View>
			</TouchableOpacity>
		);
  };
  const rightContentSecond = () => {
		return (
			<TouchableOpacity onPress={() => setPasswordShowSecond(!passwordShowSecond) }>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					{/* <Text style={{ marginRight: 5 }}>Scan by QR</Text> */}
					<Image
						source={{ uri: 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699007-icon-21-eye-hidden-512.png' }}
						style={{ width: 25, height: 25,opacity:passwordShowSecond?1:0.5 }}
					/>
				</View>
			</TouchableOpacity>
		);
	};
  const detectContent = (e) =>{
    const one = "Mobile"
    const two = "Applicant"
    const three = "Information"
    const success = "Success"
    var index =  registrationType[currentIndex]
    console.log("index",index)

   
    switch (index) {
      case one:
        return <React.Fragment>
       <View style={{marginLeft:0}}>
       <Text 
           style={{marginRight:120,marginTop:60,marginBottom:20}}
            category="h6"
          >Type your E-mail Address
            {/* Type your mobile for Order notification */}
          </Text>
          <Input
          keyboardType={"email-address"}
          label={mobileTheme}
          style={{marginRight:24,marginTop:0}}
          placeholder="juan@delacruz.com"
          value={mobile}
          // maxLength={11}
          onChange={(e)=>setValue(e.nativeEvent.text)}
        /> 
          {/* <Input
          keyboardType={"numeric"}
          label={mobileTheme}
          style={{marginRight:24,marginTop:0}}
          placeholder="(+63 000 000 00)"
          value={mobile}
          maxLength={11}
          onChange={(e)=>setValue(e.nativeEvent.text)}
        />  */}
         </View>
    </React.Fragment>
        break;
        case two:
          return  <React.Fragment>
          <View style={{marginLeft:0}}>
            {/* <Divider    style={{marginRight:120,marginTop:60,marginBottom:20}}/> */}
             <Text 
           style={{marginRight:120,marginTop:60,marginBottom:20,fontWeight:'400'}}
            category="h6"
          >Please select application type : <Text category="h6" style={{fontWeight:'bold'}}>{applicationType}</Text>
          </Text>
          <TouchableOpacity disabled={true}  onPress={()=>setApplicationType('Manager')}><View style={{backgroundColor: applicationType  != 'Manager' ? '#dcdde1' : 'black',borderRadius:40,height: 45,width:140,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white'}}>Apply as Manager</Text></View></TouchableOpacity>
          <TouchableOpacity disabled={true}  onPress={()=>setApplicationType('Customer')}><View style={{backgroundColor: applicationType  != 'Customer' ? '#dcdde1' : 'black',borderRadius:40,height: 45,width:140,alignContent:'center',justifyContent:'center',alignItems:'center',marginTop:20}}><Text style={{color:'white'}}>Apply as Customer</Text></View></TouchableOpacity>
          <TouchableOpacity onPress={()=>setApplicationType('Driver')}><View style={{backgroundColor:applicationType  != 'Driver' ? '#dcdde1' : 'black',borderRadius:40,height: 45,width:120,alignContent:'center',justifyContent:'center',alignItems:'center',marginTop:20}}><Text style={{color:'white'}}>Apply as Driver</Text></View></TouchableOpacity>
           </View>
      </React.Fragment>
        break;
        case three:
          return  <React.Fragment>
          <View style={{marginLeft:0}}>
            {/* <Divider    style={{marginRight:120,marginTop:60,marginBottom:20}}/> */}
             <Text 
           style={{marginRight:120,marginTop:60,marginBottom:20}}
            category="h6"
          >Set your account password 
          </Text>
          
          {/* <TouchableOpacity onPress={()=>setApplicationType('Customer')}><View style={{backgroundColor: applicationType  != 'Customer' ? '#dcdde1' : 'black',borderRadius:40,height: 45,width:140,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white'}}>Apply as Customer</Text></View></TouchableOpacity>
          <TouchableOpacity onPress={()=>setApplicationType('Driver')}><View style={{backgroundColor:applicationType  != 'Driver' ? '#dcdde1' : 'black',borderRadius:40,height: 45,width:120,alignContent:'center',justifyContent:'center',alignItems:'center',marginTop:20}}><Text style={{color:'white'}}>Apply as Driver</Text></View></TouchableOpacity> */}
            <Input
            accessoryRight={rightContent}
            label={()=><Text style={{marginBottom:10}}>Password</Text>}
            style={{marginRight:24,marginTop:20}}
            placeholder="Type your password"
            value={passwordPrimary}
            secureTextEntry={passwordShow? false: true}
            onChange={(e)=>setPassword(e.nativeEvent.text)}
          /> 
            <Input
          label={()=><Text style={{marginBottom:10}}> Re-type Password</Text>}
          accessoryRight={rightContentSecond}
            style={{marginRight:24,marginTop:20}}
            placeholder="Type again your password"
            value={passwordSecondary}
            secureTextEntry={passwordShowSecond? false: true}
            onChange={(e)=>setPasswordSecondary(e.nativeEvent.text)}
          /> 
          <CheckBox
          status="warning"
          style={{marginTop:20,borderColor:'black',marginBottom:20}}
           checked={activeChecked}
           onChange={nextChecked => setActiveChecked(nextChecked)}
             >
  {evaProps => <Text onPress={()=>openTermsaAndCondition()} {...evaProps} style={{color:'#0097e6',marginLeft:20}}>I Agree Terms and Condition</Text>}
</CheckBox>
           </View>
      </React.Fragment>
      case "Processing":
        return  <React.Fragment>
          </React.Fragment>
      default:
        return <View/>
        break;
    }
    
  }

  const successContent = () =>{
    return (
      <ScrollView  style={{height:height,backgroundColor:'white'}}>
      <Layout  level='1'>
            <View style={{height:800, flex: 1,
                justifyContent: 'center',
                alignItems: 'center',marginLeft:20,marginRight:20}}>
                    <Image source={{ uri: 'https://cdn.dribbble.com/users/458522/screenshots/14007167/media/214f6fa81fbd40f3b65b2cb747393226.png?compress=1&resize=1600x1200'}} style={{ width:400,
        height:400}}/>

          <Text style={{marginBottom:40}} category='p1'>Account has been created</Text>
         <TouchableOpacity onPress={()=> navigation.goBack() }>
       <View style={{backgroundColor:mobile.length <= 9 ? 'black' : 'black',borderRadius:40,height: 45,width:140,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white'}}>Continue Logging in</Text></View>
     </TouchableOpacity>
      {/* <Button  onPress={()=>setIndex(0)} status='primary'>
     Back to store 
  </Button> */}
            </View>
         
            </Layout>
   </ScrollView>
    )
  }
  const sendSMS = ()=>{
    sendSMSservice().then( (data) =>{ 
      navigation.goBack()
    })
    
  }


  const openTermsaAndCondition = async () => {
    let result = await WebBrowser.openBrowserAsync('https://loogy.co/Terms');
  };
const validateButtonState =()=>{
  switch (currentIndex) {
    case 0:
      return mobile.length <= 9 ? '#dcdde1' : 'black' 
      break;
    case 1:
      return applicationType  === null ?  '#dcdde1' : 'black'
      break;
      case 2:
        if  (passwordSecondary === null ||  passwordPrimary === null || !activeChecked ) {
          return '#dcdde1'
        } else if (passwordSecondary != passwordPrimary  || !activeChecked ) {
          return '#dcdde1'
        }else {
          return 'black'
        }
        
        break;
        case 4:
          return 'black'
          break;
    default:
      return 'black'
      break;
  } 
}
  const formContent =()=>{
    return (
      <React.Fragment>
<ScrollView  contentContainerStyle={{paddingBottom: 120}}>
      <View style={{marginLeft:24,opacity:status ? 0.2:1 }}  >
          
            <Text 
             style={{fontWeight:'bold',marginRight:120,marginTop:120}}
              category="h1"
            >Welcome!
            </Text>
            <Text 
             style={{marginTop:8}}
              category="h6"
            >Fill-up the form to get started.
            </Text>
            <View style={{flex:1,alignSelf:'flex-start', flexDirection: "row",marginBottom:5,justifyContent:'space-between',width:'100%',marginTop:20}}>
            <TouchableOpacity  disabled={status ? true :false} onPress={() => setIndex(0)}><Text style={{color:currentIndex >= 0 ? '#0652DD' : '#dcdde1',fontWeight: currentIndex >= 0 ? 'bold':'500'}}>Email</Text></TouchableOpacity>
            <TouchableOpacity disabled={status ? true :mobile.length <= 9 ? true:false} onPress={() => setIndex(1)}><Text style={{color:currentIndex >= 1 ? '#0652DD' : '#dcdde1' ,fontWeight: currentIndex >= 1 ? 'bold':'500'}}>Application Type</Text></TouchableOpacity>
            <TouchableOpacity disabled={status ? true :currentIndex <= 1 ? true:false} onPress={() => setIndex(2)}><Text style={{color:currentIndex >= 2 ? '#0652DD' : '#dcdde1',marginRight:20,fontWeight: currentIndex >= 2 ? 'bold':'500'}}>Set Password</Text></TouchableOpacity>
              
          </View>
         {detectContent()}
         {currentIndex >= 3 ?  status ?  <ActivityIndicator  size="small" color="#0000ff" /> : null : null}
           </View>
      </ScrollView>
      <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
        
<View  style={{ height: 45,width:120, bottom:60,position:'absolute', alignSelf:'flex-end',right:20,opacity:status? 0.2:1}} >
  
          <TouchableOpacity disabled={validateButtonState() === 'black' ? false : true} onPress={() => currentIndex + 1 == 3 ? submitForm() : setIndex(currentIndex < 3 ? currentIndex + 1 :currentIndex )}>
        <View style={{backgroundColor:  validateButtonState()  ,borderRadius:40,height: 45,width:120,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white'}}>Continue</Text></View>
        </TouchableOpacity>
        </View>


      </React.Fragment>
      )
  }
return<React.Fragment>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex:1}}
    >{/* { currentIndex >= 1 ? formContent() : null }  */}
      {/* { registrationType[currentIndex] === "Processing"  ?  <ActivityIndicator  size="small" color="#0000ff" />     : null} */}
      {/* successContent() */}
      {registrationType[currentIndex] === "Success" ? successContent() : formContent()}
      </KeyboardAvoidingView>
</React.Fragment>
}
