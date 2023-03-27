;import  React,{useEffect}from 'react';
import { StyleSheet,View,TouchableOpacity ,Dimensions,ActivityIndicator,SafeAreaView} from 'react-native';
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
    Icon 
  } from "@ui-kitten/components";
import { ScrollView } from 'react-native-gesture-handler';
import {axios} from '../../components/Utils/ServiceCall' 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height 
import {UserContext} from '../../components/Utils/UserContextAPI' 
import CustomCard from '../../components/Products/Card' 

import Categorize from '../../components/Products/Categorize'
export default function OrderList({navigation}) {
const [active, setActive] = React.useState({tile:'Flowers'}); 
const [isLoading, setLoading] = React.useState(false); 
const [data, setData] = React.useState([]); 
var items = [{
    id:0,
    title:'Flowers' 
  },{
    id:1,
    title:'Bouqute' 
  },
  
  {
    id:4,
    title:'Variety' 
  },
  {
    id:2,
    title:'Setup' 
  },
  {
    id:3,
    title:'Funeral' 
  }, 
  ] 
async function fetchProduct() {  
  try {  
    const data =   {id:active.title,queryType:"filter"  } 
     const response = await axios.post('/store/Product', data)
     setLoading(false)
     return  response
  }catch (error) { 
    // const data =   {id:'Flowers',queryType:"filter"  } 
    // const response = await axios.post('/store/Product', data)
    // setLoading(false)
    // return  response 
    }
}

useEffect(() => {   
  setLoading(true)
  fetchProduct().then ( data=> {  
        setData(data.data.results) 
   })
 }, [active])
  
   

function categorizeContent() {
  var content = [<View></View>] 
items.map( item => {
  content.push(<TouchableOpacity onPress={()=> setActive(item)}>
<View key={item.id} style={{backgroundColor:'white',margin:10,width:'auto',height:30,borderRadius:90,justifyContent:'center',alignContent:'space-between'}}>  
<Text category='c1' style={{alignContent:'center',color:'#b13636' ,opacity:active === item.id ? 1 :0.3}}>{item.title}</Text> 
</View></TouchableOpacity> )
}) 
 
return  content 
}

const Header = (props,order) => (
  <View {...props}>
    {console.log(order.totalPrice)}
    <Text category='h6'>{order.price}</Text>
    <Text category='p1'>By Wikipedia</Text>
  </View>
);
const Footer = (props) => (
  <View {...props} >
    <Button
      style={styles.footerControl}
      size='small'
      status='basic'>
      CANCEL
    </Button>
    <Button
      style={styles.footerControl}
      size='small'>
      ACCEPT
    </Button>
  </View>
);

async function updateProduct(e) {  
  try {  
    const data =   {reference:e._id,OrderType:active.title,type:'Product',orderStatus:'FOR-VALIDATION'} 
    const response = await axios.post('/update/StoreOrders',data)
    console.log(response)
     setLoading(false) 
    
     return  response
  }catch (error) { 
    setLoading(false)
    console.log(error)
      // alert('something went wrong')
    }
}

function updateOrderItem(e) {
  updateProduct(e)
  
  // setLoading(!isLoading)
}

function viewProduct(e) { 

  navigation.navigate('AdminItemProduct',{productID:e._id}) 
//   navigation.navigate('Admin', { screen: 'AdminItemProduct' ,productID:e._id})
}
function  displayContentResult() {
  var display = [<View/>]
  return (
    <UserContext.Provider value={data}> 
    <CustomCard tapped={(e)=>viewProduct(e)}/> 
     </UserContext.Provider>
  ) 
}
  return (
    <SafeAreaView style={{backgroundColor:'white'}}>
    <View style={styles.container}> 
      <ScrollView style={{height:height}}>
      <View style={{margin:20}}>
      <Text style={styles.title}>{active.title} </Text>
      <Text category="c2"  >Found {data.length} items</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />    
      {/* <ScrollView horizontal={true}>{categorizeContent()}</ScrollView> */}
      <ScrollView    showsHorizontalScrollIndicator={false} horizontal={true} style={{height:60,marginLeft:5}}  > 
      <Categorize didPressedCategory={(e)=>setActive(e)}/>
  </ScrollView>
      {isLoading ? <ActivityIndicator size="small"/> : displayContentResult()}
      </View> 
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor:'white'
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
    marginBottom:5
  },
});
