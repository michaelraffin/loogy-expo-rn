import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
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
import DashedLine from 'react-native-dashed-line'; 
import {BookingContext}from  '../../components/Context/UserBookingContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import axios from 'axios';
 
export default  function BookingSummary({ route, navigation }){


  const [items, setItems] = useState([1,2,3,4,5]);
  const {setUserVehicle} = useContext(BookingContext);
  function currencyFormat(num) {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  const displayItems=(e)=>{
  const content = [<View/>]
  
  e.map((data, index) => {
    
    content.push(
      <React.Fragment>
      <View style={{backgroundColor:'white',borderColor:'white',borderWidth:0.5,borderRadius:10,margin:10,marginRight:30,marginLeft:30,elevation: 2}}>
       <View style={{backgroundColor:'black',height:10,width:10,position:'absolute',left:16,top:15, borderRadius: 10,alignItems:'center',zIndex:4,}}/>
      <View style={{backgroundColor:'#C4E538',height:'40%',width:1,position:'absolute',left:20,top:25, opacity:1,    borderWidth: 1,borderRadius:1,zIndex:1,elevation: 1,}}/>
      <View style={{backgroundColor:'#dcdde1',height:10,width:10,position:'absolute',left:16,top:59, borderRadius: 10,alignItems:'center',zIndex:4,}}/>


     <View style={{backgroundColor:'black',height:25,width:25,position:'absolute',right:-4,top:-12, borderRadius: 25,alignItems:'center'}}><Text style={{fontWeight:'bold',color:'white',marginTop:3}}>{(index + 1)}</Text></View>
<Layout style={styles.containerMultiDate} level='1'>
  <TouchableOpacity   style={styles.input} >
    <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold',
      color:'#747d8c'
    }}>Pickup From</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={undefined === null ? true:false}  style={styles.inputRoundTripTouchable} >
        <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold'
    }}>{data.departDetails.address.substring(0, 20)}</Text>
    </TouchableOpacity>
  </Layout>
  
  <Layout style={styles.containerContent} level='1'>
    {/* <View style={{backgroundColor:'#A3CB38',height:,width:2,position:'absolute',left:5,top:-60,borderStyle:'dotted', opacity:0.5,    borderWidth: 1,
    borderRadius:1}}/> */}
  <TouchableOpacity   style={styles.input} >
    <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold',
      color:'#747d8c'
    }}>Delivery To</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={undefined === null ? true:false}  style={styles.inputRoundTripTouchable} >
        <Text style={{
      flex: 1,
      margin: 2,
      marginLeft:11,
      fontWeight:'bold'
    }}>{data.arrivalDetails.address.substring(0, 20)}</Text>
    </TouchableOpacity>
  </Layout>
  </View>
  {/* <View style={{height:2,width:30,backgroundColor:'gray',marginLeft:'10%',borderWidth:2,borderRadius:20}}/> */}
  </React.Fragment>
   
    )
  })
  return content
  }

  function EmptyState() {
    return (
      <Layout style={styles.layout} level="1">
        <View
          style={{
            height: 400,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop:80
          }}
        >
     <Image source={{ uri: 'https://cdn.dribbble.com/users/2058104/screenshots/4198771/dribbble.jpg?compress=1&resize=800x600'}} style={{ width:300,
          height:250}}/>

        <Text 
            // onChangeText={nextValue => setMobile(nextValue)} 
            category="h5"
          > Not found
          </Text>
          <Button style={{marginTop:20,backgroundColor:'#f8c291',borderColor:'#f8c291'}} onPress={()=> resultType('LANDING')}>Search again</Button>
        </View>
      </Layout>
    );
  }
  const displayVehicleType = (data) => {
    // const data = {id:5,
    //   name:"Semi-Trailer Trucks",
    //   description:"Also called 18-wheelers, big rigs, or tractor-trailers, they are popular fleet trucks that come in many different shapes and sizes.",
    //   imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrwgn9l_tSsrnRbXEmaKRtteX9Y1-nCExuUut14ihWzGBrKQznE-I9creJlsX9zei06-w&usqp=CAU",
    //   priceRange:16000,
    // }
    return (
      <TouchableOpacity
        // onPress={()=> setVehicle(data.id) }
        >
        <View style={{
            flexDirection:'row',
              height:'auto',
              borderRadius:20,
              margin:20,
              // borderWidth:data.id === selectedVehicle ? 1.5:0
         
          }}>
          <View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
            
                <Image    resizeMode='contain' source={{uri:data.imageUrl}} style={{width:'100%',height:100,marginLeft:20}}/>
              </View>  
           
              
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'700'}} category='h6' >{data.name !== undefined ? data.name : data.name}</Text>
                <Text style={{marginLeft:20,marginTop:10,marginRight:20}} category='c1'  >{'data.id '=== 'selectedVehicle'  ? data.description.substring(0, 20)  :data.description }</Text> 
              
              </View>    
          </View> 
          </TouchableOpacity>
    )
  }
  const displayFooter = (price) => {
    return (
      <React.Fragment>
    <View style={{backgroundColor:'white',height:40}}> 
          <Layout style={styles.container} level="1">
            <Text style={styles.subTotal} category="h6">
              Total (Price may vary)
            </Text>
            <Text style={styles.subTotalItem} category="c1">
             {true ? Platform.OS === 'android' ? currencyFormat(price.priceRange) : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format((price.priceRange) ) : '0.00'}
            </Text>
          </Layout> 
     
          </View>



{/* //ORDER TRACKING */}
          {/* <Divider/> 

          <View > 
     <Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
     
            <View status='basic' style={{margin:20}}>
            <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
            Note:
            </Text>
             <Text    category="c1"style={{marginTop:5}}   >
             To process your order, please upload  <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >proof of payment</Text> in Orders Tab.
            </Text>
             </View>  
          </Layout> 
          </View> */}

{/* //ORDER TRACKING */}


        </React.Fragment>
    )
  }
    return (
      <React.Fragment>
          <BookingContext.Consumer> 
    {items =>
    <ScrollView  style={{ backgroundColor: 'white' }}> 
      <View style={{marginTop:100}}/>


           {/* <Text style={styles.text} category='h1'>Booking Summary</Text> */}

{/* //ORDER TRACKING */}
           <Text style={styles.text} category='h1'>L-10XAlX</Text> 
           <Text style={{ margin: 2,
      marginTop: 5,
      fontWeight: 'bold',
      marginRight: 150,
      marginLeft: 20,color:'#7f8fa6'}} category='c2'>Order Number</Text>

<Layout style={styles.layout} level='1'>
            <View style={{height:200, flex: 1,
                justifyContent: 'center',
                alignItems: 'center',marginLeft:20,marginRight:20}}>
                    <Image source={{ uri: 'https://miro.medium.com/max/1198/1*5W7LEp3QLiQjC2K0lPBUKw.gif'}} style={{ width:400,
        height:200}}/> 
            </View>
            <View style={{height:10, flex: 1,
                justifyContent: 'center',
                alignItems: 'center',marginLeft:20,marginRight:20}}>
                  <Text  category='c3'>Waiting for drivers to accept</Text>
            </View>
            </Layout>

{/* //ORDER TRACKING */}

 {/* <Divider/>  */}

          <View > 
     <Layout style={{margin:20,borderRadius:5,backgroundColor:'black'}} level="1" >
     
            <View status='basic' style={{margin:20}}>
            <Text    category="c1" style={{fontWeight:'bold',color:'white'}}  >
            In progress:
            </Text>
             <Text    category="c1"style={{marginTop:5,color:'white'}}   >
           Drivers might find it  <Text    category="c1" style={{fontWeight:'bold',color:'white'}}  >Hard</Text> in Orders Tab.
            </Text>
             </View>  
          </Layout> 
          </View>


         

           <View style={{marginTop:32}}/> 
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Journey Details</Text>
          {console.log(items.getSelectedVehicle())}
           {displayItems(items.userTrips)}
           <Text style={{marginTop:2,marginLeft:20,fontWeight:'bold'}} category='h6'>Transportation</Text>
           {displayVehicleType(items.getSelectedVehicle())}
           {displayFooter(items.getSelectedVehicle())}


 
{/* //ORDER TRACKING */}
       {/* <Button  status="basic"   onPress={()=>  navigation.navigate('Book',{screen:'Sucess'}) }  style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'selectedVehicle' === null ?'#dcdde1' :  'black', borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Place Order</Text>
    </Button> */}

{/* //ORDER TRACKING */}

    </ScrollView>
}
</BookingContext.Consumer>
        <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>


{/* //ORDER TRACKING */}
        <View  style={{ height: 30,width:'auto', top:60,position:'absolute', alignSelf:'flex-end',right:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{backgroundColor:'#dcdde1',borderRadius:50,opacity:0.7}}>
            <Text style={{color:'#7f8fa6',margin:5,marginLeft:10,marginRight:10}}>Cancel</Text>
            </View>
            </TouchableOpacity>
        </View>
 {/* //ORDER TRACKING */}      
        </React.Fragment>
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
    },
    containerContent: {
      marginTop: 0,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, 
      marginBottom: 12,
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
  