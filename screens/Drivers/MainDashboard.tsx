import React, { useEffect, useState, PureComponent, useRef, useContext } from 'react';
import {
	Alert,
	Modal,
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
import * as eva from '@eva-design/eva';
import Clipboard from 'expo-clipboard';
var Image_Http_URL = { uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif' };
import { cart, Theme, CartContextAction } from '../../components/Utils/UserCart';
import ThemeColor from '../../constants/Colors';
import { saveEntry, getEntry, removeItem } from '../../components/Utils/StoreDetails';
import moment from 'moment';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import UserLocationUI from '../../components/Utils/UserLocation'
import { CheckMark, SmallArrow } from '../../components/Svgs';
import { schedulePushNotification } from '../Cart/Notification';
import {Small,BigLoader,ButtonLoader,InstagramContent,ButtonLoaderStandard} from '../../components/Loader';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Svg, { Circle, Path, Line, Polyline, Rect } from 'react-native-svg';
import Store from '../../components/Context/MapContext';
import { MapContext } from '../../components/Context/MapContext';
import DashedLine from 'react-native-dashed-line';
import { BookingContext } from '../../components/Context/UserBookingContext';
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places';
import { axios ,axiosV2} from '../../components/Utils/ServiceCall';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { LoginRequired } from '../../components/Errors/LoginRequired';
import FloatingBar from '../../components/FloatingBar';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
import { notifyGroup,roomListenerStandard} from '../../components/Utils/SocketManager';
var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;
/*
  1. Create the config
*/
const toastConfig = {
	/*
	  Overwrite 'success' type,
	  by modifying the existing `BaseToast` component
	*/
	success: (props) => (
	  <BaseToast
		{...props}
		style={{ borderLeftColor: 'pink' }}
		contentContainerStyle={{ paddingHorizontal: 15 }}
		text1Style={{
		  fontSize: 15,
		  fontWeight: '400'
		}}
	  />
	),
	/*
	  Overwrite 'error' type,
	  by modifying the existing `ErrorToast` component
	*/
	error: (props) => (
	  <ErrorToast
		{...props}
		text1Style={{
		  fontSize: 17
		}}
		text2Style={{
		  fontSize: 15
		}}
	  />
	),
	/*
	  Or create a completely new type - `tomatoToast`,
	  building the layout from scratch.
  
	  I can consume any custom `props` I want.
	  They will be passed when calling the `show` method (see below)
	*/
	tomatoToast: ({ text1, props }) => (
	  <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
		<Text>{text1}</Text>
		<Text>{props.uuid}</Text>
	  </View>
	)
  };
 export default function Dashboard(props) {
	var route = props.route	 
	var navigation = props.navigation 

	const [teamStatus, setTeamStatus] = useState(false);  
	const [isEnabled, setIsEnabled] = useState(false);  
	const isFocused = useIsFocused();
	const [ checked, setChecked ] = React.useState(false);
	const [ category, setCategory ] = useState('One-Way');
	const [ selectedCity, setCity ] = useState([121.023415,14.556586]); // MNL
	const [ tripType, setTrip ] = useState('Arrival');
	const [ results, setResult ] = useState([]);
	const [ searchItems, setSearchedItem ] = useState([]);
	const [ value, setSearchItem ] = useState('');
	const [ isKeyboardActive, setKeyboardActive ] = useState(false);
	const [ isFirstTouch, setFirstTouch ] = useState(false);
	const {setUserVehicle,getCurrentUser,getCurrentUserLocation} = useContext(BookingContext);
	const [ status, setStatus ] = useState(false);
	const [didRefresh, setRefresh] = React.useState(false);
	const didScrollBottom = useRef(false) 
	const [keyboardStatus, setKeyboardFocus] = useState(false);
	const [isLoadNew, setisLoadNew] = useState(false);
	const [teamName, setTeamName] = useState('');
	const [ currentRegion, setDiscoveryRegion ] = useState('NCR');
	let dynamicTitle = results.length === 0 ? "Your personal load" : "Your personal loads"
	const [ appNavigations, setAllowedNavigation ] = useState([{id:0,status:false}]);
	const [ staisLocationDisabletus, setDisableLocation ] = useState(false);
	const [sectionitems,setSection] = useState([
		{
	index:0,
	  title: "Searched Item",
	  data:searchItems, 
	  searched:false
	},
	{index:1,
	  title: dynamicTitle,
	  data:results, 
	  searched:false
	}])
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [isSheetDisplay,setisSheetDisplay] =  useState(false);
	const snapPoints = React.useMemo(() => ['35%',Platform.OS === 'android'  ? '50%' :'45%'], []);
	const [isSubscriber,setFetchSubscriber] =  useState(false);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);



	useEffect(() => {

	
		if (getCurrentUser().id != null) {
			try {
				fetchProduct(getCurrentUser().id,'user-id').then(item =>{ 
					setStatus(false);
					setResult(item.data.results);
					setSection([
						{
						index:0,
					  title: "Seached Item",
					  data:searchItems, 
					  searched:false
					},
					{index:1,
					  title: dynamicTitle,
					  data:item.data.results, 
					  searched:false
					}])
				})

				fetchDasboardUtilies().then(list =>{
					console.log('list.results',list.results[0].dashboardLoadSetup)
					setAllowedNavigation(list.results[0].dashboardLoadSetup)
				})
			

			
			} catch (error) {
				console.log('error in roomListener')
			}
		}



	 
	}, [getCurrentUser().data]);

useEffect(() => {
socketListerner
},[]);

let didShow  = false
let socketListerner = React.useMemo(()=> { 
	try {
	
		roomListenerStandard(Platform.OS === 'android' ? 'davao-trucking':'cebu-trucking',(data)=>{
			console.log('davao-trucking',data)
			 
				var payload = {
					title: 'You made it! Order Accepted!',
					body: `You will  gonna received a orders`
				};
				 schedulePushNotification(payload).then(() => {});
				 didShow = true
				//  fetchNewCategory('Following','user-id')
				 discoverBooking(selectedCity,tripType)
				//  setFetchSubscriber(true)
		
		})
	
	} catch (error) {
		
	}
},[])
	const addNewTeam =()=>{
		setisSheetDisplay(!isSheetDisplay)
	}
	const addTeamTapped =()=>{
		setTeamStatus(true);
		addNewTeamService(null).then(item =>{ 
			setTeamStatus(false);
			setTeamName(null)
			setIsEnabled(false)
			setisSheetDisplay(false)
			fetchNewCategory('byTeam','user-id')
		})
	}

	async function fetchDasboardUtilies(){
		var e = "6435230c2d77d025be4f63ef"
		try {
			const data = { id: e, queryType: 'specific', storeOwner: 'storeOwner', isAPI: true,referenceOrder:e,number:1,showLimit:true};
		const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post("/store/LoogyUtilities", data)
			console.log(response.data)
		return 	response.data;
		} catch (error) {
			console.log('error fetchDasboardUtilies ',error)
		}
		
	}
	async function addNewTeamService(e){
		try {
			console.log(getCurrentUser().authToken)
			var data = {data:{title:teamName,admin:[getCurrentUser().id]},shortName:`@${teamName}`,private:isEnabled,pword:10321,groupOwner:"Xadsadsa"}
			const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post('/Loogy/create/Group', data);
			return response
		}catch (error) {
			setStatus(false);
			if (error.response.data.stack.includes('InvalidTokenError')) {
				LoginRequired();
			} else {
				alert('Pleas try again...');
			}
		}
	}
	async function fetchProduct(e,searchBy,domain) {
		let prefferedURL = '/store/LoogyPooling'
		if (e == '' || e.length <= 5 ) {
			return
		} 
		setStatus(true);
		console.log('domain',domain)
		try {
			var type = searchBy === 'load-id' ? 'load-id' : 'user-id';
			var orderStatus = 'Pending'
			if (type === 'user-id') {
				type = 'custom' 	
			} 
			let data = { id: e, queryType: searchBy, storeOwner: 'storeOwner', isAPI: true,referenceOrder:e,number:20,showLimit:true,queryData:{status:orderStatus,userReference: e}};
			if (domain != undefined && domain !== 'LoogyGroup') {
				console.log('PART - 1')
				prefferedURL =  `/store/${domain}`
				data = {groupOwner:'Xadsadsa'}
			}else if (domain != undefined && domain === 'LoogyGroup') {
				console.log('PART - 2')
				prefferedURL =  `/store/${domain}`
				  data =   {
							queryType: "customV2",
							queryData: [
								{ "data.admin": getCurrentUser().id  },
								{ "groupID": "92668122730363644763746725524865"}
								]
							}
			}else if (domain != undefined && domain === 'getNearestBooking') {
				console.log('PART - 3')
				prefferedURL =  `/${domain}`
				  data =   {
							queryType: "customV2",
							query:{status:'Pendng'},
							arrivalCoordinates: [
								121.05830760000003,
							13.7564651
							  ]
							}
			}
			console.log(domain,'SHIT')
			
			const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post(prefferedURL, data);
			setStatus(false);
			return response;
		} catch (error) {
			setStatus(false);
			if (error.response.data.stack.includes('InvalidTokenError')) {
				LoginRequired();
			} else {
				alert('Pleas try again...');
			}
		}
	}
	
	function searchItem(e){ 
		setStatus(true);
		// setResult([]) 
		setSearchedItem([])
		fetchProduct(e,'load-id').then(item =>{
		setStatus(false);
		setSearchedItem(item.data.results);
		console.log('item?.data.results',item?.data.results)
		setSection([
			{
			index:0,
			title: "Seached Item",
			data:item.data.results, 
			searched:true
			},
			{index:1,
			title: dynamicTitle,
			data:results, 
			searched:false
			}
		])
		
	})
	
}

	const manageSectionItems = (e)=>{
		console.log('error')
		if (e === 'byTeam'){
			setSection([
				{
					index:0,
				  title: "Searched Item",
				  data:results, 
				  searched:false
				},
				{index:2,
				  title: "Team",
				  data:results, 
				  searched:false
				}])
		} else  if (e === 'LoogyGroup'){ 
			setSection([
				{
				index:0,
				  title: "Searched Item",
				  data:searchItems, 
				  searched:false
				},
				{index:1,
				  title: dynamicTitle,
				  data:results, 
				  searched:false
				}])
			
		}else  if (e === 'NearMe'){ 
			// setSection([
			// 	{
			// 	index:0,
			// 	  title: "Searched Item",
			// 	  data:searchItems, 
			// 	  searched:false
			// 	},
			// 	{index:1,
			// 	  title: dynamicTitle,
			// 	  data:results, 
			// 	  searched:false
			// 	}])
			
		}
		
		
		// else {
			// setSection([
			// 	{
			// 	index:0,
			// 	  title: "Searched Item",
			// 	  data:searchItems, 
			// 	  searched:false
			// 	},
			// 	{index:1,
			// 	  title: dynamicTitle,
			// 	  data:results, 
			// 	  searched:false
			// 	}])
				
		// }
	}

	async function fetchProductV2(e,id,url,data){
		console.log('fetchProductV2',url)
 try {
	
	const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post(url, data);
	setStatus(false);
	return response;
	
 }
 catch(error){
	console.log('error',error)
	return null
 }

	}
	function searcNearestBooking(e){


		 try {

			setStatus(true)
			setCategory(e);
			var data =     {
				"location": "CEBU",
				"queryData":
				{"status":"Pending",
				"fields":"trips.departDetails.coordinates"},
				"maxDistance":10000,
				"radius":500,
				"arrivalCoordinates": [getCurrentUserLocation().coordinates.longitude,
					getCurrentUserLocation().coordinates.latitude]
			  }
	
			fetchProductV2(getCurrentUser().id,e, 'getNearestBooking',data).then(item =>{
				console.log('item->',item.data.results.count)
					setStatus(false);
					setResult(item.data.results.results);
					setSection([
						{index:  1,
						  title: 'Nearest Load',
						  data:item.data.results.results, 
						  searched:false
						}]) 
			})
		 } catch(error) {
			setStatus(false)
			setDisableLocation(true)
			Alert.alert(`Users Location`, `We cant give you the nearest load, allow Loogy to access your location.`, [
				{text: 'Okay', onPress: () => console.log('OK Pressed')}
			], {
			  cancelable: false,
			})
		 }
	}

	function setTypeOfTrip(trip){
		setStatus(true)
		setCategory('Discover')
		discoverBooking(selectedCity,trip)
	}
	function discoverBooking(e,trip){
	
		setStatus(true)
		setCategory('Discover')
		try {
			var coordinates = e === null ? [120.984222,14.599512]:e
			var typeOfTrip = trip === undefined  ?  'Arrival':trip
			setCity(coordinates)
			setTrip(typeOfTrip)
			var data =   {
				"location": "CEBU",
				"queryData":
				{"status":"Pending",
				"fields":typeOfTrip === 'Arrival' ?'trips.arrivalDetails.coordinates':'trips.departDetails.coordinates'},
				"maxDistance":10000,
				"radius":500,
				"arrivalCoordinates": coordinates
			  }
			fetchProductV2(getCurrentUser().id,e, 'getNearestBooking',data).then(item =>{
				console.log('item->',item.data.results)
					setStatus(false);
					setResult(item.data.results.results);
					setSection([
						{index:  1,
						  title: `Discover Load`,
						  data:item.data.results.results, 
						  searched:false
						}]) 
			})
		}catch(error){
			console.log('error',getCurrentUserLocation())
		}
	
	}

	function fetchNewCategory(e) {
		
		setStatus(true)
		setCategory(e);
		manageSectionItems(e)
		var title = e === 'byTeam' ? 'Your Team' : dynamicTitle
		fetchProduct(getCurrentUser().id,'user-id',e === 'byTeam' ? 'LoogyGroup' : undefined).then(item =>{
			setStatus(false);
			setResult(item.data.results);
			setSection([
			{index: e === 'byTeam' ? 2 : 1,
			  title: title,
			  data:item.data.results, 
			  searched:false
			}]) 
		})


		// setStatus(true);
		// setRefresh(true)
		// manageSectionItems(category)
		// fetchProduct(getCurrentUser().id,'user-id').then(item =>{ 
		// 	setStatus(false);
		// 	setRefresh(false)
		// 	setResult(item.data.results);
		// 	setSection([
		// 	{
		// 	  index:0,
		// 	  title: "Seached Item",
		// 	  data:searchItems, 
		// 	  searched:false
		// 	},
		// 	{index:1,
		// 	  title: dynamicTitle,
		// 	  data:item.data.results, 
		// 	  searched:false
		// 	}])
		// })


		//TEMPORARY DISABLE FOR RELEASE JUNE 7 
		// if (e.length <= 5) {
		// 	return 
		// }


	}
	async function onCheckedChange(isChecked) {
		var data = {
			title: 'You made it! Order Accepted!',
			body: `You will ${isChecked ? 'received ' : 'Not'} gonna received a orders`
		};
		let notif = schedulePushNotification(data).then(() => {});
		setChecked(isChecked);
	}

	const _handlePress = () => {
		Linking.openURL('https://waze.com/ul?ll=10.315699%2C123.885437&navigate=yes&zoom=17');
	};

	const loadArrivalDetails = (e) => {
		try {
			return e[0].arrival.substring(0, 20);
		} catch (error) {
			return 'Empty';
		}
	};
	const loadDepartDetails = (e) => {
		try {
			return e[0].depart.substring(0, 20);
		} catch (error) {
			return 'Empty';
		}
	};

	const validateUser = (data) => {
		var userNotFound = false;
		if (userNotFound) {
			LoginRequired();
		} else {
			navigation.navigate('LoadDetails', { screen: 'LoadDetails',referneceOrder: { item:data},viewType:"dashboard" })
		}
	};
	function currencyFormat(num) {
		return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	  }


	const getGroupTitle =(e)=>{
		try {
			return e.data.title
		} catch (error) {
			return e.shortName
		}
	}
	const groupContent = (indexData, indexSection) => {

		return (
			<TouchableOpacity onPress={()=>navigation.navigate('Team', { screen: 'TeamList' ,params: { contextData:  indexData}})}>
						<View style={{ marginLeft: 30, marginTop: 2 ,alignItems:'flex-start',marginBottom:20}}>
						<Image
										source={{
											uri:
												'https://cdn.iconscout.com/icon/free/png-256/forward-1767505-1502572.png'
										}}
										style={{
                      position:'absolute',
											width: 20,
											height: 20,
                      top:30,
                      right:20,
                      opacity:1
										}}
									/>
						<Text category="h1" style={{fontWeight:'bold',marginTop:20}}>{getGroupTitle(indexData)}</Text>
						<Text category="p1" style={{fontWeight:'bold',marginTop:10,color:'#0652DD'}}>{indexData.shortName}</Text>
						<TouchableOpacity onPress={()=>addNewTeam()}>		
							<View style={{width:'auto',marginTop:20}}>
						</View>
						</TouchableOpacity>
						</View>
				</TouchableOpacity>
		)
		
	}
	const journeyContent = (indexData, indexSection) => {
		var data = indexData
		var returnedDate =  data.trips ? data.trips[0].returnedDate : new Date()
		var departedDate =  data.trips ? data.trips[0].selectedDate : new Date()
		let loadType = data.loadType
		var priceRange = data.offeredPrice === undefined  ? 0 : Number(data.offeredPrice)
		if (indexSection.index === 1) {
			category
			return (
				<TouchableOpacity onPress={() => validateUser(data)} activeOpacity={1}>
					<View style={{ marginLeft: 30, marginTop: 2 }}>
						</View>
					<React.Fragment> 
						<View
							style={{
								backgroundColor: 'white',
								borderColor: 'white',
								borderWidth: 0.5,
								borderRadius: 10,
								margin: 10,
								marginRight: 30,
								marginLeft: 30,
								elevation: 2
							}}
						>
							<View
								style={{
									backgroundColor: '#6ab04c',
									height: 10,
									width: 10,
									position: 'absolute',
									left: 16,
									top: 55,
									borderRadius: 10,
									alignItems: 'center',
									zIndex: 4
								}}
							/>
							<View
								style={{
									backgroundColor: '#C4E538',
									height: '25%',
									width: 1,
									position: 'absolute',
									left: 20,
									top: 25 + 39,
									opacity: 1,
									borderWidth: 1,
									borderRadius: 1,
									zIndex: 1,
									elevation: 1
								}}
							/>
							<View
								style={{
									backgroundColor: 'black',
									height: 10,
									width: 10,
									position: 'absolute',
									left: 16,
									top: 59 + 32,
									borderRadius: 1,
									alignItems: 'center',
									zIndex: 4
								}}
							/>
							{/* <TouchableOpacity onPress={() => _handlePress()} style={{ zIndex: 1 }}>
								<View
									style={{
										backgroundColor: 'white',
										height: 25,
										width: 25,
										position: 'absolute',
										right: -10,
										top: 30,
										zIndex: 1,
										borderRadius: 25,
										alignItems: 'center'
									}}
								>
									<View style={{ width: 30, height: 30, borderRadius: 50 / 2 }}>
										<Image
											source={{
												uri:
													'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'
											}}
											style={{
												width: 30,
												height: 30,
												transform: [ { rotateZ: '180deg' } ]
											}}
										/>
									</View>
								</View>
							</TouchableOpacity> */}
							<View>
								<Text category="h5" style={{ fontWeight: 'bold', marginLeft: 15, marginTop: 5 }}>
									{currencyFormat(priceRange)}
								</Text>
								<View style={{ position: 'absolute', top: 10, right: 20 }}>
									<TouchableOpacity>
										<Text category="c2" style={{ color: '#0652DD',fontWeight:'bold', marginLeft: 5, marginRight: 5 }}>
											{data.referenceOrder}
										</Text>
									</TouchableOpacity>
								</View>
								<View style={{position:'absolute',top:10,right:20,zIndex:1}}>
    <Image
										source={{
											uri:
												'https://cdn.iconscout.com/icon/free/png-256/forward-1767505-1502572.png'
										}}
										style={{
                      position:'absolute',
											width: 20,
											height: 20,
                      top:-3,
                      right:-20,
                      opacity:0.5
										}}
									/>
    </View>
							</View>
							<Divider />
							<Layout style={styles.containerMultiDate} level="1">
								<TouchableOpacity onPress={() => _handlePress()} style={styles.input}>
									<Text
										style={{
											flex: 1,
											margin: 2,
											fontSize:11,
											marginLeft: 11,
											// fontWeight: 'bold',
											color: '#747d8c'
										}}
									>
										{data.trips === undefined ? (
											''
										) : data.trips.length ? (
											loadDepartDetails(data.trips)
										) : (
											''
										)}...
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									disabled={undefined === null ? true : false}
									style={styles.inputRoundTripTouchable}
								>
									<Text
										style={{
											flex: 1,
											margin: 2,
											
											fontSize:11,
											marginLeft: 11,
											// fontWeight: 'bold'
										}}
									>{departedDate}
										{/* {data.trips ? moment(departedDate,'MMMM DDD YYYY').toDate().toDateString() : ''} */}
									</Text>
								</TouchableOpacity>
							</Layout>
							<Layout style={styles.containerContent} level="1">
								<TouchableOpacity style={styles.input}>
									<Text
										style={{
											flex: 1,
											margin: 2,
											marginLeft: 11,
											fontSize:11,
											// fontWeight: 'bold',
											color: '#747d8c'
										}}
									>
										{data.trips === undefined ? (
											''
										) : data.trips.length ? (
											loadArrivalDetails(data.trips)
										) : (
											''
										)}...
									</Text>
								</TouchableOpacity>
								{loadType != 'One-Way' ? <TouchableOpacity
									disabled={undefined === null ? true : false}
									style={styles.inputRoundTripTouchable}
								>
									<Text
										style={{
											flex: 1,
											margin: 2,
											marginLeft: 11,
											fontSize:11,
											// fontWeight: 'bold'
										}}
									>{data.trips ? returnedDate  : ''}
									{/* moment(returnedDate,'MMMM DDD YYYY, h:mm:ss A').toDate().toDateString() */}
									</Text>
<View style={{position:'absolute',top:20,right:60,backgroundColor:'#c7ecee',borderRadius:20}}>
<Text style={{padding:5,fontSize:11,fontWeight:'bold'}}>Estimate</Text>
</View>
								</TouchableOpacity> : null}
								
							</Layout>
						</View> 
						{/* <Text>Distance : 1031</Text> */}
					</React.Fragment>
				</TouchableOpacity>
			);
		} else 	if (indexSection.index === 2) { 
			return (
				<TouchableOpacity>
						<View style={{ marginLeft: 30, marginTop: 2 ,alignItems:'center',marginBottom:20}}>
						<Image source={{ uri: 'https://cdn.dribbble.com/users/3809802/screenshots/6855289/3_4x.png?compress=1&resize=1200x900&vertical=top' }}  style={{height:250,width:width ,resizeMode:'cover'}} fadeDuration={20} />
							<Text category="p1" style={{fontWeight:'light',marginTop:20}}>Connect with other group drivers</Text>

						<TouchableOpacity onPress={()=>addNewTeam()}>		
							<View style={{width:'auto',marginTop:20}}>
					
		<View	style={{
									backgroundColor:  '#0652DD'  ,
									// marginL: 10,
									width: 'auto',
									// marginRight:20,÷
									// margin:20,
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}>
	<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color:  'white'
									}}
									category="c2"
								>
									Add your Team +
								</Text>
								</View>
						</View>
						</TouchableOpacity>
						</View>
						
				</TouchableOpacity>
				// <Button style={{backgroundColor:'#2ecc71',borderColor:'##2ecc71'}}><Text style={{color:'white'}}>Add your group here</Text></Button>
			)

		}
	};
	const displayItems = (e) => {
		const content = [ <View /> ];
		e.map((data, index) => {
			content.push(
				<React.Fragment>
					<View
						style={{
							backgroundColor: 'white',
							borderColor: 'white',
							borderWidth: 0.5,
							borderRadius: 10,
							margin: 10,
							marginRight: 30,
							marginLeft: 30,
							elevation: 2
						}}
					>
						<View
							style={{
								backgroundColor: 'black',
								height: 10,
								width: 10,
								position: 'absolute',
								left: 16,
								top: 15,
								borderRadius: 10,
								alignItems: 'center',
								zIndex: 4
							}}
						/>
						<View
							style={{
								backgroundColor: '#C4E538',
								height: '40%',
								width: 1,
								position: 'absolute',
								left: 20,
								top: 25,
								opacity: 1,
								borderWidth: 1,
								borderRadius: 1,
								zIndex: 1,
								elevation: 1
							}}
						/>
						<View
							style={{
								backgroundColor: '#dcdde1',
								height: 10,
								width: 10,
								position: 'absolute',
								left: 16,
								top: 59,
								borderRadius: 10,
								alignItems: 'center',
								zIndex: 4
							}}
						/>

						<View
							style={{
								backgroundColor: 'black',
								height: 25,
								width: 25,
								position: 'absolute',
								right: -4,
								top: -12,
								borderRadius: 25,
								alignItems: 'center'
							}}
						>
							<Text style={{ fontWeight: 'bold', color: 'white', marginTop: 3 }}>{index + 1}</Text>
						</View>
						<Layout style={styles.containerMultiDate} level="1">
							<TouchableOpacity style={styles.input}>
								<Text
									style={{
										flex: 1,
										margin: 2,
										marginLeft: 11,
										fontWeight: 'bold',
										color: '#747d8c'
									}}
								>
									Pickup From
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={undefined === null ? true : false}
								style={styles.inputRoundTripTouchable}
							>
								<Text
									style={{
										flex: 1,
										margin: 2,
										marginLeft: 11,
										fontWeight: 'bold'
									}}
								>
									{'Ayala Alabang, MNL'}
								</Text>
							</TouchableOpacity>
						</Layout>

						<Layout style={styles.containerContent} level="1">
							{/* <View style={{backgroundColor:'#A3CB38',height:,width:2,position:'absolute',left:5,top:-60,borderStyle:'dotted', opacity:0.5,    borderWidth: 1,
     borderRadius:1}}/> */}
							<TouchableOpacity style={styles.input}>
								<Text
									style={{
										flex: 1,
										margin: 2,
										marginLeft: 11,
										fontWeight: 'bold',
										color: '#747d8c'
									}}
								>
									Delivery To
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={undefined === null ? true : false}
								style={styles.inputRoundTripTouchable}
							>
								<Text
									style={{
										flex: 1,
										margin: 2,
										marginLeft: 11,
										fontWeight: 'bold'
									}}
								>
									{'Cagaya de Oro - CGY'}
								</Text>
							</TouchableOpacity>
						</Layout>
					</View>
					{/* <View style={{height:2,width:30,backgroundColor:'gray',marginLeft:'10%',borderWidth:2,borderRadius:20}}/> */}
				</React.Fragment>
			);
		});
		return content;
	};

	const location = () => {
		var today = new Date()
	
		return (
			<TouchableOpacity>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 10
					}}
				>
					<Text style={{ marginRight: 5, color: 'black' }} category="c1">
						{	moment(today).format('MMMM DD YYYY, h:mm:ss A').toString()}
					</Text>
					{/* <Image  source={{uri:'https://static.thenounproject.com/png/4404538-200.png'}}  style={{width:25,height:25  }}/> */}
				</View>
			</TouchableOpacity>
		);
	};
	const validateApplicateType = () => {
		console.log('user data',getCurrentUser())
		try {
			return getCurrentUser().data.user_metadata.aplicantType
			
		} catch (error) {
			return "Verification's Needed"
		}
	}
	const valiteEmail = () => {
		try {
			return getCurrentUser().email
			
		} catch (error) {
			return "Verification's Needed"
		}
	}
	const HeaderContent = () => {
		return (
			<View style={{ width: width, height: 'auto', backgroundColor: checked ? 'white' : 'white' }}>
				<Text style={{ marginLeft: 20, marginTop: 70, color: 'black', fontWeight: '400' }} category="c1">
					Welcome
					{/* // {status ? '' :  validateApplicateType() } */}
				</Text>
				<Text
					style={{ marginLeft: 20, marginTop: 5, color: 'black', fontSize: 16, fontWeight: 'bold' }}
					category="c2"
				>{valiteEmail()}
				</Text>
				<Divider style={{marginTop:20}}/>
				<View style={{flexDirection:'row'}}>
				<View style={{flexDirection:'row'}}>
				<Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Your</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Load</Text>
				</View>
				<Button onPress={()=>navigation.navigate('Home', { screen: 'Service' })} style={{ borderRadius: 40, width: 20,height:20, backgroundColor:'black', borderColor: 'black' }}>Create your load</Button>
		
					</View>
					{/* <TouchableOpacity>{location()}</TouchableOpacity> */}
				<View
					style={{ height: 30, width: 70, top: 60, position: 'absolute', alignSelf: 'flex-end', right: 30 }}
				>
					
					
					<TouchableOpacity onPress={() =>  navigation.navigate('Home',{screen:'UserProfile',productID:'Depart',params: { viewingType:  'viewProfile'}}) }>
						{/* <Toggle status="success" checked={checked} onChange={onCheckedChange}>
							<Text style={{ color: 'white' }}>{`${checked ? 'Online' : 'Offline'}`}</Text>
						</Toggle> */}
						<View style={{width:40,height:40,borderRadius:20,backgroundColor:'#0652DD',marginLeft:20,justifyContent:'center',alignContent:'center',alignItems:'center'}}><Image  source={{uri:getCurrentUser().data.user_metadata.userDetails.avatar}}  style={{width:30,height:30 ,borderRadius:15 }}/></View>
						{/* <Text style={{ color: 'white' }}>Profile</Text> */}
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	// ScanTracking
	const viewScanner = ()=>{
		navigation.navigate('ScanTracking');
		// searchItem(value,'load-id')
	}
	const rightContent = () => {
		return (
			<TouchableOpacity onPress={() => viewScanner() }>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor:'white',
						borderRadius:20,elevation:15,marginRight:10
						
					}}
				>
					<Text style={{ marginLeft: 10,marginRight:10,color:'black' }}>Scan by QR</Text>
					<Image
						source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/qr-code-scan-2120166-1784370.png' }}
						style={{ width: 25, height: 25 ,marginRight: 10}}
					/>
				</View>
			</TouchableOpacity>
		);
	};
	const searchIconContent = () => {
		return (
			<TouchableOpacity onPress={() => navigation.navigate('SearchLoad') }>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor:'white',
						borderRadius:20,
						elevation:15
						

					}}
				><Image
						source={{ uri: 'https://icon-library.com/images/search-icon-small/search-icon-small-17.jpg' }}
						style={{ width: 25, height: 25 }}
					/>
				</View>
			</TouchableOpacity>
		);
	};
	const showProfileIconContent = () => {
		return (
			<TouchableOpacity onPress={() =>  navigation.navigate('Profile',{screen:'UserProfile',productID:'Depart',params: { viewingType:  'viewProfile'}}) }>
				<View
					style={{
						flexDirection: 'row',
						alignContent: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor:'white',
						borderRadius:20,marginLeft:10,
						elevation:15,borderWidth:2,borderColor:'white'
					}}
				><Image
						source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQjblwVQ-GlXCaTJnkev2wwBkrWAZQzUehfQ&usqp=CAU' }}
						style={{ width: 25, height: 25,	borderRadius:20 }}
					/>
				</View>
			</TouchableOpacity>
		);
	};
	const noticeView = ()=>{
		return (
			<> 
			<Layout style={{margin:20,borderRadius:5,backgroundColor:'#f7f1e3'}} level="1" >
			<View style={{height:2,width:'100%',backgroundColor:Colors.light.tint,borderRadius:5}}/> 
				<View status='basic' style={{margin:20}}>
		
				<Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >
				Search Load item
				</Text>
				 <Text    category="c1"style={{marginTop:5}}   >
				 You can also search the load by scanning qr code  <Text    category="c1" style={{fontWeight:'bold',color:'black'}}  >Tap Scan by QR</Text>
				</Text>
				 </View>  
				 <Text style={{marginLeft:20,position:'absolute',top:0,right:20}}>Hide</Text>
			  </Layout> 
			  {isFirstTouch ? value.length <= 5  ?<Text style={{color:'#e84118',marginLeft:20,marginTop:-10,marginBottom:20}} category="c1">Your booking reference should 6 characters</Text> : null : null}
			  {/* <TouchableOpacity onPress={()=> setKeyboardActive(false)}>
			  <Text style={{marginLeft:20}}>Hide</Text>
			  </TouchableOpacity> */}
			  </>
		)
	}
	const notifyUserWhenReady =()=>{
		console.log('notify this person',getCurrentUser())
	}
	const displayCominSoon = ()=>{
		Alert.alert(`Coming soon`, `We are working on this feature, so stay tuned to get more updates.`, [
          	{text: 'Okay', onPress: () => console.log('OK Pressed')},  
			{ text: "Notify me, when it's ready", onPress: () => notifyUserWhenReady() },
          ], {
            cancelable: false,
          })
	}
	const loadCategory = React.useMemo(()=> { 
		var allowedItems = appNavigations
		var list = []
		// list.push(<TouchableOpacity  onPress={() => fetchNewCategory('Following','user-id')}>
		// 				<View
		// 					style={{
		// 						opacity: category === 'Following' ? 1 : 0.2,
		// 						backgroundColor: category === 'Following' ? 'black' : 'white',
		// 						margin: 10,
		// 						width: 'auto',
		// 						height: 25,
		// 						borderRadius: 50 / 2,
		// 						justifyContent: 'center',
		// 						alignContent: 'center'
		// 					}}
		// 				>
		// 					<Text
		// 						style={{
		// 							marginLeft: 10,
		// 							marginRight: 10,
		// 							marginTop: 0,
		// 							color: category === 'Following' ? 'white' : 'black'
		// 						}}
		// 						category="c2"
		// 					>
		// 						Following
		// 					</Text>
		// 				</View>
		// 			</TouchableOpacity>)
		appNavigations.map((data, index) => {
			if (data.status) {
					if (data.id === 1) {
						list.push(	<TouchableOpacity   onPress={() =>   discoverBooking(selectedCity,tripType) }>
						<View
							style={{
								opacity: category === 'Discover' ? 1 : 0.2,
								backgroundColor: category === 'Discover' ? 'black' : 'white',
								margin: 10,
								width: 'auto',
								height: 25,
								borderRadius: 50 / 2,
								justifyContent: 'center',
								alignContent: 'center'
							}}
						><View style={{backgroundColor:category === 'Discover' ? 'red' : 'white',width:10,height:10,borderRadius:5,position:'absolute',top:-2,right:0}}/>
							<Text
								style={{
									marginLeft: 10,
									marginRight: 10,
									marginTop: 0,
									color: category === 'Discover' ? 'white' : 'black'
								}}
								category="c2"
							>
								{data.title}
							</Text>
						</View>
					</TouchableOpacity>)
					} else if (data.id === 2) {
					
						list.push(<TouchableOpacity  onPress={() => fetchNewCategory('One-Way','user-id')}>
						<View
							style={{
								opacity: category === 'One-Way' ? 1 : 0.2,
								backgroundColor: category === 'One-Way' ? 'black' : 'white',
								margin: 10,
								width: 'auto',
								height: 25,
								borderRadius: 50 / 2,
								justifyContent: 'center',
								alignContent: 'center'
							}}
						>
							<Text
								style={{
									marginLeft: 10,
									marginRight: 10,
									marginTop: 0,
									color: category === 'One-Way' ? 'white' : 'black'
								}}
								category="c2"
							>
								{data.title}
							</Text>
						</View>
					</TouchableOpacity>)
					} else if (data.id === 3) {
						list.push(<TouchableOpacity  disabled={false} onPress={() => fetchNewCategory('byTeam','user-id')} > 
						
							<View
								style={{
									opacity: category === 'byTeam' ? 1 : 0.2,
									backgroundColor: category === 'byTeam' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'byTeam' ? 'white' : 'black'
									}}
									category="c2"
								>
									{data.title}
								</Text>
							</View>
						</TouchableOpacity>)
					} else if (data.id === 6) {
							list.push(
								<TouchableOpacity   onPress={() =>   searcNearestBooking('NearMe','user-id') }>
								<View
									style={{
										opacity: category === 'NearMe' ? 1 : 0.2,
										backgroundColor: category === 'NearMe' ? 'black' : 'white',
										margin: 10,
										width: 'auto',
										height: 25,
										borderRadius: 50 / 2,
										justifyContent: 'center',
										alignContent: 'center'
									}}
								>
									<Text
										style={{
											marginLeft: 10,
											marginRight: 10,
											marginTop: 0,
											color: category === 'NearMe' ? 'white' : 'black'
										}}
										category="c2"
									>
									{data.title}
									</Text>
								</View>
							</TouchableOpacity> 
							)
				} 
		}
			}
		)
		
		return(
			<ScrollView horizontal={true} style={{height:90,paddingLeft:Platform.OS === 'android' ? 10 : 20,showsHorizontalScrollIndicator:false}}  showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
			<View
						
						style={{
							opacity:isKeyboardActive ? 0 : 1,
							height: 50,
							width: width,
							justifyContent: 'center',
							flexDirection: 'row',
							alignSelf: 'auto',
							alignContent: 'center',
							marginTop: 20
						}}
					>
						{list}
							{/* <TouchableOpacity   onPress={() =>   discoverBooking(selectedCity,tripType) }>
							<View
								style={{
									opacity: category === 'Discover' ? 1 : 0.2,
									backgroundColor: category === 'Discover' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							><View style={{backgroundColor:category === 'Discover' ? 'red' : 'white',width:10,height:10,borderRadius:5,position:'absolute',top:-2,right:0}}/>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'Discover' ? 'white' : 'black'
									}}
									category="c2"
								>
									Discover
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity  onPress={() => fetchNewCategory('One-Way','user-id')}>
							<View
								style={{
									opacity: category === 'One-Way' ? 1 : 0.2,
									backgroundColor: category === 'One-Way' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'One-Way' ? 'white' : 'black'
									}}
									category="c2"
								>
									Personal Load
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity  disabled={false} onPress={() => fetchNewCategory('byTeam','user-id')} > 
					
							<View
								style={{
									opacity: category === 'byTeam' ? 1 : 0.2,
									backgroundColor: category === 'byTeam' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'byTeam' ? 'white' : 'black'
									}}
									category="c2"
								>
									Team
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity   onPress={() =>   searcNearestBooking('NearMe','user-id') }>
							<View
								style={{
									opacity: category === 'NearMe' ? 1 : 0.2,
									backgroundColor: category === 'NearMe' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'NearMe' ? 'white' : 'black'
									}}
									category="c2"
								>
									Nearest Load
								</Text>
							</View>
						</TouchableOpacity>  */}
						{/* <TouchableOpacity  disabled={status}  onPress={() => displayCominSoon()}>
							<View
								style={{
									opacity:0.2,
									backgroundColor: category === 'byTeam' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'byTeam' ? 'white' : 'black'
									}}
									category="c2"
								>
									Visayas
								</Text>
							</View>
						</TouchableOpacity> */}
						{/* <TouchableOpacity  disabled={status}  onPress={() => displayCominSoon()}>
							<View
								style={{
									opacity:0.2,
									backgroundColor: category === 'byTeam' ? 'black' : 'white',
									margin: 10,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: category === 'byTeam' ? 'white' : 'black'
									}}
									category="c2"
								>
									Mindanao
								</Text>
							</View>
						</TouchableOpacity> */}
					</View>
					</ScrollView>
		)
	},[category,appNavigations])






	const onRefresh = React.useCallback(() => {
		var e = category
		setStatus(true)
		setCategory(e);
		manageSectionItems(e)
		var title = e === 'byTeam' ? 'Your Groups' : dynamicTitle
		fetchProduct(getCurrentUser().id,'user-id',e === 'byTeam' ? 'LoogyGroup' : undefined).then(item =>{
			setStatus(false);
			setResult(item.data.results);
			setSection([
			{index: e === 'byTeam' ? 2 : 1,
			  title: title,
			  data:item.data.results, 
			  searched:false
			}]) 
		})
	  }, [didRefresh,getCurrentUser().data]);
 
	const displayEmptyTeam = ()=> {
		return (
			<TouchableOpacity onPress={()=>addNewTeam()}>
			<View style={{ marginLeft: 0, marginTop: 20 ,alignItems:'center',marginBottom:20}}>
			<Image source={{ uri: 'https://cdn.dribbble.com/users/3809802/screenshots/6855289/3_4x.png?compress=1&resize=1200x900&vertical=top' }}  style={{height:250,width:width ,resizeMode:'cover'}} fadeDuration={20} />
				<Text category="p1" style={{fontWeight:'light',marginTop:20}}>Connect with other drivers</Text>
				<TouchableOpacity >		
							<View style={{width:'auto',marginTop:20}}>
					
		<View	style={{
									backgroundColor:  '#ecf0f1'  ,
									width: 'auto',
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}>
	<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color:  'black'
									}}
									category="c2"
								>
									Browse other Team 
								</Text>
								</View>
						</View>
						</TouchableOpacity>
			</View>
	
	</TouchableOpacity>
		)
	}
	const displayHeaderItem = (section)=>{
		try { 
		if (status) {
			return <View/>
		}
		if (section.index === 0 && (section.searched === true && section.data.length != 0 ) ) {
			return   ( 
			<View style={{marginBottom:20,marginTop:20,marginLeft:20,backgroundColor:'white'}}>
			<Text category="p1" style={{fontWeight:'bold'}}>{section.title}</Text>
			
			<View style={{fontWeight:'100',marginLeft:5,position:'absolute',top:0,right:40}}><TouchableOpacity onPress={()=>clearItem()}><Text category="c1" style={{fontWeight:'bold',marginLeft:10,marginRight:0,marginTop:5,marginBottom:5,color:'black'}}>CLEAR</Text></TouchableOpacity></View>
	
		</View>
			)
		}else if (section.index === 0 && (section.data.length === 0 && section.searched === true)) {
			return   ( 
				<React.Fragment>
					{/* <Text category="h6" style={{fontWeight:'bold',marginBottom:20,marginTop:20,marginLeft:20,}}>{section.title}</Text> */}
			<View style={{marginBottom:20,marginTop:40,marginLeft:20,alignContent:'center',alignItems:'center',backgroundColor:'white'}}>
			<Image source={{ uri: 'https://cdn.dribbble.com/users/1053528/screenshots/11887031/media/bfdbde8644eddd2023c406d6ec055acd.png?compress=1&resize=1200x900&vertical=top'}} style={{ width:400,height:200}}/>
			<Text category="h6" style={{fontWeight:'bold',marginTop:20}}>{value} Not found</Text>
			<TouchableOpacity onPress={()=>clearItem()}><Text category="c1" style={{fontWeight:'100',marginTop:15,marginBottom:60,color:'#0652DD'}}>Please check and search again...</Text></TouchableOpacity>
			
			
		</View>
		</React.Fragment>
			)
		}else if (section.index === 0 && section.searched === false) {
			return  <View />
		}  else if (section.index === 1  && section.data.length != 0 && category === 'Discover' ) {
			return (<>
				<View style={{justifyContent:'space-between',flexDirection:'row',marginRight:20,backgroundColor:'white'}}>
				<View style={{marginBottom:10,marginTop:0,marginLeft:20,backgroundColor:'white'}}>
			<Text category="p1" style={{fontWeight:'bold'}}>{section.title}</Text>
			<Text category="c1" style={{fontWeight:'400',marginLeft:1,marginBottom:10}}>{section.data.length} {tripType.toLowerCase()} item{section.data.length === 1 ? '': 's'} found</Text> 
			</View>
				{renderArrivalDepartedButton()}
				</View>
			</>)
		}  else if (section.index === 1  && section.data.length === 0 && category === 'Discover' ) {
			return  (
				<React.Fragment> 
			<View style={{marginBottom:20,marginTop:40,marginLeft:20,alignContent:'center',alignItems:'center'}}>
			<Image  source={{ uri: 'https://cdn.dribbble.com/users/37530/screenshots/3818851/media/e3890ef95385de5dc49e9a9155e4cfea.png?compress=1&resize=800x600&vertical=top'}} style={{ width:'100%',height:300}}/>
			<Text category="p1" style={{marginTop:20,marginBottom:20}}>It seems the {tripType} loads was already taken.</Text>
			{renderArrivalDepartedButton()} 
		</View>
		</React.Fragment>
			)
		}
		else if (section.index === 1  && section.data.length === 0 ) {
			return  (
				<React.Fragment> 
			<View style={{marginBottom:20,marginTop:40,marginLeft:20,alignContent:'center',alignItems:'center'}}>
			<Image  source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/empty-state-concept-3428212-2902554.png'}} style={{ width:'100%',height:300}}/>
			<Text category="p1" style={{marginTop:20,marginBottom:40}}>Welcome! to start create your own load</Text>
			<Button onPress={()=>navigation.navigate('Home', { screen: 'Service' })} style={{ borderRadius: 40, width: width - 40, marginRight:20, marginTop: 20,marginBottom:32, backgroundColor:'black', borderColor: 'black' }}>Create your load</Button>
 			{/* <Button  status="basic"    onPress={()=> navigation.navigate('Load', { screen: 'Service' })}    style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'white', borderColor: 'white' }}>
     	 <Text style={{ color: 'black', fontWeight: 'bold' }}>Create load first load</Text>
		</Button> */}

		</View>
		</React.Fragment>
			)
		}else if (section.index === 2) {
			return <>
<View style={{marginBottom:20,marginTop:0,marginLeft:20,backgroundColor:'white'}}> 

<View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
	<View>
	<Text category="p1" style={{fontWeight:'bold'}}>{section.title}</Text>
<Text category="c1" style={{fontWeight:'400',marginLeft:0}}> {section.data.length === 0  ? 'Stay connected' :`Team found ${section.data.length}` }</Text> 
	</View>
	<View >
		<TouchableOpacity onPress={()=>addNewTeam()}>
		<View	style={{
									backgroundColor:  '#0652DD'  ,
									// marginL: 10,
									width: 'auto',
									marginRight:20,
									// margin:20,
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}>
	<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color:  'white'
									}}
									category="c2"
								>
									Create your Team +
								</Text>
								</View>
								</TouchableOpacity>
	{/* <Button style={{backgroundColor:'#2ecc71',borderColor:'#2ecc71'}}><Text style={{color:'white'}}>Add your Team here</Text></Button> */}
	{/* <TouchableOpacity  disabled={status ? true :false} ><Text style={{color:1 >= 0 ? '#0652DD' : '#dcdde1',}}>Email</Text></TouchableOpacity> */}
	{/* <Text style={{color:'black',marginLeft:20,marginRight:0,fontWeight:'light',fontSize:40,marginTop:10}} >Booking</Text>
				<Text style={{color:'black',marginLeft:10,marginRight:50,fontWeight:'bold',fontSize:40,marginTop:10}} >Summary</Text> */}
	</View>
		
				</View>
				{console.log('console.log(sectionitems.length)',sectionitems.length)}
			{section.data.length === 0 ? displayEmptyTeam() : null}
</View>
</>
		}else {
			return (
				<>
									{/* {HeaderContent()} */}
				<View style={{marginBottom:20,marginTop:0,marginLeft:20,backgroundColor:'white'}}>
			<Text category="p1" style={{fontWeight:'bold'}}>{section.title}</Text>
			<Text category="c1" style={{fontWeight:'400',marginLeft:1,marginBottom:10}}>{section.data.length} item{section.data.length === 1 ? '': 's'} found</Text>
		</View>
	 </>
			)
		}
		}catch {
			return <View/>
		}
	}

	const renderArrivalDepartedButton = ()=>{
		return (
				<View style={{flexDirection:'row',justifyContent:'flex-end'}}>
			<TouchableOpacity onPress={()=> setTypeOfTrip('Departed')}>
			<View style={{flexDirection:'row',opacity:tripType === 'Arrival' ? 1: 0.2}}>
				<View style={{height:15,width:15,backgroundColor:'#6ab04c',borderRadius:10,marginRight:8}}/>
			<Text category="c1" style={{fontWeight:'bold',marginRight:10,opacity:tripType === 'Arrival' ? 1: 0.5,color:'#0652DD'}}>{tripType === 'Departed'?'':'Try'} Departed</Text>
			
			</View>
				</TouchableOpacity>
				<TouchableOpacity  onPress={()=> setTypeOfTrip('Arrival')}>
				<View style={{flexDirection:'row',opacity:tripType === 'Departed' ? 1: 0.2}}>
				<View style={{height:15,width:15,backgroundColor:'black',marginRight:8}}/>
				<Text category="c1" style={{fontWeight:'bold',color:'#0652DD'}}>{tripType === 'Arrival'?'':'Try'} Arrival</Text>
				{/* <View style={{backgroundColor:'black',width:20,height:2,borderRadius:2,position:'absolute',bottom:-2,marginLeft:20,marginRight:'auto'}}/> */}
				</View>
				</TouchableOpacity>
			</View>
	
		)
	}
	const clearItem =()=>{
		setKeyboardFocus(true)
		setSection(sectionitems.filter((item)=> item.index != 0))
		
	}
	const submitItem =(e)=>{
		setFirstTouch(true)
		searchItem(e.nativeEvent.text)
	}
	const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
		const paddingToBottom = 20;
		return layoutMeasurement.height + contentOffset.y >=
		  contentSize.height - paddingToBottom;
	  };
	   
	  const fullLoader = ()=>{
		switch (category) {
			case 'One-Way':
			case 'byTeam':
				return (<>
					<BigLoader/>
					<BigLoader/>
					<BigLoader/>
					<BigLoader/>
					<BigLoader/> 
				  </>)
				
			break;
			case  'Discover':
				case 'NearMe':
				return (<>
				<Image
				source={{
					uri:
						'https://cdn.dribbble.com/users/475393/screenshots/3099510/pulse.gif'
				}}
				style={{
				// position:'absolute',
					width: width,
					height: height / 3,
					// top:1200,
					// right:20,
					// opacity:1
				}}
			/>
			<View style={{height:height/ 2,width:width,backgroundColor:'white'}}/>
			</>)
			break;
		}
		  
	  }
	  const refreshController =()=>{
		try {
			return 		<RefreshControl
			style={{opacity:0.2}}
			  refreshing={didRefresh}
			  size= {2}
			  onRefresh={onRefresh}
			/>
		} catch (error) {
			null
		}
	  }
	  const renderSectionlist = ()=> {
		try {
			return <SectionList
						contentContainerStyle={{paddingBottom:400,paddingTop:20}}
						style={{
							paddingBottom:200,
							opacity:isSheetDisplay ? 0.1: 1,
							backgroundColor:'white'
						}}
						//   refreshControl={
						// 	refreshController
						//   }   
		   sections={sectionitems}
			renderItem={({ section,item}) =>  
			isKeyboardActive ? null : 	(
				<React.Fragment>
					 {/* {section.index === 0 ? <View style={{ backgroundColor:  '#192a56', marginTop: 2,marginBottom:0, width: 90, height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center',marginLeft:25,alignItems:'center' }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color:'white' ,fontWeight:'bold',width:'auto'}} category='c2' >{item.loadType}</Text></View>: null} */}
					{/* {section.index === 1 ? journeyContent(item,section) : <View style={{backgroundColor:'red'}}/>} */}
					{/* {category === 'One-Way' ?journeyContent(item,section) : groupContent(item,section)} */}
					{renderSectionContent(item,section)}
					{/* <View/> */}
				 </React.Fragment>)
			 }
			keyExtractor={(item, index) =>  index}
			maxToRenderPerBatch={5}
			ListEmptyComponent={()=><View style={{height:200,width:width,backgroundColor:'red'}}/>}
			renderSectionHeader={({ section }) =>  displayHeaderItem(section) }
			/>
		} catch (error) {
			return <View style={{backgroundColor:'red',width:width,height:200}}/>
		}
	  }
	const userHeaderContent =()=>{
		return 	<View style={{ marginTop: 40 }} >
		<View style={{flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'space-between',marginTop:20,marginLeft:20,marginRight:20,marginBottom:20}}>
		<View style={{width:'auto',height:'auto',borderRadius:20}}>
		{showProfileIconContent()}
		</View>
		<View style={{width:'auto',height:'auto',borderRadius:40}}>
		<View style={{flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
		{rightContent()}
		{searchIconContent()}
		</View>
		</View>
		</View>
	<UserLocationUI errorMessage={'To get accurate loads, allow Loogy to access your location'}/>
	</View>
	}
	
	const cityLocator =(e)=>{
		switch (e) {
			case 'NCR':
				discoverBooking([121.023415,14.556586])
				setDiscoveryRegion('NCR')
	
				break;
				case 'BATANGAS':
					discoverBooking([121.164421,13.941876])
					setDiscoveryRegion('BATANGAS')
					
					break;
					case 'LEYTE':
						discoverBooking( [124.858482,10.131400])
						setDiscoveryRegion('LEYTE')
					break;
					case 'CEBU':
						discoverBooking([123.997292,10.266182])
						notifyGroup("cebu-trucking")
						setDiscoveryRegion('CEBU')
					break;
					case 'BOHOL':
						discoverBooking([123.873001,9.672948])
						setDiscoveryRegion('BOHOL')
						break;
						case 'DAVAO':
							discoverBooking([126.176643,7.106000])
							setDiscoveryRegion('DAVAO')
						break;

						case 'CGY':
							discoverBooking([124.645920,8.477217])
							setDiscoveryRegion('CGY')
							break;
						
							case 'DVO':
								discoverBooking([124.645920,8.477217])
								setDiscoveryRegion('DVO')
								notifyGroup("davao-trucking")
								break;
						
			default:
				break;
		}
	}
	const renderSearchBar = ()=>{
		const successContent =  (
			<>
			<ScrollView  horizontal={true} showsHorizontalScrollIndicator={false} style={{height:60,width:width,opacity: status ? 0.1: 1}}>
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('NCR')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black',fontWeight: currentRegion ==='DVO' ?'800' :'200' }} category='c2' >NCR</Text></View></TouchableOpacity>
		
			
			{/* <TouchableOpacity disabled={status} onPress={()=>cityLocator('NCR')} ><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{
				alignContent: 'center',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' }} category='c2' >NCR</Text></View></TouchableOpacity> */}
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('DVO')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black',fontWeight: currentRegion ==='DVO' ?'800' :'200' }} category='c2' >Davao</Text></View></TouchableOpacity>
		
			
			<TouchableOpacity disabled={status}  onPress={()=>cityLocator('BATANGAS')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black',fontWeight: currentRegion ==='BATANGAS' ?'800' :'200' }} category='c2' >Batangas</Text></View></TouchableOpacity>
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('LEYTE')} ><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' ,fontWeight: currentRegion ==='LEYTE' ?'800' :'200'}} category='c2' >Leyte</Text></View></TouchableOpacity>
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('CEBU')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' ,fontWeight: currentRegion ==='CEBU' ?'800' :'200'}} category='c2' >Cebu</Text></View></TouchableOpacity>
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('BOHOL')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black',fontWeight: currentRegion ==='BOHOL' ?'800' :'200' }} category='c2' >Bohol</Text></View></TouchableOpacity>
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('DAVAO')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black' ,fontWeight: currentRegion ==='DAVAO' ?'800' :'200'}} category='c2' >Davao</Text></View></TouchableOpacity>
			<TouchableOpacity disabled={status} onPress={()=>cityLocator('CGY')}><View style={{ backgroundColor: category === 'One-Way' ? '#262626' : 'white', margin: 10, width: 'auto', height: 25, borderRadius: 50 / 2, justifyContent: 'center', alignContent: 'center', }}><Text style={{ marginLeft: 10, marginRight: 10, marginTop: 0, color: category === 'One-Way' ? 'white' : 'black',fontWeight: currentRegion ==='CGY' ?'800' :'200' }} category='c2' >Cagayan De Oro</Text></View></TouchableOpacity>
			</ScrollView>
			</>
		)

		return successContent //status ? <View/> :successContent
	}
	const content = () => {
		if (getCurrentUser().data === null) {
			return <>
			{fullLoader()}
			<View style={{marginTop:110, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View>
			</> 
		 }else {
			return (
				<React.Fragment>
					<View style={{backgroundColor: '#ffffff'}}> 
					{/* <View style={{width:width,height:90,backgroundColor:'black',flexDirection:'row',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
						<Text style={{color:'white'}}>{status ? 'fetching':'You are subscribing to Cebu City' }</Text>
						</View> */}
						{category === 'Discover' ?  <View style={{backgroundColor:'white',height:60,width:width}}/>  :userHeaderContent()}
						
						{/* <Input
							 clearButtonMode="while-editing"
							 returnKeyType="search"
							autoFocus={keyboardStatus} 
							value={value}
							onSubmitEditing={(e) => submitItem(e)}
							accessoryRight={rightContent}
							label="Search booking reference"
							style={{ margin: 20 }}
							placeholder="L-XAX10"
							onPressIn={()=>setKeyboardActive(true)}
							onBlur={()=>setKeyboardActive(false)}
							onChange={(e) => setSearchItem(e.nativeEvent.text)}
						/> */}
						{/* {isFirstTouch ? value.length <= 5  ?<Text style={{color:'#e84118',marginLeft:20,marginTop:-10}} category="c1">Your booking reference should 6 characters</Text> : null : null} */}
						{loadCategory}
						{category === 'Discover' ?  <View style={{backgroundColor:'white',height:'auto',width:width,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>{renderSearchBar()}</View>  : null}
							{isKeyboardActive ? noticeView	(): null }
							{/* <View style={{marginTop:100, display: status ? 'flex' : 'none',bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View> */}
								{/* <ActivityIndicator style={{ display: status ? 'flex' : 'none',position:'absolute',marginTop:120,marginRight:0,marginLeft:0 }} size="small" color="#0000ff" /> */}
								{/* <View style={{marginTop:50}}/> */}
						{status ? fullLoader() : renderSectionlist() }
						
						<View />
					</View>
					{isSheetDisplay ? null :  <Button  
					onPress={({ section,item})=>
						validateSectionPressed(section,item)
					}
					style={{  
	shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5,backgroundColor:'black',borderColor:'black',bottom:80,position:'absolute',right:20,height:50,width:50,borderRadius:25}} size='tiny'>
	   <Text style={{fontSize:30,color:'white'}}>+</Text>
         </Button>}
			{isSheetDisplay ? null :  <FloatingBar index={0} navigation={navigation} showAccount={true}/> }
			{isSheetDisplay ? <BottomSheet
				ref={bottomSheetRef}
				index={0}
				style={{shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				
				elevation: 5, }}
				snapPoints={snapPoints}
				><View>
<TouchableOpacity  onPress={() => setisSheetDisplay(false)}>
							<View
								style={{
									backgroundColor: 'One-Way' === 'One-Way' ? '#dfe4ea' : 'white',
									top:0,
									left:20,
									width: 45,
									marginBottom:20,
									height: 25,
									borderRadius: 50 / 2,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										marginLeft: 10,
										marginRight: 10,
										marginTop: 0,
										color: 'One-Way' === 'One-Way' ? 'black' : 'black'
									}}
									category="c2"
								>
								Close
								</Text>
							</View>
						</TouchableOpacity>
 <Text  category='h5' style={{marginBottom:8,fontWeight:'bold',marginLeft:20}}>Create your Team</Text>
 <Input
        value={teamName}
		onChange={(e) => setTeamName(e.nativeEvent.text)}
        label="What's the name of your Team?"
        style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
        placeholder="Juan Dela Cruz Forwarder?"
      />
	  {/* <Text style={{marginLeft:20}}>{`@${setNameCamelCase()}`}</Text> */}
	  <View style={{flexDirection:'row',alignContent:'flex-start',alignItems:'center',justifyContent:'flex-start',marginLeft:20}}>
	  <Switch
          style={{marginTop:2}}
        trackColor={{ false: "#767577", true: "#0652DD" }}
        thumbColor={"#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
	  <Text>{isEnabled ?'Private' : 'Public'}</Text>
	  </View>
	  <Button  status="primary" 
	  onPress={()=>addTeamTapped()}
       disabled={teamStatus ? true: false}  
       style={{ borderRadius: 40, width: width - 40, 
		opacity:teamStatus ? 0.2:1,
       marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'selectedVehicle' === null ?'#dcdde1' :  'black', 
       borderColor: 'selectedVehicle' === null ? '#dcdde1' : 'black' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{teamStatus ?"Processing..." : "Save"}</Text>
    </Button>
	  </View>
</BottomSheet> : null }
				</React.Fragment>
			);
		}
		
	};
	const renderSectionContent=(item,section)=>{
		switch (category) {
			case 'One-Way':
			case 'NearMe':
			case 'Discover':
				return journeyContent(item,section)
				
			break;
			case  'byTeam':
				return groupContent(item,section)
			break;
		}
	}

	const setNameCamelCase = ()=>{
try {

	var result = teamName.replace( /([A-Z])/g, " $1" );
	return  result.charAt(0).toUpperCase() + result.slice(1);
}catch{
	return ''
}
	}

	const validateSectionPressed = (index,indexData)=>{
		// if(category === 'byTeam'){
			// navigation.navigate('Load', { screen: 'TeamList' ,params: { contextData:  indexData}})
		// }else{
			// navigation.navigate('Load', { screen: 'Service' })
			navigation.navigate('Home', { screen: 'Service' })
		// }
	}
  return <React.Fragment><StatusBar barStyle={'white'}/>{content()}</React.Fragment>
}

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: 300,
		resizeMode: 'cover'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		margin: 2,
		marginTop: 20,
		fontWeight: 'bold',
		marginRight: 130,
		marginLeft: 20
	},
	containesr: {
		backgroundColor: 'white',
		flex: 1,
		flexDirection: 'column',
		marginLeft: 20,
		marginRight: 20
	},

	container: {
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 5,
		marginTop: 5,
		flexDirection: 'row'
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
		marginTop: 12,
		flexDirection: 'row',
		marginRight: 16,
		marginLeft: 16,
		marginBottom: 12 
	},
	containerContent: {
		marginTop: 0,
		flexDirection: 'row',
		marginRight: 16,
		marginLeft: 16,
		marginBottom: 12
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
	},
	subTotal: {
		flex: 1,
		margin: 2,
		fontWeight: 'bold'
	},
	subTotalItem: {
		fontWeight: 'bold',
		fontSize: 23,
		alignContent: 'flex-end',
		margin: 2
	}
});

  //  (
	// 	<SafeAreaView>
  //     {/* <FloatingBar index={1} navigation={navigation}/> */}
	// 		{content()}
  //     <StatusBar style={checked ? 'dark' : 'light'} />
	// 	</SafeAreaView>
	// );

					{/* <FlatList
					  refreshControl={
						<RefreshControl
						  refreshing={didRefresh}
						  size= {2}
						  onRefresh={onRefresh}
						/>
					  }   
						maxToRenderPerBatch={5}
						extraData={(e) => console.log('e', e)}
						data={results}
						ListHeaderComponent={()=> (
							<React.Fragment>
									<Divider style={{marginTop:20}}/>
						<View style={{marginBottom:20,marginTop:20,marginLeft:20}}>
						<Text category="h3" style={{fontWeight:'bold'}}>Your loads</Text>
						<Text category="c1" style={{fontWeight:'100',marginLeft:5}}>{results.length} found</Text>
						
						</View>
						</React.Fragment>)
						}
						style={{paddingBottom:90,opacity:isKeyboardActive ? 0 : 1}}
						renderItem={(item) => journeyContent(item)}
						ListEmptyComponent={() => (
							<Layout style={styles.layout} level="1">
								<View
									style={{
										height: 400,
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										marginLeft: 20,
										marginRight: 20,
										marginTop: 0
									}}
								>
									<Image
										source={{
											uri:
												'https://cdn.dribbble.com/users/1113690/screenshots/6231933/empty_state_bino_4x.jpg?compress=1&resize=1600x1200'
										}}
										style={{
											width: 300,
											height: 250,
											resizeMode: 'cover'
										}}
									/>
									<Text category="6"> {value} Not found</Text>
								</View>
							</Layout>
						)}
					/> */}

