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
import Colors from '../../constants/Colors';
import {UserContext} from '../../components/Utils/UserContextAPI' 
import CustomCard from '../../components/Products/Card' 
import {fetchData} from '../Utils/StoreDetails'
export default function OrderList({didPressedCategory,list,disabled}) {
const [active, setActive] = React.useState({
  "title": "Dried",
  "displayName": "Dried",
  "id": 39,
  "status": true
});
const [category, setItems] = React.useState([]);

function  setCategoryActive(item) {
  if (active.id !== item.id){
    setActive(item)
    didPressedCategory(item)
  }
  
} 


useEffect(() => {
   fetchData().then((data)=>{ 
            setItems(data.data.results[0].productCategories)
            var arrayCategory = data.data.results[0].productCategories.filter(item => item.status === true)
            list(arrayCategory)
        })
}, [])

const  categorizeContent = ()=> {  
    var content = [<View></View>]
    try {
        category.map( item => { 
          if (item.status) {
            content.push(<TouchableOpacity disabled={disabled} key={item.id} onPress={()=> setCategoryActive(item)}>
            <View key={item.id} style={{backgroundColor:'white',margin:10,width:'auto',height:30,borderRadius:90,justifyContent:'center',alignContent:'space-between',opacity:disabled ? 0.5 : 1}}> 
            <Text category='c1' style={{alignContent:'center',color:'black' ,opacity:active.id === item.id ?1 :0.5}}>{item.displayName}</Text> 
            {active.id === item.id ? <View style={{width:'auto',height:2,backgroundColor:Colors.light.tint,marginTop:2}}/>:null} 
            </View></TouchableOpacity> )
          }
          })  
    } catch (error) {
        
    }
  return  content 
  }
    return(
        
       category?.length ?  categorizeContent() : <ActivityIndicator/> 
    )

}