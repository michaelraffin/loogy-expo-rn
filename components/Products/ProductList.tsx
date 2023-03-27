import * as WebBrowser from 'expo-web-browser';import  React,{useEffect}from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity,SafeAreaView, ScrollView,Dimensions,Image,View ,FlatList,Animated,ActivityIndicator,RefreshControl} from 'react-native';
import { ApplicationProvider, Divider, Input } from '@ui-kitten/components';
import { Button ,Text,Card,Radio, RadioGroup,Spinner,Layout} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';  
// import { Icon } from '@ui-kitten/components';
import Colors from '../../constants/Colors';
import { MonoText } from './StyledText';
import CustomCard from './Card' 
import {UserContext} from '../Utils/UserContextAPI'
import {axios} from '../Utils/ServiceCall' 
import CartContext from "../Utils/CartContext";
import { AsyncStorage } from 'react-native';  
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import {QRCode,Retake,ArrowUp} from '../../components/Svgs'
import Categorize from '../../components/Products/Categorize'
import Banner from '../../components/Products/Banner'
import { useScrollToTop } from '@react-navigation/native';
import Modal from '../../components/Modal'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
// import {ThemeContext, Theme} from '../Utils/UserCart'
var Image_Http_URL ={ uri: 'https://scontent.fmnl4-4.fna.fbcdn.net/v/t1.0-9/126167885_1504960249697579_8984401396784563576_n.jpg?_nc_cat=102&ccb=2&_nc_sid=8bfeb9&_nc_eui2=AeGk6kmSYyoQu46W_UICsReKVMs81DcKkT5UyzzUNwqRPhCf4uA2WaXQ5soe0d2fmkZ5l6aixscBADswlLbNQt2y&_nc_ohc=IGT7ciNMyNEAX_DCGFd&_nc_ht=scontent.fmnl4-4.fna&oh=2b938be15ed2bd730e2ea65d877095a4&oe=6005A88A'};
var width = Dimensions.get('window').width 
var height = Dimensions.get('window').height 
var storeOwner = "5ff00ddaeb2f5d0940dfa186"
export default function ShopContent({ path ,navigation,data,modalContent}: { path: string }) {
  const [counter, setCounter] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const [selected, setItem] = React.useState('Dried');
  const [foundItem, setFoundItem] = React.useState('Flux Dried');
  const [value, setValue] = React.useState('');
  const [passCode, setPasscode] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [spinStatus, setStatus] = React.useState(false);
  const [productItems, setProducts] = React.useState([]);
  const [gifts, setGiftItems] = React.useState([]);
  const [addons, setAddonItems] = React.useState([]);
  const [cartItems, setCart] = React.useState([]); 
  const { cartDetails, updateDetails } = React.useContext(CartContext); 
  const [aaa, setA] = React.useState(0); 
  const scrollViewRef = React.useRef();
  const scrolltoTop = React.useRef(null);
  const offset = React.useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);  
  const [otherProducts, setOther] = React.useState([]);
  const [otherTitle, setOtherTitle] = React.useState('Bundles');
  const snapPoints = React.useMemo(() => ['25%','76%'], []);
  const [categories, setCategories] = React.useState([]); 
  // const didRefresh = React.useRef()  
  const [currentNews, setNews] = React.useState(null); 
  const newRef = React.useRef()  
  const [didRefresh, setRefresh] = React.useState(false);
function viewItem(e){      
  navigation.navigate('View Product',{productID:e._id}) 
 
// var data = {}
// data.tracking = e._id
// console.log(e._id)
//   navigation.navigate('Orders', {
//     screen: 'order',
//     params: {tracking: e._id}
//   })

  
}
console.log(modalContent)

async function fetchGiftItems() { 
  try {  
    const data =   {id:'Food',queryType:"filter"  ,storeOwner:storeOwner,isAPI:false} 
     const response = await axios.post('/store/Product', data)
     return  response
  }catch (error) { 
      alert('something went wrong')
    }
}
async function fetchGiftItemsOnly() { 
  try {  
    const data =   {id:'Gifts',queryType:"filter" ,storeOwner:storeOwner } 
     const response = await axios.post('/store/Product', data)
     return  response
  }catch (error) { 
      alert('something went wrong')
    }
}
async function fetchProduct() { 
  try {  
    const data =   {id:selected,queryType:"filter" ,storeOwner:storeOwner,isAPI:false} 
     const response = await axios.post('/store/Product', data)
    console.log(response.data)
     return  response
  }catch (error) { 
      alert('something went wrong')
    }
}
async function fetchOtherProduct(e) { 
  try {  
    const data =   {id:e,queryType:"filter",storeOwner:storeOwner  } 
     const response = await axios.post('/store/Product', data)
    console.log(response.data)
     return  response
  }catch (error) { 
      alert('something went wrong')
    }
}

