import  React,{useEffect,useState,PureComponent}from 'react';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
import ThemeColor from '../../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../../components/Utils/StoreDetails'
import  moment from 'moment'
import Toast from 'react-native-toast-message'; 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {CheckMark} from '../../components/Svgs'
import {schedulePushNotification} from '../../screens/Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import {axios} from '../../components/Utils/ServiceCall'
var width = Dimensions.get('window').width; //full width
export default function SuccessPayment({ route,navigation }) { 
    const [list, setList] = React.useState([]);
  const { Details, updateCart } = cart() 
  const [isEnabled, setIsEnabled] = useState(false);
  const [index, setCurrentIndex] = useState(0);
  var empty =[]


  useEffect(() => {  
    setList([])
    fetchProduct().then ( item=>{
        setList(item.data.results)
    })
 
  }, [isEnabled])
 
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
async function fetchProduct() { 
    try {  
        // const response = await axios.post('/details/Store', {id:storeOwner}).catch((error)=>console.log(error))  

        const data =   {id:'Dried',queryType:"none",storeOwner:'storeOwner'  } 
        const response = await axios.post('/store/Talent', data)
      console.log(response.data)
       return  response
    }catch (error) { 
        alert('something went wrong')
      }
  }

  const copyToClipboard = () => { 
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


function getCurrentIndex(e){ 
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
        console.log(index)
    // console.log(e)
    setCurrentIndex(index)
    // const position = e.contentOffset; 
    // page index 
    // const index = Math.round(e.contentOffset.x / 500);
    // console.log(e.contentOffset)
}
  return (

    <View>
      
    <ScrollView style={{backgroundColor:'white'}}>
   
   
    <ScrollView 
       onMomentumScrollEnd={(event) => { 
        getCurrentIndex(event)
     }}
    scrollEventThrottle={16}
    pagingEnabled={true}
    snapToEnd={true}
    showsHorizontalScrollIndicator={false} 
    horizontal={true} style={{height:300,marginBottom:0}}>
         <Image  source={{uri:'https://scontent.fmnl4-2.fna.fbcdn.net/v/t1.6435-9/p960x960/176413761_1672830346261070_1675260094353220369_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=8bfeb9&_nc_eui2=AeEtBWtlgRTwWoWC9KA7tUUV72H85ijMcP7vYfzmKMxw_qFgvuGz9xY_ZtRl2hNBWxpwKXyyD3knj-xnZQQUe1px&_nc_ohc=BkHUV62QmFQAX-aOc3_&_nc_ht=scontent.fmnl4-2.fna&oh=545971c75fcd916c2f083bf219d0500f&oe=618789B7'}} style={{width:width,height:300}}/>

         <Image  source={{uri:'https://scontent.fmnl4-2.fna.fbcdn.net/v/t1.6435-9/217541196_6048056221885971_7720085261548045128_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=0debeb&_nc_eui2=AeGfFPdQdhsBxs-Sv9Lrq50SwAPCMwwlqMzAA8IzDCWozNpOdmnZBy92qk6eGNjKrbSKxGu0VIIDJQuR8UPt8Gbl&_nc_ohc=B5H2URTJPuIAX-ZLYb_&_nc_ht=scontent.fmnl4-2.fna&oh=e8fad7490f2f992997fbe05c176bbb44&oe=6189230C'}} style={{width:width,height:300}}/>

      
         <Image  source={{uri:'https://images.unsplash.com/photo-1609150883040-cfd45714ce10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2251&q=80'}} style={{width:400,height:300}}/>

    </ScrollView>
      
    <Image  source={{uri:'https://scontent.fmnl4-6.fna.fbcdn.net/v/t1.6435-9/218172800_6048054931886100_3782577587290369592_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=0debeb&_nc_eui2=AeEUxtoBORjjdjpDXDiadzrSRqR_OphgLDZGpH86mGAsNlKDMqrVJICdSGhEdOiXlxIJh5i5zll1-7KXg4M_dxpV&_nc_ohc=JTEOgpE3mGkAX8oYmoM&_nc_ht=scontent.fmnl4-6.fna&oh=0383e8e30fce7f21e80d72e513c16a81&oe=61871304'}} style={{width:width,height:300}}/>
  
    <Image  source={{uri:'https://scontent.fmnl4-2.fna.fbcdn.net/v/t1.6435-9/p960x960/176413761_1672830346261070_1675260094353220369_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=8bfeb9&_nc_eui2=AeEtBWtlgRTwWoWC9KA7tUUV72H85ijMcP7vYfzmKMxw_qFgvuGz9xY_ZtRl2hNBWxpwKXyyD3knj-xnZQQUe1px&_nc_ohc=BkHUV62QmFQAX-aOc3_&_nc_ht=scontent.fmnl4-2.fna&oh=545971c75fcd916c2f083bf219d0500f&oe=618789B7'}} style={{width:width,height:300}}/>

    <Image  source={{uri:'https://scontent.fmnl4-6.fna.fbcdn.net/v/t1.6435-9/214747810_6048055408552719_5903473691735276555_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=0debeb&_nc_eui2=AeGErM2KHbTfIoUKsT68WHDrEvhO1avG3vsS-E7Vq8be-zkcKcNmvk01DNbIf6tWbUjSwRwK9zhZh8xYOKfInqW3&_nc_ohc=Ot9kgm571ucAX8h7uil&_nc_ht=scontent.fmnl4-6.fna&oh=98c0dd0d0a639ccf7dacd80c794abd7c&oe=6188E8A2'}} style={{width:width,height:300}}/>
   
   
    
{/* <FlatList
data ={list}
keyboardDismissMode="on-drag"
showsVerticalScrollIndicator={false}
ListHeaderComponent={
<View 
style={{

    flexDirection:'row',
    height:30,
    borderRadius:10,
    margin:20,
    marginTop:60
  
}}
>
    <Text style={{marginLeft:20,marginTop:10}} category='h6' >Photographers</Text>
    <View style={{width:'50%',
       flexDirection:'row',
            alignItems:'flex-start',
            justifyContent:'flex-end'}}>
                 <Text style={{marginLeft:20,marginTop:10}} category='c1' >{isEnabled ? 'Rush' : 'Tomorrow' }</Text>
    <Switch
       trackColor={{ false: "#f4f3f4", true: "#ff7f50" }}
    onValueChange={toggleSwitch}
    value={isEnabled}
    style={{marginLeft:20}} onChange={(status)=>console.log(status.value)}/>
            </View>
</View>}
ListEmptyComponent={()=>{
  return(
<ActivityIndicator/>
  )
}}
renderItem={(item) =>{
    var data = item.item
    return(
        <TouchableOpacity
        >
        <View style={{
            flexDirection:'row',
              height:'auto',
              backgroundColor:'white',
              borderRadius:10,
              margin:20,    
              
          }}>
              <View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
                <Image  source={{uri:'https://cdn.dribbble.com/users/436757/screenshots/2415904/placeholder_shot_still_2x.gif?compress=1&resize=400x300'}} style={{width:'100%',height:80,marginLeft:20,marginTop:5}}/>
              </View>  
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10}} category='h6' >{data.name}</Text>
                <Text style={{marginLeft:20,marginTop:10}} category='p1' >{data.description.substring(0, 60)} ...</Text>
                <Text style={{marginLeft:20,marginTop:10}} category='c2'  >See more</Text>
              </View>    
          </View>
          
          </TouchableOpacity>
    )
} 
}
/> */}


  </ScrollView>
 

 <View onPress={() => navigation.goBack()} style={{ height: 50,width:59,position:'absolute', alignSelf:'flex-end',top:50,left:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{backgroundColor:'white',width:50,height:50,borderRadius:50/2}}>
                <Image  source={require('../../assets/images/left-arrow.png')} style={{width:20,height:20,marginLeft:13,marginTop:14}}/></View>
          </TouchableOpacity>
    </View>


    {/* <View onPress={() => navigation.goBack()} style={{ height: 50,width:'auto',position:'absolute', alignSelf:'flex-end',bottom:50,left:20}} >
          <TouchableOpacity >
            <View style={{backgroundColor:'white',opacity:0.9,width:'auto',height:50,borderRadius:50/2}}>
                <Text>{index} August 7, 1991</Text>
                </View>
          </TouchableOpacity>
    </View> */}



    <View onPress={() => navigation.goBack()} style={{ height: 50,width:59,position:'absolute', alignSelf:'flex-end',bottom:50,right:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{backgroundColor:'white',width:50,height:50,borderRadius:50/2}}>
                <Image  source={require('../../assets/images/left-arrow.png')} style={{width:20,height:20,marginLeft:16,marginTop:14,
                 transform: [{ rotate: '180deg'}]
                }}/></View>
          </TouchableOpacity>
    </View>

  </View>
  );



} 
const styles = StyleSheet.create({
    image: {
      borderRadius:400,
        width:400,
        height:350
      },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      margin: 2,
      marginTop:20,
      marginBottom:20
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
  