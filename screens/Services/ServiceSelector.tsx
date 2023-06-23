import  React,{useEffect,useState,useContext,useRef,useMemo,useCallback}from 'react';
import { StyleSheet,ActivityIndicator,ScrollView, Animated ,Dimensions,Image,TextInput,TouchableOpacity} from 'react-native';  
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
import { FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import {BookingContext}from  '../../components/Context/UserBookingContext'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default function Cart({ navigation ,route}) { 
    const [selectedVehicle, setVehicle] = useState(null)
    // const {setUserVehicle} = useContext(BookingContext);
    const [status, setStatus] = useState(false)
    const {getCurrentUser,getCurrentUserLocation,driverDetails} = useContext(BookingContext);
    const {setTrips,setUserVehicle,didTapped,setOrderTypeAction} = useContext(BookingContext);
    const [vehicles, setVehicleList] = useState([
        {
            "description": "Allow others to bid and accept it privately.",
            "id": 0,
            "imageUrl": "https://cdn3d.iconscout.com/3d/premium/thumb/bidding-date-5886191-4897678.png",
            "name": "Bid (Coming Soon)",
            "priceRange": 12000,
            status:false
        },
        {
            "description": "Only you can and your team can view this load.",
            "id": 1,
            "imageUrl": "https://cdn3d.iconscout.com/3d/premium/thumb/private-6760415-5558254.png?f=webp",
            "name": "Only me / Private",
            "priceRange": 12000,
            status:false
        },
        {
            "description": "Allow others to get.",
            "id": 21,
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9G4Bzc5HeZASH69M70ABpdL8ZzsAmDOGLqDgIUcTw_i00sBl6FSguZRm1MbyxmkFGYqc&usqp=CAU",
            "name": "Public",
            "priceRange": 13000,
            status:true
        }
    ]); 
    useEffect(() => {
      fetchProduct().then(item=>{
        setStatus(false)
        // setVehicleList(item.results[0].serviceList)
        console.log('itemitemitem',item.results[0].serviceList)
      })
      },[])

   async function fetchProduct() { 
    try {   
      var e = '629868882977690963ff3175'
			var orderStatus = 'Pending' 
			const data = { id: e, queryType: 'specific', storeOwner: 'storeOwner', isAPI: true,referenceOrder:e,number:20,showLimit:true,queryData:{status:orderStatus,userReference: e}};
			const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post('/store/LoogySettings', data);
			return response.data;
       return  response
    }catch (error) { 
         alert('Pleas try again...')
      }
  }
      function noticeContent() {
        return (<View style={{
          backgroundColor: '#f7f1e3',
          width: 300,
          height: 70,
          borderRadius: 20,
          marginLeft: 20,
          marginRight: -20,
          marginTop: 20
      
        }}>
          <Text style={{ color: 'black', marginLeft: 20, marginTop: 10, fontWeight: 'bold' }} category="h5">Delay ahead notice</Text>
          <Text style={{ color: 'black', marginLeft: 20, marginTop: 5 }} category="c1">For Bicol please avoid distance near the port</Text>
        </View>
        )
      }

      const renderHeader =()=>{
          return (
            (<View style={{backgroundColor:'white',marginTop:40}}>
            <View style={{flexDirection:'row',marginTop:60}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'bold',fontSize:40,marginTop:10}} >Set</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'light',fontSize:40,marginTop:10}} >Order Type</Text>
				</View>
         </View>
     )
          )
      } 
      

      
      const setMyVehicle=(e)=>{
        try {
            
        setVehicle(e.id)
        setOrderTypeAction(e)
        } catch (error) {
            alert('error ')
        }
        // console.log()
        // setUserVehicle(e)
      }
      const didPressed =()=>{
        navigation.navigate('Load',{screen:'BookingSummary'})
        // navigation.navigate('Shop', { screen: 'BookingSummary' }); 
    }
