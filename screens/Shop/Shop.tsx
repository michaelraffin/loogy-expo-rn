import React ,{useState,PureComponent,useContext,useEffect,useRef} from 'react';
import { StyleSheet ,Text,View,
  Alert,
  Linking} from 'react-native'; 
import Items from '../../components/Products/ProductList'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location"; 
import Modal from '../../components/Modal' 
import { useIsFocused } from '@react-navigation/native';
import {registerForPushNotificationsAsync} from '../Cart/Notification';  
import Zeroconf from 'react-native-zeroconf'
import {
  saveEntry,
  getEntry,
  removeItem
} from "../../components/Utils/StoreDetails" 

// Notification
import * as Notifications from 'expo-notifications';


const zeroconf = new Zeroconf()
export default function Shop({navigation}) {


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

  
  (async () => {
  let token =  await registerForPushNotificationsAsync()
  console.log("xxxxx",token)
  // .then(token =>console.log(token))
  // setExpoPushToken(token)
  saveEntry(token,'userPushToken').then((status) => { 
  }) 

  })();


  zeroconf.on('start', () => console.log('The scan has started.')) 
 }, [])
 


 const shopContent = React.useMemo(()=> { 
  return  <Items navigation={navigation} modalContent={(e)=>console.log(e)}/>   
},[])
return(
    <React.Fragment> 
     <View style={styles.container}>
       {shopContent}
     </View> 
  </React.Fragment>
)
} 

const styles = StyleSheet.create({
  container: { 
      backgroundColor:'white',
    flex: 1, 
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
