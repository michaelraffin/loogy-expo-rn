import React, { useEffect, useState, useRef, useMemo, PureComponent, useCallback, useContext } from 'react';
import { ToastAndroid, Platform, StyleSheet, ScrollView, Image, Vibration, TextInput, ImageBackground, RefreshControl, Dimensions, TouchableOpacity, KeyboardAvoidingView, View, Alert, FlatList, ActivityIndicator } from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input } from '@ui-kitten/components';
import * as Linking from 'expo-linking';
import  moment from 'moment'

export default function AvatarCTA({ profileName, profileEmail, profileAvatar,hideContact,dateJoined }, props) {
  const iosMessage = 'https://www.budgetpcupgraderepair.com/wp-content/uploads/2019/08/SMS-Icon-01.png'
  const androidMessage = 'https://www.pngkey.com/png/detail/334-3340440_sms-android-messages-app-icon.png'
  const telephoneIcon = 'https://icons-for-free.com/download-icon-contact+mobile+phone+telephone+icon-1320168260690280424_512.png'
  console.log('props.hideContact',hideContact)
  const openSMS = () => {
    const operator = Platform.OS === 'android' ? '?' : '&'
    console.log('profileEmail',profileEmail)
    Linking.openURL(`sms:${+profileEmail}${operator}body=Hi ${profileName}! Kumusta po.`);
  }

  const openCall = () => {
    const operator = Platform.OS === 'android' ? '?' : '&'
    console.log('profileEmail',operator)
    Linking.openURL(`tel:${+profileEmail}`);
  }
const displayDateJoined =()=>{
  console.log('dateJoined XXXXX,',dateJoined)
  if (dateJoined === undefined) {
    return moment(new Date(),'MMMM DDD YYYY').toDate().toDateString()
  }
  try {
    // 2022-05-31T05:07:05.533347+00:00
      var date =  moment(dateJoined,'YYYY-MM-DD').format('MMMM Do YYYY').toString()
      console.log('date',date)
      return date
  } catch (error) {
    return moment(new Date(),'MMMM DDD YYYY').toDate().toDateString()

    console.log('ERROR date',error)
  }
}
  return (<View >
    <View style={{ marginLeft: 20, marginTop: 20 }}>
      <View style={{
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 10
      }}>
        <View style={{ height: 50, width: 50, backgroundColor: 'black', borderRadius: 75 }}>
          <TouchableOpacity>
            <Image source={{ uri: profileAvatar }} style={{ borderRadius: 75, width: 50, height: 50, marginBottom: 10 }} />
          </TouchableOpacity>
        </View>
        <View>
          <Text category="c1" style={{ marginLeft: 20, fontWeight: 'bold' }}>{profileName}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10, marginLeft: 20
            }}
          ><Text category="c1">Date Created {displayDateJoined()}</Text>
          </View>
     
          <View style={{ flexDirection: 'row',opacity: hideContact ? 0 : 10 }}>
            <TouchableOpacity onPress={() => openSMS()}>
              <View style={{ backgroundColor: '#f1f2f6', marginBottom: 0, width: 25, height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', marginLeft: 20, alignItems: 'center' }}><Image source={{ uri: Platform.OS === 'android' ? androidMessage : iosMessage }} style={{ width: 19, height: 19 }} /></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={openCall}>
              <View style={{ backgroundColor: '#f1f2f6', marginBottom: 0, width: 25, height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', marginLeft: 20, alignItems: 'center' }}><Image source={{ uri: Platform.OS === 'android' ? telephoneIcon : telephoneIcon }} style={{ width: 19, height: 19 }} /></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View></View>)

}