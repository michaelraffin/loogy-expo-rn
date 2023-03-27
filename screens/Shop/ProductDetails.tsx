import React ,{useState,PureComponent,useContext,useEffect,useRef} from 'react';
import { StyleSheet ,
  TextInput,Dimensions,View,ImageBackground,InputAccessoryView, ActivityIndicator,TouchableOpacity,Image,Vibration,KeyboardAvoidingView} from 'react-native'; 
import Items from '../../components/Products/ProductList'  
import Svg,{Circle,Path,Line,Polygon} from "react-native-svg"
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import backIcon from '../../assets/images/left-arrow.png'
import {axios,productStats,productLike} from '../../components/Utils/ServiceCall'
import SelectedItemContext from "../../components/Utils/SelectedItemContext"
import { ScrollView } from 'react-native-gesture-handler'; 
import ButtonCart from '../../components/Products/AddCart'; 
import {ProductDetailContext} from '../../components/Utils/UserContextAPI' 
import LanguageContext from "../../components/Utils/LanguageContext";
import {
  Button,
  Text,
  Card,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Layout,
  Icon,
  Divider
} from "@ui-kitten/components";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import ProductSize from '../../components/Products/Size';
import {currencyFormat} from '../../components/Utils/StoreDetails'
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import Colors from '../../constants/Colors';
var DeviceUUID = require("react-native-device-uuid");

var Image_Http_URL ={ uri: 'https://scontent.fmnl4-4.fna.fbcdn.net/v/t1.0-9/126167885_1504960249697579_8984401396784563576_n.jpg?_nc_cat=102&ccb=2&_nc_sid=8bfeb9&_nc_eui2=AeGk6kmSYyoQu46W_UICsReKVMs81DcKkT5UyzzUNwqRPhCf4uA2WaXQ5soe0d2fmkZ5l6aixscBADswlLbNQt2y&_nc_ohc=IGT7ciNMyNEAX_DCGFd&_nc_ht=scontent.fmnl4-4.fna&oh=2b938be15ed2bd730e2ea65d877095a4&oe=6005A88A'};
var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height; 

var unBook = require('../../assets/images/unBook.png')
var book = require('../../assets/images/bookmark.png')
export default function Product({route,navigation}) {

  const { productID} = route.params;
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [item, setProductDetail] = useState({additionalNotes:null});
  const [options, setLanguage] = useState({quantity:1,addons:{price:0},size:{price:0}});
  const [addons, setAddons] = useState({});
  const [didLoad, setLoad] = useState(false); 
  
  const [didLoadImage, setLoadImage] = useState(false); 
  const bottomSheetModalRef = useRef<BottomSheetModal>(null); 
  const Nx = { options, setLanguage };
  const snapPoints = React.useMemo(() => ['25%','76%'], []);
  const [gifts, setGiftItems] = React.useState([]);
  const [isBookMark, setBookMarked] = useState(false); 
   
  async function fetchProduct() { 
    try { 
      const data = {id:productID,queryType:"specific"  ,isAPI:false}  
      const response = await axios.post('/store/Product', data) 
      return  response.data.results[0] 
    }catch (error) { 
        alert('error')
      }

     
  }

  async function fetchGiftItems() { 
    try {  
      const data =   {id:'Gifts',queryType:"filter"  } 
       const response = await axios.post('/store/Product', data)
       console.log(response)
       return  response
    }catch (error) { 
        alert('something went wrong')
      }
  }

  async function recordProductStats(e) {
    try {
        const data = {storeOwner:"Nidz",cType:"visitedProduct",cName:"iOS","data":e,"date":new Date()}
        const response = await productStats.put('/Items', data) 
        return  response
        
    } catch (error) {
      
    }
    
  }
  useEffect(() => { 
    console.log(productID)
    fetchProduct().then( item =>{  
      item.additionalNotes = null
      setProductDetail(item)
      setLoad(true)
      recordProductStats(item)
    })
    
 
    // fetchGiftItems().then( item =>{   
    // setGiftItems(item.data.results)  
    // })
    loadAsync()
  }, [productID])

 function likeProduct (e){

  setBookMarked(!isBookMark)
  likeService(e).then( item =>{
    })
}
async function likeService (e){
  try {
    const data = {"data":e,"date":new Date()}
    const response = await productLike.post('/product/like', data)
    
    return data
  }catch(error){

  } 
}

async function loadAsync (){
  try {
    let data = await DeviceUUID.getUUID()
    console.log("WWWWW",data)
    return data
  }catch(error){

  }

}
  function viewAddress(){  
    
    bottomSheetModalRef.current?.present();  
 
  }
const handlePresentModalPress = React.useCallback(() => {
  bottomSheetModalRef.current?.present();
}, []);
  function navigateBack() {
    Vibration.vibrate(1)
    navigation.goBack()
  }
  

  let element = (e)=> (
    <View style={{borderRadius:5}}><Text category="h4" style={{color:Colors.buttonTheme,margin:5}}>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(e)}</Text></View>
    )
  function dismissKeyboard(){
    bottomSheetModalRef.current?.dismiss()
    item.additionalNotes = notes 
    setProductDetail(item)
    console.log(item)
  }
  var constImage = ()=> {
    return <Image  source={{uri:item.imgUrl === undefined ? Image_Http_URL : item.imgUrl}}/>
  }


