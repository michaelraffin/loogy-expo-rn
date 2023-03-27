import * as React from 'react';   
import {axios} from './ServiceCall'
import AsyncStorage from '@react-native-async-storage/async-storage';

var storeOwner = "5ff00ddaeb2f5d0940dfa186"
export   const fetchData = async()=> {
    try {  
    const response = await axios.post('/details/Store', {id:storeOwner}).catch((error)=>console.log(error))  
    return response  
    }catch (error) {
      return error
        console.error('error',error); 
      }
  }


  export  const saveWishList = async (value)=> { 
      try {
        console.log('calling  saveWishList export')
        // let convertedDataString = value.toString()
        let wishList = await AsyncStorage.setItem('wishList', value) 
        return  wishList
      } catch (e) {  
        return null
      } 
  }
  export  const getWishList = async ()=> { 
    try {

      console.log('calling  getWishList')
      const value = await AsyncStorage.getItem('wishList')
      // let returnVale = JSON.parse(value) //JSON.parse(value)
      return  value != null ? JSON.parse(value) : null;

    } catch (e) {  
      return null
    } 
}

export  const saveEntry = async (value,id)=> { 
  try {
    console.log('calling  saveEntry')
    // let convertedDataString = value.toString()
    let converted = value
    if (isObject(value)){
      converted =  JSON.stringify(value)
    }  
    console.log('value to save',value)
    let wishList = await AsyncStorage.setItem(id, converted) 
    return  wishList
  } catch (e) {  

    return null
  } 
}
export  const saveEntry2 = async (value,id)=> { 
  try {
    let converted = value
    if (isObject(value)){
      converted =  JSON.stringify(value)
    } 
    // const jsonValue = JSON.stringify(value)
    // console.log('calling  saveEntry2')
    // let convertedDataString = value.toString()
    return  await AsyncStorage.setItem(id, converted) 
  } catch (e) {  
    return null
  } 
}
  function isObject(o) {
    return o instanceof Object && typeof o.constructor === 'function';
  }

export  const getEntry = async (entryID) => {
  try {
    console.log('calling  getEntry',entryID)
    const value = await AsyncStorage.getItem(entryID) 
    return value != null ? JSON.parse(value) : null;
     //value != null ? value : null;
  } catch(e) {
    console.log('ERROR getEntry',e)
    return null
  } 
}
export  const getEntryV2 = async (entryID) => {
  try {
    console.log('calling  getEntryV2',entryID)
    const value = await AsyncStorage.getItem(entryID)
    return value != null ? JSON.parse(value) : null 
    // value != null ?  value : null;
  } catch(e) {
    console.log('ERROR',e,entryID)
    return null
  }

}

export  const removeItem = async () => {
  try {
    console.log('calling get data Remove Item')
    let data = await AsyncStorage.removeItem('orderReference');
    
    return  data
  }
  catch(exception) {
    console.log(exception)
  }

}

export  async function  RemoveData (data){
  try {
    console.log('calling get data RemoveData')
    return await AsyncStorage.removeItem(data);
  }
  catch(exception) {
    console.log(exception) 
}
}

export  async function  currencyFormat (num){
  try {
    console.log('calling get data currencyFormat')
    return 'P' + parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  catch(exception) {
    console.log(exception)

}
}


export  const getData = async () => {
  try {    
    console.log('calling get data async')
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      // value previously stored
    }
  } catch(e) {
    // error reading value
  }
}