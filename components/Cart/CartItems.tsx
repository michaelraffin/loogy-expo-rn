import React, { useState, PureComponent, useContext,useRef } from "react";
import CartContext from "../Utils/CartContext"; 
import * as eva from "@eva-design/eva";
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  View
} from "react-native";
import { ApplicationProvider, Divider, Input  } from "@ui-kitten/components";
import {
  Button,
  Text,
  Card,
  Radio,
  RadioGroup,
  Avatar,
  Layout
} from "@ui-kitten/components";

import { AntDesign } from "@expo/vector-icons";

import { cart, Theme,CartContextAction } from '../Utils/UserCart';
 
import CartState from '../Utils/CartState';

import Svg, { Path } from "react-native-svg"
function SvgComponent() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"  >
      <Path d="M495.914 189.604c-18.965-15.914-47.343-13.424-63.228 5.506l-42.695 50.523V99.129c0-12.279-5.106-24.17-14.008-32.625l-56.978-54.125C310.606 4.4 299.6.005 288.015.005H44.999C20.187.005 0 20.192 0 45.004v421.991c0 24.812 20.187 44.999 44.999 44.999h299.994c24.812 0 44.999-20.187 44.999-44.999v-81.961L501.46 253c15.987-19.052 13.509-47.408-5.546-63.396zM299.994 35.695c60.013 57.008 55.751 52.841 56.876 54.309h-56.876V35.695zm59.998 431.3c0 8.271-6.729 15-15 15H44.999c-8.271 0-15-6.729-15-15V45.004c0-8.271 6.729-15 15-15h224.995v74.998c0 8.284 6.716 15 15 15h74.998v161.129l-63.77 75.46a45.226 45.226 0 00-9.296 18.47l-13.94 58.356a14.999 14.999 0 0020.555 17.248l55.05-23.862a45.226 45.226 0 0011.401-7.151v47.343zm-35.677-97.168l22.978 19.28-5.11 6.052a15.057 15.057 0 01-5.523 4.12l-27.524 11.931 6.971-29.178a15.019 15.019 0 013.064-6.116l5.144-6.089zm42.329-3.643l-22.967-19.271 82.91-98.11 22.919 19.231-82.862 98.15zm111.865-132.502l-9.649 11.43-22.908-19.222 9.682-11.457c5.289-6.303 14.71-7.125 20.997-1.849 6.412 5.379 7.119 14.852 1.878 21.098z" />
      <Path d="M224.995 90.003H74.998c-8.284 0-15 6.716-15 15s6.716 15 15 15h149.997c8.284 0 15-6.716 15-15s-6.716-15-15-15zM314.993 181.001H74.998c-8.284 0-15 6.716-15 15s6.716 15 15 15h239.995c8.284 0 15-6.716 15-15s-6.716-15-15-15zM314.993 271H74.998c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15h239.995c8.284 0 15-6.716 15-15 0-8.285-6.716-15-15-15zM224.995 360.998H74.998c-8.284 0-15 6.716-15 15s6.716 15 15 15h149.997c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
    </Svg>
  )
}

const MemoSvgComponent = React.memo(SvgComponent) 

var width = Dimensions.get("window").width;
var Image_Http_URL = {
  uri:
    "https://scontent.fmnl9-2.fna.fbcdn.net/v/t1.0-9/133062997_670673320292451_3457467490911310937_n.jpg?_nc_cat=107&ccb=2&_nc_sid=8bfeb9&_nc_ohc=Ea26CBOdayIAX-1P_pp&_nc_ht=scontent.fmnl9-2.fna&oh=408eae8f0c4de050398ccf808ad3983a&oe=600D4A80"
};

 
export default  React.memo (({ items, deleteCart,viewItem,xxx}) => { 

  const [selectedIndex, setSelectedIndex] = useState(0);
  const myPromise = useRef();
  const { Details, updateCart } = cart() 
  const [cartItems, Update] = useState(Details);
  const collapsed = useRef(false);
  const List = useRef([]);
  const [type, setCollapse] = useState(false);
  // const { itemDetails, updateDetails }  = useContext(CartState);
  // const { cartDetails, updateDetails } = useContext(CartContext);
  function deleteItem(item) {  
    // let updated = Details 
    // let newlist =   updated.cartItems.filter( data => data._id != item._id)
    // updated.cartItems = newlist   
    // List.current =   newlist
    // // updateCart(updated) 
    // Update(updated) 
    deleteCart(item) 
  } 

function showCollapse(){ 
  collapsed.current =  !collapsed.current
  setCollapse(!type)
}

 
  function loadItems() { 
    List.current =   Details.cartItems
    var content = [<View />];  
    List.current.map((data, index)  => {  
      content.push(
        <React.Fragment key={index}> 
        <TouchableOpacity   onPress={()=> showCollapse()}> 
          <Layout  style={styles.container}>
            <Layout    style={styles.layoutAvatar} level="1">
              <Avatar
                style={{
                  marginTop: 10
                }}
                size="giant"
                source={{uri:data.imgUrl}}
              />
            </Layout> 
            <Layout key={index} style={styles.layout} level="1">
              <Text category="label"  >{data.title.substring(0, 10)}...</Text> 
              <Text
               category="c1" 
                style={{
                  marginTop: 5
                }}
              >
              {data.itemOptions.quantity} X   {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}
          
              </Text>
             {data.itemOptions.size.name === undefined ? null :  <Text category="label">{'('+ data.itemOptions.size.name.substring(0, 1)+')'}</Text> }
             
              <Text
                category="c2"
                style={{
                  color:'#0984e3',
                  borderRadius: 10,
                  // backgroundColor:'#68a0cf',
                  // backgroundColor:'green',
                  // marginTop: 5
                }}
              >

              { data.itemOptions.addons.price === 0 ? null :'Addons'}
              </Text>
              {data.additionalNotes === null ? null :  <Text
              size="small"
              style={{color:'#0984e3'}}
               category="p2" 
              >{data.additionalNotes === null ? '' : type ? data.additionalNotes :'View Notes'}</Text>}
             {/* <Text
              size="small"
              style={{color:'#0984e3'}}
               category="p2" 
              >{data.size === null ? '' : 'Size:' + data.size.name}</Text> */}
             
             {console.log(data.size === undefined ? '' : 'Size:' + data.size.name)}
              
            </Layout> 
            <Layout style={styles.layout} level="1"> 
              <Button size="small" onPress={() => deleteItem(data)} status="basic">
                Delete
              </Button> 
            </Layout> 
          </Layout>
          <View
            style={{ height: 0.5, width: width, backgroundColor: "#d8d7d7" }}
          /> 
          </TouchableOpacity>
        </React.Fragment>
      );
    }); 
    return content;
  }
  return (
    <React.Fragment>    
      {loadItems()} 
  </React.Fragment> 
  )
  })

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
    flexDirection: "row"
  },
  layoutAvatar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
  }
}); 