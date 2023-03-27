import { StackScreenProps } from '@react-navigation/stack';
import React ,{useState,PureComponent,useEffect,useRef,useMemo} from 'react';
import { Radio,Input, Button,Calendar,TextView,Text} from '@ui-kitten/components';
import  moment from 'moment' 
import TimePicker from '../components/TimePicker'
import { cart, Theme } from './Utils/UserCart'; 
import {Small,BigLoader,ButtonLoader} from '../components/Loader';
import {  ScrollView,Image,View} from 'react-native'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';
const myIcon = <Icon name="arrowright" size={30} color="#900" />;
 
export default React.memo((props)=>{
    const [date, setDate] = useState(moment(new Date()).add(1, 'd').toDate());
    const [slot, setTime] = useState(null);
    const [set, setTimeBug] = useState(false);
    const [status, setStatus] = useState(false);
    const { Details, updateCart } = cart();   
    const [ allowed, updatePicker ]  = useState();   

    const scrollViewRef = useRef();
    Details.deliveryOption.deliverySchedule = {}
    Details.deliveryOption.time = {}
    function UpdateCalendar(selectedDate) {
        setDate(selectedDate) 
    }

    function  seletecTime(e) { 
        setTime(e)
        setTimeBug(true)
    }

useEffect(() => { 
    setTimeout(() => {   
        updatePicker(true)
      }, 1500)
  }, [])


  const timePicker = useMemo(()=> { 
    return   <TimePicker  type={props.type} storeDetails={props.storeDetails} selectedDate={date} selectedTime={(e)=>seletecTime(e)}/>  
  },[props.type])
      
  function MainContent() {
      return (
        <View style={{ backgroundColor:'white',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginBottom:190
        
   }}>   
   
   <Calendar 
                       
                        min={moment(new Date()).add(1, 'd').toDate()}
                        max={moment(new Date()).add(1, 'year').toDate()}
                    style={{ marginTop:20,marginBottom:20}}
                        date={date}
                        onSelect={nextDate => UpdateCalendar(nextDate)}
                    /> 
                    
                    {timePicker}
                    
    </View>
      )
  }

  function autoScroll() {
    setTimeout(() => {    
        setStatus(false)
        scrollViewRef.current.scrollToEnd({ animated: true })
      }, 500)
  }

  function saveDetails() {
    props.deliverySchedule(date,slot)
  }
    return ( 
        <React.Fragment>
<View> 
    <Button  disabled={set ? false:true} onPress={()=> saveDetails()} style={{margin:20 ,backgroundColor:set ? Colors.buttonTheme :'#f5f6fa',color: 'white' ,borderColor:set ? Colors.buttonTheme : '#f5f6fa'}} >
        { moment(date).format('ll')}  
        {slot !== null ? ' at ' +  slot.time : null}  {set ? <Icon name="check" size={15} color="white" /> : null} 
    </Button>
     
        <ScrollView  >
        {allowed ?  MainContent()  : <ButtonLoader styles={{height:100}}/> }
     
                    </ScrollView>
</View>
        </React.Fragment>
                 );
})
 
 

// export default CalendarJS;