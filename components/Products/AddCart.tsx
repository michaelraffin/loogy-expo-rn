import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  Vibration
} from "react-native";
import { ApplicationProvider, Input } from "@ui-kitten/components";
import {
  Button,
  Text,
  Card,
  Radio,
  RadioGroup,
  Spinner,
  Layout,
  Icon
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { ProductDetailContext } from "../../Utils/UserContextAPI";
import LanguageContext from "../Utils/LanguageContext";
import SelectedItemContext from "../Utils/SelectedItemContext"; 
import CartContext from "../Utils/CartContext";
import Action from "../Utils/ProductAction";
import { AsyncStorage } from "react-native"; 
import { cart, Theme } from '../Utils/UserCart';
import { EventRegister } from 'react-native-event-listeners' 
import ButtonCart from '../../components/Products/AddCart';
import Colors from '../../constants/Colors'; 
var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height; 
const StarIcon = props => <Icon {...props} name="star" />;
export default function ViewProduct({onPressed}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cartList, setCart] = useState([]);
  const { options, setLanguage } = useContext(LanguageContext);
  const [currentItem, updateItem] = useState({ name: true }); 
  const { item, update } = useContext(SelectedItemContext); 
  const { cartDetails, updateDetails } = useContext(CartContext);  
  const [itemExist, setItem] = useState(false);

 const { Details, updateCart } = cart();  
  async function appendItem() {
    try {
      var content = JSON.stringify(cartList);
      await AsyncStorage.setItem("userCart", content);
    } catch (error) {
      // Error saving data
      alert("Something went wrong");
    }
  }

  async function _addCartItem(product) { 
    product.itemOptions = options 
    var items =   Details
    let total = items.cartItems.filter((data) => data._id === product._id).length
  
    if (total >=1 ) {
      setItem(true) 
      items.cartItems.map((data) => {
       if ( data._id === product._id) {
            product.itemOptions = options
       } 
      })   
    }else{ 
      items.cartItems.push(product)
      setItem(true) 
      
    }  
    updateCart(items) 
      return   items
      // onPressed() 
      // EventRegister.emit('AddCarts',true)
}

function addCart(items){
  _addCartItem(items).then ( data=> {    
      onPressed() 
    // EventRegister.emit('AddCarts',data)
 })
}
  function updateQuantity(e) {
    if (e === "Add") { 
      if (options.quantity < 20) {
      var cartObject = {}
      cartObject.quantity = options.quantity + 1
      cartObject.addons = options.addons
      cartObject.size = options.size
      cartObject.cartItems = options.cartItems
      setLanguage(cartObject);
    }else{
      // Vibration.vibrate(1)
    }
    } else {
      if (options.quantity > 1) { 
        var cartObject = {}
      cartObject.quantity = options.quantity - 1
      cartObject.addons = options.addons
      cartObject.size = options.size
      cartObject.cartItems = options.cartItems
  setLanguage(cartObject);
      }else{
        // var items =   Details
        // let total = items.cartItems.filter((data) => data._id === e._id).length
      
        // if (total >=1 ) { 
        //  var itemsItems =  items.cartItems.filter((data) => data._id !== e._id)
        // updateCart(itemsItems)  
        // alert('remove')
        // }
      } 
    }  
  }
 
  useEffect(() => { 
  }, []);


  function  validateItemExistence(e) { 
    var status  =  Details.cartItems.filter((data) => data._id === e._id).length  === 0 ? false : true  
    var title =   e.status ?  status || itemExist ?  'Update Cart ' : 'Add to  Cart'   :'Out of stock'
    return title
  }

let element = (e)=> (
  <Text category={"h6"} style={{color:'white',fontSize:15,fontWeight:'700'}}>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(e)}</Text>
)
  return (
    <ApplicationProvider  {...eva} theme={eva.light}>  
    
    <SelectedItemContext.Consumer>
      {items => ( 
        <React.Fragment>
          <Layout style={styles.container}>
            <Button
              style={{ marginTop: 20 }}
              onPress={() => updateQuantity("Minus")}
              appearance="ghost"
            >
              <AntDesign name="minuscircleo" size={24} color={Colors.buttonTheme} />{" "}
            </Button> 
              <Button
              style={{ marginTop: 20, marginLeft: -20, marginRight: -20,color:Colors.light.theme }} 
              appearance="ghost"
            > 
             <Text style={{color:'black' }}>{options.quantity}</Text>  
            </Button>
            <Button
              style={{ marginTop: 20 }}
              onPress={() => updateQuantity("Add")}
              appearance="ghost"
            >
              <AntDesign name="pluscircle" size={24} color={Colors.buttonTheme} />{" "}
            </Button> 
            <Button 
            disabled={items.status ? false : true}
            style={{marginLeft:30, marginTop: 20,width:'auto',marginRight:5,backgroundColor:items.status ?  Colors.buttonTheme : '#f5f6fa',color:'white',borderColor:items.status ? Colors.buttonTheme : '#f5f6fa'}}
            onPress={() => addCart(items)}
            appearance="filled"
          > 
           { validateItemExistence(items)} { items.status ?  element((items.price * options.quantity) + options.addons.price + options.size.price) : null}
          </Button>
          </Layout> 
        </React.Fragment>
      )}
    </SelectedItemContext.Consumer> 
  </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  button:{
    backgroundColor:Colors.buttonTheme
  },
  icon: {
    width: 32,
    height: 32
  },
  container: {
    marginLeft:5,
    marginRight:5,
    marginBottom:20,
    justifyContent:'center',
    flex: 1,
    flexDirection: "row"
    
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
}); 