import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform,Alert ,Linking} from 'react-native'; 
import Axios from 'axios';
import {
  saveEntry,
  getEntry,
  removeItem
} from "../../components/Utils/StoreDetails" 
import {axios,productStats} from '../../components/Utils/ServiceCall'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function recordProductStats(e) {
  try {
      const data = {storeOwner:"NidzUsers",cType:"mobileToken",cName:"iOS","data":e,"date":new Date()}
      const response = await productStats.put('/Items', data)
      console.log(response)
      return  response
      
  } catch (error) {
    
  }
  
}

const threeOptionAlertHandler = () => {
  const handlePress = React.useCallback(async () => {
    await Linking.openURL('app-settings://notification/com.raffin0000.Nidz');
  }, []);

  //function to make three option alert
  Alert.alert(
    
    'Hello User',
    'Failed to get push token for push notification! To receive frequent updates, allow notification in the Device Settings',
    [
      // { text: 'May be', onPress: () => console.log('May be Pressed') },
      { text: 'Device Settings', onPress: () =>console.log('OK Pressed')},
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: true }
  );
};
export async function schedulePushNotification(message) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

export async function registerForPushNotificationsAsync() {
  let token;
  try {
    
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (finalStatus === 'denied') {
      const handlePress =(async () => {
        return  await  Linking.openSettings()//Linking.openURL('app-settings://notification/com.raffin0000.Nidz');
      })

       Alert.alert(
    
        `'Loogy' would like to send you a Push notifications`,
        'To receive frequent updates, allow Loogy notification in the Device Settings',
        [
          // { text: 'May be', onPress: () => console.log('May be Pressed') },
          { text: 'Device Settings', onPress: () =>handlePress()},
          { text: 'Later', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: true }
      );
      return
      
    }
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      threeOptionAlertHandler()
      // alert('Failed to get push token for push notification! To receive frequent updates, allow notification in the Device Settings');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data; 
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  } 
  recordProductStats(token)
  return token;
  } catch (error) {
    return 'no token was added'
  }
}
