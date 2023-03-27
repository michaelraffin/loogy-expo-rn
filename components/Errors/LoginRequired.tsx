

import React ,{Component}from "react"
import {Alert} from 'react-native'; 

export const LoginRequired = () => (
    Alert.alert(
        "Login Required",
        "Account is required before placing your order.",
        [
          {
            text: "Login Here",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Sign up", onPress: () => console.log("OK Pressed") },
          { text: "Okay later..", onPress: () => console.log("OK Pressed") }
        ]
      )
)