function fadeIn () {
  Animated.timing(aaa, {
    toValue: 1,
    duration: 4000
  }).start();

  Animated.timing(aaa, {
    toValue: 1,
    duration: 4000
  }).start(({ finished }) => { 
  });
}

const fetchServices = ()=>{

  fetchProduct().then ( data=> { 
    setProducts(data.data.results)
    setStatus(false) 
 })



 fetchGiftItems().then ( data=> { 
   setGiftItems(data.data.results) 
})

fetchGiftItemsOnly().then ( data=> {  
  setAddonItems(data.data.results) 
})



var catList = [{
  "title": "Dried",
  "displayName": "Dried",
  "id": 39,
  "status": true
}, {
  "title": "Hot-Picks",
  "displayName": "Hot-Picks",
  "id": 45,
  "status": true
}, {
  "id": 122,
  "title": "Flowers",
  "displayName": "Roses",
  "status": true
}, {
  "id": 4,
  "title": "Variety",
  "displayName": "Variety",
  "status": true
}, {
  "id": 0,
  "title": "Bundles",
  "displayName": "Bundles",
  "status": true
}, {
  "id": 3,
  "title": "Funerals",
  "displayName": "Funeral",
  "status": true
}, {
  "id": "186.456",
  "title": "Chocolate Bouquets-186.456",
  "displayName": "Chocolate Bouquets",
  "status": true
}, {
  "id": "146.442",
  "title": "Php 500 and below-146.442",
  "displayName": "Php 500 and below",
  "status": true
}, {
  "id": "143.870",
  "title": "Money Bouquet-143.870",
  "displayName": "Money Bouquet",
  "status": true
}]
  var categoryList = [...catList,...categories]
  let list = categoryList.filter( (data) => data.title !== selected ) 
  var item = list[Math.floor(Math.random() * list.length)]
    setOtherTitle(item.displayName)
    fetchOtherProduct(item.title).then( data =>{
      setOther(data.data.results)
    })  
}
useEffect(() => {  
  fetchServices()
}, [selected])

function getCurrentDisplayName(){

var catList =  [{
  "title": "Dried",
  "displayName": "Dried",
  "id": 39,
  "status": true
}, {
  "title": "Hot-Picks",
  "displayName": "Hot-Picks",
  "id": 45,
  "status": true
}, {
  "id": 122,
  "title": "Flowers",
  "displayName": "Roses",
  "status": true
}, {
  "id": 4,
  "title": "Variety",
  "displayName": "Variety",
  "status": true
}, {
  "id": 0,
  "title": "Bundles",
  "displayName": "Bundles",
  "status": true
}, {
  "id": 3,
  "title": "Funerals",
  "displayName": "Funeral",
  "status": true
}, {
  "id": "186.456",
  "title": "Chocolate Bouquets-186.456",
  "displayName": "Chocolate Bouquets",
  "status": true
}, {
  "id": "146.442",
  "title": "Php 500 and below-146.442",
  "displayName": "Php 500 and below",
  "status": true
}, {
  "id": "143.870",
  "title": "Money Bouquet-143.870",
  "displayName": "Money Bouquet",
  "status": true
}]
  let list = catList.filter( (data) => data.title === selected )[0]
  return list
}
function setHeader(params) { 
  navigation.setOptions({tabBarVisible: false})
}
function setCategory(data) {
  
  if (data.id != active){
    setActive(data.id)
    setStatus(true)
    setItem(data.title) 
    if (data.id === 1 ){
      setProducts([{margin:20 ,height:10,width:70,borderRadius:90},{margin:20 ,height:10,width:70,borderRadius:90},{margin:20 ,height:10,width:70,borderRadius:90}])
    }else {
      setCart([]) 
    } 
  }

}

