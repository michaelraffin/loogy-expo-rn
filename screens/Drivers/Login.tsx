import React, { useEffect, useState, PureComponent, useRef, useContext } from 'react';
import { Alert, Switch, ToastAndroid, BackHandler, Keyboard, SafeAreaView, StyleSheet, ScrollView, Image, ImageBackground, RefreshControl, StatusBar, Dimensions, TouchableOpacity, KeyboardAvoidingView, View, ActivityIndicator, Platform } from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Clipboard from 'expo-clipboard';
var Image_Http_URL = { uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif' };
import { cart, Theme, CartContextAction } from '../../components/Utils/UserCart';
import ThemeColor from '../../constants/Colors'
import { saveEntry, getEntry, removeItem } from '../../components/Utils/StoreDetails'
import moment from 'moment'
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import { CheckMark } from '../../components/Svgs'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg, { Circle, Path, Line, Polyline, Rect } from "react-native-svg"
import Store from '../../components/Context/MapContext'
import { MapContext } from '../../components/Context/MapContext'
import DashedLine from 'react-native-dashed-line';
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import axiosMain from 'axios';
import { BookingContext } from '../../components/Context/UserBookingContext'
import { axios } from '../../components/Utils/ServiceCall';
import Counter from '../../components/Utils/Counter';
import { OTP } from 'react-native-otp-form';
import { supabase, supabaseUrl, supabaseAnonKey, siginWithSupabase } from '../Drivers/slogin'
import { startAsync, makeRedirectUri } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


export default function LoginDetails({ route, navigation }) {
  const [mobile, setMobile] = useState('');
  const [emailPassword, setEmailPasswordLogin] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState(false);
  const [otpActive, setOTPActive] = useState(false);
  const [verifyAllow, setAllowVerify] = useState(false);
  const [isPasswordSecure, setPasswordSecure] = useState(false);
  const [allowResend, setResend] = useState(false);
  const [viewerType, setViewerType] = useState('LOGIN');
  const [isSuccess, setSuccess] = useState(false);
  const isFocused = useIsFocused();
  const { setUserAccountContext, setLoginByEmailService, setTypeOfView,setUserByEmailAccountContext } = useContext(BookingContext);



  useEffect(() => {
    
    // saveEntry('isNew3','@isNew')
    if (isFocused) {
      setOTPActive(false)
      setStatus(false)
    } else {
      
      setViewerType('LOGIN')
      setEmailPasswordLogin({
        email: '',
        password: ''
      })
    }

  }, [isFocused])

  useEffect(() => {
    
    // if (isSuccess || status) {
    //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    //   return () => backHandler.remove()
    // }
  }, [isSuccess, status])


  async function signInEmailPassword() {
    try {
      const response = await axios.post('/signin/Loogy', {
        "email": emailPassword.email,
        "password": emailPassword.password
      });

      return response
    } catch (error) {
      const err = error as AxiosError
      setStatus(false)
      console.log(error)
    }
  }
  async function sendSMSservice() {
    try {
      const response = await axios.post('/Loogy/SMSAuth', {
        "requestedBy": mobile
      });
      return response
    } catch {
      alert('ERRPR')
    }
  }
  async function verySMSService() {
    try {
      const response = await axios.post('/Loogy/verify/auth/sms', {
        "requestedBy": mobile,
        "code": "609211"
      });
      return response
    } catch {
      alert('ERRPR')
    }
  }
  async function magicLinkService() {
    try {
      const response = await axios.post('/user/Loogy/resetp', { "email": emailPassword.email });
      return response
    } catch (error) {
      console.log(error)
      alert('ERRPR')
    }
  }

  const sendMagicLink = () => {
    setStatus(true)
    magicLinkService().then((data) => {
      console.log(data)
      if (data.data.message != null) {
        alert(data.data.message.message)
        setStatus(false)
      } else {
        setViewerType('LOGIN')
        setTimeout(() => {
          ToastAndroid.show('Reset password link has been sent, please check your email.', ToastAndroid.LONG);
          setStatus(false)
        }, 1000);
      }
    })

  }
  const sendSMS = () => {
    if (mobile.length >= 11) {
      setStatus(true)
      setResend(false)
      sendSMSservice().then((data) => {
        setStatus(false)
        setOTPActive(true)
      })
    }
  }
  async function getProfileAccount(id) {
    console.log('ID', id)
    try {
      const response = await axios.post('/user/Loogy/profile', { "id": id });
      return response
    } catch (error) {
      const err = error as AxiosError
      console.log(err.response.data)
      alert('ERRPR')
    }
  }
  const loginEmailPassword = () => {
    setStatus(true)
    signInEmailPassword().then((data) => {
      if (data?.data.data === null) {
        setStatus(false)
        alert(data?.data.message.message)
      } else {
        let stringDate = JSON.stringify(data?.data)
        if (stringDate != undefined) {
          getProfileAccount(data?.data.data.id).then((driverDetails) => {
            setSuccess(true)
            console.log('driverDetails',driverDetails)
            ToastAndroid.show('Successfully login!', ToastAndroid.LONG);
            saveEntry(stringDate, '@userProfile').then(profile => {
              // PROFILE-SETUP
              console.log('profile',data?.data.data)
              console.log('Drivers profile',driverDetails)
              // var application_info = {
              //   application_info : 
              // }
              setLoginByEmailService(driverDetails?.data.data[0])
               setTimeout(() => {
                setUserByEmailAccountContext(data?.data.data)
                // setUserAccountContext(data?.data.data)
                setStatus(false)
                }, 3000);
                
            })
          })
        } else {
          setSuccess(false)
          Alert.alert(`Invalid Credentials`, `Please check your email/password`, [
            { text: "Okay, I'll try again", onPress: () => null },
          ], {
            cancelable: false,
          })
        }
      }
    })
  }
  const verifyOTP = (e) => {
    //   alert('Nice'
    setStatus(true)
    Keyboard.dismiss()
    verySMSService().then((data) => {
      setStatus(false)
      // setOTPActive(true)
    })
    //   setAllowVerify(true)
    // if (mobile.length >= 11) {
    //     setStatus(true)
    //     sendSMSservice().then( (data) =>{
    //     setStatus(false)
    //     setOTPActive(true)
    //     })
    // }
  }

  const didExpired = (e) => {
    console.log('eeeee')
    setResend(true)
  }
  const OTPContent = () => {
    return (<React.Fragment>
      <TouchableOpacity
        onPress={() => setOTPActive(false)}>
        {/* <Text 
   style={{
    color:'#0097e6',
    fontWeight:'bold',
    margin: 2,
    marginTop: 60,
    marginRight: 150,
    marginLeft: 20
  }}
  >Change Mobile</Text> */}
      </TouchableOpacity>
      <Text
        style={styles.h1}
      //   category="h3"
      //   style={{
      //   margin: 2,
      //   marginTop: 20,
      //   marginBottom: 20,
      //   marginRight: 150,
      //   marginLeft: 20,
      //   fontWeight:'bold'
      // }}
      >Enter the code</Text>
      <Text
        // style={styles.h1}
        category="p1"
        style={{
          margin: 2,
          marginTop: 20,
          marginBottom: 20,
          marginRight: 150,
          marginLeft: 20,
        }}
      >We sent the code to {mobile}</Text>
      <OTP
        codeCount={6}
        containerStyle={{ marginTop: 10 }}
        otpStyles={{ backgroundColor: '#eee' }}
      />
      {/* disabled={verifyAllow ? false : true}  */}
      <Button status="basic" onPress={() => verifyOTP()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20, marginBottom: 10, backgroundColor: verifyAllow ? 'gray' : 'black', borderColor: verifyAllow ? 'gray' : 'black' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{verifyAllow ? ' Verify' : 'Verify'}</Text>
      </Button>
      <TouchableOpacity disabled={!allowResend}>
        <View style={{ opacity: allowResend ? 1 : 0.2, borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20, marginBottom: 10, height: 60, flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Resend code</Text>
          <Counter allow={(e) => didExpired(e)} />
        </View>
      </TouchableOpacity>
    </React.Fragment>)
  }

  const signInMobile = () => {
    return (
      <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7XYgi5jLh7OdGuRCmnOqvJTEn0hKee7rWKrYQf_87-X7ayYrv0rqTLjZb9g8xJaMMtks&usqp=CAU' }} style={{ width: 25, height: 25, marginLeft: 20 }} />
        <Input
          label="Mobile Phone Number"
          onSubmitEditing={() => sendSMS()}
          keyboardType={"numeric"}
          placeholder="(+09 000 000 00)"
          maxLength={11}
          clearButtonMode="while-editing"
          returnKeyType="send"
          disabled={false ? true : false}
          style={{ width: '80%', marginRight: 20, marginLeft: 20 }}
          value={mobile}
          onChangeText={value => setMobile(value)}
        />
      </View>
    )
  }
  const updateDetails = (e, data) => {
    // setEmailPasswordLogin({password...:value})

    const newTodos = emailPassword;
    if (data === 'email') {
      setEmailPasswordLogin({
        email: e,
        password: newTodos.password
      })
    } else {
      setEmailPasswordLogin({
        email: newTodos.email,
        password: e
      })
    }
  }

  const rightContent = () => {
    return (
      <TouchableOpacity onPress={(value) => setPasswordSecure(!isPasswordSecure)}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        ><Image
            source={{ uri: !isPasswordSecure ? 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699007-icon-21-eye-hidden-512.png' : 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699007-icon-21-eye-hidden-512.png' }}
            style={{ width: isPasswordSecure ? 25 : 20, height: isPasswordSecure ? 25 : 20 }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const resetPasswordContent = () => {
    return (<React.Fragment>
      <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Input
          label="Registered Email"
          //  onSubmitEditing={() => sendSMS()}
          keyboardType={"email-address"}
          placeholder="Please type your email"
          clearButtonMode="while-editing"
          returnKeyType="send"
          style={{ width: '90%', marginRight: 20, marginLeft: 20, marginBottom: 20 }}
          value={emailPassword.email}
          onChangeText={value => updateDetails(value, 'email')}
        />
      </View>
      <Button status="basic" disabled={emailPassword.email.length < 4 ? true : false} onPress={() => sendMagicLink()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 40, marginBottom: 10, backgroundColor: emailPassword.email.length < 4 ? 'gray' : 'black', borderColor: emailPassword.email.length < 4 ? 'gray' : 'black' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5 }} category={'c2'}  >Reset Password</Text>
      </Button>
    </React.Fragment>
    )
  }
  const signinPassword = () => {
    return (<React.Fragment>
      <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Input
          label="Email"
          //  onSubmitEditing={() => sendSMS()}
          keyboardType={"email-address"}
          placeholder="Please type your email"
          clearButtonMode="while-editing"
          returnKeyType="send"
          style={{ width: '90%', marginRight: 20, marginLeft: 20, marginBottom: 20 }}
          value={emailPassword.email}
          onChangeText={value => updateDetails(value, 'email')}
        />
      </View>
      <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Input
          label="Password"
          accessoryRight={rightContent}
          onSubmitEditing={() => sendSMS()}
          placeholder="Type your password here"
          clearButtonMode="while-editing"
          returnKeyType="send"
          secureTextEntry={!isPasswordSecure ? true : false}
          style={{ width: '90%', marginRight: 20, marginLeft: 20 }}
          value={emailPassword.password}
          onChangeText={value => updateDetails(value, 'password')}
        />
      </View>
      <TouchableOpacity disabled={isAllowedLogin() ? false : true} onPress={() => setViewerType('RESET')}><Text style={{ marginLeft: 20, marginTop: 10 }}>Reset Password</Text></TouchableOpacity>
      <Button disabled={isAllowedLogin() ? false : true} status="primary" onPress={() => loginEmailPassword()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 40, marginBottom: 10, backgroundColor: emailPassword.password.length < 4 ? 'gray' : 'black', borderColor: emailPassword.password.length < 4 ? 'gray' : 'black' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5 }}>Continue as Password</Text>
      </Button>
    </React.Fragment>
    )
  }
  const isAllowedLogin = () => {
    if (emailPassword.password.length < 4 || emailPassword.email.length < 4) {
      return false
    } else {
      return true
    }
  }
  const showWarningError = () => {
    return (
      <Layout style={{ margin: 20, borderRadius: 5, backgroundColor: '#f7f1e3' }} level="1" >
        <View style={{ height: 2, width: '100%', backgroundColor: Colors.light.tint, borderRadius: 5 }} />
        <View status='basic' style={{ margin: 20 }}>
          <Text category="c1" style={{ fontWeight: 'bold', color: 'black' }}  >
            Note:
          </Text>
          <Text category="c1" style={{ marginTop: 5 }}   >
            5 attempt left, your account will be  <Text category="c1" style={{ fontWeight: 'bold', color: 'black' }}  >Lock Automaticaly</Text>
          </Text>
        </View>
      </Layout>
    )
  }
  const LoginContent = () => {
    return (
      <React.Fragment>
        <View style={{ height: 400, width: width, backgroundColor: 'white' }}>
          {viewerType === 'LOGIN' ? <React.Fragment>
            <Text style={styles.h1}>Login</Text>
            <Text style={styles.text}>Join our Loogy community!</Text>
          </React.Fragment> : <React.Fragment>
            <Text style={styles.h1}>Reset Password</Text>
            <Text style={styles.text}>Easy to reset your password</Text>
          </React.Fragment>}

          <View style={{ height: 25, width: 'auto', borderRadius: 25, alignItems: 'flex-start' }}>
            {viewerType === 'LOGIN' ? signinPassword() : resetPasswordContent()}
          </View>
        </View>
      </React.Fragment>
    )
  }
  const displayHeader = () => {
    return (
      <View style={{ backgroundColor: 'white' }}>
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
          <Image source={{ uri: 'https://images.unsplash.com/photo-1577075473292-5f62dfae5522?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340' }} style={styles.image} />
        </View>
      </View>
    )
  }
  return (<React.Fragment>
    {status ? <View style={{ marginTop: 120, bottom: 120, position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row', }}><ActivityIndicator size="small" color="#0000ff" /></View> : null}
    <FlatList
      data={[1]}

      style={{ backgroundColor: 'white', opacity: status ? 0.2 : 1 }}
      snapToStart={true}
      fadingEdgeLength={200}
      ListHeaderComponent={displayHeader()}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      renderItem={(item) => {
        return otpActive ? OTPContent() : LoginContent()
      }}
    />
    <View style={{ height: 30, width: 30, top: 60, position: 'absolute', alignSelf: 'flex-end', left: 20, marginBottom: 120, opacity: status ? 0.1 : 1 }} >
      <TouchableOpacity disabled={status} onPress={() => navigation.goBack()}>
        <View style={{ width: 30, height: 30, borderRadius: 50 / 2 }}><Image source={{ uri: 'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png' }} style={{ width: 30, height: 30 }} /></View>
      </TouchableOpacity>
    </View>
  </React.Fragment>)
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
    marginTop: 5,
    marginBottom: 40,
    marginRight: 150,
    marginLeft: 20
  },
  h1: {
    margin: 2,
    fontSize: 40,
    marginTop: 20,
    fontWeight: 'bold',
    marginRight: 100,
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