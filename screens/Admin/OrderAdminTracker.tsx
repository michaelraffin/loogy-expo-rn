import React, { useEffect, useState, PureComponent, useRef } from "react";
import {
  Platform,
  StyleSheet,
  ScrollView,
  Image,
  InputAccessoryView,
  RefreshControl,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  TouchableWithoutFeedback
} from "react-native";
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
import * as eva from "@eva-design/eva";
import { axios } from "../../components/Utils/ServiceCall";
import { Video } from 'expo-av'; 
var Image_Http_URL = {
  uri:
    "https://cdn.dribbble.com/users/734476/screenshots/4020070/artboard_15.png"
};
var notFound = {
  uri:
    "https://i.pinimg.com/originals/74/c1/85/74c1853896c88c0a2bff2948efd5f034.png"
};
import moment from "moment";
import Svg, {
  Circle,
  Path,
  Line,
  Polyline,
  Polygon,
  Rect
} from "react-native-svg";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import PickerImage from "../../components/ImagePicker";
import { useIsFocused } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import {
  saveEntry,
  getEntry,
  removeItem
} from "../../components/Utils/StoreDetails" 
import { Small,BigLoader,ButtonLoader,ButtonLoaderStandard} from "../../components/Loader"; 
import {Sample1,SearchingComponent} from "../../components/Svgs"
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {schedulePushNotification} from '../../screens/Cart/Notification';
var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height
const LoadingIndicator = props => (
  <View>
    <Spinner />
  </View>
);
export default function TackerOrderHistory({route, navigation }) {

  const [activeChecked, setActiveChecked] = React.useState(true);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [recentStatus, showRecent] = useState(true);
  const [mobileNumber, setValue] = useState("");
  const [borderColor, SetBorderColor] = useState("");
  const [items, setItems] = useState({ count: 0 });
  const [status, loadingState] = useState(false);
  const [isFound, didFound] = useState(false);
  const [type, resultType] = useState("LANDING"); //LANDING
  const [mobile, setMobile] = useState("");
  const referenceOrderRef = useRef(null);
  const [recentItems, setRecent] = useState([]);
  const isFocused = useIsFocused();
  const bottomPadding = useRef(0); 
  const showRecentStatus = useRef(false);
  const [displayRecent, setDisplayRecent] = useState(false); 
const bottomSheetModalRef = useRef<BottomSheetModal>(null);  
const snapPointsCalendar = React.useMemo(() => ['25%','50%'], []);   
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
    setValue("");
  };

  
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  useEffect(
    () => {
      if (isFocused) {  
        loadingState(false); 
        try {
          const { orderReference} = route.params;
          console.log("ORDER,",orderReference)
          if (orderReference != undefined) { 
            setValue(orderReference)
            fetchOrderTracker(orderReference)
          }
        }catch(error) { 
          route.params = null
        }
        
      }else {
        setValue("")
      }
    },
    []
  );

  function pressedRecentItem(item) {
    setValue(item);
    fetchOrderTracker(item);
    bottomPadding.current = 0
  }



  function categorizeContent() {
    var content = [<View />];
    let finalItems =   recentItems.slice(Math.max(recentItems.length - 5, 0)) 
    finalItems.map(item => {
      content.push(
        <TouchableOpacity
          onPress={() => pressedRecentItem(item)}
        >
          <View 
            onPress={() =>pressedRecentItem(item)}
            key={item}
            style={{
              backgroundColor: "#b13636",
              margin: 10,
              width: "auto",
              height: 25,
              borderRadius: 100,
              justifyContent: "center",
              alignContent: "space-between"
            }}
          >
            <View style={{ margin: 5}}>
              <Text category="c2" style={{ color: "white" }}>
                {item}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row"
        }}
      >
        {content}
      </View>
    );
  }

  async function generateQRCode(e) {
   
    try {
      const data = { referenceOrder: items.results[0].orderReference };
      const response = await axios
        .post("/Qrcode", data, {
          responseType: 'arraybuffer'
        })
        .catch(error => console.log(error));
        console.log("xxxx",response)
        return response
      // if (response.data.count == 1) { 
      //   setItems(response.data)
      //   loadingState(false)
      //   resultType(response.data.status ? "FOUND" : "NOT-FOUND")
      //   referenceOrderRef.current = response.data.results[0].orderReference
      //   bottomPadding.current = response.data.results[0].paymentStatus === "ON-HOLD" ? 90 : 0 
      // }else {
      //   resultType("NOT-FOUND");
      //   loadingState(false);
      //   bottomPadding.current =  0
      // }
    
    } catch (error) {
      // resultType("LANDING");
      // console.error(error)
      // loadingState(false);
      // alert("Something went wrong, please try again later")
      // bottomPadding.current = 0
    } 
    // showRecent(false) 
  }
  
  async function fetchOrderTracker(e) {
    resultType("SEARCHING");
    loadingState(true);
    bottomPadding.current = 0 
    try {
      const data = { mobileReference: e.toString() };
      var link = "/orderTracker?mobileReference="+  e.toString()
      console.log(link)
      const response = await axios
        .post(link, data)
        .catch(error => console.log(error));
        console.log("xxxx",response)
      if (response.data.count == 1) { 
        setItems(response.data)
        loadingState(false)
        resultType(response.data.status ? "FOUND" : "NOT-FOUND")
        referenceOrderRef.current = response.data.results[0].orderReference
        bottomPadding.current = response.data.results[0].paymentStatus === "ON-HOLD" ? 90 : 0 
      }else {
        resultType("NOT-FOUND");
        loadingState(false);
        bottomPadding.current =  0
      }
    
    } catch (error) {
      resultType("LANDING");
      console.error(error)
      loadingState(false);
      alert("Something went wrong, please try again later")
      // bottomPadding.current = 0
    } 
    showRecent(false) 
  }
