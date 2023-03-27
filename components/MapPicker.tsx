import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  InputAccessoryView,
  Alert,
  Linking
} from "react-native"; 
import { View } from "../components/Themed"; 
import {
  Input,
  Text,
  Button,
  Card,
  RadioGroup,
  Radio,
  Divider,
  Spinner,
  Layout,
  Calendar,
  Icon,
  Toggle,
  ApplicationProvider,
  IndexPath, Select, SelectItem
} from "@ui-kitten/components"; 
import * as eva from "@eva-design/eva"; 
import * as Permissions from "expo-permissions";
import MapView, { Marker,PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location"; 
import {MapMarker,Back,BackDark} from "../components/Svgs"
import Colors from '../constants/Colors';
var Image_Http_URL = {
  uri:
    "https://cdn1.iconfinder.com/data/icons/ui-ux-set/24/location-mini-512.png"
};

var width = Dimensions.get('window').width;
import Svg,{Circle,Path,Line,Polyline,Rect,Polygon} from "react-native-svg"
export default function TimePicker({getSetLocation,dismiss,storeDetails,selectionAddress}) {
  const [status, didPrompt] = useState(false);
  const [isManual, setType] = useState(true);
  const [value, setValue] = useState(null);
  const [buttonStatus, setButton] = useState(true);
  const [locale, geoSet] = useState(undefined);
  const [marker, set] = useState({});
  const [coor, setCoordinates] = useState({});
  const isMap = React.useRef(false);
  const [activeChecked, setActiveChecked] = React.useState(false);
  const [borderColor, SetBorderColor] = useState("#f7f1e3");
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [drag, setDrag] = React.useState(false);
  // const [contentDisplay,setContent]  = useState(mapContentView())
  const [deliveryList, setDeliveryList] = useState(null);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  };

useEffect(() => { 
  setDeliveryList(storeDetails.storeOptions.deliveryList)
}, [])

  const onActiveCheckedChange = (isChecked) => {
    console.log(isChecked)
    setActiveChecked(isChecked);
  };
  const rnd = (data) => ( 
    <TouchableWithoutFeedback onPress={toggleSecureEntry}> 
    <MapMarker/>
     </TouchableWithoutFeedback>
    
  )
  async function getLocation() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    return status
// if (status === "granted") {
//  return status
  // const  {status} = await Permissions.askAsync(Permissions.LOCATION)
  //   console.log('asak again',status)
  //   return status  
// }
  
  }
  async function asAgain() {
     const { status } = await Permissions.askAsync(Permissions.LOCATION);
     const  askAgain = await Permissions.askAsync(Permissions.LOCATION);
     console.log(askAgain)
      return status ? status : askAgain
  }

  
const settingsLinker = ()=> (
  dismiss(),
  Linking.openURL('app-settings://notification/com.raffin0000.Nidz')
)

  useEffect(() => {
   try {
    setTimeout(() => {
      getLocation().then( (status) => {
        console.log('status',status)
        if (status == "granted") { 
      
         navigator.geolocation.getCurrentPosition(coords => {
          console.log(coords.coords);
          setCoordinates(coords.coords);
          setMarker(coords.coords);
          didPrompt(true);
        });
        }else{

          asAgain().then ( (status) => {
              if (status === "granted") {
                navigator.geolocation.getCurrentPosition(coords => {
                  console.log(coords.coords);
                  setCoordinates(coords.coords);
                  setMarker(coords.coords);
                  didPrompt(true);
                });
              }else {
                Alert.alert(
                  'Location Required',
                  'Please allow our app to access your location',
                  [
                   
                    { text: 'Go to settings', onPress: () => settingsLinker()},
                    { text: 'Cancel', style: 'cancel' , onPress: () => dismiss() }
                  ],
                  { cancelable: false }
                );
              }
          })
          
        }
    
      })
    }, 500); 
  //   fetchProduct();
   } catch (error) {
    setSecureTextEntry(true)
   }
   
  }, []);

  function CustomMarker() {
    return (
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 30,
          backgroundColor: "#007bff",
          borderColor: "#eee",
          borderRadius: 5,
          elevation: 10
        }}
      />
    );
  }
   function setMarker(e) {
   setButton(true)
    setTimeout(() => {    
    getLocale(e).then ( geoLocale => {
      set(e); 
    geoSet(geoLocale[0]); 
    setButton(false)
    setDrag(false) 
     })
  }, 1000) 

  }

  async function getLocale(e) {
    try {
      let location = await Location.reverseGeocodeAsync({
        latitude: e.latitude,
        longitude: e.longitude
      })
      return  location
    }catch {
      return null
    }
  }
  function address() {
    var address = {};
    address =
      locale.postalCode +
      " " +
      locale.district +
      " " +
      locale.name +
      " " +
      locale.region;
    return address.substring(0, 50);
  }

