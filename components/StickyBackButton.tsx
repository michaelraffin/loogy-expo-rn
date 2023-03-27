import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {Switch,ToastAndroid, SafeAreaView,StyleSheet,ScrollView,Image,ImageBackground ,Alert,RefreshControl,Dimensions,TouchableOpacity,KeyboardAvoidingView,View, ActivityIndicator,Platform} from 'react-native'; 
import { ApplicationProvider,Text,Layout ,Button,Divider,Input} from '@ui-kitten/components'; 

function StickyBackButton({status,navigation}) {
    return (
             <View  style={{ height: 30,width:30, top:60,position:'absolute', alignSelf:'flex-end',left:20,opacity: status? 0.2:1}} >
          <TouchableOpacity disabled={status} onPress={() => navigation.goBack()}>
            <View style={{width:30,height:30,borderRadius:50/2}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
            </TouchableOpacity>
        </View>
    );
}

export default StickyBackButton;