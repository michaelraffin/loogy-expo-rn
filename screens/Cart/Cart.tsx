import  React,{useEffect,useState,useContext,useRef,useMemo,useCallback}from 'react';
import { StyleSheet,ScrollView, Animated ,Dimensions,Image} from 'react-native';  
import CartComponent from '../../components/Cart/CartDetails';    
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import SelectedItemContext from "../../components/Utils/SelectedItemContext"
import ProductDetails from '../../components/Cart/ProductDetails';
import { View } from '../../components/Themed';
import { useFonts } from 'expo-font';
import { EventRegister } from 'react-native-event-listeners'
import Colors from '../../constants/Colors'; 
import { Button ,Text,Card,RadioGroup,Radio, Divider,Spinner,Layout,Calendar,Icon,Avatar, Tab, TabBar,ListItem,List} from '@ui-kitten/components';
import { cart, Theme,CartContextAction } from "../../components/Utils/UserCart";
import { Small,BigLoader,ButtonLoader,ButtonLoaderStandard} from "../../components/Loader"; 
import splash from '../../assets/images/splash.png'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default function Cart({ navigation ,route}) { 
  const { Details, updateCart } = cart(); 
  const [didView, set] = useState('Welcome'); 
  const [displayCart, update] = useState(DisplayLoader()); 
  const [displayLoder, setLoader] = useState(true); 
  const displayView = useRef(DisplayLoader())
  const isFocused = useIsFocused();
  const animationValue = useRef(new Animated.Value(0)).current 


const cartView = useMemo(()=> { 
  return <CartComponent  navigation={navigation}/>
},[Details.cartItems])
    
  function DisplayContent(){ 
 
    console.log(isFocused ? 'nice' : 'load')
    // isFocused ?  update(Details.cartItems.length === 0 ?  EmptyCart():<CartComponent  navigation={navigation}/>):    update(DisplayLoader())
       return DisplayLoader()
  }
 
  function DisplayLoader(){
    return <View>
    <ScrollView style={{backgroundColor:'white',height:1000,alignContent:'center'}} scrollEnabled ={false} showsHorizontalScrollIndicator = {false} showsVerticalScrollIndicator = {false}>
    <View style={{
    justifyContent: "center", 
    backgroundColor:'white', 
    position:'absolute',
    top:-50,
    width:width,
    height:'auto',
    elevation: 1
    }}>
    </View>
    <Image
        style={{width:'auto',height:height}}
        source={splash}
      />
  </ScrollView>
 </View>
   
  }
 

  // useEffect(() => {  
  //   setTimeout(() => { 
  //     update(isFocused ?  Details.cartItems.length === 0 ?  EmptyCart() : cartView() : DisplayLoader() )
  //       }, 100) 
  // }, [isFocused]); //isFocused
 

 
  
  useEffect(() => {
    Animated.loop(
          Animated.timing(animationValue,{
            toValue:1,
            duration:1000,
            useNativeDriver:true
          })
    ).start();
  },[])

  function EmptyCart() { 
    return (
     <ScrollView  style={{height:height,backgroundColor:'white'}}>
        <Layout style={styles.layout} level='1'>
              <View style={{height:height, flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',marginLeft:20,marginRight:20}}>
                      <Image source={{ uri: 'https://cdn.dribbble.com/users/2058104/screenshots/4198771/dribbble.jpg?compress=1&resize=800x600'}} style={{ width:'100%',
          height:200}}/>
  
            <Text  
                      style={styles.text} category='h5'>Your cart is empty</Text>
                    
                     
        <Button style={styles.button} onPress={()=>    navigation.navigate('Shop', { screen: 'TabOneScreen' })} status='primary'>
       Back to store  
    </Button>
              </View>
           
              </Layout>
     </ScrollView>
    )
  } 
 function diplayView(){ 
  var data = isFocused ?  EmptyCart() : DisplayLoader() 
  return  data
 }
  return  isFocused ?  Details.cartItems.length === 0 ?  EmptyCart() : cartView : DisplayLoader() // displayCart  //diplayView()
  
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    marginLeft:20,
    marginRight:20,
    marginBottom:5,
    marginTop:5,
    flexDirection: 'row',
  },
  button:{
    backgroundColor:Colors.buttonTheme,
    color:'white',
    borderColor:Colors.buttonTheme,
  margin:20 
  },
  buttonView:{
  width:width ,
  backgroundColor:'white'
  },
  text: {
    margin: 2,
  },
  headerTitle: {
    margin: 20,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },

  input: {
    flex: 1,
    margin: 2,
  },

  subTotalItem:{
    fontSize:14,
    alignContent:'flex-end',
    margin: 2,
  },
  subTotal:{
    flex: 1,
    margin: 2,
  },
  Total:{
    fontSize: 24,
    flex: 1,
    margin: 2,
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
    // alignItems: 'flex-start',
    // marginHorizontal: 50,
    marginLeft:20,
    // marginRight:20,

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


 
  //   EventRegister.addEventListener('AddCarts', (data) => {
  //     console.log('mikss',data.cartItems)
  //     update(data.cartItems.length === 0 ?  EmptyCart() :<ScrollView><Text style={{margin:200}}>{data.cartItems.length}</Text></ScrollView>)
  // })
  // return () =>{
  //   console.log('cleaning'),
  //   EventRegister.removeEventListener('AddCarts')
  // }

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => { 
  //     // var title =  Details.cartItems.length 
  //     // var empty = EmptyCart()
  //     // var itemCart = <CartComponent  navigation={navigation}/>
  //     // console.log('tabBarOptions',route)
  //     // update(Details.cartItems.length === 0 ?  EmptyCart():itemCart) 
  //     console.log('Hey waiting')
  //     // update(DisplayLoader())
  //     setTimeout(() => {
  //     // var title =  Details.cartItems.length 
  //     // var empty = EmptyCart()
  //     displayView.current = EmptyCart()
  //     console.log('ops')
  //     // var itemCart = <CartComponent  navigation={navigation}/>
  //     // console.log('tabBarOptions',route)
  //     update(Details.cartItems.length === 0 ?  EmptyCart():<CartComponent  navigation={navigation}/>)
  //     }, 500) 
  //   });

 

  //   return unsubscribe;
  // }, [navigation]);
 
  


// export default function Cart({navigation}) {
//     const list = useRef(0)
//   const [didView, set] = useState([]); 
//   const { Details, updateCart } = cart();  
//   // This hook returns `true` if the screen is focused, `false` otherwise
//   const isFocused = useIsFocused(); 
//   function renderCart(){
//         return (
//           <CartContextAction.Provider value={{Details, updateCart}}> 
//           <CartComponent   navigation={navigation}/>
//           </CartContextAction.Provider>
//         )
//       }
//   return <View>{isFocused ? renderCart() : null}</View>;
// }





// export default function Cart({navigation}) { 
//   const list = useRef(0)
//   const [didView, set] = useState([]); 
//   const { Details, updateCart } = cart();  

//   // useEffect(() => {
//   //  navigation.addListener('focus', (e) => {
//   //   set(Details.cartItems)
//   //   list.current =  Details.cartItems 
//   //   console.log(Details.cartItems.length)
//   // });


//   // }, [])  
//   React.useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       set(Details.cartItems)
//       list.current =  Details  
//       updateCart(list)
//       console.log('focuss')
//     });

//     return unsubscribe;
//   }, [navigation]);

//   function renderCart(){
//     return ( 
//       <CartComponent  navigation={navigation}/>
//     )
//   }
//   return (
//     renderCart()
//   );
// }




 
     {/* </ScrollView> */}
        {/* <BottomSheetModalProvider>
        <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
      
      <View style={sheet.contentContainer}>
        <SelectedItemContext.Provider value={{ item, update, xx}}> 
        <Product />
        </SelectedItemContext.Provider>
          
          </View>
        </BottomSheetModal>

    </BottomSheetModalProvider> */}