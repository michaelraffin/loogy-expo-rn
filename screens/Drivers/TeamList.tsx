import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Platform,Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator, TextComponent} from 'react-native'; 
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
import {BookingContext}from  '../../components/Context/UserBookingContext'
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
import CardJourney from '../../components/Journey/Card'
import {axiosV2} from '../../components/Utils/ServiceCall'
import MapView, { Marker,Polyline } from "react-native-maps";
import { NavigationContext } from '@react-navigation/native';

export default function LocationPicker({ route, navigation }) {
    const [ status, setStatus ] = useState(false);
    const [ teamIDReference, setTeamIdReference ] = useState(route.params.contextData);
    const {setUserVehicle,getCurrentUser,getCurrentUserLocation,driverDetails} = useContext(BookingContext);
    const [results, setResult] = useState([]);
    const navigations = React.useContext(NavigationContext);
    console.log('navigationnavigationnavigationnavigation',navigations)
    useEffect(() => {   
        setResult(([]))
        fetchProduct(route.params.contextData)
        // route.params.contextData
      }, [route.params.contextData])

      async function fetchProduct(e) { 
        console.log('useRefrenceID EEEE',e)
        setResult(([]))
       setStatus(true)
       try {
        var query =  {
            id: "On-Scheduled",
            queryType: "customV2",
            storeOwner: "storeOwner",
            queryData: [
              { teamID:e.groupID }
            ]
          }
        
         const data =   {id:'On-Scheduled',queryType:'customV2' ,storeOwner:'storeOwner',isAPI:true,queryData:query}   
         const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().application_info.email).post('/store/LoogyPooling', query)
         console.log('response---->>>',response.data.results)
         setStatus(false)
         setResult(response.data.results)
          return  response
       }catch (error) { 
         const err = error as AxiosError
         setStatus(false)
       }
     }

     const didTappedDelete = ()=>{
      setStatus(false)
      deleteService().then(item=>{
        navigation.setParams({
          isRefresh: true,
        });
        navigation.goBack()
        setStatus(false)
      })
     }
     async function deleteService (){
      try {
      var data =  {"groupID":route.params.contextData.groupID,"type":"LoogyGroup"}
      const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().application_info.email).post('/record/delete/LoogyGroup', data)
      } catch (error) {
        navigation.goBack()
      }
    }
    const backButton = ()=>{
        return(
<View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity: status? 0.2:1}} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
        )
    } 
      const deleteButton = ()=>{
      return(
<View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',right:20,opacity: status? 0.2:1}} >
        <TouchableOpacity onPress={() => didTappedDelete()}>
          <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://icon-library.com/images/android-delete-icon/android-delete-icon-26.jpg'}}  style={{width:25,height:25  }}/></View>
          </TouchableOpacity>
      </View>
      )
  }
    const displyTeamTile = ()=>{
        try{
            return(
                <View  style={{ height: 40,width:70, top:55,position:'absolute', alignSelf:'flex-end',left:70,opacity: status? 0.2:1}} >
                          <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text category='h1' style={{fontWeight:'bold',color:'#0652DD'}}>@{teamIDReference.data.title}</Text>
                            </TouchableOpacity>
                        </View>
                        )
        }catch {
            return <View/>
        }
    }


    const journeyContennt =(data,index)=>{ 
        try {
          return (
            <TouchableOpacity   activeOpacity={1}>
         <React.Fragment> 
           <View style={{marginTop:index === 0 ? 0: 20}}>
         <CardJourney 
         journey={data.item.trips[0]}
          details={data.item} 
          didView={()=>navigation.navigate('LoadDetails', { screen: 'LoadDetails',params: { referneceOrder: data,type:'readOnly' } } )}
          badgeStyle={{ width: 30, height: 30, borderRadius: 15 ,backgroundColor:'#f5f6fa',justifyContent:'center',alignContent:'center',alignItems:'center'}}/>
        </View>
        </React.Fragment>
        </TouchableOpacity>)
        }catch  {
          return <View style={{backgroundColor:'black'}}/>
        }
        
      
        {/* {category ==='Completed' ?<TouchableOpacity  onPress={()=>didLoad(data)}><Text>Write a review</Text></TouchableOpacity> : null} */}
      }
      const headerDetails = ()=> { 
        return (
          <View style={{backgroundColor:'white'}}>
           <View style={{flexDirection:'row',marginTop:10}}>
                <View style={{marginBottom:20,marginTop:0,marginLeft:20,backgroundColor:'white'}}>
			<Text category="h6" style={{fontWeight:'bold'}}>{'Team load item'}{results.length === 1 ? '': 's'}</Text>
			<Text category="c1" style={{fontWeight:'100',marginLeft:5,marginBottom:10}}>{results.length} item{results.length === 1 ? '': 's'} found</Text> 
		</View>
				</View>
        </View>
        )
        }
const renderList = ()=> { 
    return (<FlatList
    style={{backgroundColor:'white',marginTop:120}}
      ListHeaderComponent={headerDetails()}
      maxToRenderPerBatch={5}
      data={results}
      renderItem={(item) =>  journeyContennt(item)  } 
       ListEmptyComponent={()=>
        <Layout style={styles.layout} level="1">
        <View
          style={{
            height: 400,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20,
            marginTop:0
          }}
        >
      <Image source={{ uri: 'https://cdn.dribbble.com/users/1113690/screenshots/6231933/empty_state_bino_4x.jpg?compress=1&resize=1600x1200'}} style={{ width:300,
          height:250,
          resizeMode: 'cover'}}/>
        <Text 
            category="6"
          >Loading....
          </Text>
          
        </View>
      </Layout>
      }
      ></FlatList>)
  }
    return (
        <><View style={{backgroundColor:'white',height:height,width:width}}>
        {backButton()}
        {deleteButton()}
        {displyTeamTile()} 
        {renderList()}
        </View>
        </>
        
    )
}


const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: 300,
      resizeMode: 'cover',
      
  
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      margin: 2,
      marginTop: 20,
      fontWeight: 'bold',
      marginRight: 130,
      marginLeft: 20
    },
    containesr: {
      backgroundColor: 'white',
      flex: 1,
      flexDirection: 'column',
      marginLeft: 20,
      marginRight: 20
    },

  container: {
    marginLeft:20,
    marginRight:20,
    marginBottom:5,
    marginTop:5,
    flexDirection: 'row',
  },
    layout: {
  
      backgroundColor: 'white',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }, container2: {
      marginTop: 30,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16
    }, containerMulti: {
      marginTop: 10,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, marginBottom: 0
    }, 
    containerMultiDate: {
      marginTop: 12,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, 
      marginBottom: 12,
      // backgroundColor:'red'
    },
    containerContent: {
      marginTop: 0,
      flexDirection: 'row',
      marginRight: 16,
      marginLeft: 16, 
      marginBottom: 12,
    },
    input: {
      flex: 1,
      margin: 2,
      marginLeft:11,
      
    },  inputTouchableRight: {
      flex: 1,
      margin: 2,
  marginRight:20,
  marginLeft:15
    },
    inputRoundTripTouchable: {
      flex: 1,
      marginTop:2
    },
    inputRight: {
      flex: 1,
      margin: 2,
    }, InActiveinputRight: {
      flex: 1,
  
      margin: 2,
      opacity: 0.3
    },
    subTotal:{
      flex: 1,
      margin: 2,
      fontWeight:'bold'
    },
    subTotalItem:{
      fontWeight:'bold',
      fontSize:23,
      alignContent:'flex-end',
      margin: 2,
    },
  });