function  dissableButton() {
  setDrag(true)
  setButton(true)
}
function mapViewContent(){  
  return (<React.Fragment>
        <MapView
        showsBuildings={true}
        // showsTraffic={true}
        // provider={PROVIDER_GOOGLE}
        showsIndoors={true}
        rotateEnabled={true} 
        // showsScale?: boolean;
        // showsBuildings?: boolean;
        // showsTraffic?: boolean;
        // showsIndoors?: boolean;
    showsScale = {true} 
          showsMyLocationButton={true}
          showsCompass={true}
          showsPointsOfInterest={true}
          zoomTapEnabled={true} 
          // onMarkerDragStart={(e)=> console.log(e)}
          // onPanDrag={(drag)=> setDrag(true)}
          onRegionChangeComplete={(loc)=>setMarker(loc)} 
          // minZoomLevel={13}
          // maxZoomLevel={17}
          onRegionChange={(e)=> dissableButton()}
          initialCamera={{
            center: {
              latitude: 8.2225,
              longitude: 124.2378
            }
            ,
            heading: 20,
            pitch: 20,
            zoom: 10000,
            altitude: 100
          }}
          getMarkersFrames={true}
          // onLongPress={v => setMarker(v.nativeEvent.coordinate)}
          showsUserLocation
          // initialRegion={{
          //   latitude: 8.2225,
          //   longitude: 124.2378
          // }}
          style={styles.map}
        >
             <Image
              source={Image_Http_URL}
              style={{ height: 100, width: 100,opacity: drag ? 0.2: 1}}
            />
          {/* <Marker
            key={"index"}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
          >
            <Image
              source={Image_Http_URL}
              style={{ height: 100, width: 100 }}
            />
          </Marker> */}
        </MapView>
    </React.Fragment>)
}


function loadCity(){
  var selectOption = [] 
    deliveryList  === null ? null :  deliveryList.map( data=> { 
      selectOption.push(
    <SelectItem  key={data.id} disabled={!data.status}  title={` ${data.displayName} -- ${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.price)}`}/>
    )
    }
  ) 

  function filterDisplayName(e){ 
    return (
    <React.Fragment style={{width:500}}><Svg xmlns="http://www.w3.org/2000/Svg" width="24" height="24" viewBox="0 0 24 24" fill={Colors.buttonTheme} color="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></Path><Circle cx="12" cy="10" r="3"></Circle></Svg><Text>{deliveryList === null  ? '...' : deliveryList[selectedIndex.row].displayName}</Text><Text style={{color:'#44bd32'}}> +{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(deliveryList === null ? 0 : deliveryList[selectedIndex.row].price)}</Text></React.Fragment>
    )
  }
  function setDeliveryAddressOption(e){
    setSelectedIndex(e)
  }
  return ( 
    <React.Fragment>
      <Select 
    placeholder="Select your city"
    autoFocus={true} 
    value={deliveryList === null ? ''  : filterDisplayName()}
    selectedIndex={selectedIndex} 
    onSelect={index =>  setDeliveryAddressOption(index)}
    >{selectOption} 
    </Select> 
    <Text style={{marginTop:20}} category="c1">Other areas not on the list will be charged accordingly depending on the distance *</Text>
    </React.Fragment>
  )
}
function mapContentView() {
  return (
    <SafeAreaView>
      <View  style={{margin:20}}> 
        <TouchableOpacity onPress={toggleSecureEntry}>
        <BackDark/>
          </TouchableOpacity> 
      </View>
  
    <View > 
    <Input     accessoryRight={rnd}
       style={{margin:20,width:width-50,height:30}}  > {locale !== undefined ? address() : "Loading...."} </Input> 
    <Button disabled={buttonStatus} style={{backgroundColor:buttonStatus ? Colors.buttonTheme :Colors.buttonTheme ,borderColor:'#f8c291',color:'white',marginLeft:20,marginRight:20,marginBottom:20,width:width}} onPress={()=>getSetLocation(marker,address(),secureTextEntry ?  "MapManual" :"MapPicker")} >Set Delivery</Button>
    <View
      style={{
      }}>
  {status ? ( 
      mapViewContent()
        ) : null}
  
    </View>  
  </View>
  </SafeAreaView>
  )
}
function dismissKeyboard(){
  try {
    getSetLocation(deliveryList[selectedIndex.row],`${value}, ${deliveryList[selectedIndex.row].displayName}`,secureTextEntry ?  "MapManual" :"MapPicker")
  }catch {
    getSetLocation(value,value,secureTextEntry ?  "MapManual" :"MapPicker")
  }
  
}
function manualType() {
  return (
    <SafeAreaView>
      <Text style={{margin:20}} category='h1'>Set your delivery address</Text>
      <Divider/>
    <View style={{margin:20}}>
    {loadCity()} 
    </View>
    <Input
     onFocus={()=>SetBorderColor('#f8c291')}
     onBlur={()=>SetBorderColor('#f7f1e3')}
       inputAccessoryViewID={"xxx"}
       style={{margin:20,width:width-50,marginTop:10}} 
        keyboardType="text" 
          placeholder="Please state your street or barangay"
          value={value}
          onChangeText={nextValue =>  setValue(nextValue)}
        />  
<Layout style={ {
  marginTop:60,
            marginLeft:20,
            marginRight:20,
            backgroundColor:'white',
    flex: 1,
    position:'fixed',
    bottom:0,
    flexDirection: 'row',
          }}>
<Layout style={{ flex: 1,
    justifyContent: 'center',
    backgroundColor:'white',
    alignItems: 'center',}}  level='3'>
<Button  disabled={value == null ? true:false || value == '' ? true:false} style={{ backgroundColor:value == null  ? Colors.disable : Colors.buttonTheme ,borderColor:value == null  ? Colors.disable : Colors.buttonTheme,color:'white',marginTop:20,width:width-50}} onPress={()=> dismissKeyboard()}   >Set Delivery Address</Button>
</Layout> 
</Layout> 
    </SafeAreaView>
  )
}
  return  <View/> //(  secureTextEntry  ?   manualType()   : mapContentView()  );
}
const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    marginTop: 20,
    // flex: 1,
    backgroundColor: "#fff"
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: Dimensions.get("window").width,
    height: 500,  
    //   width: Dimensions.get("window").width,
    // height: 500,
    // backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
  }
});
