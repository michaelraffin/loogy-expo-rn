;import  React,{useEffect}from 'react';
import { StyleSheet,View,TouchableOpacity ,Dimensions,ActivityIndicator,SafeAreaView,Linking} from 'react-native';
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
  
export default function OrderList({navigation}) {
const [active, setActive] = React.useState(0); 
const [isLoading, setLoading] = React.useState(false); 
const [data, setData] = React.useState([]); 
var items = [{id:0,title:'Store-Pickup' ,displayName:'Pickup',description:'This order are coming from Mobile App'},{id:1,title:'Delivery',displayName:'Delivery',description:'This order are coming from Mobile App'},{id:2,title:'ONLINE-ONLY-UNDEFINE',displayName:'Website',description:'This order are coming from Website in any particular order'}] 
async function fetchProduct() { 
  
  try {  
    const data =   {numberofItems:500,OrderType:items[active].title,type:'StoreOrders'} 
    const response = await axios.post('/get/Order',data)
     setLoading(false)
     return  response
  }catch (error) { 
    setLoading(false)
    console.log(error)
      // alert('something went wrong')
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
  content.push(<TouchableOpacity onPress={()=> setActive(item.id)}>
<View key={item.id} style={{backgroundColor:'white',margin:10,width:'auto',height:30,borderRadius:90,justifyContent:'center',alignContent:'space-between'}}>  
<Text category='c1' style={{alignContent:'center',color:'#b13636' ,opacity:active === item.id ? 1 :0.3}}>{item.displayName}</Text> 
</View></TouchableOpacity> )
}) 
return  content 
}

const Header = (props,order) => (
  <View {...props}>
    {console.log(order.totalPrice)}
    <Text category='h6'>{order.orderReference}</Text>
    <Text category='p1'>{order.deliveryDetails.SenderName}</Text>
  </View>
);
const Footer = (props,identifier) => (
  <View {...props} >
    {items[active].displayName ===  "Website" ?    <Button 
    onPress={()=>  Linking.openURL('https://admin.paculbaflowershop.com/'+identifier.orderReference)}
      style={styles.footerControl}
      size='small'>
      View 
    </Button> :  <Button 
    onPress={()=>  
      navigation.navigate('Admin',{params:  {orderReference:identifier.orderReference}, screen: 'OrderTracker' ,orderReference:identifier.orderReference})}
      style={styles.footerControl}
      size='small'>
      View mobile
    </Button>}
   


    
  </View>
);

async function updateProduct(e) {  
  try {  
    const data =   {reference:e._id,OrderType:items[active].title,type:'StoreOrders',orderStatus:'FOR-VALIDATION'} 
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

function  displayContentResult() {
  var display = [<View/>]
  data.map( (item) => { 
display.push(<View style={{height:'auto',width:'auto'}}>
  {/* <Text category="h5">{item.orderReference}</Text> */}
 <Layout style={styles.topContainer} level='1'>
<Card style={styles.card} header={(e)=>Header(e,item)}>
  <Text>Total: P{item.totalPrice}</Text>

</Card>
<Card activeOpacity={false} style={styles.card} footer={(e)=>Footer(e,item)}>
  <Text>{items[active].displayName}</Text>
</Card>
</Layout>

</View>)
  })
  return display 
}
  return (
    <SafeAreaView style={{backgroundColor:'white'}}>
    <View style={styles.container}> 
      <ScrollView style={{height:height-100}}>
      <View style={{margin:20}}>
      
      <View style={{marginTop:20}}><TouchableOpacity   onPress={(e)=>     navigation.navigate('Add')} ><Text style={styles.title}>Add Product here</Text></TouchableOpacity></View>
      <View style={{marginTop:20}}><TouchableOpacity   onPress={(e)=>     navigation.navigate('Admin', { screen: 'ProductList' })} ><Text style={styles.title}>View Product here</Text></TouchableOpacity>
      </View><View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />    
      <Divider style={{marginBottom:20}}/>
      <Text style={styles.title}>Your Orders</Text>
      <ScrollView horizontal={true}>{categorizeContent()}</ScrollView>
      <Text category='p2' style={{marginBottom:20}}>{items[active].description}</Text>
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