async  function sendNotif(){

    var data = {
      title:'Payment Status: Validation',
      body: 'Your payment validation is in progress for booking reference: ['+items.results[0].orderReference + ']. You will be notified once approved.',
    }
    let notif =  await schedulePushNotification(data)
  }
  function uploadPhoto() {
    let fetchStatus = fetchOrderTracker(referenceOrderRef.current).then(
      response => {
        bottomPadding.current =
          items.results[0].paymentStatus.paymentStatus === "ON-HOLD" ? 90 : 0;
      }
    );
    sendNotif()
  }
  function loadItems() {
    var content = [<View />];
    let itemsCart = JSON.parse(items.results[0].cartItems);
    itemsCart.map(data => {
      content.push(
        <React.Fragment key={data._id}>
          <TouchableOpacity key={data._id}>
            <Layout key={data._id} style={stylesCart.container}>
              <Layout
                key={data._id}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
                level="1"
              >
                <Avatar
                  style={{
                    marginTop: 10,
                    marginLeft: 10
                  }}
                  size="giant"
                  source={{ uri: data.imgUrl }}
                />
              </Layout>
              <Layout style={stylesCart.layout} level="1">
                <Text category="label">{data.title.substring(0, 10)}...</Text>
                <Text
                  category="c1"
                  style={{
                    marginTop: 5
                  }}
                >{data.itemOptions.quantity} X {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}
                </Text>
                <Text
                  category="c2"
                  style={{
                    color: "#0984e3",
                    borderRadius: 10
                  }}
                >
                  {data.itemOptions.addons.price === 0 ? null : "Addons"}
                </Text>
                

                {data.additionalNotes === null ? null :  <Text
              size="small"
              style={{color:'#0984e3'}}
               category="p2" 
              >{data.additionalNotes === null ? '' : type ? data.additionalNotes :'Show Greetings'}</Text>}
            


              </Layout>
            </Layout>
            <View
              style={{ height: 0.5, width: "auto", backgroundColor: "#d8d7d7" }}
            />
          </TouchableOpacity>
        </React.Fragment>
      );
    });
    return content;
  }

  async function showImageGallert() {
    return dd;
  }

  function DeliveryContent() {
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: 160
        }}
      >
        <Image
          style={{
            height: 100,
            width: 150,
            margin: 20
          }}
          size="giant"
          source={require("../../assets/images/deliverygif.gif")}
        />
      </View>
    );
  }
  function MapViewContent(details) {
    var coodinates =  items.results[0].deliveryDetails.Address
    var deliveryDetails =  items.results[0].deliveryDetails
    var cordinateMarker = {}   
    var markerDetails  = {
      title: "Paculba Flowershop",
      description :"0975-365-3640"
    } 
    if (isString(items.results[0].locationType)  || items.results[0].OrderType == "Store-Pickup"){
      cordinateMarker =  {
          latitude: 8.2283,
          longitude: 124.24319704994559
      }
    }else {
      cordinateMarker = {
        latitude: coodinates.latitude,
        longitude: coodinates.longitude
      }  
      
      markerDetails = {
        title :  "Receiver: " + deliveryDetails.Receiver + " ContactNumber : " +  deliveryDetails.ReceiverContactNumber,
        description : "Time & Date: "  +moment(items.results[0].deliverySchedule.date).format('ll')  + " at "+   items.results[0].deliverySchedule.slot.time
      }
    }


    return (
      <MapView
        showsTraffic={true}
        onMarkerDeselect={false}
        provider="google"
        mapType={"google"}
        showsBuildings={true}
        provider={null}
        showsIndoors={true}
        showsCompass={true}
        showsPointsOfInterest={true}
        zoomTapEnabled={true} 
        initialRegion={{
          heading: 20,
          pitch: 20,
          zoom: 10000,
          altitude: 100,
          latitude: 8.2283,
          longitude: 235.757,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
        showsUserLocation
        style={{
          width: 'auto',
          marginTop:20,
          height: 200,borderRadius:10
        }}
      >
        <MapView.Marker
        
        //  style={{zIndex: 200, position:"absolute"}}
          coordinate={cordinateMarker}
          title={markerDetails.title}
          description={markerDetails.description}
          />
            {/* <View style={{width:'auto',height:100,backgroundColor:'white',opacity:1,borderRadius:20}}><Text>{markerDetails.title}</Text></View> */}
            {/* </MapView.Marker> */}
      </MapView>
    );
  }

  function QRCodeContent(reference) {
     generateQRCode().then(xxx => {
       console.log(xxx)
      let blob = new Blob(
        [xxx.data], 
        { type: xxx.headers['content-type'] }
      )
      // let image = URL.createObjectURL(blob)
      // console.log('imageeee',image)
    //   return image
    // }) 
    }) 
  }
  function isString(val) {
    return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
 }

 function  displayVideo() {
   try {
     if (items.results[0].videoGreetings !== "none") {
      return    <React.Fragment><Text category="c1" style={{ margin: 2 }}>
      Video</Text>
      {console.log('videoeee',items.results[0])}
   <Video
   source={{ uri: items.results[0].videoGreetings.link }}
   rate={1.0}
   volume={1.0}
   isMuted={true}
   useNativeControls={true}
   resizeMode="contain"
   shouldPlay
   isLooping
   style={{ width: 'auto', height: 200,borderRadius:20,marginBottom:20}}
   />
      {/* <Text category="c1" style={{ margin: 2 }}>
                            Video QrCode</Text> 
                            {QRCodeContent()}
                            <Divider style={{width:'auto',height:1,margin:5}}/> */}

   </React.Fragment>
     }else {
      return null
     }

   } catch (error) {
     return null
   }
   
 }

 function colorCategory(e) {
  var color = "#2ed573"
  switch (e) {
    case 'ON-HOLD': 
     color = "#ff4757"
      break;
      case 'PAYMENT VERIFIED': 
      color = "#27ae60"
       break;
      case 'ORDER ACCEPTED': 
      color = "#27ae60"
       break;
      case 'FOR VALIDATION': 
      color = "#ffa502"
      break;
      case 'IN TRANSIT': 
      color = "#2ed573"
      break;
      case 'DELIVERED': 
      color = "#6ab04c"
      break;
    default:
      color = "#ff4757"
      break;
  }
  return color
 }
 function displayBankDetails(e) { 
   
  var content = (<View></View>)
  var itemBankList = []
  if (e.itemName === 'Bank Deposit') { 
    const renderItem =  e.items.map( data =>{ 
    itemBankList.push(<Text  category='c2' >◉ {data.itemName} - {data.itemDetails}  </Text>)
    })
  }else {
    itemBankList.push(<Text  category='c2' >{e.itemName} - {e.itemDetails}</Text>)
  }
 
   return itemBankList
 }
  function DeliveryContentView(){
    var deliveryDetails = ""
    try {
      deliveryDetails =   isString(items.results[0].locationType) ?  items.results[0].locationType === "MapManual" ?  items.results[0].Address :   items.results[0].Address.latitude :  null
    }catch {
      deliveryDetails = ""
    }
  
    return  (
      <React.Fragment>{DeliveryContent()}<Text category="p1">Delivery</Text></React.Fragment>
    )
  }
  function validateItems() {
    var displayContent  = <View/> 
    switch (type) {
      case 'LANDING':
        displayContent = null
        break;
        case 'FOUND':
        
            displayContent = (<React.Fragment>    
              <Divider style={{width:width,height:1}}/>                
                        <Layout style={{ flexDirection: "row", marginBottom: 20 }}>
                          <Card
                            status="basic"
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 20,
                              height: "auto",
                              flex: 1,
                              borderRadius:10,
                              borderColor:
                                items.results[0].paymentStatus === "ON-HOLD"
                                  ? "#ced6e0"
                                  : "#ced6e0",
                              borderWidth: 2,
                              borderStyle: "dashed"
                            }}
                          >
                            {displayVideo()}
                                 <Text category="c1" style={{ margin: 2 }}>
                            Reference Order</Text>
                            <Text category="c2" style={{ margin: 2 }}>
                              {items.results[0].orderReference}
                            </Text> 
                            <Divider style={{width:'auto',height:1,margin:5}}/> 

                            <Text category="c1" style={{ margin: 2 }}>
                            Order type </Text>
                            <Text category="c2" style={{ margin: 2 }}>
                              {items.results[0].OrderType}
                            </Text> 
                            <Divider style={{width:'auto',height:1,margin:5}}/>
                            <Text category="c1" style={{ margin: 2 }}>
                             Mode of Payment  </Text>
                            <Text category="c2" style={{ margin: 2 }}>
                              {console.log('Michael',items.results[0].paymentDetails)}
                              {displayBankDetails(items.results[0].paymentDetails)}
                            </Text>
                            <Divider style={{width:'auto',height:1,margin:5}}/>
                            <Text category="c1" style={{ margin: 2 }}>
                            Delivery Date  </Text>
                            <Text category="c2" style={{ margin: 2 }}>
                            {moment(items.results[0].deliverySchedule.date).format('ll')  + " at "+   items.results[0].deliverySchedule.slot.time}
                            </Text> 
                            <Divider style={{width:'auto',height:1,margin:5}}/>
                            <Text category="c1" style={{ margin: 2 }}>
                            Payment Status   </Text>
                            <Text
                              category="c2"
                              style={{ 
                                margin: 2,color: colorCategory(items.results[0].paymentStatus) 
                              }}
                            >{items.results[0].paymentStatus}
                            </Text>
                          
                            <Divider style={{width:'auto',height:1,margin:5}}/>
                       <Text category="c1" style={{ margin: 2 }}>
                            Order Status</Text>
                            
                            <Text category="c2" style={{ margin: 2 ,color: colorCategory(items.results[0].orderStatus)}}>
                              {items.results[0].orderStatus}
                            </Text>  
                            <Button   onPress={()=>handlePresentModalPress()}  disabled={items.results[0].orderStatus === "DELIVERED"  ? false: true}  status='basic' ca style={{ margin: 2 ,color: 'blue'}}>
                            View Proof Delivery here
                            </Button>  
                           
                            <Divider style={{width:'auto',height:1,margin:5}}/>
                            <Text category="c1" style={{ margin: 2 }}>
                            Customer Details  </Text>
                            <Text
                              category="c2"
                              style={{ 
                                margin: 2
                              }}
                            >{items.results[0].deliveryDetails.SenderName} ||  {items.results[0].deliveryDetails.Mobile}
                            </Text>
                            <Divider style={{width:'auto',height:1,margin:5}}/>
                              
    
    
                              {items.results[0].OrderType == "Store-Pickup" ? null :  <React.Fragment><Text category="c1" style={{ margin: 2 }}>
                            Receiver Details  </Text>
                            <Text
                              category="c2"
                              style={{ 
                                margin: 2
                              }}
                            >{items.results[0].deliveryDetails.Receiver} ||  {items.results[0].deliveryDetails.ReceiverContactNumber}
                            </Text>
                            <Divider style={{width:'auto',height:1,margin:5}}/></React.Fragment>}
                              {MapViewContent()}
                            <Text category="c1" style={{ margin: 10}}>
                             {items.results[0].OrderType == "Store-Pickup" ? 'Store Location' : items.results[0].deliveryDetails.locationType === "MapPicker" ?  "Receiver's address" : "Address: " + items.results[0].deliveryDetails.Address.address  }</Text>
                            <View
                              style={{
                                width: width,
                                backgroundColor: "gray",
                                height: 0.2,
                                marginTop: 20,
                                width: "auto"
                              }}
                            /><View
                              style={{
                                backgroundColor: "white",
                                borderRadius: 10,
                                margin: 20,
                                flex: 1,
                                alignContent: "center",
                                justifyContent: "center"
                              }}
                            >{loadItems()}
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              ><Text category="c2" style={{ color: "black", marginTop: 20 }}> Grand Total:  
                               {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(items.results[0].totalPrice)}</Text>
                              </View>
                            </View>
                          </Card>
                        </Layout>
                      </React.Fragment>)
          // }
       
        break;
       case 'NOT-FOUND':
       displayContent = EmptyState()
       break;

       case 'SEARCHING':
        displayContent = Searching()
        break;

       
      default:
        displayContent = null
        break;
    }
 
    return displayContent
  }
  function Searching() {
    return (
      <Layout style={styles.layout} level="1">
 
        <View
          style={{
            margin:20
            // height: 400,
            // flex: 1,
            // justifyContent: "center",
            // alignItems: "center",
            // marginLeft: 20,
            // marginRight: 20
          }}
        >
                 <BigLoader/>
 
        <BigLoader/> 
        {/* <SearchingComponent/>
          <Text 
            onChangeText={nextValue => setMobile(nextValue)} dsad
            category="h5"
          >Searching...</Text> */}
    
        </View>
      </Layout>
    );
  }
  function EmptyState() {
    return (
      <Layout style={styles.layout} level="1">
        <View
          style={{
            height: 400,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop:50
            // borderColor:'gray',
            // borderWidth:0.5,
            // borderRadius:20
            
          }}
        >
        <Sample1/>

        <Text 
            onChangeText={nextValue => setMobile(nextValue)} 
            category="h5"
          > Not found
          </Text>
          <Button style={{marginTop:20,backgroundColor:'#b13636',borderColor:'#b13636'}} onPress={()=> resultType('LANDING')}>Search again</Button>
        
        </View>
      </Layout>
    );
  }

  const renderIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Text>Clear</Text>
    </TouchableWithoutFeedback>
  );
  function searchView() {
    return (
      <View
        style={{
          height: height / 2,
          alignContent: "center",
          justifyContent: "center"
        }}
      >
        <Image source={Image_Http_URL} style={styles.image} />
        <Text style={styles.text} category="s1">
          Track 1da order status here
        </Text>
        {/* <Input
          accessoryRight={renderIcon}
          disabled={status? true:false} 
          style={{width:200,marginTop:10}} 
                         placeholder="Your Mobile number"
                         value={mobileNumber}
                         onChangeText={mobile => setValue(mobile)}
                       />
         <Button onPress={fetchOrderTracker}  accessoryLeft={status ? LoadingIndicator : null}    disabled={status? true:false} style={{marginTop:20,backgroundColor:'#b13636',borderColor:'#b13636'}}  >
          {status? 'Loading...':'Submit' }
         </Button>  */}
      </View>
    );
  }
  function displayResult() {
    <View style={{}}>
      <Image source={Image_Http_URL} style={styles.image} />
      <Text style={styles.text} category="s1">
        Track your order status here
      </Text>
      <Input
     
        disabled={status ? true : false}
        style={{ width: 200, marginTop: 10 }}
        keyboardType="numeric"
        placeholder="Your Mobile number"
        value={mobileNumber}
        onChangeText={mobile => setValue(mobile)}
      />
      <Button
        onPress={fetchOrderTracker(mobileNumber)}
        accessoryLeft={status ? LoadingIndicator : null}
        appearance={status ? "outline" : ""}
        disabled={status ? true : false}
        style={{ marginTop: 20 }}
        status="primary"
      >
        {status ? "Loading..." : "Submit"}
      </Button>
    </View>;
  }
  // showRecent(!recentStatus)  {recentStatus ? arrowUp() : arrowDown()}
  function emptyRecord(){
    return (<Layout style={styles.layout} level="1">
    <View
      style={{
        height: 400,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20,
        marginRight: 20,
        marginTop:50
        // borderColor:'gray',
        // borderWidth:0.5,
        // borderRadius:20
        
      }}
    ><Image source={{ uri: 'https://i.pinimg.com/originals/81/c4/fc/81c4fc9a4c06cf57abf23606689f7426.jpg'}} style={{ width:400,
    height:200}}/>
    <Text 
        onChangeText={nextValue => setMobile(nextValue)} 
        category="s1"
      > No order history
      </Text>
      <Button style={{marginTop:20,backgroundColor:'#b13636',borderColor:'#b13636'}}   onPress={()=>   navigation.navigate('Shop', { screen: 'TabOneScreen' })}>Back to store</Button>
    </View>
  </Layout>)
  }
  function recentView() {
    const holderView = (
      <View style={{ marginLeft: 20 ,backgroundColor:'white'}}>
        <TouchableOpacity>
          <Text
            category="p1"
            style={{ color: "#a4b0be", fontSize: 12 }}
            onPress={() => console.log('miss')}
          >
          Your recent order
          </Text>
        </TouchableOpacity>
        <ScrollView 
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          // style={{ marginLeft: 5, height: recentStatus ? 60 : 0 }}
          style={{ marginLeft: 5, height: 60}}
        >
          {categorizeContent()}
        </ScrollView>
      </View>
    );

    return holderView;
  }
  function updateKeyboard(e){
    console.log('i was calle',e)
    setDisplayRecent(e)
    showRecentStatus.current = e
  }
  function landingPage(){
    return(
    <React.Fragment>
        <Text style={{ marginLeft: 20 }} category="h2">
           Check customer Orders
          </Text>
          <Layout
            style={{
              marginRight: 20,
              backgroundColor: "white",
              flex: 1,
              flexDirection: "row"
            }}
          >
            <Layout
              style={{
                flex: 1,
                justifyContent: "flex-start",
                backgroundColor: "white",
                alignItems: "left"
              }}
              level="4"
            > 
            </Layout>
          </Layout> 
          {/* {recentItems?.length  ? recentView():emptyRecord() } */}
       {/* {recentItems?.length  ? type === "SEARCHING" || type === "FOUND" ? recentView():emptyRecord()  : null} */}
          {/* </View> */}

    </React.Fragment>
    )
  }

  function mainContent(){
    
    

  }
  // recentItems
  

  function proofPaymentContent(e){
    var list = [] 
    try {
      e.proofDeliveryLink.map(item => {
        list.push(
          <Image source={{
            uri:item
          }} style={{height:width,width:width}} />
        )}
      )
      
    }
    catch (error) {
      return <View/>
    }
    return   <ScrollView pagingEnabled={true} horizontal={true} style={{width:'auto',height:'auto'}}>{list}</ScrollView> 
    } 
  

  return  (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ScrollView
        style={{
          backgroundColor: "white",
        //   marginBottom: bottomPadding.current
        }}
      >
        <Layout style={styles.container}>  
        {type === "FOUND" ? landingPage() : null || type === "SEARCHING" ? landingPage() : null || type === "LANDING" ? landingPage() : null}

        
          <Layout style={styles.layout} level="1">
           {validateItems()}
          </Layout>
        </Layout>
      </ScrollView> 
      {type === "FOUND" ? items.results[0].paymentStatus ===  "ON-HOLD" ? null : null:   null }
     
    <BottomSheetModalProvider>
    <BottomSheetModal 
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPointsCalendar} 
        ><React.Fragment></React.Fragment>
         {items.count === 0  ? null : <Layout style={{ flexDirection: "row", marginBottom: 20 }}>{proofPaymentContent(items.results[0])}</Layout>}
        </BottomSheetModal> 
    </BottomSheetModalProvider>
    </ApplicationProvider>
  );
}

const stylesCart = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
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

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    margin: 2
  },
  container: {
    marginTop: 70,
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column"
  },
  radio: {
    margin: 2
  },
  layout: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

function arrowDown() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      color="#b13636"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-chevron-down"
    >
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

function arrowUp() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      color="#b13636"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-chevron-up"
    >
      <Path d="M18 15l-6-6-6 6" />
    </Svg>
  );
}
