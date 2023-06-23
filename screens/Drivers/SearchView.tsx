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
import * as eva from '@eva-design/eva';
import Clipboard from 'expo-clipboard';
var Image_Http_URL = { uri: 'https://i.pinimg.com/originals/c7/3d/ce/c73dce38ee18e795588f8e7ae6a8796d.gif' };
import { cart, Theme, CartContextAction } from '../../components/Utils/UserCart';
import ThemeColor from '../../constants/Colors';
import { saveEntry, getEntry, removeItem } from '../../components/Utils/StoreDetails';
import moment from 'moment';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message'; 
import UserLocationUI from '../../components/Utils/UserLocation'
import { CheckMark, SmallArrow } from '../../components/Svgs';
import { schedulePushNotification } from '../Cart/Notification';
import {Small,BigLoader,ButtonLoader,InstagramContent} from '../../components/Loader';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlatList, TextInput } from 'react-native';
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
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default function SearchView({ route, navigation }) {
	console.log('DASHBOARD PARAMETER',route)
	const isFocused = useIsFocused();
	const [ checked, setChecked ] = React.useState(false);
	const [ category, setCategory ] = useState('One-Way');
	const [ results, setResult ] = useState([]);
	const [ searchItems, setSearchedItem ] = useState([]);
	const [ value, setSearchItem ] = useState('');
	const [ isKeyboardActive, setKeyboardActive ] = useState(false);
	const [ isFirstTouch, setFirstTouch ] = useState(false);
	const {setUserVehicle,getCurrentUser} = useContext(BookingContext);
	const [ status, setStatus ] = useState(false);
	const [didRefresh, setRefresh] = React.useState(false);
	const didScrollBottom = useRef(false) 
	const [keyboardStatus, setKeyboardFocus] = useState(false);
	const [isLoadNew, setisLoadNew] = useState(false);
	let dynamicTitle = results.length === 0 ? "Your personal load" : "Your personal loads"
	const [sectionitems,setSection] = useState([
		{
	index:0,
	  title: "Searched Item",
	  data:searchItems, 
	  searched:false
	}])


	useEffect(() => {
		// try {
		// 	if (route.params.isRefresh === true) {
		// 		navigation.setParams({ isRefresh: false });
		// 		fetchProduct(getCurrentUser().id,'user-id').then(item =>{ 
		// 			setStatus(false);
		// 			setResult(item.data.results);
		// 			setSection([
		// 				{
		// 				index:0,
		// 			  title: "Seached Item",
		// 			  data:searchItems, 
		// 			  searched:false
		// 			},
		// 			{index:1,
		// 			  title: dynamicTitle,
		// 			  data:item.data.results, 
		// 			  searched:false
		// 			}])
		// 		})
		// 	}
		// }catch(error){
		// 	navigation.setParams({ isRefresh: false });
		// 	console.log('error')
		// }
	},[])



	useEffect(() => {

		// 	setStatus(true);
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
		// if (getCurrentUser().id != null) {
		// 	try {
		// 		fetchProduct(getCurrentUser().id,'user-id').then(item =>{ 
		// 			setStatus(false);
		// 			setResult(item.data.results);
		// 			setSection([
		// 				{
		// 				index:0,
		// 			  title: "Seached Item",
		// 			  data:searchItems, 
		// 			  searched:false
		// 			},
		// 			{index:1,
		// 			  title: dynamicTitle,
		// 			  data:item.data.results, 
		// 			  searched:false
		// 			}])
		// 		})
			
		// 	} catch (error) {
				
		// 	}
		// }
	}, [getCurrentUser().data]);


	const addNewTeam =()=>{
		// setStatus(true);
		addNewTeamService(null).then(item =>{
			setStatus(false);
		})
	}

	async function addNewTeamService(e){
		try {
			console.log(getCurrentUser().authToken)
			var data = {data:{title:"TeamMindanaoxxx1"},shortName:"@Alax",private:true,pword:10321,groupOwner:"Xadsadsa"}
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
			if (domain != undefined) {
				prefferedURL =  `/store/${domain}`
				data = {groupOwner:'Xadsadsa'}
			}
			console.log('prefferedURL',prefferedURL)
			const response = await axiosV2(getCurrentUser().authToken,getCurrentUser().email).post(prefferedURL, data);
			console.log('response.data',response.data)
			setStatus(false);
			return response;
		} catch (error) {
            console.log('ERROR',error)
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
        console.log('setSearchedItemsetSearchedItem',setSearchedItem)
		console.log('item?.data.results',item?.data.results)
		setSection([
			{
			index:0,
			title: "Seached Item",
			data:item.data.results, 
			searched:true
			}
		])
		
	})
	
}

	const manageSectionItems = (e)=>{
		if (e === 'byTeam'){
			setSection([
				{
					index:0,
				  title: "Searched Item",
				  data:searchItems, 
				  searched:false
				},
				{index:2,
				  title: "Team",
				  data:searchItems, 
				  searched:false
				}])
		}else {
			setSection([
				{
				index:0,
				  title: "Searched Item",
				  data:searchItems, 
				  searched:false
				}
                // ,
				// {index:1,
				//   title: dynamicTitle,
				//   data:results, 
				//   searched:false
				// }
            ])
				
		}
	}
	function fetchNewCategory(e) {
		// setStatus(true);
		if (e.length <= 5) {
			return 
		}
		setCategory(e);
		manageSectionItems(e)
		fetchProduct(getCurrentUser().id,'user-id',e === 'byTeam' ? 'LoogyGroup' : undefined).then(item =>{
			setStatus(false);
			setResult(item.data.results);
		})
	}
	function tappedSearched() {
		setStatus(true);
		var data = {data:{isBackload:true},queryType:'custom' }
		let prefferedURL = '/store/LoogyPooling'
		 axiosV2(getCurrentUser().authToken,getCurrentUser().email).post(prefferedURL, data).then( results =>{
			console.log('results',results)
			setStatus(false);
			setResult(results.data.results);
		 })
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
			navigation.navigate('LoadDetails', { screen: 'LoadDetails',referneceOrder: { item:data} ,viewType:"dashboard"})
		}
	};
	function currencyFormat(num) {
		try {
			return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		} catch {
			return "No declared amount"
		}
		
	  }
	const journeyContent = (indexData, indexSection) => {
		var data = indexData
		console.log('results journeyContent',data.offeredPrice.string)
		var returnedDate =  data.trips ? data.trips[0].returnedDate : new Date()
		var departedDate =  data.trips ? data.trips[0].selectedDate : new Date()
		var priceRange = isNaN(data.offeredPrice)  ? 0 : Number(data.offeredPrice)   //data.selectedVehicle.priceRange 
		// if (indexSection.index === 1) {
			category
			return (
				<TouchableOpacity onPress={() => validateUser(data)} activeOpacity={1}>
					<View style={{ marginLeft: 30, marginTop: 2 }}>
							{/* <Text category="h6" style={{fontWeight:'bold'}}>{data.referenceOrder}</Text> */}
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
											marginLeft: 11,
											fontWeight: 'bold',
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
											marginLeft: 11,
											fontWeight: 'bold'
										}}
									>
										{data.trips ? moment(departedDate,'MMMM DDD YYYY').toDate().toDateString() : ''}
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
											fontWeight: 'bold',
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
									>{data.trips ? moment(returnedDate,'MMMM DDD YYYY, h:mm:ss A').toDate().toDateString() : ''}
									</Text>
								</TouchableOpacity>
							</Layout>
						</View> 
					</React.Fragment>
				</TouchableOpacity>
			);
		// } 
    //     else 	if (indexSection.index === 2) { 
	// 		return (
	// 			<TouchableOpacity>
	// 					<View style={{ marginLeft: 30, marginTop: 2 ,alignItems:'center',marginBottom:20}}>
	// 					<Image source={{ uri: 'https://cdn.dribbble.com/users/3809802/screenshots/6855289/3_4x.png?compress=1&resize=1200x900&vertical=top' }}  style={{height:250,width:width ,resizeMode:'cover'}} fadeDuration={20} />
	// 						<Text category="p1" style={{fontWeight:'light',marginTop:20}}>Connect with other group drivers</Text>

	// 					<TouchableOpacity onPress={()=>addNewTeam()}>		
	// 						<View style={{width:'auto',marginTop:20}}>
					
	// 	<View	style={{
	// 								backgroundColor:  '#0652DD'  ,
	// 								width: 'auto',
	// 								height: 25,
	// 								borderRadius: 50 / 2,
	// 								justifyContent: 'center',
	// 								alignContent: 'center'
	// 							}}>
	// <Text
	// 								style={{
	// 									marginLeft: 10,
	// 									marginRight: 10,
	// 									marginTop: 0,
	// 									color:  'white'
	// 								}}
	// 								category="c2"
	// 							>
	// 								Add your Team +
	// 							</Text>
	// 							</View>
	// 					</View>
	// 					</TouchableOpacity>
	// 					</View>
	// 			</TouchableOpacity>
	// 		)

	// 	}
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
				<Button onPress={()=>navigation.navigate('Load', { screen: 'Service' })} style={{ borderRadius: 40, width: 20,height:20, backgroundColor:'black', borderColor: 'black' }}>Create your load</Button>
		
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
	// const rightContent = () => {
	// 	return (
	// 		<TouchableOpacity onPress={() => viewScanner() }>
	// 			<View
	// 				style={{
	// 					flexDirection: 'row',
	// 					alignContent: 'center',
	// 					justifyContent: 'center',
	// 					alignItems: 'center'
	// 				}}
	// 			>
	// 				<Text style={{ marginRight: 5 }}>Scan by QR</Text>
	// 				<Image
	// 					source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/qr-code-scan-2120166-1784370.png' }}
	// 					style={{ width: 25, height: 25 }}
	// 				/>
	// 			</View>
	// 		</TouchableOpacity>
	// 	);
	// };

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
						borderRadius:20,elevation:15,marginRight:0
						
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
		return(
			<ScrollView horizontal={true} style={{height:90,paddingLeft:Platform.OS === 'android' ? 10 : 40,showsHorizontalScrollIndicator:false}}  showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
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
						<TouchableOpacity disabled={status} onPress={() => fetchNewCategory('One-Way','user-id')}>
							<View
								style={{
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
						<TouchableOpacity  disabled={status}  onPress={() => displayCominSoon()}> 
						{/* //</View>onPress={() => fetchNewCategory('byTeam','user-id')}> */}
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
									Team
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity  disabled={status}  onPress={() =>   displayCominSoon()  }>
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
									Luzon
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity  disabled={status}  onPress={() => displayCominSoon()}>
							<View
								style={{
									opacity:0.2,
									// backgroundColor: category === 'byTeam' ? 'black' : 'white',
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
						</TouchableOpacity>
						<TouchableOpacity  disabled={status}  onPress={() => displayCominSoon()}>
							<View
								style={{
									opacity:0.2,
									// backgroundColor: category === 'byTeam' ? 'black' : 'white',
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
						</TouchableOpacity>
					</View>
					</ScrollView>
		)
	},[category])

	const onRefresh = React.useCallback(() => {
		console.log(getCurrentUser().id)
		setStatus(true);
		setRefresh(true)
		manageSectionItems(category)
		fetchProduct(getCurrentUser().id,'user-id').then(item =>{ 
			setStatus(false);
			setRefresh(false)
			setResult(item.data.results);
			setSection([
			{
			  index:0,
			  title: "Seached Item",
			  data:searchItems, 
			  searched:false
			}
            // ,
			// {index:1,
			//   title: dynamicTitle,
			//   data:item.data.results, 
			//   searched:false
			// }
        ])
		})
	  }, [didRefresh,getCurrentUser().data]);
 
	const displayHeaderItem = (section)=>{
		try { 
		if (status) {
			return <View/>
		}
		if (section.index === 0 && (section.searched === true && section.data.length != 0 ) ) {
			return   ( 
			<View style={{marginBottom:20,marginTop:20,marginLeft:20,backgroundColor:'white'}}>
			<Text category="h6" style={{fontWeight:'bold'}}>{section.title}: {value}</Text> 
			{/* <View style={{fontWeight:'100',marginLeft:5,position:'absolute',top:0,right:40}}><TouchableOpacity onPress={()=>clearItem()}><Text category="c1" style={{fontWeight:'bold',marginLeft:10,marginRight:0,marginTop:5,marginBottom:5,color:'black'}}>CLEAR</Text></TouchableOpacity></View> */}
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
			return <React.Fragment>
           
    <View style={{marginBottom:20,marginTop:120,marginLeft:20,alignContent:'center',alignItems:'center',backgroundColor:'white'}}>
    <Image source={{ uri: 'https://cdn.dribbble.com/users/2071065/screenshots/17532553/media/a461d71650fcee695e47608eff299044.jpg?compress=1&resize=1200x900&vertical=top'}} style={{ width:400,height:200}}/>
    <Text category="h6" style={{fontWeight:'bold',marginTop:60}}>Search different load within Philippines.</Text>
    {/* <TouchableOpacity onPress={()=>clearItem()}><Text category="c1" style={{fontWeight:'100',marginTop:15,marginBottom:60,color:'#0652DD'}}>Please check and search again...</Text></TouchableOpacity> */}
    
</View>
</React.Fragment>
		} else if (section.index === 1  && section.data.length === 0 ) {
			return  (
				<React.Fragment>
			
			<View style={{marginBottom:20,marginTop:40,marginLeft:20,alignContent:'center',alignItems:'center'}}>
			<Image  source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/empty-state-concept-3428212-2902554.png'}} style={{ width:'100%',height:300}}/>
			<Text category="p1" style={{marginTop:20,marginBottom:40}}>Welcome! to start create your own load</Text>
			<Button onPress={()=>navigation.navigate('Load', { screen: 'Service' })} style={{ borderRadius: 40, width: width - 40, marginRight:20, marginTop: 20,marginBottom:32, backgroundColor:'black', borderColor: 'black' }}>Create your load</Button>
 			{/* <Button  status="basic"    onPress={()=> navigation.navigate('Load', { screen: 'Service' })}    style={{ borderRadius: 40, width: width - 40, marginLeft: 20, marginTop: 20,marginBottom:32, backgroundColor:'white', borderColor: 'white' }}>
     	 <Text style={{ color: 'black', fontWeight: 'bold' }}>Create load first load</Text>
		</Button> */}

		</View>
		</React.Fragment>
			)
		}else if (section.index === 2) {
			return <>
			{/* {HeaderContent()} */}
			{/* <Divider style={{marginTop:20}}/> */}
<View style={{marginBottom:20,marginTop:0,marginLeft:20,backgroundColor:'white'}}> 

<View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
	<View>
<Text category="h6" style={{fontWeight:'bold'}}>{section.title}</Text>
<Text category="c1" style={{fontWeight:'100',marginLeft:0}}> {section.data.length <= 2 ? 'Stay connected' :'Team found' }</Text> 
	</View>
	<View >
	</View></View>
</View>
</>
		}else {
			return (
				<>
									{/* {HeaderContent()} */}
				<View style={{marginBottom:20,marginTop:0,marginLeft:20,backgroundColor:'white'}}>
			<Text category="h6" style={{fontWeight:'bold'}}>{section.title}</Text>
			<Text category="c1" style={{fontWeight:'100',marginLeft:5,marginBottom:10}}>{section.data.length} item{section.data.length === 1 ? '': 's'} found</Text> 
		</View>
	 </>
			)
		}
		}catch {
			return <View/>
		}
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
		  return (<>
		  <BigLoader/>
		  <BigLoader/>
		  <BigLoader/>
		  <BigLoader/>
		  <BigLoader/>

		</>)
	  }
	const content = () => {
		try {
			if (getCurrentUser().data === null) {
				return <>
				{fullLoader()}
				<View style={{marginTop:110, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row'}}><ActivityIndicator  size="small" color="#0000ff"  /></View>
				</> 
			 }else {
				return (
					<React.Fragment>
						<View style={{backgroundColor: 'white'}}> 
							<View style={{ marginTop: 50,backgroundColor:'white' ,flexDirection:'row',alignContent:'center',alignItems:'center'}} >
							{status? <View style={{marginTop:110, bottom:120,position:'absolute' ,top: 0, left: 0, right: 0, justifyContent:'center',alignContent:'center',alignItems:'center',flex:1,flexDirection: 'row',}}><ActivityIndicator  size="small" color="#0000ff"  /></View>: null}

									<TouchableOpacity  onPress={() => navigation.goBack()}>
								<View style={{width:30,height:30,borderRadius:50/2, marginLeft:20,marginRight:20}}><Image  source={{uri:'https://www.iconninja.com/files/228/393/66/direction-navigation-back-arrow-circle-left-icon.png'}}  style={{width:30,height:30  }}/></View>
								</TouchableOpacity>
								<Input
								clearButtonMode="while-editing"
								returnKeyType="search"
								autoFocus={true} 
								value={value}
								onSubmitEditing={(e) => submitItem(e)}
								accessoryRight={rightContent}
								style={{ marginLeft:0,marginRight:20,width:width - 90}}
								placeholder="Type your reference"
								onEndEditing={()=>setKeyboardActive(false)}
								onPressIn={()=>setKeyboardActive(true)}
								onBlur={()=>setKeyboardActive(false)}
								onChange={(e) => setSearchItem(e.nativeEvent.text)}
							/>
							</View>
								{isKeyboardActive ? noticeView	(): null }
								<TouchableOpacity disabled={status} onPress={() => tappedSearched()}>
								<View
									style={{
										backgroundColor: category === 'One-Way' ? '#dcdde1' : 'white',
										margin: 10,
										width: 70,
										height: 25,
										borderRadius: 50 / 2,
										justifyContent: 'center',
										alignContent: 'center',
										marginTop:20
									}}
								><Text
										style={{
											marginLeft: 10,
											marginRight: 10,
											marginTop: 0,
											color: category === 'One-Way' ? 'black' : 'black'
										}}
										category="c2"
									>
										Backload +
									</Text>
								</View>
							</TouchableOpacity>
							{status ? fullLoader() : <SectionList
							contentContainerStyle={{paddingBottom:height,paddingTop:20}}
							style={{paddingBottom:200
								,backgroundColor:'white'
							}}
							//   refreshControl={
							// 	<RefreshControl
							// 	style={{opacity:0.2}}
									
							// 	  refreshing={didRefresh}
							// 	  size= {2}
							// 	  onRefresh={onRefresh}
							// 	/>
							//   }   
				  sections={sectionitems}
				renderItem={({ section,item}) =>  
				isKeyboardActive ? null : 	(
					<React.Fragment>
						{ journeyContent(item,section) }
						 </React.Fragment>)
			
				 }
				keyExtractor={(item, index) =>  index}
				maxToRenderPerBatch={5}
				renderSectionHeader={({ section }) =>  displayHeaderItem(section) }
				/>}<View />
						</View>
					</React.Fragment>
				);
			}
		} catch (error) {
			return <View style={{backgroundColor:'red',width:width,height:height}}/>
		}
		
		
	};

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
