import  React,{useEffect,useState,PureComponent,useRef}from 'react';
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
import {schedulePushNotification} from '../../screens/Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import {axios} from '../../components/Utils/ServiceCall'
export default function SuccessPayment({ route,navigation }) { 
    const [list, setList] = React.useState([]);
  const { Details, updateCart } = cart() 
  const [isEnabled, setIsEnabled] = useState(false);
  const [coordinates, setCoordinate] = useState(null);
  const [allowScroll, setScroll] = useState(false);
  const [category, setCategory] = useState('Rental');
  const scrollViewRef = useRef();
  var empty =[]


  useEffect(() => {  

    (async () => {

      setList([])
      fetchProduct().then ( item=>{
          setList(item.data.results)
      })
   
      getLocation() .then ( status => {
      console.log(status)
    })
   
    let location = await Location.getCurrentPositionAsync({});
      setCoordinate(location)
  })();
  }, [isEnabled,category])
 




async function getLocation() {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  return status  
} 


  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
async function fetchProduct() { 
  var type = category === 'Suppliers' ? 'Merchant' : category
    try {  
        // const response = await axios.post('/details/Store', {id:storeOwner}).catch((error)=>console.log(error))  

        const data =   {id:'Dried',queryType:"none",storeOwner:'storeOwner' ,isAPI:false } 
        const response = await axios.post(`/store/${type}`, data)
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



   function searchNow(){
    setScroll(!allowScroll)

   } 
  return (

    <>
    <ScrollView
     style={{backgroundColor:'white'}} scrollEnabled={allowScroll}>
      <View >
        <ImageBackground source={{uri:'https://images.unsplash.com/photo-1429087969512-1e85aab2683d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80'}}
     style={{width:'100%',height:height}}>
       <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
       <Text style={{marginLeft:20,color:'white'}}  category='h1' >Tell us your event.</Text>
        
       </View>
     </ImageBackground>
     
     </View>
         
    <TouchableOpacity>
    <TextInput  style={{
              marginTop:120,
              margin:20}}placeholder="Search here"/>
      <View style={{
            
            flexDirection:'row',
              height:90,
              backgroundColor:'#ecf0f1',
              borderRadius:10,
              margin:20,
              
              
              
          }}>
              <View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
                <Image  source={{uri:'https://cdn-icons-png.flaticon.com/512/711/711191.png'}} style={{width:'100%',height:80,marginLeft:20,marginTop:5}}/>
              </View>  
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10}} category='p1' >Photographers  and Videographers</Text>
                <Text style={{marginLeft:20,marginTop:10}} category='c2' >See more</Text>
              </View>    
          </View>
          </TouchableOpacity>



<FlatList
data ={list}
style={{marginBottom:80}}
keyboardDismissMode="on-drag"
showsVerticalScrollIndicator={false}
ListHeaderComponent={
<View 
style={{
    flexDirection:'row',
    height:30,
    borderRadius:10,
    margin:20,
  
}}
>
    <Text style={{marginLeft:20,marginTop:10,fontWeight:'bold'}} category='h6' >{category}</Text>
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
        onPress={()=> navigation.navigate('PartnerDetails',{productID:data}) }
        >
        <View style={{
            flexDirection:'row',
              height:'auto',
              backgroundColor:'white',
              borderRadius:10,
              margin:20,    
              
          }}><View style={{backgroundColor:'white'}}><Text style={{fontWeight:'bold',borderRadius:20,margin:2,padding:2,color:'white',position:'absolute',top:10,backgroundColor:'#e74c3c'}} category='c2'  >Promo</Text></View>
              <View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
            
                <Image  source={{uri:'https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png'}} style={{width:'50%',height:50,marginLeft:20,marginTop:5,opacity:0.2}}/>
              </View>  
              
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'700'}} category='h6' >{data.name !== undefined ? data.name : data.serviceName}</Text>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'bold'}} category='c2'  >Price Start: ₱ 900.00</Text>
               <View style={{backgroundColor:'white'}}><Text style={{marginLeft:20,marginTop:10,fontWeight:'bold',color:'#6ab04c'}} category='c2'  >Popular</Text></View>
              </View>    
          </View> 
          </TouchableOpacity>
    )
} 
}
/>

