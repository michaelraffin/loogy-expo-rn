import * as React from 'react';
import { StyleSheet,ScrollView ,SafeAreaView,Dimensions,TouchableOpacity} from 'react-native';

import TourContent from '../components/Video/TourContent';
import { Text, View } from '../components/Themed';
import {
    Spinner, 
    Button
  } from "@ui-kitten/components";

  import {MapMarker,Back,BackDark} from "../components/Svgs"

  import Colors from '../constants/Colors';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
export default function Tour2({navigation,didPressed}) {
  return (
      <SafeAreaView style={{backgroundColor:'white'}}>
          <View style={{height:50,width:width}}>
      <View  style={{  height: 50,width:50,position:'absolute', alignSelf:'flex-end',top:20,left:0,marginLeft:30,backgroundColor:'white'}} >
              <TouchableOpacity  onPress={()=> navigation.goBack()} >
                {/* <BackDark/> */}
                <Text>Cancel</Text>
                     </TouchableOpacity>
            </View> 
            </View>
      <ScrollView style={{height:height}}>
      
    <View style={styles.container}>
      <Text style={styles.title}>Video Message </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <ScrollView horizontal={true} style={{width:width}} showsHorizontalScrollIndicator={false} pagingEnabled={true}><TourContent path="/screens/TabOneScreen.tsx" /><TourContent path="/screens/TabOneScreen.tsx" /></ScrollView> */}
      <TourContent path="/screens/TabOneScreen.tsx"  />
      <Button onPress={()=>didPressed()} style={{backgroundColor:'black',borderColor:'black',width:200,marginTop:60}}>Start now</Button>

     
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
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center'
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
    fontSize:11
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
});
