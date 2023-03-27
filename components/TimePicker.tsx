import { StackScreenProps } from '@react-navigation/stack';
import React ,{useState,PureComponent,useContext,useMemo} from 'react';

import { StyleSheet, TouchableOpacity,SafeAreaView, ScrollView,Dimensions,Image,View ,Vibration} from 'react-native';
import { Radio,Button,Input,Card,Text, RadioGroup,Calendar,Spinner,Layout} from '@ui-kitten/components';
import  moment from 'moment'
 
import { cart, Theme } from './Utils/UserCart'; 
import { useTheme, Themes } from './Utils/Testcontext';
export  default function ViewProduct({storeDetails,selectedTime,type}) {
 
const [date, setDate] = useState(new Date());
const [itemSlot ,setSlot] = useState([]); 
const [check ,didRender] = useState(false); 
const listTimeSlot = []
const [checked, setChecked] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(0); 
const { theme, setTheme } = useTheme(); 
const { Details, updateCart } = cart();   
const [storePeakRate, setRate] = useState(storeDetails.storeOptions.deliveryFlatrate.peakHoursRate);
const [businessHours, setBusinessHours] = useState(storeDetails.storeOptions.businessHours);
console.log(businessHours)
var now = moment(new Date()); 
var end = moment().endOf('day') 
var duration = moment.duration(now.diff(end));
var days = duration.asHours();
var open = false;
var time = '09:00-23:59'
var currentDate = new Date()
let closingTime = type === "Store-Pickup" ?  moment('05:00 PM', 'h:mm A') : moment(businessHours.closing, 'h:mm:ss')
let opening = type === "Store-Pickup" ? moment('09:00 AM', 'h:mm A') : moment(businessHours.opening, 'h:mm:ss')
const [timeslot ,setTimeSlot] = useState([]); 


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZa0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }



  const setTupTime = useMemo((e)=>{
    
    console.log('typeee',type  )
var slots = [] 
var slotCopy = []
let formatedClosing = moment('11:59 PM', 'h:mm A')
let peakhours = moment('08:00 AM', 'h:mm A') 
let morning = moment('09:00 AM', 'h:mm A')
let five = moment('05:00 PM', 'h:mm A')
itemSlot.map(time => {   
        var peakHours = moment(time).isSame(peakhours) ||  moment(time).isBefore(morning) || moment(time).isAfter(five)
        let timerss = moment(time).format('h:mm A')
        let dddd = moment(formatedClosing).format('h:mm A')
        var timeObject = {
          peakHours:peakHours,
          time:moment(time).format('h:mm A').toString()
        }
        slotCopy.push(timeObject)
        var keys  = makeid(2)
        slots.push(    
            <Radio status="danger" disabled={false} key={keys} style={{marginLeft:20}}>
            <Card  s status='basic'style={{
                    marginLeft:5,marginRight:90}}> 
                    <TouchableOpacity onPress={()=> console.log(timeObject)}> 
                <Text   category='c2'>{moment(time).format('h:mm A').toString()} </Text>
                <Text   style={{color:peakHours? 'green':'gray'}}>{peakHours? '+'+storePeakRate+'P Special Delivery time difference ':'No fees added'} </Text>
                </TouchableOpacity>
                </Card>  
            </Radio>  
     )
    })  


    setTimeSlot(slotCopy)
return slots
},[check])


function touchableTime(e){
  
}

function runLooping(){
    var slotsss = []
    do { 
        let x = listTimeSlot
        slotsss.push(opening.toString())
        console.log('while') 
        opening.add(30, 'minutes')
    }
    while (moment(opening).isSameOrBefore(closingTime));  
    setSlot(slotsss)
    didRender(true) 

}

React.useEffect(() => { 
    runLooping()
  }, [])
function selectedDate(e) {
    setSelectedIndex(e) 
    try {
    selectedTime(timeslot[e])
      } catch (error) {
        // ...
        console.log(error)
      }
}

function displayTimeContent(){
  return <RadioGroup
    selectedIndex={selectedIndex}
    onChange={index => selectedDate(index)}>
         {setTupTime}
        </RadioGroup>
}
return(  
        <Layout  > 
      {check ? displayTimeContent() : <Spinner/>}
      {console.log('render timcpierk',check)}
        </Layout>  
)
}
  