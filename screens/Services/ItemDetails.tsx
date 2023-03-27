import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input} from '@ui-kitten/components'; 
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
// import {MapBox} from '../../components/Utils/ServiceCall'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import axios from 'axios';


export default  function BookingSummary({ route, navigation }){
    return (
    <ScrollView  style={{ backgroundColor: 'white' }}>
           <Image source={{ uri: 'https://cdn.dribbble.com/users/458522/screenshots/14324329/media/aede197c4afe820c2e5d93b9f7a8fef3.png?compress=1&resize=1600x1200' }} style={styles.image} />
           {/* <Text style={styles.text} category='h1'>Details</Text> */}

           <Text style={styles.text} category='h1'>ID-5102d-X</Text>
           <Text style={{marginTop:2,marginLeft:20,color:'gray',fontWeight:'bold'}} category='h6'>Order number</Text>
           <Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
            <View style={{height:2,width:'100%',backgroundColor:Colors.light.tint,borderRadius:5}}/> 
                <View status='basic' style={{margin:20}}>

                <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
                Note:
                </Text>
                <Text    category="c1"style={{marginTop:5}}   >
                To process your order, please upload  <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >proof of payment</Text> in Orders Tab.
                </Text>
                </View>  
           </Layout> 


           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Journey Details</Text>
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Transportation</Text>

       <Button  status="basic"    style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'selectedVehicle' === null ?'#dcdde1' :  'black', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Place Order</Text>
    </Button>
    <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
        
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            
          </TouchableOpacity>
        </View>
        </ScrollView>
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
      marginLeft:11
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
  });
  