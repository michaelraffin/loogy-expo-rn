import React, { useEffect, useState, useRef, useMemo, PureComponent, useCallback, useContext } from 'react';
import { 
	Platform,
	StyleSheet,
	Image,
	Dimensions,
	TouchableOpacity,
	ActivityIndicator,
	View,
	Alert,
	FlatList
} from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase,supabaseUrl,supabaseAnonKey,siginWithSupabase} from '../Drivers/slogin' 
import {BookingContext} from  '../../components/Context/UserBookingContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import LocationPicker from '../../components/Utils/UserLocation'
import {expo} from '../../app.json'
import AppUpdatefrom from '../AppUpdate/AppUpdate'
import {BigLoader} from '../../components/Loader'
import {registerForPushNotificationsAsync} from '../Cart/Notification'
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const Landing = ({ navigation }) => {
const {setUserAccountContext,setDriverDetails,setTypeOfView,setLoginByAuthService} = useContext(BookingContext);
const [ status, setStatus ] = useState(true);
const [ isGooggleActive, setGoogle ] = useState(false);
const [ isFacebookActive, setFacebook ] = useState(false);
const [ isPasswordActive, setPassword ] = useState(false);
const [ forceUpdate, setForceUpdate ] = useState(false);
const [ buildVersion, setBuildVersion ] = useState({android:0,ios:0});
const [ app, setAppDetails ] = useState(null);
const [ appForceContent, setForceContent ] = useState({
	"imageUrl": "https://i.gifer.com/Q4w3.gif",
	"title": "It's time to update",
	"subtitle": "Update Loogy app and get new exciting features."
  });
const [ landingImageContent, setImageLanding ] = useState({heightDevidedBy:2,imageUrl:'',title:'',subtitle:""});
const [ storeLink, setStoreLink ] = useState({android:'',ios:''});


useEffect( ()=> {
	setupStore()
},[])

function setupStore(){
	try {
		fetchDataV2().then( item =>{
			// setAppDetails(item)
			setStatus(false)
			setStoreDetails(item)
		})
	} catch (error) {
		
	}

}
const fetchDataV2 = async () => {
	try {
		
	var e = '629868882977690963ff3175'
	var orderStatus = 'Pending' 
	const data = { id: e, queryType: 'specific', storeOwner: 'storeOwner', isAPI: true,referenceOrder:e,number:20,showLimit:true,queryData:{status:orderStatus,userReference: e}};
	const response = await axiosV2('landing-x1','landing-x1').post('/store/LoogySettings', data);
	return response.data.results[0]
	} catch (error) {
		setStatus(false)
	}
  }

const fetchData = async () => {
	var e = '629868882977690963ff3175'
	var orderStatus = 'Pending' 
	const data = { id: e, queryType: 'specific', storeOwner: 'storeOwner', isAPI: true,referenceOrder:e,number:20,showLimit:true,queryData:{status:orderStatus,userReference: e}};
	const response = await axiosV2('landing-x1','landing-x1').post('/store/LoogySettings', data);

	return response.data.results[0]
  }
const setStoreDetails =(e)=>{
	try {

			setImageLanding(e.storeSetup.landingContent)
			setForceContent(e.storeSetup.appForceContent)
			setGoogle(e.availableLogin.filter((data)=> data.id === 1 )[0].status)
			setFacebook(e.availableLogin.filter((data)=> data.id === 2 )[0].status)
			setPassword(e.availableLogin.filter((data)=> data.id === 3 )[0].status)
			setBuildVersion(e.appVersioning)
			setStoreLink(e.storeSetup)

			if (Platform.OS === 'android' && e.appVersioning.isUpdateNow) {
				if (e.appVersioning.android != expo.android.versionCode){
					setForceUpdate(true)
				}
		
			} else if (Platform.OS === 'ios'  && e.appVersioning.isUpdateNow){
					if (e.appVersioning.ios != expo.version){
					setForceUpdate(true)
					}	
			}
	
			setStatus(false)

	}catch{
		
Alert.alert(`Opps...Sorry`, `Please try again later`, [ 
	{ text: 'Okay', onPress: () => console.log('None') },
  ],{
	cancelable: true,
  })
		console.error
	}
}
const displayAlert=(e)=>{
Alert.alert(`Opps...Sorry`, `${e} sign in is temporary not available`, [ 
	{ text: 'Okay', onPress: () => console.log(e) },
  ],{
	cancelable: true,
  })
}
const validateCurrentBuild =()=>{
	if (! status && Platform.OS === 'android'){
		if (expo.android.versionCode === buildVersion.android){
			setForceUpdate(true)
		}
	}else if (! status &&  Platform.OS === 'ios'){
		if (expo.version === buildVersion.ios){
			setForceUpdate(true)
		}
	}
}
const validateLogin = () =>{
	if (isPasswordActive){
		navigation.navigate('Login', { screen: 'Login' })
	}else {
		displayAlert('Password')
	}
}
 async function fetchProduct() { 
  try {   
	var e = '629868882977690963ff3175'
		  var orderStatus = 'Pending' 
		  const data = { id: e, queryType: 'specific', storeOwner: 'storeOwner', isAPI: true,referenceOrder:e,number:20,showLimit:true,queryData:{status:orderStatus,userReference: e}};
		  const response = await axiosV2('landing-x1','landing-x1').post('/store/LoogySettings', data);
		 return response.data
	 return  response
  }catch (error) { 
	   alert('Pleas try again...')
	}
}	
const landingImage = ()=>{

		try {
			return (
				<View
						style={{
							height: height - height / landingImageContent.heightDevidedBy,
							width: '100%',
							alignContent: 'center',
							alignItems: 'center',
							transform: [ { scaleX: 2.2 } ],
							borderBottomStartRadius: 200,
							borderBottomEndRadius: 200,
							overflow: 'hidden',
							backgroundColor: 'black',
							borderColor: 'white',
							borderWidth: 1
						}}
					>
						<Image
							source={{
								uri:landingImageContent.imageUrl
							}}
							style={styles.image}
						/>
					</View>
			)
		} catch (error) {
			
			return <BigLoader/>
		}
	

}
	const landingContent = () => {

		try {
			
		return (
			<React.Fragment>
				<View style={{ marginTop: 0, backgroundColor: 'white' }}>
					{landingImage()}
					<View style={{ backgroundColor: 'white' }}>
						<Text style={styles.text} category="h1">
							{landingImageContent.title}
						</Text>
						<TouchableOpacity  disabled={status}  onPress={() => signInWithDynamicCallBack('google')}>
							<View
							onPress={() => signInWithDynamicCallBack('google')}
								style={{
									alignContent: 'center',
									alignItems: 'center',
									marginBottom: 20,
									marginTop: 50,
									marginLeft: 50,
									marginRight: 50,
									flexDirection: 'row',
									justifyContent: 'space-between'
									
								}}
							><Image
									source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
									style={{ width: 20, height: 20, marginLeft: 25 }}
								/>
								<Text style={{ fontWeight: 'bold' }}>Continue with Google</Text>
							</View>
						</TouchableOpacity>
						{isFacebookActive ? displayFacebookContent(): null}
						{isPasswordActive ?  displayPasswordContent(): null}
					</View>
				</View>
				<View style={{ marginBottom: 60, backgroundColor: 'white' }} />
			</React.Fragment>
		)
		} catch (error) {
				return  <BigLoader/>
		}
	};
	const displayFacebookContent = ()=>{
		try {
			return (
				<TouchableOpacity disabled={status ?true:false}  onPress={() => signInWithDynamicCallBack('facebook')}>
								<View
									style={{
										
										alignContent: 'center',
										alignItems: 'center',
										marginBottom: 20,
										marginTop: 10,
										marginLeft: 50,
										marginRight: 50,
										flexDirection: 'row',
										justifyContent: 'space-between'
									}}
								>
									<Image
										source={{
											uri:
												'https://icons-for-free.com/download-icon-facebook+logo+logo+website+icon-1320190502625926346_512.png'
										}}
										style={{ width: 30, height: 30, marginLeft: 20 }}
									/>
									<Text style={{ fontWeight: 'bold' }}>{isFacebookActive ? 'Continue with Facebook':'Currently disabled' }</Text>
								</View>
							</TouchableOpacity>
			)
		} catch (error) {
			return <BigLoader/>
		}
	
	}
	const displayPasswordContent = ()=>{
		try {
			
		return (
			<React.Fragment>
					<TouchableOpacity   onPress={() => navigation.navigate('Apply')}>
							<View>
								<Button
								onPress={() => navigation.navigate('Apply')}
									status="primary"
									style={{
										
										borderRadius: 40,
										width: width - 40,
										marginLeft: 20,
										marginTop: 20,
										marginBottom: 20,
										backgroundColor: 'selectedVehicle' === null ? '#dcdde1' : 'black',
										borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black'
									}}
								>
									<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
										Get started
									</Text>
								</Button>
							</View>
						</TouchableOpacity>
						<TouchableOpacity disabled={status} onPress={() => validateLogin() }>
							<View style={{ alignContent: 'center', alignItems: 'center', margin: 20 }}>
								<Text>
									Already have an account,
									<Text style={{ fontWeight: 'bold', color: 'black' }}> login in here.</Text>
								</Text>
							</View>
						</TouchableOpacity>
			</React.Fragment>
		)
		} catch (error) {
			return <BigLoader/>
		}
	}
const  signInWithDynamicCallBack = (e)=>{
	if (e === 'google' && !isGooggleActive ) {
		displayAlert(e.toUpperCase())
	} else if (e === 'facebook' && !isFacebookActive ) {
		displayAlert(e.toUpperCase())
	}else {
		setStatus(true)
		siginWithSupabase(e).then(item=>{	
		  setStatus(true)
			if (item != undefined) {
			setTimeout(() => {
				setLoginByAuthService(item.login)
				setUserAccountContext(item.profile)
				setStatus(false)
					}, 3000);
			}else {
				setStatus(false)
			}
		})
	}

  }
  const locationPickerComponent =()=>{
	try {
		return <LocationPicker hide={true} errorMessage={'To get accurate loads, allow Loogy to access your location'}/>
	} catch (error) {
		return null
	}
  }
	const flatListContent = () => {
		try {
			return <>
			<FlatList 
			data={[1]} style={{ backgroundColor: 'white',opacity:status ? 0.5:1 }} renderItem={(item) => landingContent()} /> 
			{locationPickerComponent()}
			<View style={{marginTop:110,opacity: status? 1: 0 ,display:status ? 'flex':'none', bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View>
			</>;
		} catch (error) {
			return <ActivityIndicator  size="small" color="#0000ff"  />
		}
	
	};
	const displayForceUpdate =()=>{
		try {
			return <AppUpdatefrom appForceContent={appForceContent} androidLink={storeLink.android} iosLink={storeLink.ios}/>
		}catch {
			return <View style={{width:width,height:height}}/>
		}
		
	}
	return  forceUpdate ? displayForceUpdate() :  flatListContent();
	
};


export default Landing;
const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: 'center'
	},
	image: {
		width: '100%',
		height: 400,
		resizeMode: 'cover',
		flex: 1,
		transform: [ { scaleX: 0.5 } ],
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		margin: 2,
		marginTop: 20,
		marginBottom: 10,
		fontWeight: 'bold',
		marginRight: 150,
		marginLeft: 20,
		fontSize: 45
	},
	container: {
		backgroundColor: 'white',
		flex: 1,
		flexDirection: 'column',
		marginLeft: 20,
		marginRight: 20
	},
	layout: {
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	container2: {
		marginTop: 30,
		flexDirection: 'row',
		marginRight: 16,
		marginLeft: 16
	},
	containerMulti: {
		marginTop: 10,
		flexDirection: 'row',
		marginRight: 16,
		marginLeft: 16,
		marginBottom: 0
	},
	containerMultiDate: {
		marginTop: 0,
		flexDirection: 'row',
		marginRight: 16,
		marginLeft: 16,
		marginBottom: 20
	},
	input: {
		flex: 1,
		margin: 2,
		marginLeft: 11
	},
	inputTouchableRight: {
		flex: 1,
		margin: 2,
		marginRight: 20,
		marginLeft: 15
	},
	inputRoundTripTouchable: {
		flex: 1,
		marginTop: 2
	},
	inputRight: {
		flex: 1,
		margin: 2
	},
	InActiveinputRight: {
		flex: 1,

		margin: 2,
		opacity: 0.3
	}
});
