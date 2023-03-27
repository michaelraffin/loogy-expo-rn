import { StackScreenProps } from '@react-navigation/stack'; 
import  React,{useEffect,useState,useContext,useRef,useMemo,useCallback}from 'react';
import { StyleSheet, TouchableOpacity, View,Dimensions } from 'react-native'; 
import { Button ,Text,Card,RadioGroup,Radio, Divider,Spinner,Layout,Calendar,Avatar, Tab, TabBar,ListItem,List,Input,Toggle} from '@ui-kitten/components';
import { RootStackParamList } from '../types';
import { ScrollView } from 'react-native-gesture-handler'; 
import {axios} from '../../components/Utils/ServiceCall'
import PickerImage from "../../components/ImagePicker";

import Categorize from '../../components/Products/Categorize'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
 


export default function Uploader({
  navigation,
}: StackScreenProps<RootStackParamList, 'NotFound'>) {



    const [titleProduct, setValue] = useState(''); 
    const [subTitleProduct, setsubTitle] = useState('');
    const [price, setProductPrice] = useState(0); 
    const [checked, setChecked] = useState(false);
    const [status, didSubmit] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0); 
    const [category, setCategory] = useState(''); 
    const [imageLink, setImageLink] = useState({link:null}); 
    var list =  ["Variety","Flowers","Bouquet","Burial","Bundle","Grand Opening"] 
    const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
      };
    async function addProduct() {
        try {   
          const data =  {  
               subtitle:subTitleProduct ,
                title:titleProduct ,
                price:price,
                imgUrl: imageLink.link,
                storeOwner:"5ff00ddaeb2f5d0940dfa186",
                type:category,
                display:checked,
                imageDetails:imageLink
              }
                
        const response = await axios.post('/product/add', data).catch((error)=>console.log(error))
           return response
        }catch (error) {
            console.error(error);
            alert('error')
          }
      }
    const submitProduct =()=>{
        didSubmit(true)
        addProduct().then((status)=> {
          console.log('status',status)
            didSubmit(false)
            navigation.replace('Root')
        })
    }
    function radioItems() {
        const xxx = []
        var dummy = ["Variety","Flowers","Bouquet","Burial","Bundle","Grand Opening","Addonssss"]
        dummy.map( item=> {  xxx.push(<Radio  key={item}  status='danger' >{item}</Radio> )  }) 
        return xxx
    }

    function imageSource(e) {
        setImageLink(e)
    }

  return (
    <View style={styles.container}> 
      <ScrollView style={{
    marginTop:60,width:width}}>
      <View style={{margin:20}}>

      <Text style={styles.title}>Upload Product Here</Text> 
      <Input
          placeholder="Title"
          value={titleProduct}
          onChangeText={nextValue =>  setValue(nextValue) }
        /> 
        <Input
          placeholder="Sub title"
          value={subTitleProduct}
          onChangeText={nextValue =>  setsubTitle(nextValue) }
        /> 
        <Input
        keyboardType="numeric"
          placeholder="Price"
          value={price}
          onChangeText={type =>  setProductPrice(type) }
        /> 
         <Input 
         disabled={true}
          placeholder="imageLink"
          value={imageLink.link} 
        />
        {/* <RadioGroup
        selectedIndex={selectedIndex}
        onChange={index => setSelectedIndex(index)}>
        {radioItems()}
      </RadioGroup> */} 
       <Text category="h5">{category}</Text>
      <ScrollView    showsHorizontalScrollIndicator={false} horizontal={true} style={{height:60,marginLeft:5}}  > 
      <Button disabled={status} style={{height:20}} onPress={(e)=>setCategory('Gifts')} status='primary'>
      Gifts
    </Button><Categorize didPressedCategory={(e)=>setCategory(e.title)}/>
  </ScrollView>
     <Toggle checked={checked} onChange={onCheckedChange}>
      {`Display Product: ${checked}`}
    </Toggle> 
    <Button disabled={status} style={{marginTop:20}} onPress={(e)=>submitProduct()} status='primary'>
        Submit
    </Button> 
      </View>
        </ScrollView>



        <View
            style={{
              shadowColor: "#000",
              justifyContent: "center",
              backgroundColor: "white",
              position: "absolute",
              bottom: 0,
              width: width,
              height: "auto",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}
          ><PickerImage
          requestType="PRODUCT"
              referenceOrder={'referenceOrderRef.current'}
              onReload={(e) => imageSource(e)}
            /></View>


    </View>
  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:20
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