const giftItems = React.useCallback(()=>{ 
  var item = []
  try {
    gifts.map( (data)=> {
      item.push(
        <TouchableOpacity onPress={()=>viewItem(data)}>
        <View style={{height:220,width:120,backgroundColor:'clear',marginLeft:10}}> 
      <Image source={data.imgUrl === undefined || data.imgUrl === "" ? Image_Http_URL : {uri:data.imgUrl,  cache: item.imgUrl}} style={styles.image}/><Button style={styles.button} size='tiny'>
                    { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}
               </Button>
               </View></TouchableOpacity>
      )
        })
  } catch (error) {
    gifts.map( (data)=> {
      item.push(
        <TouchableOpacity onPress={()=>viewItem(data)}>
        <View style={{height:220,width:120,backgroundColor:'clear',marginLeft:10}}> 
      <Image source={data.imgUrl === undefined || data.imgUrl === "" ? Image_Http_URL : {uri:data.imgUrl,  cache: item.imgUrl}} style={styles.image}/><Button style={styles.button} size='tiny'>
                 {data.price}
               </Button>
               </View></TouchableOpacity>
      )
        })
  }


return item
},[gifts])
const addonItems = ()=>{ 
  var item = []

  try {
    addons.map( (data)=> {
      item.push(
        <TouchableOpacity onPress={()=>viewItem(data)}>
        <View style={{height:220,width:120,backgroundColor:'clear',marginLeft:10}}> 
      <Image source={data.imgUrl === undefined || data.imgUrl === "" ? Image_Http_URL : {uri:data.imgUrl,  cache: item.imgUrl}} style={styles.image}/><Button style={styles.button} size='tiny'>
                    { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}
               </Button>
               </View></TouchableOpacity>
      )
        })
  } catch (error) {
    addons.map( (data)=> {
      item.push(
        <TouchableOpacity onPress={()=>viewItem(data)}>
        <View style={{height:220,width:120,backgroundColor:'clear',marginLeft:10}}> 
      <Image source={data.imgUrl === undefined || data.imgUrl === "" ? Image_Http_URL : {uri:data.imgUrl,  cache: item.imgUrl}} style={styles.image}/><Button style={styles.button} size='tiny'>
                 {data.price}
               </Button>
               </View></TouchableOpacity>
      )
        })
  }

//   addons.map( (data)=> {
// item.push(
//   <TouchableOpacity onPress={()=>viewItem(data)}>
//   <View style={{height:100,width:100,backgroundColor:'clear',marginLeft:10}}> 
// <Image source={data.imgUrl === undefined || data.imgUrl === "" ? Image_Http_URL : {uri:data.imgUrl,  cache: item.imgUrl}} style={styles.image}/><Button style={styles.button} size='tiny'>
//               { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}
//          </Button></View></TouchableOpacity>
// )
//   })

return item
}
function displayQRCODE(){
  return (
    <QRCode/>
  )
}
useScrollToTop(React.useRef({
  scrollToTop: () => scrolltoTop.current?.scrollToOffset({ offset: -100 }),
}));

function ValidateBanner(e){
  console.log('eeeee',e)
  if (e.type === "product"){
   navigation.navigate('View Product',{productID:e.productID})
  }else if (e.type === "news"){
    newRef.current = e
    setNews(e)
    bottomSheetModalRef.current?.present();
   }else {
    
  
  }
}


