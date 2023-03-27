import React ,{useEffect} from 'react'
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
import {axios} from '../../components/Utils/ServiceCall' 

var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;  
export default function TabOneScreen({navigation,route}) {
  
  const { data} = route.params;

  const [status, setStatus] = React.useState(false); 
  useEffect(()=>{ 
    // notifier
        // console.log()
    fetchProduct(data).then((data)=>{
        console.log(data)
        setStatus(true)
    })
  },[data])


  async function fetchProduct(details) { 
    try {  
      const data =  JSON.parse(details) 
      // data.status = "FOR DELIVERY"
      const response = await axios.post('/notifier',data ) 
      return  response.data.results
    }catch (error) { 
        console.log(error)
        // alert('error')
      }
  }

function unValidatedView() {
    return ( <View style={styles.container}>
              <Text >SMS has been sent</Text>
           <TouchableOpacity onPress={()=>console.log('Nice')}><Text category="c2" style={{color:'#00a8ff',marginTop:20}} >Continue</Text></TouchableOpacity>
           
  </View>)
  }
  
  
  return (
    <View style={styles.container}> 
      {status ? unValidatedView():<Spinner/> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
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
