import * as React from 'react'
import { StyleSheet,View ,Dimensions,TouchableOpacity} from 'react-native' 
import {
  Button,
  Text,
  Card,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Layout,
  Icon,
  Divider
} from "@ui-kitten/components";
import { Video } from 'expo-av'; 
import {Retake,Forward,Recorder,Back,CloseButton} from '../../components/Svgs'
var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height; 
export default function TabOneScreen({navigation,route}) {
  
  const { link} = route.params;
  console.log(link)
  return (
    <View style={styles.container}> 
      <Video
  source={{ uri: link }}
  rate={1.0}
  volume={5}
  isMuted={false}
  resizeMode="contain"
  shouldPlay
  isLooping 
  style={{ width: width, height: height + 20}}>
<View style={{ position:'absolute',top:50,left:20}}> 
               <TouchableOpacity
            onPress={(e)=> navigation.popToTop()}
            style={{
              // padding: 20,
              width: "100%",
             //  backgroundColor: "#fff"
            }}
          > 
        <CloseButton/>
          </TouchableOpacity>
            
           </View>
  </Video>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