function currencyFormat(num) {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
      const renderFooter =()=>{
        return (
          (<View style={{backgroundColor:'white'}}>
              <Divider/>
                <View>{noticeContent()}</View>
         <Text style={{marginLeft:20,marginTop:20}}>Details</Text>
         <TextInput   
 returnKeyType = {"next"}
inputAccessoryViewID={"xxx"}
     multiline
     numberOfLines={4}
     style={{padding:10,backgroundColor:'#f5f6fa',borderWidth:1,borderColor:'#f5f6fa',borderRadius:5,height:100,marginRight:20,marginLeft:20,marginTop:10,marginBottom:20}}
     placeholder="Order description"
     editable
     maxLength={200}></TextInput>

       <Button  status="basic"   onPress={()=>didPressed()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:selectedVehicle === null ?'#dcdde1' :  'black', borderColor: selectedVehicle === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
    </Button>
       </View>
   )
        )
    }
      return (
<React.Fragment style={{backgroundColor:'white'}}>
{status ?  <View style={{marginTop:0, bottom:0,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View> : null} 
{/* <ActivityIndicator style={{ display: status ? 'flex' : 'none' }} size="small" color="#0000ff" />  */}
<FlatList

data ={vehicles}
snapToStart={true}
fadingEdgeLength={200}
extraData={(e)=>console.log(e)}
ListHeaderComponent={renderHeader()}
style={{
  opacity:status? 0.5 : 1,
    backgroundColor:'white',
    marginTop:0,
    marginBottom:selectedVehicle === null ? 0 : 0
    
  }}
keyboardDismissMode="on-drag"
showsVerticalScrollIndicator={false}
ListEmptyComponent={()=>{
    return(
      <React.Fragment>
        <BigLoader/>
        <BigLoader/>
        <BigLoader/>
        <BigLoader/>
        <ButtonLoader/>
      </React.Fragment>
    )
  }}
  renderItem={(item) =>{
    var data = item.item

    return(
        <TouchableOpacity
        disabled={data.status ?  status : true}
        onPress={()=> setMyVehicle(data) }
        >
        <View style={{
            flexDirection:'row',
              height:'auto',
              borderRadius:20,
              margin:20,
              opacity: data.status ? 1:0.2,
              borderWidth:data.id === selectedVehicle ? 1.5:0
         
          }}><View style={{width:100,
            alignItems:'center',
            justifyContent:'center'}}>
            
                <Image    resizeMode='contain' source={{uri:data.imageUrl}} style={{width:'100%',height:100,marginLeft:20}}/>
              </View>  
           
              
                <View style={{flex:1,width:'70%'}}>
                <Text style={{marginLeft:20,marginTop:10,fontWeight:'700'}} category='h6' >{data.name !== undefined ? data.name : data.name}</Text>
                <Text style={{marginLeft:20,marginTop:10,marginRight:20}} category='c1'  >{data.id === selectedVehicle  ? data.description   :data.description }</Text> 
                {/* <Text style={{marginLeft:20,marginTop:10,marginRight:20}} category='c1'  >{data.id === selectedVehicle  ? data.description.substring(0, 20)  :data.description }</Text>  */}
                         </View>    
          </View> 
          </TouchableOpacity>
    )
    }
}
 />
        <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,backgroundColor:'transparent'}} >
          <TouchableOpacity onPress={() => navigation.goBack()}> 
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            
          </TouchableOpacity>
        </View>

    {selectedVehicle === null ? null : <View style={{backgroundColor:'white', bottom:0,position:'absolute',width:width}}>
       <Button  status="primary"   onPress={()=>didPressed()} style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20,marginBottom:20, backgroundColor:selectedVehicle === null ?'#dcdde1' :  'black', borderColor: selectedVehicle === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
    </Button>
       </View>  }    
       
 </React.Fragment>
      )
}
const styles = StyleSheet.create({
  image: {
    // borderRadius:400,
    width: '100%',
    height: 300,
    resizeMode: 'cover'

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
    marginTop: 60,
    marginBottom: 20,
    fontWeight: 'bold',
    marginRight: 100,
    marginLeft: 20
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20
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
  }, containerMultiDate: {
    marginTop: 0,
    flexDirection: 'row',
    marginRight: 16,
    marginLeft: 16, marginBottom: 20
  },
  input: {
    flex: 1,
    margin: 2,
  },  inputTouchableRight: {
    flex: 1,
    margin: 2,
marginRight:20
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
});
 