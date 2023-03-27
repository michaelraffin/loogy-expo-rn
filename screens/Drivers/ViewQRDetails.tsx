import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Alert,Switch,ToastAndroid,SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
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
import {LoginRequired} from '../../components/Errors/LoginRequired'
import CardJourney from '../../components/Journey/Card'
import MapView, { Marker } from "react-native-maps"; 
export default  function Dashboard({ route, navigation }){
    console.log('QRCODE DETAILS',route.params.referenceOrder.item)
const validateQRDetails = ()=>{
    try {
        return route.params.referenceOrder.item.item.referenceOrder
    } catch (error) {
        return 'route.params.referenceOrder'
    }
}
function currencyFormat(num) {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
console.log('validateQRDetails()',validateQRDetails())
    return <>
    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',height:height + 40}}>
        <Text category='h5' style={{fontWeight:'bold'}}>Place your QR Code Scanner</Text>
        <Text category='p1' style={{marginTop:10,marginBottom:20}}>Share this QR code to your preferred Carrier</Text>
        <TouchableOpacity>
            <View style={{backgroundColor:'white',elevation:0.2,borderRadius:10}}>
            <View style={{margin:20}}>
        <QRCode
        
      size={height / 4}
        logo={{uri: "https://localflowershop.sgp1.digitaloceanspaces.com/product/1651903967051-512.png"}}
      value={validateQRDetails()}
    />
    </View>
    </View>
    <Text  category="h5" style={{fontWeight:'bold',marginLeft:'20%',marginTop:20}}>
             {true ? Platform.OS === 'android' ? currencyFormat(Number(route.params.referenceOrder.item.item.offeredPrice)) : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(haulDetails.item.offeredPrice)) : '0.00'}
            </Text>
    </TouchableOpacity>
            <Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
            
            <View status='basic' style={{margin:20}}>
            <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
            Note:
            </Text>
            <Text    category="c1"style={{marginTop:5}}   >
            Only <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >Drivers</Text> can accept this load. Customers and Company can only view this item.
            </Text>
            </View>  
        </Layout>
    </View>
    <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity:1}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
    </>
}