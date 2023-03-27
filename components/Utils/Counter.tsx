import React,{createContext,useEffect,useState} from "react"; 
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity,Image } from 'react-native';
import {
    Button,
    Text,
    Card,
    Radio,
    RadioGroup,
    Avatar,
    Layout
  } from "@ui-kitten/components";
export default  React.memo (({allow}) => { 
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [timerCount, setTimer] = useState(60)

    useEffect(() => {
      var lastTimerCount = 0
      let interval = setInterval(() => {
     
        setTimer(lastTimerCount => {
            lastTimerCount <= 1 && clearInterval(interval)
            if (lastTimerCount === 1) {
                allow(true)
            }
            return lastTimerCount - 1
        })
        
      }, 1000) //each count lasts for a second
      //cleanup the interval on complete
      console.log(interval)
      return () => clearInterval(interval)
    }, []);
return <Text>{timerCount >= 1 ? `: ${timerCount}s`: null}</Text>
})