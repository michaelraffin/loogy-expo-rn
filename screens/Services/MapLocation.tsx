import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Platform,Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input} from '@ui-kitten/components'; 
import * as eva from '@eva-design/eva';   
import Clipboard from 'expo-clipboard';
var Image_Http_URL ={ uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif'};
import { cart, Theme,CartContextAction } from '../../components/Utils/UserCart'; 
import ThemeColor from '../../constants/Colors'
import {saveEntry,getEntry,removeItem} from '../../components/Utils/StoreDetails'
import  moment from 'moment'
import * as Permissions from "expo-permissions";  
import * as Location from "expo-location"; 
import Toast from 'react-native-toast-message'; 
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {CheckMark} from '../../components/Svgs'
import {schedulePushNotification} from '../../screens/Cart/Notification';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg,{Circle,Path,Line,Rect} from "react-native-svg"
import Store from  '../../components/Context/MapContext'
import {MapContext} from '../../components/Context/MapContext'
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places'
import axios from 'axios';
import MapView, { Marker,Polyline,PROVIDER_GOOGLE} from "react-native-maps";

export default function LocationPicker({ route, navigation }) {
    const ref = useRef();
    const [timer, setTimer] = useState(null);
    const [searchValue,setValue] = useState(null)
    const [results,setResults] = useState([])
    const [status,setStatus] = useState(false)
    const [isGeo,setGeo] = useState(false)
    const [errorStatus,setError] = useState(false)
    const [showMap,setShowMap] = useState(false)
    const [selectedAddress,setSelectAddress] = useState(null)
    const [geoConverted,setGeoConverted] = useState(null)
    const [journeyType,setJourneyType] = useState(route.params.journeyType)
    const [mapSearchAddress,mapSearchSetAddress] = useState(null)
    const {didSetAddress} = useContext(MapContext);
    useEffect(() => {
    }, [])
    function didSelectMap(item){
        didSetAddress(item.item)
        navigation.goBack() 
        // didSetAddress(item.item.place_name)
        // Context._currentValue.didTapped(item)
    }
    function didTapSet(){
      didSetAddress(mapSearchAddress)
      navigation.goBack() 
  }
    function fetchOrderTracker (){
        console.log('www')
      
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?country=ph&language=en&limit=15&autocomplete=true&fuzzyMatch=true&routing=true&access_token=pk.eyJ1IjoibWFtbmlkeiIsImEiOiJjanZsNnhhZ24wdDE1NDlwYmRvczJzNDk2In0.Bl06Qp0TgR-KfisAsKbciQ`
        // {
        //     country:"ph",
        //     autocomplete:true,
        //     language:"en",
        //     fuzzyMatch:true,
        //     routing:true,
        //     access_token:"pk.eyJ1IjoibWFtbmlkeiIsImEiOiJjanZsNnhhZ24wdDE1NDlwYmRvczJzNDk2In0.Bl06Qp0TgR-KfisAsKbciQ"  }
          )
          .then(function (response) {
            setStatus(false)
            setResults(response.data.features)
          
          })
          .catch(function (error) {
            console.log(error);
            setStatus(false)
          });
    }
    function getSearchValue(item: string | any[] | ((prevState: null) => null) | null){
        setValue(item)
        if (item.length >= 3) {
            setError(false)
            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }
            setTimer(
                setTimeout(() => {
                    fetchOrderTracker()
                    setStatus(true)
                }, 1500)
            );
        } else {
            setError(true)
            setResults([])
            console.log('Failed')
        }
      
    }

    const getGeoCoder = (coordinate)=>{
      console.log('coordinate',coordinate)
        setGeo(true)
        getReverse(coordinate).then(item=>{
          setGeoConverted(item[0])
          var generateFullName = item[0].city +", "+item[0].name +", "+ item[0].country
          var geometry = {geometry:{
            coordinates:[coordinate.longitude,coordinate.latitude]
          },
          place_name:generateFullName, 
          }
          mapSearchSetAddress(geometry)
          setGeo(false)
        })
    }

    async function getReverse(item){
      let keys = {
        latitude : item.latitude,
        longitude :  item.longitude
    }
      let address =  await Location.reverseGeocodeAsync(keys);
      return address
    }
    const initialPHRegion = {
      latitude: 14.560709104678233,
      latitudeDelta: 0.5017048734069078,
      longitude: 121.01807774975896,
      longitudeDelta: 0.23325998336076736
    }

const displayMap = ()=>{
  try {
    return   <MapView
    // mapType={PROVIDER_GOOGLE}
    initialRegion = {initialPHRegion}
    showsBuildings={true} 
    provider={null}
    rotateEnabled={false}
    showsUserLocation={true}
    showsIndoors={true}
    showsCompass={true}
    showsPointsOfInterest={true}
    zoomTapEnabled={true}  
    animateToRegion={(region)=> console.log('region',region)}
    onCenterChanged={(center)=>console.log('center',center)}
    onRegionChangeComplete={(onChangeRegion)=>getGeoCoder(onChangeRegion)}
    style={styles.map} />
  } catch (error) {
return <Text>{JSON.stringify(error)}</Text>
  }
}


const displaySetButton = ()=>{
  if ( geoConverted === null) {
    return <View/>
  }
  try {
    return (
      <Button  status="primary" 
      disabled={isGeo}  
      accessoryRight ={()=><Image  source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy4SICM2Rfxy_dpQae-OfjS6b0aDxY2PUBTwCPl1OU0Ivy5Iy4r8tJqZVjrdIrpzWgpHs&usqp=CAU'}} style={{width:10,height:10,opacity: isGeo ? 0 : 1 }}/>}
      onPress={()=>didTapSet()}
      style={{ borderRadius: 40, width: width - 40, 
       position:'absolute',
       opacity: isGeo ? 0.2 : 1,
      marginLeft: 20, bottom: 20, backgroundColor:  'black', 
      borderColor:  'black' }}>
     <Text style={{ color: 'white', fontWeight: 'bold' }}>{isGeo ?"Processing..." : `${geoConverted.name}, ${geoConverted.city}, ${geoConverted.region}`}</Text>
   </Button>
    )
  }catch{
    return <View/>
  }
  
}
    const mapPickerContent = ()=>{
        return (<Store>
             <View onPress={() => navigation.goBack()} style={{ height: 50,width:width,position:'absolute', alignSelf:'flex-end',top:60,left:20}} >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{backgroundColor:'clear',width:70,height:70,borderRadius:70/2}}><Image  source={require('../../assets/images/cancel.png')} style={{width:28,height:28,top:20  }}/></View>
              </TouchableOpacity>
            </View>
           <View style={{justifyContent: 'center', //Centered vertically
alignItems: 'center', // Centered horizontally
flex:1,}} >
            {/* <MapView style={styles.map} /> */}
            {displayMap()} 
            <View style={{height:40,width:40, 
justifyContent: 'center', //Centered vertically
alignItems: 'center', // Centered horizontally
flex:1,
position:'absolute',

}}>
  <TouchableOpacity>
  <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Simpleicons_Places_map-marker-point.svg/2048px-Simpleicons_Places_map-marker-point.svg.png'}}  style={{width:30,height:30,left:0,
opacity: isGeo ? 0.1 : 1 }}/>
  </TouchableOpacity>
</View>
</View>
<View style={{width:'auto',height:'auto',borderRadius:40,  position:'absolute',top:60,right:20}}>
							<View style={{flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
              {searchContent()}
              {rightContent()}
							</View> 
	</View>
  {displaySetButton()}
  <View onPress={() => navigation.goBack()} style={{ height: 50,width:'auto',position:'absolute', alignSelf:'flex-end',top:60,left:20}} >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor:'clear',width:70,height:70,borderRadius:70/2}}><Image  source={require('../../assets/images/cancel.png')} style={{width:28,height:28  }}/></View>
              </TouchableOpacity>
            </View>
        </Store>
        )
    }
    const mapSearchContent = ()=>{
        return (
            <Store>
            <ScrollView  keyboardShouldPersistTaps='handled'>
                <SafeAreaView>
                    <View style={{marginLeft:20,marginRight:20}}>
    <FlatList   
    data ={results}
    scrollEnabled={true}
    style={{marginBottom:0,height:height}}
    keyboardDismissMode="on-drag"
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={()=>{
        return(
            <React.Fragment>
                <Image  source={{uri:'https://cdn.dribbble.com/users/150039/screenshots/15043316/media/d66c51a81f504f0b605cdc0fb37a0da5.png?compress=1&resize=1600x1200'}} style={{width:'auto',height:200,marginTop:100}}/> 
        </React.Fragment>
        )
      }}
    ListHeaderComponent={
    <View>
        <Text category="h1" style={{ marginTop: 100,fontWeight:'bold' }}>Select Location</Text>
        {/* {journeyType} */}
    <Input
         style={{ width: 'auto',marginTop:15}}
        autoFocus={true}
         placeholder="Type Address"
         value={searchValue}
         onChangeText={item => getSearchValue(item)}
       />
       <Text category="h5"style={{fontWeight:'bold',marginTop:20}}>Searching for `{searchValue}`</Text>
       {/* {errorStatus ? <Text  category="p1"style={{fontWeight:'100',marginTop:20}}>Type your address completely.</Text> : searchValue  === null  ? null : <Text category="h5"style={{fontWeight:'bold',marginTop:20}}>Searching for `{searchValue}`</Text>} */}
       {status ?  <ActivityIndicator number='small'  size="small" color="gray"   style={{display:"flex",marginTop:20}}/> : null}
        </View>
    }
    renderItem={(item) =>
        
         {
            const mapIcon =()=> (   <Svg   width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.light.theme} color={Colors.light.theme}stroke-width="2" stroke-Linecap="round" stroke-Linejoin="round" className="feather feather-arrow-right-Circle"><Line x1="8" y1="12" x2="16" y2="12"></Line></Svg> )
             var title = item.item.text_en
             var description = item.item.place_name
             console.log('map',item)
            //  var type = item.item.properties.category.includes('hotel') ? 'Hotel':'Building' 
            return(
              <React.Fragment>
                 <TouchableOpacity onPress={()=>didSelectMap(item)}>
               
          
                     <Text keys={title} style={{fontWeight:"bold",marginTop:20}}><Image source={{ uri: 'https://cdn-icons.flaticon.com/png/512/1946/premium/1946781.png?token=exp=1634449771~hmac=ab832283c6507aef4d95dbd7eb68757d' }}  style={{width:10,height:10,marginRight:20}} />{title}</Text>
                    <Text keys={title} category="p2" style={{marginLeft:10}}>{description}</Text>
                    <Divider/>
                    </TouchableOpacity>
              </React.Fragment>
                )
        }
    }/></View>
      <View onPress={() => navigation.goBack()} style={{ height: 50,width:'auto',position:'absolute', alignSelf:'flex-end',top:60,left:20}} >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{backgroundColor:'clear',width:70,height:70,borderRadius:70/2}}><Image  source={require('../../assets/images/cancel.png')} style={{width:28,height:28  }}/></View>
              </TouchableOpacity>
            </View>
            <View style={{width:'auto',height:'auto',borderRadius:40,  position:'absolute',top:60,right:20}}>
							<View style={{flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
              {searchContent()}
              {rightContent()}
							</View>
			  	</View>
    </SafeAreaView>
            </ScrollView>
            </Store>
        )
    }

    const rightContent = () => {
      return (
        <TouchableOpacity onPress={() => setShowMap(!showMap) }>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:'white', 
              borderRadius:20,marginRight:10,
              elevation:20,
              opacity: showMap ? 1 : 0.5
            }}
          ><Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Simpleicons_Places_map-marker-point.svg/2048px-Simpleicons_Places_map-marker-point.svg.png' }}
              style={{ width: 23, height: 23,margin:4}}
            />
          </View>
        </TouchableOpacity>
      );
    };
    const rightContentV2 = () => {
      return (
        <TouchableOpacity onPress={() => setShowMap(!showMap) }>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:'white', 
              borderRadius:20,marginRight:10,
              elevation:20
              
            }}
          ><Text style={{ marginLeft: 10,marginRight:10,color:'black' }}>Drop a Pin</Text>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Simpleicons_Places_map-marker-point.svg/2048px-Simpleicons_Places_map-marker-point.svg.png' }}
              style={{ width: 25, height: 25 ,marginRight: 10,marginTop:5,marginBottom:5}}
            />
          </View>
        </TouchableOpacity>
      );
    };
    const searchContent = () => {
      try  {
        return (
          <TouchableOpacity onPress={() => setShowMap(!showMap) }>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:'white', 
                borderRadius:20,marginRight:10,
                elevation:20 ,
                opacity: showMap ? 0.5 : 1
              }}
            ><Image
                source={{ uri: 'https://icon-library.com/images/search-icon-small/search-icon-small-17.jpg' }}
                style={{ width: 25, height: 25 ,margin:3}}
              />
            </View>
          </TouchableOpacity>
        );
      }catch{
        return <View/>
      } 
    };
    return (
      <React.Fragment> 
        {showMap ? mapPickerContent()  : mapSearchContent()  }
      </React.Fragment>
       
    );


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex:1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

