// @flow
import React, { useEffect, useState,useRef,useMemo, PureComponent,useCallback ,useContext} from 'react';
import {Switch, Platform,ToastAndroid, StyleSheet, ScrollView, Image, Vibration,TextInput, ImageBackground, RefreshControl, Dimensions, TouchableOpacity, KeyboardAvoidingView, View, Alert,FlatList } from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input } from '@ui-kitten/components';
export default function DynamicForm(props) {

     const dynamicForm =() =>{
        
        var borderColor = props.value === ""  ? '#c0392b' : '#dcdde1'
        var backgroundColor = props.value === ""  ? 'white' : 'white'
        var value = props.value === "" ? props.placeHolder : props.value
        var textColor = props.value === "" ? "#dcdde1" : 'black'
        try {
            return (
                <View style={{
                  flex: 1,
                  margin: 2,
                  marginLeft:11,
                
                }}>
                <Text category="c1" style={{color:'#dcdde1'}}>{props.label}</Text>
                <View style={{  marginRight:5,backgroundColor:backgroundColor,borderWidth:1,borderColor:borderColor,borderRadius:8,height:40,marginTop:5,flexDirection: 'row',justifyContent:'flex-start',alignContent:'center',alignItems:'center'}}>
                <Text style={{marginLeft:10,color:textColor}} numberOfLines={1}>{value}</Text>
                </View>
                </View>
              )
        } catch (error) {
            console.log('error',error)
            return (
                <View style={{
                  flex: 1,
                  margin: 2,
                  marginLeft:11
                }}>
                <Text category="c1" style={{color:'#dcdde1'}}>{''}</Text>
                <View style={{borderWidth:1,backgroundColor:props.value.length === 1 ? '#ecf0f1' : 'white',borderColor:'#dcdde1',borderRadius:8,height:40,marginTop:5,flexDirection: 'row',justifyContent:'flex-start',alignContent:'center',alignItems:'center'}}>
                <Text style={{marginLeft:10}} numberOfLines={1}>{}</Text>
                
                </View>
                </View>
              )
        }
    
      }
  return  dynamicForm()
};
