import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Switch,ToastAndroid,SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Tooltip,Button,Divider,Input,Toggle} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
import ThemeColor from '../../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../../components/Utils/StoreDetails'
import  moment from 'moment'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location"; 
import DateTimePicker from '@react-native-community/datetimepicker';
import QRCode from 'react-native-qrcode-svg';
// import styles from '../../components/Journey/cardStyles'
// import Toast from 'react-native-toast-message'; 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {CheckMark,SmallArrow} from '../../components/Svgs'
import {schedulePushNotification} from '../Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg,{Circle,Path,Line,Polyline,Rect} from "react-native-svg"
import Store from  '../../components/Context/MapContext'
import {MapContext} from '../../components/Context/MapContext'
import DashedLine from 'react-native-dashed-line'; 
import {BookingContext} from  '../../components/Context/UserBookingContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import Toast from 'react-native-simple-toast';
import io  from "socket.io-client"
import {LoginRequired} from '../../components/Errors/LoginRequired'

export default  function Card(props){
    const displayDescription = (e) =>{
        try {
       return e.substring(0, 20)
       } catch (error) {
           return ""
       }
   }
   const _handlePress = (e) => { 
  //  .departDetails.coordinates
  // q=" + latLng.latitude + "," + latLng.longitude +
   //  Linking.openURL(`https://waze.com/ul?ll=${e[1]},${e[0]}&navigate=yes`);
  //  Linking.openURL(`https://waze.com/ul?ll=${e[1]},${e[0]}&navigate=yes`);


  // return <NavigationSheet/>
//  Linking.openURL(`http://maps.apple.com/?saddr=${e.arrivalDetails.coordinates[1]},${e.arrivalDetails.coordinates[0]}&daddr=${e.departDetails.coordinates[1]},${e.departDetails.coordinates[0]}&z=10&t=s`);


  //  Linking.openURL(`http://maps.apple.com/?ll=${e.arrivalDetails.coordinates[1]},${e.arrivalDetails.coordinates[0]}`);
 
  // Link
   };
   const loadDepartDetails = (e) => {
    try {
        return e[0].depart.substring(0, 20);
    } catch (error) {
        return 'Empty';
    }
};

    const displayNumberJourney = ()=>{
      return(

<TouchableOpacity style={{ zIndex: 1 }}>
							<View
								style={{
									backgroundColor: 'white',
									height: 25,
									width: 25,
									position: 'absolute',
									right: -10,
									top: 30,
									zIndex: 1,
									borderRadius: 25,
									alignItems: 'center'
								}}
							><View style={props.badgeStyle}>
                  <Text style={{color:'#353b48',fontWeight:'bold'}} >{props.details.trips.length}</Text>
								</View>
							</View>
              </TouchableOpacity>
      )
    }
    function currencyFormat(num) {
      try {
        if (num.selectedVehicle.priceRange != null) {
          return '₱' + num.selectedVehicle.priceRange.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') 
        }
        return "No amount delacred " 
      }catch {
        return "No amount delacred "
      }
 
    }
    
    const journey =(e)=>{
        var data = e
        console.log('displayItems',props.journey)
        try {
          return ( <TouchableOpacity onPress={()=>	props.didView(props.details.referenceOrder)}  activeOpacity={1}>
            <React.Fragment>
            <View style={{backgroundColor:'white',borderColor:'white',borderWidth:0.5,borderRadius:10,margin:10,marginRight:30,marginLeft:30,elevation: 2}}>
         <View style={{backgroundColor:'#6ab04c',height:10,width:10,position:'absolute',left:16,top:55, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
        <View style={{backgroundColor:'#C4E538',height:'25%',width:1,position:'absolute',left:20,top:25+39, opacity:1,    borderWidth: 1,borderRadius:1,zIndex:1,elevation: 1,}}/>
        <View style={{backgroundColor:'black',height:10,width:10,position:'absolute',left:16,top:Platform.OS === 'android' ? 59+32 : 100, borderRadius: 1,alignItems:'center',zIndex:4,}}/>
      <View> 
    <Text category="h4" style={{fontWeight:'bold',marginLeft:15,marginTop:5}}>{currencyFormat(props.details)}</Text>
    <View style={{position:'absolute',top:10,right:20}}><TouchableOpacity><Text category="c2" style={{color:'#0652DD',fontWeight:'bold',marginLeft:5,marginRight:5}}>{props.details.referenceOrder}</Text></TouchableOpacity>
    <Image
										source={{
											uri:
												'https://cdn.iconscout.com/icon/free/png-256/forward-1767505-1502572.png'
										}}
										style={{
                      position:'absolute',
											width: 20,
											height: 20,
                      top:-3,
                      right:-20,
                      opacity:0.5
										}}
									/>
    </View>
  </View>
  {props.details.trips.length === 1 ? null :displayNumberJourney()}
  <Divider/>
         <Layout style={styles.containerMultiDate} level='1'>
           <TouchableOpacity    onPress={()=>_handlePress(data)}  style={styles.input} >
             <Text category='c1' style={{
               flex: 1,
               margin: 2,
               marginLeft:11,
              //  fontWeight:'bold',
               color:'#747d8c'
             }}>{displayDescription(data.depart)}...</Text>
             </TouchableOpacity>
             <TouchableOpacity  style={styles.inputRoundTripTouchable} >
                 <Text
                  category='c1'
                 style={{
               flex: 1,
               margin: 2,
               color:'#747d8c',
               marginLeft:11,
             }}>{data.selectedDate}</Text>
             </TouchableOpacity>
           </Layout> 
           <Layout style={styles.containerContent} level='1'>
           <TouchableOpacity   onPress={()=>_handlePress(data.arrivalDetails.coordinates)}  style={styles.input} >
             <Text  
             category='c1'
              style={{
               flex: 1,
               margin: 2,
               marginLeft:11,
               color:'#747d8c'
             }}>{displayDescription(data.arrival)}...</Text>
{/* <Text>DSadsa</Text> */}
             </TouchableOpacity>
             <TouchableOpacity disabled={undefined === null ? true:false}  style={styles.inputRoundTripTouchable} >
                 <Text
                  category='c1'
                 style={{
               flex: 1,
               margin: 2,
               color:'#747d8c',
               marginLeft:11,
              //  fontWeight:'bold'
             }}>
              {props.details.loadType === 'One-Way' ?'' : data.returnedDate}
              </Text>
             </TouchableOpacity>
           </Layout>
           </View>
           </React.Fragment></TouchableOpacity>)
        }catch(error){
            console.log('error CARD2', error)
          return ( <TouchableOpacity  activeOpacity={1}>
            <React.Fragment>
                    <View style={{backgroundColor:'white',borderColor:'white',borderWidth:0.5,borderRadius:10,margin:10,marginRight:30,marginLeft:30,elevation: 2}}>
           <View style={{backgroundColor:'#6ab04c',height:10,width:10,position:'absolute',left:16,top:20, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
          <View style={{backgroundColor:'#C4E538',height:'40%',width:1,position:'absolute',left:20,top:30, opacity:1,    borderWidth: 1,borderRadius:1,zIndex:1,elevation: 1,}}/>
          <View style={{backgroundColor:'black',height:10,width:10,position:'absolute',left:16,top:59, borderRadius: 1,alignItems:'center',zIndex:4,}}/>
         <Layout style={styles.containerMultiDate} level='1'>
           <TouchableOpacity    onPress={()=>_handlePress(data.departDetails.coordinates)}  style={styles.input} >
             <Text
            category='c1'
              style={{
               flex: 1,
               margin: 2,
               marginLeft:11,
              //  fontWeight:'bold',
               color:'#747d8c'
             }}>{displayDescription(data.depart)}...</Text>
             </TouchableOpacity>
             <TouchableOpacity  style={styles.inputRoundTripTouchable} >
                 <Text   category='c1' style={{
               flex: 1,
               margin: 2,
               color:'#747d8c',
               marginLeft:11,
              //  fontWeight:'bold'
             }}>
                ERROR
              {/* {moment(data.selectedDate,'MMMM DDD YYYY, h:mm:ss A').toDateString()} */}
              {data.selectedDate}</Text>
             </TouchableOpacity>
           </Layout> 
           <Layout style={styles.containerContent} level='1'>
           <TouchableOpacity   onPress={()=>_handlePress(data.arrivalDetails.coordinates)}  style={styles.input} >
             <Text
                 category='c1'
              style={{
               flex: 1,
               margin: 2,
               marginLeft:11,
              //  fontWeight:'bold',
               color:'#747d8c'
             }}>{displayDescription(data.arrival)}...</Text>
             </TouchableOpacity>
             <TouchableOpacity disabled={undefined === null ? true:false}  style={styles.inputRoundTripTouchable} >
                 <Text  category='c1' 
                 style={{
               flex: 1,
               margin: 2,
               color:'#747d8c',
               marginLeft:11,
              //  fontWeight:'bold'
             }}>
              {props.details != undefined ? props.details.loadType === "One-Way" ? '':data.returnedDate :''}
              </Text>
             </TouchableOpacity>
           </Layout>
           </View>
           </React.Fragment></TouchableOpacity>)
        }
        }
    return  journey(props.journey)
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
      height:50
    },
    containerContent: {
      marginTop: -20,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, 
      marginBottom: 12,
      height:20
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
  