<FlatList
data ={list}
style={{marginBottom:80}}
keyboardDismissMode="on-drag"
showsVerticalScrollIndicator={false}
ListHeaderComponent={
<View 
style={{
    flexDirection:'row',
    height:30,
    borderRadius:10,
    margin:20,
  
}}
>

<Text style={{marginLeft:20,marginTop:10,fontWeight:'bold'}} category='h6' >Open relocation</Text>
<View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
            
                <Image  source={{uri:'https://cdn.dribbble.com/users/5366043/screenshots/14516455/media/8ca4f1db025d9b7ce1b0aa01a325b548.jpg?compress=1&resize=1600x1200'}} style={{width:'100%',height:90,marginLeft:20,marginTop:5}}/>
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
        onPress={()=> navigation.navigate('PartnerDetails',{productID:data}) }
        >
        <View style={{
            flexDirection:'row',
              height:'auto',
              backgroundColor:'white',
              borderRadius:10,
              margin:20,    
              
          }}><View style={{backgroundColor:'white'}}><Text style={{fontWeight:'bold',borderRadius:20,margin:2,padding:2,color:'white',position:'absolute',top:10,backgroundColor:'#e74c3c'}} category='c2'  >Promo</Text></View>
              <View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
            
                <Image  source={{uri:'https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png'}} style={{width:'50%',height:50,marginLeft:20,marginTop:5,opacity:0.2}}/>
              </View>  
              
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'700',marginRight:20}} category='h6' >{data.name}</Text>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'bold'}} category='c2'  >Price Start: ₱ {data.priceStart}</Text>
               <View style={{backgroundColor:'white'}}><Text style={{marginLeft:20,marginTop:10,fontWeight:'bold',color:'#6ab04c'}} category='c2'  >Popular</Text></View>
               <Image  source={{uri:'https://cdn-icons-png.flaticon.com/512/74/74392.png'}} style={{width:30,height:30,position:'absolute',right:0,top:10}}/>   
              </View> 
              
          </View> 
          </TouchableOpacity>
    )
} 
}
/>
  </ScrollView>


{allowScroll ?  null : <View onPress={() => console.log('')} style={{ height: 40,position:'absolute', alignSelf:'flex-end',bottom:40}} >
          <TouchableOpacity onPress={() => searchNow()}>
        
            <View style={{backgroundColor:'white',width:width-40,marginLeft:20,marginRight:20,height:50,borderRadius:50/2}}>

            <View 
style={{

    flexDirection:'row',
    height:30, 
    borderRadius:10,
    margin:20,
  
}}
>
    <Text style={{marginLeft:20,marginTop:0,color:'#30336b'}} category='c2' ></Text>
    <View style={{width:'100%',
       flexDirection:'row',
      
            justifyContent:'flex-end'}}>
                 <Text style={{marginTop:0, marginRight:20,color:'#30336b'}}  category='c2' >Continue to Discover</Text>
            </View>
</View>
        
              </View>
            
          </TouchableOpacity>
        </View>}
  
        
   <View onPress={() => console.log('')} style={{ height: 50,position:'absolute',backgroundColor:'white',width:width,justifyContent:'center', flexDirection:'row', alignSelf:'auto', alignContent:'center',bottom:allowScroll ? 0:100}} >
   <TouchableOpacity onPress={() => setCategory('Suppliers')}><View style={{backgroundColor:category === 'Suppliers'?'#30336b'  : 'white', marginTop:10,width:60,marginLeft:10,marginRight:10,height:25,borderRadius:50/2,justifyContent:'center',alignContent:'center',}}><Text style={{marginLeft:10,marginTop:0,color:category === 'Suppliers'?'white' : '#30336b'}} category='c2' >Suppliers</Text></View></TouchableOpacity>
    <TouchableOpacity onPress={() => setCategory('Rental')} ><View style={{backgroundColor:category === 'Rental'?'#30336b'  : 'white', marginTop:10,width:50,marginLeft:10,marginRight:10,height:25,borderRadius:50/2,justifyContent:'center',alignContent:'center',}}><Text style={{marginLeft:10,marginTop:0,color: category === 'Rental'?'white' : '#30336b'}} category='c2' >Rental</Text></View></TouchableOpacity>
   <TouchableOpacity onPress={() => setCategory('Talent')}><View style={{backgroundColor:category === 'Talent'?'#30336b'  : 'white', marginTop:10,width:50,marginLeft:10,marginRight:10,height:25,borderRadius:50/2,justifyContent:'center',alignContent:'center',}}><Text style={{marginLeft:10,marginTop:0,color:category === 'Talent'?'white' : '#30336b'}} category='c2' >Talents</Text></View></TouchableOpacity>
  </View>
  {/* <View onPress={() => console.log('')} style={{ height: 40,position:'absolute', alignSelf:'flex-end',bottom:allowScroll ? 40:100}} >
          <TouchableOpacity onPress={() => searchNow()}>
        
        
            <View style={{backgroundColor:'#30336b',width:width-40,marginLeft:20,marginRight:20,height:50,borderRadius:50/2}}>

            <View 
style={{

    flexDirection:'row',
    height:30, 
    borderRadius:10,
    margin:20,
  
}}
>
    <Text style={{marginLeft:20,marginTop:0,color:'white'}} category='c2' >Event type</Text>
    <View style={{width:'70%',
       flexDirection:'row',
            alignItems:'flex-start',
            justifyContent:'flex-end'}}>
                 <Text style={{marginLeft:0,marginTop:0,color:'white'}}  category='c2' >Date: 12/23/21</Text>
            </View>
</View>

              
            <View style={{flex:0,width:'100%'}}>
                
                <Text style={{marginLeft:20,marginTop:0}} category='p1' >Event Type</Text>
                <Text style={{marginLeft:20,marginTop:0}} category='c2'  >When?</Text>
              </View>  
        
              </View>
            
          </TouchableOpacity>
        </View> */}
  </>
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
  