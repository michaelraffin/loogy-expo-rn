import React, { useEffect, useState, useRef, useMemo, PureComponent, useCallback, useContext } from 'react';
import { ToastAndroid, Platform, StyleSheet, ScrollView, Image, Vibration, TextInput, ImageBackground, RefreshControl, Dimensions, TouchableOpacity, KeyboardAvoidingView, View, Alert, FlatList, ActivityIndicator } from 'react-native';
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
import Store from '../../components/Context/MapContext'
import { MapContext } from '../../components/Context/MapContext'
import StoreContext from '../../components/Context/MapContext'
import { BookingContext } from '../../components/Context/UserBookingContext'
import BookingContextProvider from '../../components/Context/UserBookingContext'
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FloatingBar from '../../components/FloatingBar'
import { axios } from '../../components/Utils/ServiceCall'
import { Small, BigLoader, ButtonLoader, InstagramContent } from '../../components/Loader';
import ConfettiCannon from 'react-native-confetti-cannon';
import AvatarProfile from '../../components/Profile/Avatar'


const departedAddress = "Departed"
const arrivalAddress = "Arrival"
const dateDeparted = "Date from"
const arrivalDate = "Date to"
export default function SuccessPayment({ route, navigation }) {
  const isFocused = useIsFocused();
  const [addresssss, setAddddddress] = useState('false');
  const [status, setStatus] = useState(false);
  const [showConfetti, setHideConfetti] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showCalendar, setCalendarContent] = useState(false);
  const [fromValue, setFrom] = useState('Iligan City - Cebu CEB');
  const [toValue, setTo] = useState('Quezon City - Manila MNL');
  const [switcher, setSwitch] = useState(false);
  const [currentIndex, setSelectedIndex] = useState(0);
  const [calendarType, setCalendarType] = useState('from');
  const [category, setCategory] = useState('One-Way');
  const { address } = useContext(MapContext);
  const [selecttttt, setCategorsy] = useState(MapContext);
  const {  userAccount, getCurrentUser, userTrips, getSelectedVehicle, setDriverDetails, setTypeOfView, driverDetails } = useContext(BookingContext);
  const [mapType, selectMapType] = useState(null);
  const [userEmail, setUserEmail] = useState('')
  const [profile, setProfile] = useState(null)
  const [warehouse, setWarehouse] = useState(null)
  const [membersName, setName] = useState('')
  const [mobile, setMobileNumber] = useState('')
  const [address1, setLocation] = useState(null)
  const [logisticName, setLogisticName] = useState('')
  const [isNew, setUser] = useState(false)
  const [currentID, setCurrentID] = useState('id')
  const { Details, updateCart } = cart()
  const [applicationType, setApplicatioNType] = useState('Driver')
  var empty = []
  

  useEffect(() => { 
    hideConfetti()
  },[isLoading])


  useEffect(() => { 
    setLogisticName('')
  },[applicationType])
  
  const isFromGoogleFacebook = () =>{
    try {
      if (driverDetails != undefined && driverDetails.app_metadata.provider === 'google' || driverDetails.app_metadata.provider === 'facebook') {
        return true
      }else {
        return false
      }
    }catch {
      return false
    }
  }
  useEffect(() => { 
    try {
      if (driverDetails == undefined || driverDetails === null) {
        return
      }
      if (driverDetails != undefined && driverDetails.app_metadata.provider === 'google' || driverDetails.app_metadata.provider === 'facebook') {
        setName(driverDetails.user_metadata.name)
        setMobileNumber(driverDetails.phone)
      }
    } catch (error) {
      console.log('error meta data', error)
    }
  }, [])


  const displayDescription = ()=>{
    switch (applicationType)  {
      case 'Organizer':
        return "Oganize your load and assigned to your team or group of drivers."
        break
        case 'Shipper':
          return "Create different load then share to the driver's."
        break
        case 'Driver':
          return "Accept different load and manage task. "
        break
        default:
        return 'No content'
    }
  }
  const extentUserProfileInAuth = React.useMemo(() => {
    try {
      if (driverDetails != null && driverDetails.app_metadata.provider === 'google' || driverDetails.app_metadata.provider === 'facebook') {
        return (<>
          <Divider style={{marginTop:20}}/>
          <View style={{marginLeft:20}}>
          <Text category="h6" style={{ marginTop: 20,marginBottom:20,  fontWeight: 'bold' }}>Application Type</Text>
          {/* <TouchableOpacity disabled={false}  onPress={()=>setApplicatioNType('Organizer')}><View style={{backgroundColor: applicationType  != 'Organizer' ? '#bdc3c7' : 'black',borderRadius:40,height: 45,width:200,alignContent:'center',justifyContent:'center',alignItems:'center'}}><Text style={{color:'white'}}>Apply as Brooker/Shipper</Text></View></TouchableOpacity> */}
          <TouchableOpacity disabled={false}  onPress={()=>setApplicatioNType('Shipper')}><View style={{backgroundColor: applicationType  != 'Shipper' ? '#bdc3c7' : 'black',borderRadius:40,height: 45,width:200,alignContent:'center',justifyContent:'center',alignItems:'center',marginTop:20}}><Text style={{color:'white'}}>Apply as Shipper/Brooker</Text></View></TouchableOpacity>
          <TouchableOpacity disabled={isLoading}   onPress={()=>setApplicatioNType('Driver')}><View style={{backgroundColor:applicationType  != 'Driver' ? '#bdc3c7' : 'black',borderRadius:40,height: 45,width:130,alignContent:'center',justifyContent:'center',alignItems:'center',marginTop:20}}><Text style={{color:'white'}}>Apply as Driver</Text></View></TouchableOpacity>
        <Layout style={{marginTop:20,borderRadius:5,backgroundColor:'white'}} level="1" >
        <View status='basic' style={{margin:20}}>
        <Text    category="c1" style={{fontWeight:'bold',color:'#6ab04c'}}  >
          Aa a {applicationType}
        </Text>
          <Text    category="c1"style={{marginTop:5,marginBottom:20}}   >
          {/* To process your order, please upload  <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >proof of payment</Text> in Orders Tab. */}
          {displayDescription()}
        </Text>
        <Divider/>
          </View>  
   </Layout>
           </View>
        </>)

      }
      return <View />
    } catch {
      return <View />
    }

  },[applicationType])

  const getOriginAccount =()=>{
    try {
      //SUPABASE AUTH ACCOUNT
      return driverDetails.app_metadata.provider
    } catch (error) {
      //EMAIL LOGIN TYPE
      return getCurrentUser().app_metadata.provider
    }
  }
  const updateProfileSettings = () => {
    
    ///this is to retain the user auth profile
    var app_metadata  = driverDetails.app_metadata
    var user_metadata = driverDetails.user_metadata
    var identity = driverDetails.identities
    console.log('driverDetails=====>',driverDetails)
    setLoading(true)
    setStatus(true)
    Platform.OS === 'ios' ? null : ToastAndroid.show('Saving your profile...', ToastAndroid.LONG)
    updateProfileService(currentID).then(profile => {
      setLoading(false)
      setStatus(false) 
      var retainProfile = profile.data.data[0]
      //This only works in EMAIL LOGIN
      var provider = getOriginAccount() //SOCIAL MEDIA
      console.log('driverDetails IphoneSE',provider)
      if (provider === 'google' || provider === 'facebook' || provider === 'apple'   ) {
        retainProfile.app_metadata = driverDetails.app_metadata
        retainProfile.user_metadata = driverDetails.user_metadata
        retainProfile.identity = driverDetails.identities[0]
      }
      if (profile != null) {
        setTypeOfView('MAIN')
        var profile = profile.data.data[0]
        setDriverDetails(retainProfile)
      }else {
        displayError()
      }


      
    })
  }
  const displayError = ()=>{
    alert('DISPLAY ')
		Alert.alert(`We're sorry`, `Unable to continue. Pleae check any missing details and try again.`, [
          	{text: 'Okay', onPress: () => console.log('OK Pressed')}
          ], {
            cancelable: false,
          })
	}
  async function updateProfileService(id) {
    try {
      var data = isFromGoogleFacebook() ?  {
        name: membersName,
        contactNumber: mobile,
        logisticName: logisticName,
        applicantType:applicationType
      } : {
        name: membersName,
        contactNumber: mobile,
        logisticName: logisticName,
        applicantType:applicationType
      }
      const response = await axios.post('/user/Loogy/update_profile', {
        "id": id, warehouse: warehouse, user_details:data
      });
      return response
    } catch (error) {
      console.log(error) 
      return null
      alert('Please check any missing details and try again')
    }
  }

  const isSatisfy = ()=>{
    if ( membersName.length >= 3  && mobile.length >= 9) {
      if (logisticName.length <= 9 && applicationType === 'Driver') {
        return false
      } else {
        return true
      }
    }
    return false
  }

  async function getProfileAccount() {
    try {
      const response = await axios.post('/user/Loogy/profile', { "id": getCurrentUser().data.id });
      return response
    } catch (error) {
      console.log(error)
      alert('ERRPR')
    }
  }

  const renderSocialMediaProfile = () => {
    try {

      if (driverDetails != undefined) {
        if (driverDetails.app_metadata.provider === 'google' || driverDetails.app_metadata.provider === 'facebook') {
          return <AvatarProfile hideContact={true}  profileName={membersName} profileEmail={driverDetails.user_metadata.email} profileAvatar={driverDetails.user_metadata.avatar_url} />
        } else {
          return <View />
        }
      } else {
        return <View />
      }
    } catch {
      return <View />
    }

  }
  const profileTextFields =()=>{
    return(
      <View>
      <Text category="h6" style={{ marginTop: 20, marginLeft: 20, fontWeight: 'bold' }}>Setup your profile</Text>
      <Text category="c1" style={{ position:'absolute',marginTop: 25, right:15, fontWeight: 'bold',color:'#2f3542' }}>2/2</Text>
      {renderSocialMediaProfile()}
      <Input
        value={membersName}
        label="Full name"
        style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
        placeholder="Juan Dela Cruz"
        onChange={(e) => setName(e.nativeEvent.text)}
      />
      {/* <Input
      value={userEmail}
disabled={true}
      label="Email"
      style={{ marginTop: 10,marginLeft:20 ,marginRight:20}}
        placeholder="jaun@delacruz.com"
      onChange={(e) => setUserEmail(e.nativeEvent.text)}
    /> */}

      <Input
        value={mobile}
        label="Contact Mobile Number"
        keyboardType={"numeric"}
        style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
        placeholder="09** **** ***"
        onChange={(e) => setMobileNumber(e.nativeEvent.text)}
      />
      {/* <MapContext.Consumer>
    {items =>
    customerAddress(items)
  }</MapContext.Consumer> */}
  
      <Input
        value={logisticName}
        label="Logistic Name"
          disabled={applicationType != 'Driver' ?true : false}
        style={{ marginTop: 10, marginLeft: 20, marginRight: 20,opacity: applicationType != 'Driver' ? 0.2: 1 }}
        placeholder="Juan Dela Cruz Forwarder"
        onChange={(e) => setLogisticName(e.nativeEvent.text)}
      />
      {extentUserProfileInAuth}
      <View style={{ opacity: isLoading ? 0.7 : isSatisfy() ? 1:0.6, justifyContent: 'center', alignContent: 'center', alignItems: 'flex-end' }}>
        <Button disabled={!isSatisfy()} onPress={() => updateProfileSettings()} status="primary" style={{ borderRadius: 30, width: 'auto', marginTop: 20, marginBottom: 8, backgroundColor: isLoading === false ? 'black' : '#dcdde1', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'white' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Profile</Text>
        </Button>
      </View>
    </View>
    )
  }
  const hideConfetti = ()=>{
    setTimeout(() => {
      setHideConfetti(false)
				}, 3000);
  }
  const continueProfile = () => {
    return (
      <React.Fragment>
        <ScrollView style={{ height: height, backgroundColor: '#f5f6fa', opacity: status ? 0.1 : 1, paddingBottom: 100 }}>
          <View style={{
            height: 300,
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            transform: [{ scaleX: 2.2 }],
            borderBottomStartRadius: 200,
            borderBottomEndRadius: 200,
            overflow: 'hidden',
            backgroundColor: 'black',
            borderColor: 'white',
            borderWidth: 1
          }}>
            <Image source={{ uri: 'https://cdn.dribbble.com/users/7831180/screenshots/15641971/media/4fda4547e5a26974564b08bbd8753b4f.jpg?compress=1&resize=1200x900&vertical=top' }} style={{

              width: '100%',
              height: 400,
              resizeMode: 'cover',
              flex: 1,
              transform: [{ scaleX: 0.5 }],
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center'

            }} />
          </View> 
          <View style={{ backgroundColor: 'white', borderRadius: 20, marginLeft: 20, marginRight: 20, marginBottom: 20, paddingTop: -60 }}>
            {isLoading ? <><BigLoader/><BigLoader/></>: profileTextFields()}
           </View>
           
          <StatusBar style={'dark'} />
        </ScrollView>
        {status ? <View style={{ marginTop: 120, bottom: 120, position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row', }}><ActivityIndicator size="small" color="#0000ff" /></View> : null}
       {showConfetti ?<ConfettiCannon fadeOut={true} count={200} origin={{ x: -10, y: 0 }} />  : null} 
       








      </React.Fragment>
    )
  }
  const loaderContent = () => {
    return (
      <React.Fragment>
        <StatusBar barStyle={'dark'} />
        <FlatList
          // refreshControl={
          //   <RefreshControl
          //     size={2}
          //   />
          // }
          maxToRenderPerBatch={5}
          extraData={(e) => console.log('e', e)}
          data={[1]}
          ListHeaderComponent={() => (
            status ? <React.Fragment>
              <BigLoader />
              <BigLoader />
              <BigLoader />
              <InstagramContent />
              <ButtonLoader />
            </React.Fragment> : <React.Fragment>

              <View style={{
                height: 300,
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
                transform: [{ scaleX: 2.2 }],
                borderBottomStartRadius: 200,
                borderBottomEndRadius: 200,
                overflow: 'hidden',
                backgroundColor: 'black',
                borderColor: 'white',
                borderWidth: 1
              }}>
                <Image source={{ uri: 'https://cdn.dribbble.com/users/7831180/screenshots/15641971/media/4fda4547e5a26974564b08bbd8753b4f.jpg?compress=1&resize=1200x900&vertical=top' }} style={{

                  width: '100%',
                  height: 400,
                  resizeMode: 'cover',
                  flex: 1,
                  transform: [{ scaleX: 0.5 }],
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center'

                }} />
              </View></React.Fragment>
          )
          }
          style={{ paddingBottom: 90 }}
          renderItem={(item) => {
            return (
              <React.Fragment>
                <BigLoader />
                <BigLoader />
                <BigLoader />
                <InstagramContent />
                <ButtonLoader />
              </React.Fragment>
            )
          }}
        />
      </React.Fragment>
    )
  }
  const setCurrentUser =(e)=>{
    if (e == undefined) {
     return
    }
    setLoading(false)
    setCurrentID(e)
  }

  return (
    <BookingContext.Consumer>
    {items =>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    {continueProfile()}
     {setCurrentUser(items.getCurrentUser().id)}
     {console.log('CONTEXT API DATA',items.getCurrentUser().id)}
    </KeyboardAvoidingView>
}</BookingContext.Consumer>
  )


}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    flex: 1,
    transform: [{ scaleX: 0.5 }],
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
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
    marginLeft: 11
  }, inputTouchableRight: {
    flex: 1,
    margin: 2,
    marginRight: 20,
    marginLeft: 15
  },
  inputRoundTripTouchable: {
    flex: 1,
    marginTop: 2
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
