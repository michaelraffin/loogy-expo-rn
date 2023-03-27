
import React, { useRef } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import VideoRecorder from 'react-native-beautiful-video-recorder'
 
import * as Permissions from "expo-permissions";
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App = ()=> {
  const videoRecorder = useRef(null)



  const videoPermession = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA);
    return status
  }


  const askPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  return status
  }


  function startRecorder () {
    videoPermession().then((status) =>{
        console.log('status', status) 
        if (status === "granted") {
            // videoRecorder.current.open({ maxLength: 30 }, (data) => {
            //     console.log('captured data', data);
            // })
                // if (videoRecorder && videoRecorder.current) {
               
                //     }
        }else {
          askPermission()
        }
     

    })
   
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <TouchableOpacity onPress={startRecorder} style={styles.btnCapture}>
                <Text style={styles.sectionTitle}>Capture video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* <VideoRecorder  ref={(e)=> console.log(e.open())} compressQuality={'medium'} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  btnCapture: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 25
  }
});

export default App;