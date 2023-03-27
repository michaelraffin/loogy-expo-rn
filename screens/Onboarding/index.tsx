import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {
	Alert,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Dimensions,
	View,
	ImageBackground,
	InputAccessoryView,
	ActivityIndicator,
	Image,
	Vibration,
	KeyboardAvoidingView
} from 'react-native';
import { BookingContext } from '../../components/Context/UserBookingContext';
import {saveEntry,getEntryV2} from '../../components/Utils/StoreDetails'
export default function index({ eventType, navigation }) {

	React.useEffect(()=>{
		Alert.alert(`Background Location`, `This apps collects location data to enable to location-based delivery and transaction logs tracking even when the app is closed`, [
            { text: "Okay", onPress: () => null },
          ], {
            cancelable: false,
          })
	},[])
	const {
		setTrips,
		userAccount,
		getCurrentUser,
		userTrips,
		getSelectedVehicle,
		setOnboardingMethod,
		showOnboarding
	} = React.useContext(BookingContext);
	const didTappedDone = () => {
		try {
			saveEntry('isNew4','@isNew')
			setOnboardingMethod(false);	
		} catch (error) {
			console.log('error',error)
		}
		
	};
	return (
		<Onboarding
			showSkip={false}
			onDone={() => didTappedDone()}
			onSkip={() => eventType('skip')}
			titleStyles={{ color: 'black' }}
			pages={[
				{
					backgroundColor: 'white',
					image: (
						<Image
							style={{ height: 300, width: '100%' }}
							source={{
								uri:
									'https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-3428210-2902552.png'
							}}
						/>
					),
					title: 'Be your own Boss',
					subtitle: 'Unlike most other, no one owns you.'
				},
				{
					backgroundColor: 'white',
					image: (
						<Image
							style={{ height: 300, width: '100%' }}
							source={{
								uri:
									'https://cdni.iconscout.com/illustration/premium/thumb/searching-in-box-3428208-2902550.png'
							}}
						/>
					),
					title: 'Organized Booking',
					subtitle: 'A unified record for your load and trips.'
				},
				{
					backgroundColor: 'white',
					image: (
						<Image
							style={{ height: 300, width: '100%' }}
							source={{
								uri:
									'https://cdni.iconscout.com/illustration/premium/thumb/deep-thinking-3428218-2902560.png'
							}}
						/>
					),
					title: 'Time in Control',
					subtitle: 'Create your own time and decide later'
				}
			]}
		/>
	);
}
