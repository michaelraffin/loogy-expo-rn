import * as React from 'react';
import { StyleSheet,ScrollView ,SafeAreaView,Dimensions,TouchableOpacity} from 'react-native';

import Page1 from '../components/Qrcode/Page1';
import { Text, View } from '../components/Themed';
import {
    Spinner, 
    Button
  } from "@ui-kitten/components";

  import {MapMarker,Back,BackDark} from "../components/Svgs"

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
export default function TabOneScreen({didContinue,didSkip}) {
  return (
      <SafeAreaView style={{backgroundColor:'white'}}>
          <View style={{height:50,width:width}}>
      <View  style={{  height: 50,width:50,position:'absolute', alignSelf:'flex-end',top:20,left:0,marginLeft:30,backgroundColor:'white'}} >
              <TouchableOpacity onPress={()=>didSkip()} >
                {/* <BackDark/> */}
                <Text >Cancel</Text>
                     </TouchableOpacity>
            </View> 
            </View>
      <ScrollView style={{height:height}}>
      
    <View style={styles.container}>
      <Text style={styles.title}>Scan Your Video Message</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Page1 path="/screens/TabOneScreen.tsx" />
      <Button onPress={()=> didContinue()} style={{backgroundColor:'black',borderColor:'black',width:200,marginTop:60}}>Continue</Button>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:60
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
