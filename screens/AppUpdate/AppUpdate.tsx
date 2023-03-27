import React ,{useState,PureComponent,useContext,useEffect,useRef} from 'react';
import { StyleSheet ,View,
  Alert,
  Platform,
  SafeAreaView,
  Dimensions,
  ScrollView, 
  Image,
  TouchableOpacity
} from 'react-native'; 
import Items from '../../components/Products/ProductList'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location"; 
import Modal from '../../components/Modal' 
import { useIsFocused } from '@react-navigation/native';
import { ApplicationProvider,Text,Layout ,Button,Divider,Input} from '@ui-kitten/components'; 
import {registerForPushNotificationsAsync} from '../Cart/Notification';  
// import Zeroconf from 'react-native-zeroconf'
import {
  saveEntry,
  getEntry,
  removeItem
} from "../../components/Utils/StoreDetails" 
import * as Linking from 'expo-linking';
// Notification
import * as Notifications from 'expo-notifications';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
// const zeroconf = new Zeroconf()
export default function AppUpdate({navigation,androidLink,iosLink,appForceContent}) {


async function getLocation() {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  return status  
} 
  const isFocused = useIsFocused();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [showButtonStatus, showButton] = useState(true);
  const settingsLinker = ()=> (
    Linking.openURL('app-settings://notification/com.raffin0000.Nidz')
  )
useEffect(() => { 

  
  // (async () => {
  // let token =  await registerForPushNotificationsAsync()
  // saveEntry(token,'userPushToken').then((status) => { 
  // }) 

  // })();


  // zeroconf.on('start', () => console.log('The scan has started.')) 
 }, [])
 

 const validatePlatform =()=>{
    if (Platform.OS === 'android') {
        Linking.openURL(androidLink)
    }else if (Platform.OS === 'ios'){
        Linking.openURL(iosLink)
    }
 }
 const shopContent = React.useMemo(()=> { 
  return    <SafeAreaView style={{backgroundColor:'white'}}>
 <Layout style={styles.layout} level="1">
        <View
          style={{
            height: 700,
            flex: 1,
            alignContent:'center',
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop:40
          }}
        ><TouchableOpacity >
            <View style={{backgroundColor:'white',marginBottom:20,borderRadius:40}}>
          <Text 
           style={{fontWeight:'bold',fontSize:40,marginLeft:10,marginRight:10,marginTop:5,marginBottom:5,textAlign:'center'}}
            category="h1"
          >{ appForceContent.title}
          </Text></View>
          </TouchableOpacity>
          <TouchableOpacity>
     <Image source={{ uri: appForceContent.imageUrl}} style={{ width:300,marginLeft:20,
          height:300}}/>
             <Text 
           style={{fontWeight:'bold',marginBottom:20,marginLeft:20,alignContent:'center',textAlign:'center'}}
            category="h6"
          >{appForceContent.subtitle}
          </Text>
          </TouchableOpacity>
          <View style={{marginTop:60,backgroundColor:'black',borderRadius:50}}><TouchableOpacity onPress={validatePlatform} ><Text style={{color:'white',fontWeight:'bold',fontSize:23,margin:10,marginLeft:20,marginRight:20}}>Update Now</Text></TouchableOpacity></View>
        </View>
      </Layout>
</SafeAreaView>  
},[])
return(
    <React.Fragment>
          <ScrollView
        style={{
          backgroundColor: "white"
        }}
      >
        <Layout style={styles.container}> 
{shopContent}
        </Layout>
        </ScrollView>
</React.Fragment>
)
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