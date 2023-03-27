import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import { Vibration } from 'react-native';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,RefreshControl,StatusBar,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator} from 'react-native'; 
import {Context} from '../components/Context/MapContext'


export default function ViewProduct() {
    // const {setAddress}= useContext();

    useEffect(() => {
        console.log('setAddress',Context)
    }, [])

return (
    <View/> 
)
}