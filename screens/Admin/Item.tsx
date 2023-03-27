;import  React,{useEffect,useState}from 'react';
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



export default function OrderList({route,navigation}) {

 const { productID} = route.params;
const [active, setActive] = useState(0); 
const [isLoading, setLoading] = useState(false); 
const [data, setData] = useState([]); 
const [product, setItem] = useState(null); 
const [tempProduct, setUpdated] = useState(null); 
const [selectedIndex, setSelectedIndex] = useState(0); 
const inputAccessoryViewID = 'uniqueID';
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




function displayCategory(){
  return (<Select
    selectedIndex={selectedIndex}
    onSelect={index => setSelectedIndex(index)}>
    <SelectItem title='Option 1'/>
    <SelectItem title='Option 2'/>
    <SelectItem title='Option 3'/>
  </Select> )
}
  
  async function fetchProduct() { 
    try { 
      const data = {id:productID,queryType:"specific"  }  
      const response = await axios.post('/store/Product', data) 
      return  response.data.results[0] 
    }catch (error) { 
        alert('error')
      }
  }

  useEffect(() => { 
    fetchProduct().then( item =>{  
      console.log(item)
      setItem(item) 
    }) 

  }, [productID])
 
 

function categorizeContent() {
  var content = [<View></View>] 
items.map( item => {
  content.push(<TouchableOpacity onPress={()=> setActive(item.id)}>
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

async function updateProduct(e,type) { 

  try {  
    var newItem = product 
    const response = type ==='Update' ?  await axios.post('/updateAdmin/Product',newItem) : await axios.post('/deleteProduct',newItem)
    console.log(response)
     setLoading(false) 
    
     return  response
  }catch (error) { 
    setLoading(false)
    console.log(error)
      // alert('something went wrong')
    }
}


function productCrud(e,type) {

  setLoading(!isLoading)
  updateProduct(e,type).then( (status)=>{
    navigation.goBack()
  }) 
}

function viewProduct(e) {
        console.log(e)
}
function  displayContentResult() { 
  var Image_Http_URL ={ uri: product.imgUrl}; 
  return (<ScrollView>
    <React.Fragment style={{marginBottom:0}}> 
        <Image source={Image_Http_URL} style={{
          width:300,height:250,
        resizeMode: "contain",
        justifyContent: "center"}}/> 
        

        {/* {isLoading ? <ActivityIndicator/>    :    <Button status="danger" style={{marginTop:20}} onPress={()=>productCrud(product,'Delete')}>Delete</Button>} */}

        {displayCategory}
         <Text style={{margin:5}}>Title</Text>
<Input

inputAccessoryViewID={'title'}
                placeholder="Product Title"
                value={product.title}
                onChangeText={nextValue =>  setTitle(nextValue)}
              />  
              <Text style={{margin:5}}>Subtitle</Text>
<Input

inputAccessoryViewID='subtitle'
                placeholder="Product Subtitle"
                value={product.subtitle}
                onChangeText={nextValue =>  setDescription(nextValue)}
              />  
              <Text style={{margin:5}}>Price</Text>
                  <Input

inputAccessoryViewID={inputAccessoryViewID}
                  keyboardType="number-pad"
                placeholder="Product Price"
                value={product.price}
                onChangeText={nextValue =>  setPrice(nextValue)}
              /> 








               <InputAccessoryView nativeID='title'>
               <Input
                
inputAccessoryViewID={'title'}
placeholder="Product Title"
                value={product.title}
                onChangeText={nextValue =>  setTitle(nextValue)}
              />
      </InputAccessoryView>
      <InputAccessoryView nativeID='subtitle'>
      <Input

inputAccessoryViewID='subtitle'
                placeholder="Product Subtitle"
                value={product.subtitle}
                onChangeText={nextValue =>  setDescription(nextValue)}
              />  
        {/* <View style={{backgroundColor:'white',height:'auto',margin:5}}><Text>{product.subtitle}</Text></View> */}
      </InputAccessoryView>
      <InputAccessoryView nativeID={inputAccessoryViewID}>
               <Input
                  keyboardType="number-pad"
                placeholder="Product Price"
                value={product.price}
                onChangeText={nextValue =>  setPrice(nextValue)}
              />
      </InputAccessoryView>
 {/* <Text style={{margin:5}}>Type</Text>
<Input

                placeholder="Product Type"
                value={product.type}
                onChangeText={nextValue =>  setProductDetails('Type',nextValue)}
              />   */}
            
    {isLoading ? <ActivityIndicator/>    :  <Button style={{marginTop:20}} onPress={()=>productCrud(product,'Update')}>Update</Button>}     
    </React.Fragment></ScrollView>
  ) 
}
const setDescription =(value)=>{
  const updatedValue = {}
  updatedValue.subtitle = value 
  setItem({
    ...product,
    ...updatedValue
  })
}
const setTitle =(value)=>{
  const updatedValue = {}
  updatedValue.title = value 
  setItem({
    ...product,
    ...updatedValue
  })
}

const setPrice =(value)=>{ 
  const updatedValue = {}
  updatedValue.price = value 
  setItem({
    ...product,
    ...updatedValue
  })
}
function setProductDetails(type,value) {
  product.title = value
  console.log(product)

const updatedValue = {}

//   var selectedItem = product  
  switch (type) {
    case 'Title': 
updatedValue.title= value
// setItem(prevMovies => ([...prevMovies.title, ...value]));
      break;
      case 'Price':

updatedValue.price= value  
      break;
      case 'subtitle':

updatedValue.subtitle= value  
setItem({
  ...product,
  ...updatedValue
})
      break;
    default:
      break;
  } 
 
}
  return (
    <SafeAreaView style={{backgroundColor:'white'}}>
    <View style={styles.container}> 
      <ScrollView style={{height:height-100}}>
      <View style={{margin:20}}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />    
      {/* <ScrollView horizontal={true}>{categorizeContent()}</ScrollView>
      {isLoading ? <ActivityIndicator size="small"/> : displayContentResult()} */}
      {product !== null ? displayContentResult() : null }
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
