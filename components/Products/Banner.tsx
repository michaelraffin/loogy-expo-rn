;import  React,{useEffect,useState,useMemo}from 'react';
import { InputAccessoryView,StyleSheet,View,TouchableOpacity ,Dimensions,ActivityIndicator,SafeAreaView,Image,KeyboardAvoidingView} from 'react-native';
import {
    ApplicationProvider,
    Text,
    Layout,
    Button,
    Avatar,
    Divider,
    Input,
    Card,
    Spinner,
    Icon ,Select, SelectItem
  } from "@ui-kitten/components";
import { ScrollView } from 'react-native-gesture-handler';
import {axios} from '../../components/Utils/ServiceCall' 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height 
import {UserContext} from '../../components/Utils/UserContextAPI' 
import CustomCard from '../../components/Products/Card' 
import {fetchData} from '../Utils/StoreDetails'
export default function OrderList({didPressedCategory,selectedCard,modalData}) {
const [active, setActive] = React.useState(0);
const [category, setItems] = React.useState([]);
const [viewHeight, setHeight] = useState(0);
const [welcomeMessage, setWelcome] = useState('0');
const [storeDetails, setStore] = useState('');
const [isReady, setStatus] = useState(false)
var items = [{
    id:0,
    title:'https://scontent.fmnl4-5.fna.fbcdn.net/v/t1.0-9/s2048x2048/135634831_1540167926176811_1438387537757544086_o.jpg?_nc_cat=106&ccb=2&_nc_sid=e3f864&_nc_eui2=AeFH5mAtVVflVV9N8sLE-ZHxSsHVtK8AFItKwdW0rwAUi3G2nh-OEgIBndwhq6cbPAZCiC4OcYA3XZHfbmcvMXJm&_nc_ohc=6Hr_CpwHtIIAX-izxe9&_nc_ht=scontent.fmnl4-5.fna&tp=7&oh=756a66bf5e3caa8d037b999b3b761fd1&oe=60451276' 
  }
  ] 
function  setCategoryActive(item) {
    setActive(item)
    didPressedCategory(item)
} 

useEffect(() => {
   fetchData().then((data)=>{  
      setStore(data.data.results[0])
      setStatus(true)
      modalData(data.data.results[0])
     })
}, []) 

const  banner = ()=> {  
    var content = [<View></View>]
    try {
      storeDetails.storeAds.map( item => {  
           content.push(
<View><TouchableOpacity onPress={()=>selectedCard(item)}><Image   style={{borderRadius:0,marginLeft:20}} source={{uri:item.link,height:storeDetails.storeAdsHeight,width:400,marginLeft:20, borderWidth: 1
}} /></TouchableOpacity></View>  )
        
       }
       ) 
    } catch (error) { 

    } 
  return  <React.Fragment><ScrollView  showsHorizontalScrollIndicator={false} horizontal={true} style={{height:storeDetails.storeAdsHeight,borderRadius:0}}>{content}</ScrollView></React.Fragment>
   } 

    return( 
      isReady ?<View style={{height:'auto',marginLeft:0,marginRight:20,backgroundColor:'white'}}><Text style={{marginRight:20,marginLeft:20,marginBottom:20,marginTop:20,
    marginTop:30,}}category='h1'>{storeDetails.welcomeMessage}</Text>{banner()}</View> : <ActivityIndicator/> 
    ) 
}