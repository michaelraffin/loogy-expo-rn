import React, { useState, useEffect } from 'react';
import {   Image, View, Platform ,TouchableOpacity,Dimensions,Alert,Linking} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { ApplicationProvider,Text,Layout ,Button,Avatar,Divider,Input,Card,Spinner,Icon} from '@ui-kitten/components';  
var width = Dimensions.get('window').width
import Svg, { Rect, Path } from "react-native-svg" 
import {axios} from '../../components/Utils/ServiceCall' 
import Colors from '../../constants/Colors';
export default function ImagePickerExample({referenceOrder,onReload,requestType}) {
  console.log('referenceOrder,',referenceOrder)
  const [image, setImage] = useState(null);
  const [receiptContent, setData] = useState(null);
  const [status, setUpload] = useState(false);
  const [reference,setMobile] = useState(referenceOrder)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Allow 'Nidz' to Access Your Photos?",
            'Nidz application will only upload photo you choose for proof of payment.',
            [
             
              { text: 'Go to settings', onPress: () =>   Linking.openURL('app-settings://notification/com.raffin0000.Nidz')},
              // { text: 'Cancel', style: 'cancel' , onPress: () => console.log('dismissed')}
            ],
            { cancelable: false }
          );
         
        }
      }
    })();
  }, [referenceOrder]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      cropping:false
    });
  
    setUpload(false)
    setData(result)
    console.log('result',result)
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


async function uploadImage() {    
  try {
    setUpload(true)
    var imagePath =  Platform.OS === 'android' ? receiptContent.uri : receiptContent.uri.replace('file://', '') 
    var nameExtension = Math.random()
    let formData = new FormData(); 
    formData.append("imageFile",{ uri: imagePath, name: nameExtension + '-image.jpg', type: 'image/jpeg' }  ); 
    const response = await axios.post('/upload', formData,{headers: {"Content-Type": "multipart/form-data"}})  
    return response
  }catch (error) {
    console.log('error fouynd ',error)
    return null
  }
}

async function updateCustomerReceipt(link){  
  const data =  { "mobileReference" :referenceOrder,"receipt":link }  
  const response = await axios.post('/updateReceipt', data).catch((error)=>console.log(error)) 
   return response
}

function validateReceipt  (){
  uploadImage().then( (data) => {
    var link = data.data.storage.link
    updateCustomerReceipt(link).then((status) => { 
      setUpload(false)
      setImage(null) 
      onReload(status)
    })
})
}
function updateOnProfileImage(){
  uploadImage().then( (data) => {
    var link = data.data.storage.link
    updateCustomerReceipt(link).then((status) => { 
      setUpload(false)
      setImage(null) 
      onReload(status)
    })
})
}


function uploadProduct  (){
  console.log('sss')
  setUpload(true)
  uploadImage().then( (data) => {
    var link = data.data.storage.link
       setUpload(false)
      setImage(null)  
      onReload(data.data.storage)

})
}
const uploaderContent = ()=> {

  return (
<TouchableOpacity disabled={status}   onPress={()=> setImage(null)}><Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      color={Colors.themeColor}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-x-square" 
      style={{position:'absolute',top:10,right:0}}
    ><Rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
      <Path d="M9 9l6 6M15 9l-6 6" />
    </Svg>
    <Image source={{ uri: image }} style={{ width: 70, height: 70 ,borderRadius:10,marginTop:40,marginBottom:20}} />
    </TouchableOpacity>
  )
}
  return (
    <React.Fragment>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           { image  &&  uploaderContent()}
            {image    ?  <Button  disabled={status} style={{backgroundColor:"#dcdde1",color:'white',borderColor:'#dcdde1',margin:20,borderRadius:40}}  accessoryRight={status ? spinnerView : null}  onPress={()=>   requestType === "VERIFY" ?  validateReceipt() : uploadProduct() } >{status ? 'Loading...' : 'Upload now'}</Button> : <Button  style={{backgroundColor:"#dcdde1",color:'white',borderColor:'#dcdde1',margin:20,borderRadius:40}}   onPress={pickImage} >Add image here</Button>}  
   </View>
   </React.Fragment>
  );
}

function spinnerView(props) {
  return (
   <Spinner/>
  )
} 
function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-upload"
      {...props}
    >
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </Svg>
  )
} 

function SvgComponent2(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-arrow-right"
      {...props}
    ><Path d="M5 12h14M12 5l7 7-7 7" />
    </Svg>
  )
}