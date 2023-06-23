import * as React from 'react';
import { Image, TouchableOpacity, View, Dimensions, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { BookingContext } from '../components/Context/UserBookingContext';
var width = Dimensions.get('window').width;
export default function Cart({ navigation, index ,showAccount,userProfile}) {
	var id = index;
    var screen = navigation
	var borderRadius = 20;
		const userType =()=> {
			try {
				if (userProfile.user_details.applicantType === "Shipper") {
					return 0
				} else {
					return  1
				}
			} catch (error) {
				return 1
			}
			// 0 == Customer
			// 1 == Driver
		
		}
	const {setUserVehicle,getCurrentUser,getCurrentUserLocation} = React.useContext(BookingContext);

	React.useEffect(() => {
			try {
				console.log('FLOATBAR  CONTEXT', userProfile.user_details)
			} catch (error) {
				console.log('error FLOATBAR',error)
			}
		},[]);



	const userLoginContent = ()=>{
return <React.Fragment>
 {userType() === 1 ? <TouchableOpacity onPress={() => screen.navigate('RealTimeMap', { screen: 'RealTimeMap' })}>
            <View style={id === 1 ? styles.activeView : styles.inActiveView}
                >
                    <Image
						source={{ uri: 'https://img.freepik.com/premium-vector/live-streaming-icon-symbol-live-stream-icon-video-broadcasting-tv-news-movie-show-button-sign_659151-929.jpg?w=2000' }}
						style={id === 1 ? styles.activeImage : styles.inActiveImage2}
					/>
                    	{id === 1 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>RealTime</Text> : null}
				</View>
			</TouchableOpacity>  : null }

	<TouchableOpacity onPress={() => screen.navigate('LoadScanner', { screen: 'QRReader' })}>
            <View style={id === 1 ? styles.activeView : styles.inActiveView}
                >
                    <Image
						source={{ uri: 'https://is5-ssl.mzstatic.com/image/thumb/Purple126/v4/15/1a/f5/151af5c5-c375-0574-2ab7-7557435ab777/source/512x512bb.jpg' }}
						style={id === 1 ? styles.activeImage : styles.inActiveImage2}
					/>
                    	{id === 1 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>Load</Text> : null}
				</View>
			</TouchableOpacity> 
			{userType() === 1 ?null  : null}

			<TouchableOpacity onPress={() => screen.navigate('History', { screen: 'DriverHistory' })}>
				<View style={id === 2 ? styles.activeView : styles.inActiveView}>
					<Image
						source={{ uri: 'https://icon-library.com/images/historical-icon/historical-icon-16.jpg' }}
						style={id === 2 ? styles.activeImage : styles.inActiveImage}
					/>
					{id === 2 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>{userType() != 1 ? 'Tran..' : 'Task'}</Text> : null}
				</View>
			</TouchableOpacity>

				{/* <TouchableOpacity onPress={() =>  screen.navigate('Profile', { screen: 'UserProfile' })}>
				<View style={id === 3 ? styles.activeView : styles.inActiveView}>
					<Image
						source={{ uri: 'https://www.datocms-assets.com/48842/1622036581-profilepic.jpg?auto=format&crop=faces&dpr=2&fit=crop&h=540&w=360' }}
						style={id === 3 ? styles.activeImage : styles.inActiveImage}
					/>
					{id === 3 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>Me</Text> : null}
				</View>
			</TouchableOpacity>   */}
</React.Fragment>
	}
	var addLoad = ()=>{
		try {
			return <View style={{position:'absolute',top:0,marginLeft:'auto',marginRight:'auto'}}><Text>Add here</Text></View>
		} catch (error) {
			return null
		}
	}
	var mainContent = ()=> {
		return (
<View
			style={{
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 1
				},
				shadowOpacity: 0.2,
				shadowRadius: 1.41,
				elevation: 0.2,
				width: width,
				height: 70,
				position: 'absolute',
				bottom: 0,
				backgroundColor: 'white',
				borderBottomLeftRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
				alignContent: 'flex-start',
				flexDirection: 'row',
				justifyContent: 'space-evenly'
			}}
		>
			{/* {addLoad()} */}
			{/* <TouchableOpacity onPress={() => screen.navigate('Load', { screen: 'Service' })}>
				<View style={id === 0 ? styles.activeView : styles.inActiveView}>
					<Image
						source={{ uri: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' }}
						style={id === 0 ? styles.activeImage : styles.inActiveImage}
					/>
					{id === 0 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>Order</Text> : null}
				</View>
			</TouchableOpacity>  */}

			{/* <TouchableOpacity onPress={() => screen.navigate('Home', { screen: 'DriverDashboard' })}>
            <View style={id === 1 ? styles.activeView : styles.inActiveView}
                >
                    <Image
						source={{ uri: 'https://www.seekpng.com/png/full/1-11418_png-file-sugar-icon-png.png' }}
						style={id === 1 ? styles.activeImage : styles.inActiveImage2}
					/>
                    	{id === 0 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>Load</Text> : null}
				</View>
			</TouchableOpacity>  */}


			<TouchableOpacity onPress={() => screen.navigate('Home', { screen: 'DriverDashboard' })}>
            <View style={id === 0 ? styles.activeView : styles.inActiveView}
                >
                    <Image
						source={{ uri: 'https://www.seekpng.com/png/full/1-11418_png-file-sugar-icon-png.png' }}
						style={id === 0 ? styles.activeImage : styles.inActiveImage2}
					/>
                    	{id === 0 ? <Text style={{ marginLeft: 10, marginRight: 10 }}>Load</Text> : null}
				</View>
			</TouchableOpacity>
			{/* {userType() === 1 ? : null} */}
			{showAccount != null ? userLoginContent() : null}
		</View>
		)
	}
	return   showAccount != null ? mainContent() : null
	 
}

const styles = StyleSheet.create({
	activeView: {
		width: 'auto',
		height: 30,
		marginLeft: 40,
		marginTop: 10,
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#dcdde1',
		borderRadius: 15
	},
	inActiveView: {
		width: 40,
		height: 40,
		marginLeft: 40,
		marginTop: 4,
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	activeImage: {
		width: 20,
		height: 20,
		borderRadius:10,
		marginLeft: 10
	},
	inActiveImage: {
		width: 20,
		borderRadius:10,
		height: 20
	},
	inActiveImage2: {
		width: 25,
		height: 20
	}
});
