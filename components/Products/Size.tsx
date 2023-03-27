import React, {useState,useContext} from 'react'
import { StyleSheet, TouchableOpacity,SafeAreaView, ScrollView,Dimensions,Image ,TouchableHighlight} from 'react-native';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import { Button ,Text,Card,Radio, RadioGroup,Spinner} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {ProductDetailContext} from '../Utils/UserContextAPI'
import  LanguageContext from '../Utils/LanguageContext'
export default function ProductSize() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { options, setLanguage } = useContext(LanguageContext);


  const items = [{price:0,name:'Regular'},{price:200,name:'Medium'},{price:500,name:'Large'},{price:0,name:'None'}]

  function selectedSize(e){
    setSelectedIndex(e)   
    var sizeObject = {}
    sizeObject.quantity = options.quantity
    sizeObject.addons = options.addons
    sizeObject.size =   items[e]
    setLanguage(sizeObject); 
  }

    return (
    <LanguageContext.Consumer> 
      { data =>
      <RadioGroup 
      selectedIndex={selectedIndex} 
        onChange={index => selectedSize(index)}>
            <Radio status='danger' key={"s"}>Regular Size </Radio>
        <Radio status='danger' key={"m"}>Add Half Bundle   {'+P200'}</Radio>
        <Radio status='danger' key={"l"}>Add 1 bundle    {'+P500'}</Radio>
      </RadioGroup>  
      }
       
      </LanguageContext.Consumer>

    )
}

const styles = StyleSheet.create({
    container: {
      flex:3,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
  
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft:20
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });
  