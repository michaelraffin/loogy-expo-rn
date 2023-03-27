import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Clipboard,Switch,ToastAndroid,BackHandler, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
// import Clipboard from '@react-native-clipboard/clipboard';
// import Clipboard from 'expo-clipboard';
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
import axios from 'axios';

export default  function BookingSummary({ route, navigation }){

  const { orderDetails} = route.params;
  console.log('orderDetails',orderDetails) 
  const [order, setOrderDetails] = useState(orderDetails);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, []);

  const showToast = () => {

    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  }
  const copyToClipboard = async (e) => {
    // try { showToast() }
    // catch{
    //   console.log('error')
    // }
    try {
      const data = await Clipboard.setString(e)
      
      // Clipboard.setString(order.referenceOrder)
      // await Clipboard.setStringAsync(e);
    }catch(error){
      console.log('ERROR',error)
      alert('Unable to copy')
    }
    
    };
function resetNavigation(){
  // navigation.navigate('My Orders', { screen: 'Order' });
  // navigation.navigate('Load', { screen: 'Service' });
  navigation.navigate('Home', { screen: 'DriverDashboard',params: { isRefresh:true} });
  
  // navigation.navigate({routeName:'Load'})
}
function EmptyState() {
    return (
      <Layout style={styles.layout} level="1">
        <View
          style={{
            height: 700,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop:40
          }}
        >
     <Image source={{ uri: 'https://cdn.dribbble.com/users/458522/screenshots/14324329/media/aede197c4afe820c2e5d93b9f7a8fef3.png?compress=1&resize=1600x1200'}} style={{ width:300,
          height:300}}/>
             <Text 
           style={{fontWeight:'bold',marginBottom:20}}
            category="h5"
          >Load has been Created!
          </Text>
          <TouchableOpacity onPress={()=> copyToClipboard(order.referenceOrder)}>
            <View style={{backgroundColor:'#dcdde1',marginBottom:20,borderRadius:40}}>
          <Text 
           style={{fontWeight:'bold',fontSize:40,marginLeft:10,marginRight:10,marginTop:5,marginBottom:5}}
            category="h1"
          >-{order.referenceOrder}-
          </Text></View>
          </TouchableOpacity>
          <View style={{alignContent:'center',alignItems:'center',justifyContent:'center'}}>
          <Text
           style={{marginTop:8,textAlign:'center'}}
           category="c1"
          >{`Your load was succesfully created.
Please view it in the Dashboard.`}
          </Text>
          </View>
          <View style={{marginTop:60}}><TouchableOpacity  onPress={()=>   resetNavigation() } ><Text style={{color:'#0984e3',fontWeight:'bold',fontSize:23}}>Dashboard</Text></TouchableOpacity></View>
        </View>
      </Layout>
    );
  }

return <React.Fragment>
          <ScrollView
        style={{
          backgroundColor: "white"
        }}
      >
        <Layout style={styles.container}> 
{EmptyState()}
        </Layout>
        </ScrollView>
        <StatusBar style={'dark-content'}/>
</React.Fragment>
} 


const stylesCart = StyleSheet.create({
    container: {
      marginTop: 10,
      marginBottom: 10,
      flex: 1,
      flexDirection: "row"
    },
    layoutAvatar: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start"
    },
    layout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start"
    }
  });
  
  const styles = StyleSheet.create({
    image: {
      width: 200,
      height: 200
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    text: {
      margin: 2
    },
    container: {
      marginTop: 60,
      backgroundColor: "white",
      flex: 1,
      flexDirection: "column"
    },
    radio: {
      margin: 2
    },
    layout: {
      backgroundColor: "white",
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  });