const giftItems = ()=>{ 
  var item = []
  gifts.map( (data)=> {
    console.log('gift',data)
item.push(
  <TouchableOpacity >
  <View style={{height:100,width:100,backgroundColor:'clear',marginLeft:10}}> 
<Image source={data.imgUrl === undefined || data.imgUrl === "" ? Image_Http_URL : {uri:data.imgUrl,  cache: item.imgUrl}} style={styles.image}/><Button style={styles.button} size='tiny'>
              { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}
         </Button></View>
         </TouchableOpacity>
)
  })

return item
}


function saveNotesForProduct(nextValue){
  setNotes(nextValue)
  
}
  function header(){
    return (
    <React.Fragment> 
        {didLoad ? <ImageHeaderScrollView
        showsVerticalScrollIndicator={false}
    onLoadStart={(e) => setLoadImage(true)}
      maxHeight={height / 1.5}
      minHeight={20} 
      headerImage={{uri:item.imgUrl === undefined ? Image_Http_URL : item.imgUrl}}
    >
         <LanguageContext.Provider value={Nx}> 
        <View style={{ height: height / 1.5 }}>
        <TriggeringView onHide={() => console.log("text hidden")}> 
        <View style={{ height: 90,position:'absolute',top:20,  right:20,backgroundColor:'white'}}> 
         {element(item.price)}
    </View>

    {/* START TRACKER */}
    {/* <View style={{ height: 90,position:'absolute',top:60,  right:20,backgroundColor:'white'}}> 
    <TouchableOpacity onPress={() => likeProduct(item)}>
           <View style={{backgroundColor:'clear',width:50,height:50,borderRadius:50/2}}><Image  source={isBookMark  ? book : unBook } style={{width:20,height:20  }}/></View>
          </TouchableOpacity>
    </View> */}
  {/* END TRACKER */}




    {/* <View onPress={() => likeProduct(item)} style={{ height: 50,width:width,position:'absolute',position:'absolute',top:20,  right:0}} >
          <TouchableOpacity onPress={() => likeProduct(item)}>
           <View style={{backgroundColor:'clear',width:50,height:50,borderRadius:50/2}}><Image  source={require('../../assets/images/bookmark.png')} style={{width:20,height:20  }}/></View>
          </TouchableOpacity>
        </View>  */}


          <View style={{margin:20,marginRight:180}}>  
          <Text category="h4">{item.title}</Text>  
          </View>
          <View style={{margin:20,marginTop:10}}>  
          <Text category="s1">{item.subtitle}</Text>  
         
          </View>
          <Divider style={{margin:20}}/>  
          <TouchableOpacity onPress={()=>dismissKeyboard()} > 
         {notes === '' ? null : <Text category="p2" style={{right:20,position:'absolute',color:'#',fontSize:14}}>Tap to Save</Text>}  
          <Text category="c1" style={{marginLeft:21,marginBottom:10,color:Colors.paragraph}}>Card Message / Order Notes</Text>
          <TextInput   
  returnKeyType = {"next"}
  onSubmitEditing={() => dismissKeyboard()}
onEndEditing={()=>console.log(notes)}
inputAccessoryViewID={"xxx"}
      multiline
      numberOfLines={4}
      style={{padding:10,backgroundColor:'#dcdde1',borderWidth:1,borderColor:'#dcdde1',borderRadius:5,height:100,marginRight:20,marginLeft:20}}
      placeholder="To someone very special..."
      editable
      value={notes}
      onChangeText={nextValue => saveNotesForProduct(nextValue) }
      maxLength={200}></TextInput>
  </TouchableOpacity>
        </TriggeringView>
         
      </View> 
      </LanguageContext.Provider>
    
    </ImageHeaderScrollView> : <ActivityIndicator style={{position:'absolute',top:'50%',right:'50%',left:'50%'}} animating={true}/> } 
    

    <View onPress={() => navigation.goBack()} style={{ height: 50,width:width,position:'absolute', alignSelf:'flex-end',top:60,left:20}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
        
            <View style={{backgroundColor:'clear',width:50,height:50,borderRadius:50/2}}><Image  source={require('../../assets/images/left-arrow.png')} style={{width:20,height:20  }}/></View>
            
          </TouchableOpacity>
        </View>
     
          <LanguageContext.Provider value={Nx}> 
          {didLoad ?      <View style={{ height: 90, width:width,position:'absolute', alignSelf:'flex-end',bottom:0,backgroundColor:'white',  shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5,}}> 
        <SelectedItemContext.Provider value={item} >
    <ButtonCart  onPressed={()=>navigateBack()}/> 
    </SelectedItemContext.Provider>
    </View>: null}
   
    </LanguageContext.Provider>

    <BottomSheetModalProvider>
    <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints} 
        > 
      <View > 

<Button  style={{backgroundColor:Colors.themeColor,borderColor:Colors.themeColor,marginTop:10,marginBottom:20,marginRight:20,marginLeft:20}}  onPress={()=>
   dismissKeyboard()}>Continue</Button>
      <TextInput   
  clearButtonMode="while-editing"
  returnKeyType = {"next"}
  blurOnSubmit={false}
  onSubmitEditing={() => dismissKeyboard()}
onEndEditing={()=>console.log(notes)}
inputAccessoryViewID={"xxx"}
      multiline
      numberOfLines={4}
      style={{padding:10,backgroundColor:'#f7f1e3',borderWidth:1,borderColor:'#f7f1e3',borderRadius:10,height:100,marginRight:20,marginLeft:20}}
      placeholder=" To someone very special..."
      editable
      value={notes}
      onChangeText={nextValue =>  setNotes(nextValue) }
      maxLength={200}></TextInput>

{/* <InputAccessoryView style={{backgroundColor:'red'}}  nativeID={"xxx"}>
    

<Button  style={{backgroundColor:Colors.themeColor,borderColor:Colors.themeColor,marginTop:10,marginBottom:20,marginRight:90}}  onPress={()=>
   dismissKeyboard()}    >Dismiss</Button>

      </InputAccessoryView>  */}

{/* <Button style={{width:'auto'}} size='tiny' appearance='ghost'onPress={()=> setNotes(notes + 'In your arms is where I always want to be. ')} >
In your arms is where I always want to be. 
    </Button>
    <Button style={{width:'auto'}} size='tiny' appearance='ghost' onPress={()=> setNotes(notes + 'You are my true happiness.')}>
    You are my true happiness.
    </Button> 


    <Button style={{width:'auto'}} size='tiny' appearance='ghost'onPress={()=> setNotes(notes + 'I am blessed to have you as my husband.')} >
    I am blessed to have you as my husband.
    </Button> 
   */}

   
     </View>
        </BottomSheetModal> 
      </BottomSheetModalProvider>
    
    </React.Fragment>
    )
  }


return(
     header()
)
} 

      {/* <Items navigation={navigation}/> */}
const styles = StyleSheet.create({ 
  
  button:{
  borderColor:Colors.themeColor,
  backgroundColor:Colors.themeColor,
  bottom:0,
  borderRadius:100,
  width:'auto',
  marginTop:5
},
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
  image: { 
    borderRadius:20, 
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
