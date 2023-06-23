import React, { Component ,useEffect,useState,useCallback,useContext} from 'react';
import { Alert, View,  Vibration, StyleSheet,TouchableOpacity,
  Image,
    Linking,
    Dimensions,
    LayoutAnimation,
    Button,
    StatusBar,
    SafeAreaView,   } from 'react-native'; 
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';  
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
  Spinner, 
  Text
} from "@ui-kitten/components";
import * as WebBrowser from 'expo-web-browser';
import { useIsFocused } from '@react-navigation/native';
import {MapMarker,Back,BackDark} from "../../components/Svgs"
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Tour1 from '../../screens/Tour1';
import {saveEntry2,getEntry,RemoveData} from '../../components/Utils/StoreDetails'
import { axios,axiosV2 } from '../../components/Utils/ServiceCall';
import { BookingContext } from '../../components/Context/UserBookingContext';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
export default function App({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); 
  const [newUser, setUser] = useState(true); 
  const isFocused = useIsFocused();
  const {setUserVehicle,getCurrentUser,getCurrentUserLocation} = useContext(BookingContext);


  useEffect(() => {
    (async () => {
      // RemoveData('@scanMessageLoad').then((data)=> {
      //   console.log(data)
      // })
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      console.log(status)
      setHasPermission(status === 'granted');
    })();
  }, []);
  getEntry('@scanMessageLoad').then((value) => {
    console.log('value',value)
    if (value != null || value !== undefined){
      setUser(false)
    }else{
      setUser(true)
    }
  })
  const handleBarCodeScanned = async({ type, data }) => {
    console.log('data scanned',data)

    var payload = {
      "queryType":"custom",
      "isAPI":true,
      "queryData":{"$or": 
    [
    {"referenceOrder": data},
    {"referenceOrder": data}
    ]}
    }
    try {
      let dynamicResult = data
        if (data.includes("https://tracker.loogy.co/")) {
        let pureCode = data.replace("https://tracker.loogy.co/", "")
        dynamicResult = pureCode
      } 

      navigation.goBack()
      let params = {referneceOrder: { item:dynamicResult},viewType:"camera"}
      navigation.navigate('LoadDetails',{screen:'LoadDetails',params:params})
    } catch (error) {
      
    }
    
    // navigation.goBack()
    setTimeout(() => {     
      // navigation.navigate('LoadDetails', { screen: 'LoadDetails',referneceOrder: { item:data} })
      // navigation.navigate('LoadDetails',{screen:'LoadDetails',params:{ referneceOrder: data,type:'isAPI',viewingFrom:'scanner' }})
    
    
      // navigation.navigate('LoadDetails', params: { referneceOrder: data,type:'isAPI' });
    }, 101)
    
  };

  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }
function validateView(){ 
const displayQRcode =   <BarCodeScanner

onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
style={StyleSheet.absoluteFillObject}
/>
return isFocused ? displayQRcode : null
} 
const storeData = async () => {
   
}
function didPressed() {
  saveEntry2('true','@scanMessageLoad').then((status) => { 
    setUser(false)
  })
}
const handlePress = useCallback(async () => {
  await Linking.openURL('app-settings:');
}, []);


function contentView() {
  return ( <View style={styles.container}>
          {validateView()} 
{scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned()} />}
</View>)
}

function unValidatedView() {
  return ( <View style={styles.container}>
    {/* <View onPress={() => navigation.goBack()} style={{ height: 50,width:200,position:'absolute', alignSelf:'flex-end',top:60,left:0,marginLeft:20}} >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{backgroundColor:'clear',width:50,height:50,borderRadius:50/2}}><Image  source={require('../../assets/images/left-arrow.png')} style={{width:20,height:20  }}/></View>
                </TouchableOpacity>
            </View> */}
            <Text >Please allow us to access Camera</Text>
        
               <TouchableOpacity onPress={()=>handlePress()}><Text category="c2" style={{color:'#00a8ff',marginTop:20}} >Allow here</Text></TouchableOpacity>
         
</View>)
}


function notice() {
  return <Tour1 didSkip={()=> navigation.goBack()} didContinue={()=>didPressed()}/>
  
}

function renderCamera() {
 return <React.Fragment>
        <StatusBar style={'dark'} />
        {hasPermission === null || hasPermission === false ?  unValidatedView() :  contentView() }
        <View  style={{ height: 30,width:30, top:50,position:'absolute', alignSelf:'flex-end',left:20}} >
              <TouchableOpacity  onPress={() => navigation.goBack()}>
                
                <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
                </TouchableOpacity>
                
            </View>
            <View style={{position:'absolute',top:height / 5.5,display:'flex',justifyContent:'center',alignItems:'center',width:width - 20,marginLeft:10,marginRight:10 }}>
                  <Text style={{color:'white',fontSize:48,fontWeight:'bold'}}>Scan QR Code</Text>
                  <Text style={{color:'white',fontSize:16}}>Scan the Booking QR Code created by loogy.</Text>
                  <View style={{width:width - 100 ,height:5,marginTop:50 ,backgroundColor:'#4834d4'}}/>
                  <View style={{width:width - 100 ,height:5,marginTop:height / 2.5 ,backgroundColor:'#4834d4'}}/>
                  </View>        
 </React.Fragment>
  
}

  return ( 
    <React.Fragment>
      {newUser ? notice() : renderCamera()} 
    </React.Fragment>
  
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 15,
      flexDirection: 'row',
    },
    url: {
      flex: 1,
    },
    urlText: {
      color: '#fff',
      fontSize: 20,
    },
    cancelButton: {
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 18,
    },
  }); 