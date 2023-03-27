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
import AvatarProfile from '../../components/Profile/Avatar'
import * as WebBrowser from 'expo-web-browser';
import StickyBackButton from '../../components/StickyBackButton'
import BottomSheet from '@gorhom/bottom-sheet';
import PickerImage from "../../components/ImagePicker";

export default  function ProfileUser({ route, navigation }){
  const [ status, setStatus ] = useState(false);
  const  [userEmail,setUserEmail] = useState('')
  const  [profile,setProfile] = useState(null)
  const  [warehouse,setWarehouse] = useState(null)
  const  [membersName,setName] = useState(null)
  const  [mobile,setMobileNumber] = useState(null)
  const  [address,setLocation] = useState(null)
  const  [logisticName,setLogisticName] = useState(null)
  const  [userTeamID,setTeamList] = useState([])
  const  [isAddYourTeam,setAddYourTeam] = useState(false)
  const  [plateNumber,setPlateNumber] = useState(null)
  const  [isReady,setDataReady] = useState(null)
  const  [dateJoined,setDateJoined] = useState(new Date())
  const  [viewingType,setViewingType] = useState(route.params.viewingType)
  const isFocused = useIsFocused();
  const {setUserAccountContext,getCurrentUser,setTypeOfView,setDriverDetails} = useContext(BookingContext);

  const bottomSheetRef = useRef<BottomSheet>(null);
	const [isSheetDisplay,setisSheetDisplay] =  useState(false);
  const [teamName,setTeamName] =  useState(null);
  const [teamStatus,setTeamStatus] =  useState(false);
  const [teamData,setTeamData] =  useState(null);
  const [serviceImageLink,setServiceImageLink] =  useState(null);
  const [serviceImageLinkList,setServiceImageLinkList] =  useState([
    "https://localflowershop.sgp1.digitaloceanspaces.com/product/1673584559857-0.4781646601447407-image.jpg",
    "https://localflowershop.sgp1.digitaloceanspaces.com/product/1673584559857-0.4781646601447407-image.jpg",
    "https://localflowershop.sgp1.digitaloceanspaces.com/product/1673584559857-0.4781646601447407-image.jpg"
    ]);

  
  
	const snapPoints = React.useMemo(() => ['35%',Platform.OS === 'android'  ? '50%' :'45%'], []);

  async function signOutAccount(){ 
    console.log('getCurrentUser().email',getCurrentUser().email)
    try {
      const response = await axios.post('/user/Loogy/signout',{"email":getCurrentUser().email });
        return response
    }  catch (error){
        console.log('ERROR LOGOUT',error)
      alert('ERRPR')
    }
  }

  const teamContent = ()=>{
    
    try {
      let items = []
      userTeamID.map(item=>{
        items.push(
        // <TouchableOpacity>
        //   <Text>{item.shortName}</Text>
        // </TouchableOpacity>
              <View	style={{
                          backgroundColor:  '#ecf0f1'  ,
                          width: 100,
                          height: 25,
                          margin:20,
                          borderRadius: 50 / 2,
                          justifyContent: 'center',
                          alignContent: 'center'
                        }}>
          <Text
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 0,
                            color:  'black'
                          }}
                          category="c2"
                        >{item.shortName}
                        </Text>
                        </View>
        
        )
      })
      return <View style={{alignContent:'flex-start',justifyContent:'flex-start',alignItems:'flex-start'}}>{items}</View>
    }catch{
      return null
    }
 
  }
  const updateProfile =()=>{
    setStatus(true)
    setisSheetDisplay(false)
    updateProfileService().then(profile=> {
      setStatus(false) 
      setDateJoined(profile?.data.data[0].created_at)
      setProfile(profile.data.data[0])
      setWarehouse(profile.data.data[0].warehouse)
      setMobileNumber(profile?.data.data[0].user_details.contactNumber)
      setName(profile?.data.data[0].user_details.name)
      setLogisticName(profile?.data.data[0].user_details.logisticName)
      setTeamList(profile?.data.data[0].user_details.teamIDs)
      setServiceImageLinkList(profile?.data.data[0].vehicle)
    })
  }
  async function updateProfileService(){ 
    try {
      const response = await axios.post('/user/Loogy/update_profileV2',{"id":getCurrentUser().id,warehouse:warehouse,user_details:{
        name:membersName,
        contactNumber:mobile,
        logisticName:logisticName,
        plateNumber:plateNumber,
        teamIDs: [teamData]//userTeamID
      },vehicle:serviceImageLinkList });
        return response
    }  catch (error){
        console.log(error)
        alert('ERRPR')
    }
  }

  const findTeam =()=>{
    setTeamStatus(true)
    setTeamData(null)
    findTeamService().then(item=>{
      console.log('team response',item)
      setTeamStatus(false)
      if (item.status) {
        setTeamData(item.results)
        setisSheetDisplay(false)
        Alert.alert(`${teamName} is found`, `Are you sure you want to add?`, [
          { text: "Okay", onPress: () => updateProfile() },
        ], {
          cancelable: false,
        })
      }else {
        alert('Invalid Id')
      }
})
  }


  async function findTeamService(){ 
    try {
      const response = await axios.post('/search/LoogyGroup',{"type":"LoogyGroup","query":{"shortName":`@${teamName}`}});
        return response.data
    }  catch (error){
        console.log(error)
        alert('ERRPR')
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

const displayAvatar = (e)=>{
  try {
    return  e.application_info.picture
  } catch (error) {
    return `https://ui-avatars.com/api/?name=${membersName}?size=228?rounded=true`
  }
}


useEffect(() => { 
  console.log('imagelink',serviceImageLink)
},serviceImageLink)
  useEffect(() => { 
      try {
        setStatus(true)
        const user = getCurrentUser() 
        setUserEmail(user.email)
        setDateJoined(user.created_at)
        console.log('userProfileXXXXX',user.created_at)
        if(isFocused) {
          getEntry('@userProfile').then(profile =>{
            console.log('userProfile',profile)
          })
          getProfileAccount().then(profile=> {
            console.log('profilessss',profile.data.data[0])
            setStatus(false)
            if (profile?.data.data[0].user_details !== undefined) {
              var details = profile.data.data[0].user_details
            
              setDataReady(true)
              setMobileNumber(details.contactNumber)
              setName(details.name)
              setProfile(profile.data.data[0])
              setWarehouse(profile.data.data[0].warehouse)
              setLogisticName(details.logisticName)
              setPlateNumber(details.plateNumber)
              setTeamList(details.teamIDs)
            }
          })
        }else{
          getEntry('@userProfile').then(profile =>{
            console.log('userProfile',profile)
          })
        }
      }catch(error) {
        console.log('error',error)
      }
  }, [])
  const sendMagicLink = ()=>{
    setStatus(true)
    signOutAccount().then( (data) =>{
      if(data.data.message != null) {
        alert(data.data.message.message) 
        setStatus(false)
      }else {

 ToastAndroid.show('Signing off...', ToastAndroid.LONG);
        setTimeout(() => { 
          setStatus(false)
          setTypeOfView('LOGIN')
        // setDriverDetails(null)
        // setUserAccountContext({user:null,data:null,driverDetails:{warehouse:null}})
          }, 1000);
      }
    }) 
}

const deleteProfile =()=>{
  setStatus(true)
  deleteProfileAccountService().then((response)=>{
    setStatus(false)
    console.log(response)
    if (response.error === null) {
      ToastAndroid.show('Account has been deleted', ToastAndroid.LONG);
      setTimeout(() => { 
        setTypeOfView('LOGIN')
        }, 1000);
    }else{
      setTypeOfView('LOGIN')
      alert('Please try again later')
    }
  })
}
async function deleteProfileAccountService(){
    try {
      const response = await axios.post('/user/DeleteAccount',{"id":getCurrentUser().id });
      console.log('  return response.data',   response.data)
        return response.data
    }  catch (error){
        console.log(error)
        return null
        alert('ERRPR')
    }

}
    const ProfileContent =()=>{
        try {
          return <View style={{width:width-40,height:'auto',backgroundColor:true ? 'white' :'white'}}>
          <Text style={{marginLeft:50,marginTop:20,color:'black',fontWeight:'bold'}} category='h1'>{membersName}</Text>
          <Text style={{marginLeft:50,marginTop:5,color:'black',fontSize:16,fontWeight:'bold'}} category='c2'>{logisticName }</Text> 
          {/* <View style={{position:'absolute',top:25,left:10,height:30,width:30,backgroundColor:'black',borderRadius:75}}>
            <TouchableOpacity>
          <Image  source={{uri:profile === null ? '' : profile.application_info.userDetails.avatar + '&size=300'}}  style={{borderRadius:75,width:30,height:30  }}/>
          </TouchableOpacity>
          </View> */}
          <Text category="c1" style={{color:'#44bd32',marginLeft:50,marginTop:10,fontWeight:'bold'}}>{profile.application_info.aplicantType}</Text>
          <Divider style={{marginTop:20}}/>
        </View>
        }catch {
          return <View style={{width:width,height:150,backgroundColor:true ? 'white' :'white'}}>
          <Text style={{marginLeft:20,marginTop:120,color:'black',fontWeight:'bold'}} category='h1'>...</Text>
      </View>
        }
      }
    const driversContent = () =>{
      try {
        var isDriver = profile.application_info.aplicantType === 'Driver' ? true : false
      return ( isDriver ?<Input
        value={plateNumber}  
        label="Plate Number"
        style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
        placeholder="Set your Unit Plate number"
        onChange={(e) => setPlateNumber(e.nativeEvent.text)}
      /> : null)
      } catch {
        return null
      }
      
    }
    const subscriptionContent = ()=>{
      return (
        <TouchableOpacity>
        <View style={{ marginLeft: 20, marginTop: 20,backgroundColor:'white',borderRadius:10,marginRight:20 }}>
      <View style={{
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 10
      }}>
        <View style={{ height: 50, width: 50, backgroundColor: 'white', borderRadius: 5,marginLeft:5 }}>
          <TouchableOpacity>
            <Image source={{ uri: 'https://img.icons8.com/external-smashingstocks-glyph-smashing-stocks/344/external-unlock-web-smashingstocks-glyph-smashing-stocks.png' }} style={{ borderRadius: 75, width: 50, height: 50, marginBottom: 10 }} />
          </TouchableOpacity>
        </View>
        <View>
          <Text category="c1" style={{ marginLeft: 20, fontWeight: 'bold' }}>{'First Mile'}</Text>
          {/* <Text category="c1" style={{ marginLeft: 20 }}>{profileEmail}</Text> */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 10, marginLeft: 20
            }}
          >
           <Text category="c1">Free Access</Text> 
           {/* <Text category="c1">Valid December 1st 2022</Text>  */}
               {/* <Text category="c1">|| Basic Account</Text> */}
            {/* <Image
              source={{ uri: 'https://img.icons8.com/color/344/26e07f/approval--v1.png' }}
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <Text category="c1">Joined August 29, 2021</Text> */}
          </View>
         
        </View>
      </View>
      {/* <TouchableOpacity><Text style={{fontWeight:'bold'}}>Upgrade now</Text></TouchableOpacity> */}
    </View>
    </TouchableOpacity>
      )
    }
    const mainProflile =()=>{
      return (
        <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex:1}} 
    ><React.Fragment>
    <ScrollView style={{height:height,backgroundColor:'#fcfcfc',opacity: status ? 0.1 : 1}} contentContainerStyle={{paddingBottom: 60}} >
    <View style={{backgroundColor:'white',borderRadius:20,margin:20,marginTop:60,elevation:5}}>
    {/* {ProfileContent()} */}
    {/* <Text category='h1' style={{marginLeft:20,marginTop:20}}>My Account</Text> */}
    <View style={{flexDirection:'row',marginTop:20}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >My</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Account</Text>
        <View> 
        {/* <View style={{top:20,right:0}}>
        <TouchableOpacity onPress={deleteProfile}><Text style={{color:'#EA2027'}}>Delete Account</Text></TouchableOpacity>
          </View> */}
        </View>
				</View>
       
<AvatarProfile dateJoined={dateJoined} hideContact={true} profileAvatar={displayAvatar()} profileEmail={userEmail} profileName={membersName}/>
<Divider/>
{subscriptionContent()}
<Divider/>
<Text style={{marginTop:20,marginLeft:20,fontWeight:'bold'}} category='h6'>Profile</Text>
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
                  {/* <Input
        value={warehouse} 
        label="Warehouse"
        style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
        placeholder="0913214231"
        onChange={(e) => setWarehouse(e.nativeEvent.text)}
      /> */}
      <Input
        value={logisticName}  
        label="Logistic Name"
        style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
        placeholder="Juan Dela Cruz Forwarder"
        onChange={(e) => setLogisticName(e.nativeEvent.text)}
      />
      {teamContent()}
      <TouchableOpacity onPress={()=>setAddYourTeam(!isAddYourTeam)}>
      <View	style={{
									backgroundColor:  '#ecf0f1'  ,
									width: 100,
									height: 25,
                  margin:20,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}>
	<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color:  'black'
									}}
									category="c2"
								>
									Add your Team +
								</Text>
								</View>
                </TouchableOpacity>
                
                {serviceImageLinkList === null ? null :   renderServiceList()}
                <PickerImage
          requestType="PROFILE"
           referenceOrder={"referenceOrderRef.current"}
              onReload={(link) =>  setServiceImageLinkList( [...serviceImageLinkList, link.link]  )}
            />
<Text>Add any Government ID</Text>
<PickerImage
          requestType="PROFILE"
           referenceOrder={"referenceOrderRef.current"}
              onReload={(link) =>  setServiceImageLinkList( [...serviceImageLinkList, link.link]  )}
            />
      {/* {driversContent()} */}
      {/* <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Driver Profile</Text> */}
  <View style={{opacity:false ? 0.7 : 1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
   <Button  onPress={()=>updateProfile()} status="primary" style={{ borderRadius: 40, width: width - 60,  marginTop: 20,marginBottom:8, backgroundColor:status === false ?'black' :  '#dcdde1', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Profile </Text>
</Button>
   <Button   onPress={()=>sendMagicLink()}   style={{ borderRadius: 40, width: width - 40,  marginTop: 20,marginBottom:16, backgroundColor:  'white', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
  <Text style={{ color: 'black', fontWeight: 'bold' }}>{false ?"Processing..." : "Sign Out"}</Text>
</Button>
</View>
</View>

<StatusBar style={'dark'} />

<ScrollView  contentContainerStyle={{paddingRight: 120}}  horizontal={true} style={{
  marginLeft:20,
  height:50,showsHorizontalScrollIndicator:false}}  showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
<View style={{flexDirection:'row',alignContent:'center',alignItems:'center',width:width}}>
  
  <View style={{backgroundColor:'white',borderRadius:10,height:20,alignContent:'center',alignItems:'center',justifyContent:'center',marginLeft:10,marginRight:10}}>
<Text onPress={()=>openTermsaAndCondition()} category='c1' style={{color:'#0652DD',marginLeft:5,marginRight:5}}>@Terms and Condition</Text>
</View>
<View style={{backgroundColor:'white',borderRadius:10,height:20,alignContent:'center',alignItems:'center',justifyContent:'center',marginLeft:10,marginRight:10}}>
<Text onPress={()=>openPPoilicy()} category='c1' style={{color:'#0652DD',marginLeft:5,marginRight:5}}>@Privacy Policy</Text>
</View>

<View style={{backgroundColor:'white',borderRadius:10,height:20,alignContent:'center',alignItems:'center',justifyContent:'center',marginLeft:10,marginRight:10}}>
<Text onPress={()=>openAbout()} category='c1' style={{color:'#0652DD',marginLeft:5,marginRight:5}}>@About Us</Text>
</View>
<View style={{backgroundColor:'white',borderRadius:10,height:20,alignContent:'center',alignItems:'center',justifyContent:'center',marginLeft:10,marginRight:10}}>
<Text onPress={()=>openContactUs()} category='c1' style={{color:'#0652DD',marginLeft:5,marginRight:5}}>@Contact Us</Text>
</View>
</View>

</ScrollView>
{/* <View style={{marginTop:20,marginLeft:5,marginRight:5}}>
<Text onPress={()=>openTermsaAndCondition()} category='c1' style={{position:'absolute',bottom:0,left:20,color:'#0652DD'}}>Terms and Condition</Text>
<Text onPress={()=>openPPoilicy()}category='c1' style={{position:'absolute',bottom:0,right:20,color:'#0652DD'}}>Privacy Policy</Text>
</View> */}
</ScrollView> 
     {status ?  <View style={{marginTop:120, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View> : null}    
          {/* {!status ? <FloatingBar index={3} navigation={navigation} showAccount={true}/> : null } */}
       {isAddYourTeam ?<BottomSheet
				ref={bottomSheetRef}
				index={1}
				style={{shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				
				elevation: 5, }}
				snapPoints={snapPoints}
				>
          <TouchableOpacity  onPress={() => setAddYourTeam(false)}>
							<View
								style={{
									backgroundColor: 'One-Way' === 'One-Way' ? '#dfe4ea' : 'white',
									top:0,
									left:20,
									width: 45,
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
						</TouchableOpacity>
            <View style={{marginLeft:20,marginRight:20}}>
            <Input
        value={teamName}
		onChange={(e) => setTeamName(e.nativeEvent.text)}
        label="What's the name of your Team?"
        style={{ marginTop: 10,}}
        placeholder="Juan Dela Cruz Forwarder?"
      />
	  <View style={{flexDirection:'row',alignContent:'flex-start',alignItems:'center',justifyContent:'flex-start'}}>
	  </View>
	  <Button  status="primary" 
    onPress={()=>findTeam()}
       disabled={teamStatus ? true: false}  
       style={{ borderRadius: 40, width: 120, 
		opacity:teamStatus ? 0.2:1,
        marginTop: 20,marginBottom:32, backgroundColor:'selectedVehicle' === null ?'#dcdde1' :  'black', 
       borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{teamStatus ?"Processing..." : "Add"}</Text>
    </Button>
        </View>
        </BottomSheet> : null}   

</React.Fragment>
<StickyBackButton status={status} navigation={navigation}/>
    </KeyboardAvoidingView> 
    
      )
    }

    const openTermsaAndCondition = async () => {
      let result = await WebBrowser.openBrowserAsync('https://loogy.co/Terms');
    };
    const openPPoilicy = async () => {
      let result = await WebBrowser.openBrowserAsync('https://loogy.co/PrivacyPolicy');
    };
    const openAbout = async () => {
      let result = await WebBrowser.openBrowserAsync('https://loogy.co/About');
    };
    const openContactUs = async () => {
      let result = await WebBrowser.openBrowserAsync('https://loogy.co/Contact');
    };
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
    const removeImageFromlist = (id)=>{
      console.log(id)
      let filtered = serviceImageLinkList.filter(item => item !== id)
      setServiceImageLinkList(filtered) 
    }
    const renderServiceList = ()=>{
      const list = []
      var identifer = 0
      serviceImageLinkList.map(link =>{
      list.push(
      <TouchableOpacity onPress={()=>removeImageFromlist(link)} >
      <View style={{margin:10,flex:1,justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
        <Image source={{ uri:link}} 
                style={{
                  width:60,
                  height:60,
                  borderRadius:10,
                  marginLeft:20}}
                />
                <Image source={{ uri:"https://icons-for-free.com/download-icon-close+icon-1320184117228553763_512.png"}} 
                style={{
                  width:20,
                  height:20,
                  borderRadius:10,
                  marginLeft:20}}
                />
                </View>
                </TouchableOpacity>
      )
      identifer =identifer+1
      })

      return <><Text style={{marginLeft:24}} category="p1">Your Vehicle</Text>{list}</>
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
        // <Text>Welcome{console.log(items)}</Text>
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