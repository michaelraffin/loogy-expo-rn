import React, { useEffect, useState, PureComponent, useRef, useContext } from 'react';
import {
	Alert,
	SectionList,
	Switch,
	ToastAndroid,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Image,
	ImageBackground,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	KeyboardAvoidingView,
	View,
	ActivityIndicator,
	Platform,
	Keyboard
} from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input, Toggle } from '@ui-kitten/components';
import { BookingContext } from '../../components/Context/UserBookingContext';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import { useIsFocused } from '@react-navigation/native';
export default function HeaderContent ({route,navigation}) {
        const {setUserVehicle,getCurrentUser,driverDetails} = useContext(BookingContext);


    useEffect(()=>{
        console.log('getCurrentUser()',driverDetails)
    },[])

        const valiteEmail = () => {
            try {
                return getCurrentUser().email
            } catch (error) {
                return "Verification's Needed"
            }
        }
   
        const checkCurrentUser = ()=>{
            getCurrentUser()
                
         }
		return (
			<View style={{ width: width, height: 'auto', backgroundColor: true ? 'white' : 'white' ,marginBottom:20}}>
				<Text style={{ marginLeft: 20, marginTop: 60, color: 'black', fontWeight: '400' }} category="c1">
					Welcome
				</Text>
				<Text
					style={{ marginLeft: 20, marginTop: 5, color: 'black', fontSize: 16, fontWeight: 'bold' }}
					category="c2"
				>{valiteEmail()}
				</Text>
				{/* <Divider style={{marginTop:20}}/>
				<View style={{flexDirection:'row'}}>
				<View style={{flexDirection:'row'}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Your</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Load</Text>
				</View>
				   </View> */}
				<View
					style={{ height: 30, width: 70, top: 60, position: 'absolute', alignSelf: 'flex-end', right: 30 }}
				>
					
					
					<TouchableOpacity onPress={() =>  navigation.navigate('Profile',{screen:'UserProfile',productID:'Depart',params: { viewingType:  'viewProfile'}}) }>
						<View style={{width:40,height:40,borderRadius:20,backgroundColor:'#0652DD',marginLeft:20,justifyContent:'center',alignContent:'center',alignItems:'center'}}><Image  source={{uri:'getCurrentUser().data.user_metadata.userDetails.avatar'}}  style={{width:30,height:30 ,borderRadius:15 }}/></View>
					</TouchableOpacity>
				</View>
			</View>
		);
       
	};