function displayContent(){
  try {
    var imageDetails = currentNews.details.image
    console.log('Rendering uI')
  return (
    <React.Fragment>
    <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()}>
     <View style={{backgroundColor:'clear',width:50,height:50,borderRadius:50/2,top:-20,position:'absolute',left:20}}><Image  source={require('../../assets/images/cancel.png')} style={{width:20,height:20  }}/></View>
     </TouchableOpacity><ScrollView style={{marginTop:20}}>
     <Image style={{flexDirection: 'row'}} source={{uri:imageDetails.imageURL ,height:imageDetails.height ,
  // height: 300,
  flex: 1,
  width: imageDetails.width}} />
       <Text style={{margin:20,marginTop:60}}category='h4'>{newRef.current.details.title}</Text> 
   <Text style={{margin:20}} category="p2">{newRef.current.details.subDetails}</Text>
   {/* <Text style={{margin:20,top:-20,position:'absolute',left:0}} onPress={()=> bottomSheetModalRef.current?.dismiss()}>Dismiss</Text> */}
   </ScrollView>
 </React.Fragment>
  )
  } catch (error) {
    console.log(error)
  }
}
function ContentItems(){
    return( 
        <React.Fragment>
        <Text style={{margin:20}}category='h1'>Make a wish</Text> 
        <Button>Scan</Button>
       </React.Fragment>
    )
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
const onRefresh = React.useCallback(() => {
  setRefresh(true)
  wait(2000).then(() =>  
  setRefresh(false),
  setProducts([]), 
  // setOther([]),
  fetchServices(),
  setStatus(true)
  
  );
}, [didRefresh]);
const updateRefresh = () =>{ 
didRefresh.current = true 
}
  return (
    <ApplicationProvider  {...eva} theme={eva.light}  >
      <View style={{height:60,backgroundColor:'white'}}/>
   
        <FlatList 
        refreshControl={
          <RefreshControl
            refreshing={didRefresh}
            size= {2}
            onRefresh={onRefresh}
          />
        }    
        ref={scrolltoTop}
        style={{width:width }}
        ListHeaderComponent={<React.Fragment>  
    <Banner selectedCard={(e)=> ValidateBanner(e)} modalData={(data)=>console.log('FROM DASHBOARD',data)}/>
     <Button   accessoryLeft={displayQRCODE} style={{  backgroundColor:Colors.buttonTheme,borderColor:Colors.buttonTheme,color:'white',margin:20}} onPress={()=>  navigation.navigate('QRReader')}>Scan Video QRCode </Button>
    <ScrollView    showsHorizontalScrollIndicator={false} horizontal={true} style={{height:60,marginLeft:20,borderRadius:20}}  ref={scrollViewRef}> 
   <Categorize disabled={spinStatus} didPressedCategory={(e)=>setCategory(e)} list={(e)=>setCategories(e)}/>
  </ScrollView>
        </React.Fragment> }
        ListFooterComponent={
          <React.Fragment>
            <UserContext.Provider value={productItems}> 
           {spinStatus ?  <View style={{marginTop:20}}><ActivityIndicator/></View> : <React.Fragment>
           <Text style={{margin:20}} category="h6">Cakes</Text>
           <ScrollView pagingEnabled={true} showsHorizontalScrollIndicator={false} horizontal={true} automaticallyAdjustContentInsets={true} contentContainerStyle={{
              paddingRight: 25,
            }}style={{height:230,marginBottom:10}} >{giftItems()}</ScrollView>
           <Divider/> 
           <Text style={{marginLeft:20,marginTop:20,marginBottom:5}} category="h6">  
           Found {getCurrentDisplayName().displayName === null ? 'Dried':getCurrentDisplayName().displayName } 
           </Text>
           <CustomCard tapped={(e)=>viewItem(e)}/>  
           <Divider/>
            </React.Fragment> } 
            </UserContext.Provider>
            <Text style={{margin:20}} category="h6">Add-on Items</Text>
           <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{height:'auto',marginBottom:20}} >{addonItems()}</ScrollView>
           <Divider/>
            <UserContext.Provider value={otherProducts}> 
           {spinStatus ?  <View style={{marginTop:20}}><ActivityIndicator/></View> : <React.Fragment>
             
           <Text style={{margin:20}} category="h6">Try {otherTitle} Items</Text>
           <CustomCard tapped={(e)=>viewItem(e)}/> 
            </React.Fragment> } 
     {/* <Modal  /> */}
            </UserContext.Provider>
            </React.Fragment>
           
          
          }



        />  
           <Button onPress={()=>scrolltoTop.current?.scrollToOffset({ offset: 0 })} style={{ shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5,backgroundColor:'black',borderColor:'black',bottom:20,position:'absolute',right:20,height:50,width:50,borderRadius:25}} size='tiny'>
       {/* <ArrowUp/> */}
       Up 
         </Button>

         <BottomSheetModalProvider>
    <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints} 
        > 
      <View style={{margin:20,alignContent:'flex-start',flex:1}} > 
    {displayContent()}
     </View>
        </BottomSheetModal> 
      </BottomSheetModalProvider>
    </ApplicationProvider>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
}

















const stylesGridCard = StyleSheet.create({

    container: {
      flex: 1,
      flexDirection: 'row',
    },
    layout: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
const styles = StyleSheet.create({
  button:{
    borderColor:Colors.buttonTheme,
    backgroundColor:Colors.buttonTheme,
    bottom:0,
    borderRadius:100,
    width:'auto',
    marginTop:5
},
  image: { 
    borderRadius:10, 
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  text: {
    margin: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: { 
    marginLeft:20, 

    width:width - 40
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});

