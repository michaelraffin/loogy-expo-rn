import  React,{useEffect,useState,PureComponent}from 'react';
import {ToastAndroid, StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../components/Utils/UserCart'; 
import {light} from '../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../components/Utils/StoreDetails'
import  moment from 'moment'
import Toast from 'react-native-toast-message'; 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {CheckMark} from '../components/Svgs'
import {schedulePushNotification} from '../screens/Cart/Notification';
export default function SuccessPayment({ route,navigation }) { 

  const { response} = route.params;
  const { Details, updateCart } = cart() 
  var empty =[]


  useEffect(() => {  
    saveReferenceOrder() 
  }, [])

async function saveReferenceOrder(){
  const status = await getEntry('orderReference')
    if (status === undefined || status === null) { 
     saveEntryHere()
    }else { 
      let appendList  = JSON.parse(status);  
      appendList.push(response.orderReference) 
      let list =  JSON.stringify(appendList); 
       saveEntry(list,'orderReference')
    }
    // response
    var data = {
      title:'You made it! Order Accepted!',
      body: 'Hey ' +response.deliveryDetails.SenderName+ '! Thank you for your order with the booking reference: '+response.orderReference + '.',
    }
    // response.orderReference,response.deliveryDetails.SenderName,moment(response.deliverySchedule.date).format('LL') 
    let notif =  await schedulePushNotification(data)
    console.log(notif)
}
const saveEntryHere = () => {
  let list  =  JSON.stringify([response.orderReference])
  saveEntry(list,'orderReference').then((status) => { 
    console.log('LOCAL STORAGE', status)
  }) 
  
} 

  const copyToClipboard = () => {
    Clipboard.setString(response.orderReference)
    // alert('s')
    
        // ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
  } 
 
    function navigateToPop() {
      deleteContent() 
      navigation.navigate('Shop', { screen: 'TabOneScreen' });
     
    }
    function deleteContent(){
      Details.cartItems = []
      Details.deliveryOption = {}
      Details.deliveryOption.consigneeDetails = null
      updateCart(Details)
      navigation.goBack()
    }
    function trackOrder() {
      deleteContent()
      navigation.navigate('Orders', { screen: 'Order' })
     
    }

    function checkMark() {
      return (
       <CheckMark/>
      )
    } 
    // console.log('welcome to success',response)
  return (
    <ApplicationProvider  {...eva} theme={eva.light}>  
    <ScrollView style={{backgroundColor:'white'}}> 
  <Layout style={styles.container}>
    <Layout style={styles.layout} level='4'>
     <View style={{height:height/2,alignContent:'center',justifyContent:'center',}}>
    
 <View style={{
        flex: 1,
        width: width,
        height:'auto', 
        justifyContent: 'center',
        alignItems: 'center',
      }}>
         <Image  source={require('../assets/images/waiting.gif')} style={styles.image}/>
     
           <Text style={styles.text} category='s1'> Thank you for your order.</Text>
     <Text style={{textAlign:'center',marginLeft:20,marginRight:20}} category='c1'>Please make payment on or before {moment(response.deliverySchedule.date).format('LL') } to process your order.</Text>
        </View>  
  
     
     </View>
     
    </Layout>
    <Divider/>
    <Layout style={styles.layout} level='1'>
    <View style={{height:130, flex: 1,
        justifyContent: 'center',
        alignItems: 'center',marginLeft:20,marginRight:20,marginTop:8}}>
 <TouchableOpacity  onPress={()=> copyToClipboard()}>

 <View style={{
        flex: 1,
        width: width,
        height:'auto', 
        justifyContent: 'center',
        alignItems: 'center',
      }}>

<Text category='c1'>Your reference order</Text>
   <Text style={styles.text} category='h1'>{response.orderReference}</Text>
<Text category="c1" style={{opacity:0.3}}>Tap to copy and paste on Track Orders.</Text>
        </View>
</TouchableOpacity>
    </View>
    </Layout>
    <Layout style={styles.layout} level='1'>
    <View style={{height:height/5,marginTop:20}}>
    <Button status="basic" onPress={()=>trackOrder() }   accessoryRight={checkMark}  style={{marginBottom:20}}>
      Track Order
    </Button>
    </View>
    <Text style={{marginTop:20}} category='c1'>Booking Date: {moment(new Date()).format('LLL')}</Text>
    </Layout>

  </Layout>
  </ScrollView> 
  </ApplicationProvider>
  );



} 
const styles = StyleSheet.create({
    image: {
      borderRadius:400,
        width:200,
        height:200
      },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      margin: 2,
    },
    container: {
        backgroundColor:'white',
        flex: 1,
        flexDirection: 'column',
      },
      layout: {

        backgroundColor:'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  });
  