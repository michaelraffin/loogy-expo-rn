import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react'; 
import { StyleSheet ,
  TextInput,Dimensions,View,ImageBackground,InputAccessoryView, ActivityIndicator,TouchableOpacity,Image,Vibration,KeyboardAvoidingView} from 'react-native'; 
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import {Shop,ProductDetails} from '../screens/Shop'; 
import CartScreen from '../screens/Cart/Cart'; 
import CameraRecord from '../screens/Camera/CameraRecord'; 
import DispatcherNotifier from '../screens/Camera/DispatcherNotifier'; 
import ScanCode from '../screens/Camera/ScanCode'; 
import ViewMessage from '../screens/Camera/VideoMessage'; 
import SuccessTracker from '../screens/Admin/SuccessTracker'; 
import Order from '../screens/Orders/Order'; 
import {Uploader} from '../screens/Product'; 
import Services from '../screens/Services/Main'; 
import Map from '../screens/Services/MapLocation'; 
import PartnerDetails from '../screens/Services/PartnerDetails'; 
import ServiceSelector from '../screens/Services/ServiceSelector'; 
import ChatPage from  '../screens/Chat/ChatPage'
import List from '../screens/Services/List'; 
import ServiceDetails from '../screens/Services/ServiceDetails'; 
import BSummary from '../screens/Services/BookingSummary'; 
import UserTrack from '../screens/Services/UserTrack'; 
import SuccessOrder from '../screens/Services/Success'; 
import Useregistration from '../screens/Registration/CustomerRegistration';
import Welcome from '../screens/Onboarding/';
import Landing from '../screens/Onboarding/Landing';
import AddNewTeam from '../screens/Team/AddNewTeam';
import TeamList from '../screens/Drivers/TeamList'; 
import MapRealTime from '../screens/Drivers/MapRealTime'; 
import ProfileSetup from '../screens/Onboarding/ProfileSetup';
import AppUpdate from '../screens/AppUpdate/AppUpdate'; 
import { Dashboard ,LoadDetails,History, LoginDriver,UserProfile,ViewQRDetails,SearchView} from '../screens/Drivers'; 
import {OrderList,Product,ViewedItem,OrderAdminTracker} from '../screens/Admin'; 
import {BookingContext} from  '../components/Context/UserBookingContext'
import {DeliverBox,ShoppingCart,Bag,Home,CheckMark,Party,ShopingList} from '../components/Svgs'; 
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types'; 
import Svg,{Circle,Path,Line,PolyLine,Polygon} from "react-native-svg" 
import { cart, Theme,CartContextAction } from "../components/Utils/UserCart";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {saveEntry,getEntryV2} from '../components/Utils/StoreDetails'
import { Spinner } from '@ui-kitten/components';
const BottomTab = createBottomTabNavigator<BottomTabParamList>();
export default function BottomTabNavigator(params) {
  const colorScheme = useColorScheme();
  // const { Details, updateCart } = cart();  
  const {setTrips,userAccount,getCurrentUser,userTrips,getSelectedVehicle,setOnboardingMethod,showOnboarding,typeOfView} = React.useContext(BookingContext);

 
    const AppCoodinator =()=>{
      return(
    <BottomTab.Navigator
    initialRouteName="Home"
    tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
<BottomTab.Screen
      name="Home"
      component={DriverDashboardNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <DeliverBox color={color}/>,
      }}
/>
<BottomTab.Screen
      name="RealTimeMap"
      component={RealTimeMapNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <DeliverBox color={color}/>,
      }}
/>
<BottomTab.Screen
      name="ChatUser"
      component={ChatUserPageNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <DeliverBox color={color}/>,
      }}
/>
<BottomTab.Screen
      name="My Orders"
      component={OrderHistoryNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <ShopingList color={color}/>,
      }}
/> 
<BottomTab.Screen
      name="LoadScanner"
      component={TabCameraScannerNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <ShopingList color={color}/>,
      }}
/>
<BottomTab.Screen
      name="Booking"
      component={BookingLandingNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <CheckMark color={color}/>,
      }}
/>
<BottomTab.Screen
      name="Apply"
      component={CustomerRegistration}
      options={{ 
        tabBarIcon: ({ color }) =>  <CheckMark color={color}/>,
      }}
/>
<BottomTab.Screen
      name="MapTab"
      component={MapNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <ShoppingCart color={color}/>,
      }}
/>
<BottomTab.Screen
      name="Load"
      component={PartnersNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <ShoppingCart color={color}/>,
      }}
/>
<BottomTab.Screen
      name="LoadDetails"
      component={LoadNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <ShoppingCart color={color}/>,
      }}
/>
<BottomTab.Screen
      name="Profile"
      component={ProfileNavigation}
      options={{ 
        tabBarIcon: ({ color }) =>  <ShoppingCart color={color}/>,
      }}
/>
<BottomTab.Screen
      name="History"
      component={DriverHistoryDashboard}
      options={{ 
        tabBarIcon: ({ color }) =>  <CheckMark color={color}/>,
      }}
/>
<BottomTab.Screen
      name="Account"
      component={AccountDriversStack}
      options={{ 
        tabBarIcon: ({ color }) =>  <CheckMark color={color}/>,
      }}
/>
<BottomTab.Screen
      name="Team"
      component={TeamStack}
      options={{ 
        tabBarIcon: ({ color }) =>  <CheckMark color={color}/>,
      }}
/>

  </BottomTab.Navigator>
   
      )
    }

    const onBoardingCoordinator =()=>{
      return(
        <BottomTab.Navigator
        initialRouteName="ProfileSetup"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
    <BottomTab.Screen
          name="ProfileSetup"
          component={OnboardingNavigator}
          options={{ 
            tabBarIcon: ({ color }) =>  <ShoppingCart color={color}/>,
          }}
  /></BottomTab.Navigator>
      )
    }

    const welcomeCoordinator =()=>{
      return(
        <BottomTab.Navigator
        initialRouteName="Welcome"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>

        <BottomTab.Screen
          name="Welcome"
          component={WelcomeNavigator}/>

      </BottomTab.Navigator>
      )
    }

    const loginCoordinator =()=>{
      return(
        <BottomTab.Navigator
        initialRouteName="Login"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
        <BottomTab.Screen
          name="Login"
          component={LoginLandingNavigator}/>
      </BottomTab.Navigator>
      )
    }
    const FoorUpdateCoordinator =()=>{
      return(
        <BottomTab.Navigator
        initialRouteName="FoceUpdate"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
        <BottomTab.Screen
          name="ForceUpdate"
          component={AppForceUpdateNavigator}/>
      </BottomTab.Navigator>
      )
    }
    

    
const validateContent =(items)=>{ 
try {
  
  switch (items.typeOfView) {
    case 'WELCOME':
    return welcomeCoordinator()
    case 'LOGIN': 
      return  loginCoordinator()
      case 'FORCE-UPDATE': 
      return  FoorUpdateCoordinator()
      case 'PROFILE-SETUP':
      return  onBoardingCoordinator()
      case 'MAIN':
        return  AppCoodinator()
        default  :
        return welcomeCoordinator()
  }
} catch (error) {
  console.log('ERrror')
}
  
}
return  (
    <BookingContext.Consumer>
    {items =>
validateContent(items)
   }
   {/* welcomeCoordinator() */}
 </BookingContext.Consumer> 
) 
}

function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const TabCameraStack = createStackNavigator<TabOneParamList>();
function TabCameraNavigator({navigation,route}) {
  navigation.setOptions({tabBarVisible: true})
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="VideoRecoder"
        component={CameraRecord}
        options={{ headerTitle: 'Shop'  ,headerShown: true }}
      /> 
    </TabOneStack.Navigator>
  );
}
const ScannerStack = createStackNavigator<TabOneParamList>();
function TabCameraScannerNavigator({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'QRReader';
  navigation.setOptions({tabBarVisible: false})
  return (
    <ScannerStack.Navigator>
      <ScannerStack.Screen
        name="QRReader"
        component={ScanCode}
        options={{ headerTitle: 'QRcodeReader'  ,headerShown: false }}
      /> 
    </ScannerStack.Navigator>
  );
}


const OrderHistory = createStackNavigator<TabOneParamList>();
function OrderHistoryNavigator ({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Order"
        component={Order}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />  
      <TabOneStack.Screen
        name="TrackOrder"
        component={UserTrack}
        options={{ headerTitle: 'Shop'  ,headerShown: true }}
      />  
    </TabOneStack.Navigator>
  );
}


const ProfileStack = createStackNavigator<TabOneParamList>();
function ProfileNavigation ({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <ProfileStack.Navigator>
  <ProfileStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerTitle: 'Profile'  ,headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
}

const RegistrationHistory = createStackNavigator<TabOneParamList>();
function CustomerRegistration ({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <RegistrationHistory.Navigator>
      <RegistrationHistory.Screen
        name="Apply"
        component={Useregistration}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />  
      <RegistrationHistory.Screen
        name="TrackOrder"
        component={UserTrack}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />  
    </RegistrationHistory.Navigator>
  );
}



const AccountStack = createStackNavigator<TabOneParamList>();
function AccountDriversStack ({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <DriverStack.Navigator>
<DriverStack.Screen
        name="Login"
        component={LoginDriver}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
    </DriverStack.Navigator>
  );
}



const TeamStackNavigation= createStackNavigator<TabOneParamList>();
function TeamStack ({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <TeamStackNavigation.Navigator>
      <TeamStackNavigation.Screen
        name="newTeam"
        component={AddNewTeam}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
        <TeamStackNavigation.Screen
        name="TeamList"
        component={TeamList}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
    </TeamStackNavigation.Navigator>
  );
}

const DriverHistoryStack = createStackNavigator<TabOneParamList>();
function DriverHistoryDashboard ({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <DriverStack.Navigator>
<DriverStack.Screen
        name="DriverHistory"
        component={History}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
    </DriverStack.Navigator>
  );
}

const DriverStack = createStackNavigator<TabOneParamList>();
function DriverDashboardNavigator ({navigation,route}) {
  console.log('DriverDashboard Navigator')
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <DriverStack.Navigator>
      <DriverStack.Screen
        name="DriverDashboard"
        component={Dashboard}       
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
<PartnersStack.Screen
        name="Service"
        component={Services}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      />  
<DriverStack.Screen
        name="SearchLoad"
        component={SearchView}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
<DriverStack.Screen
        name="LoadDetails"
        component={LoadDetails}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
      <DriverStack.Screen
        name="ViewQRDetails"
        component={ViewQRDetails}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
<DriverStack.Screen
        name="DriverHistory"
        component={History}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      /> 
  <DriverStack.Screen
     name="ScanTracking"
     component={ScanCode}
     options={{ headerTitle: 'Message'  ,headerShown: false }}
   />
   {/* ////MAIN */}
   <PartnersStack.Screen
           name="Success"
           component={SuccessOrder}
           options={{ headerTitle: 'Summary'  ,headerShown: false }}
         />
    </DriverStack.Navigator>
  );
}

const ProductStack = createStackNavigator<TabTwoParamList>(); 
function ProductNavigator({navigation,route}) {
  return (
    <ProductStack.Navigator>
      <ProductStack.Screen
        name="Add"
        component={Uploader}
        options={{ headerTitle: 'Upload Product'  ,headerShown: false }}
      /> 
    </ProductStack.Navigator>
  );
}

const ProfileStackV2 = createStackNavigator<TabTwoParamList>(); 
function ProfileStackNavigator({navigation,route}) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerTitle: 'Profile'  ,headerShown: false }}
      /> 
    </ProfileStack.Navigator>
  );
}


const AdminStack = createStackNavigator<TabTwoParamList>(); 
function AdminNavigator({navigation,route}) {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen
        name="AdminOrderList"
        component={OrderList}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      /> 
 

<AdminStack.Screen
        name="ProductList"
        component={Product}
        options={{ headerTitle: 'My Products'  ,headerShown: true }}
      /> 
<AdminStack.Screen
        name="AdminItemProduct"
        component={ViewedItem}
        options={{ headerTitle: 'Item'  ,headerShown: true }}
      /> 


<AdminStack.Screen
        name="Add"
        component={Uploader}
        options={{ headerTitle: 'Item'  ,headerShown: true }}
      /> 
<AdminStack.Screen
        name="OrderTracker"
        component={OrderAdminTracker}
        options={{ headerTitle: 'Detail'  ,headerShown: true }}
      /> 

 



{/* <ProductStack.Screen
        name="Add"
        component={Uploader}
        options={{ headerTitle: 'Upload Product'  ,headerShown: false }}
      />  */}
    </AdminStack.Navigator>
  );
}


//DISPATCHER
const DispatcherStack = createStackNavigator<TabTwoParamList>(); 
function DispatcherNavigator({navigation,route}) {
  return (
    <DispatcherStack.Navigator>
      <DispatcherStack.Screen
        name="Dispatcher"
        component={DispatcherNotifier}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      /> 
<DispatcherStack.Screen
        name="NotifyUser"
        component={SuccessTracker}
        options={{ headerTitle: 'Messaget Sent'  ,headerShown: false }}
      /> 
 
    </DispatcherStack.Navigator>
  );
}
const MapStack = createStackNavigator<TabTwoParamList>(); 
function MapNavigator({navigation,route}) {
  navigation.setOptions({tabBarVisible: false})
  return (
    <MapStack.Navigator>
    <MapStack.Screen
        name="Map"
        component={Map}
        initialParams={{ itemId: 42 }}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      />
      </MapStack.Navigator>
  )
}


//Real time Driver Finder
const RealTimeMapStack = createStackNavigator<TabTwoParamList>(); 
function RealTimeMapNavigator({navigation,route}) {
  navigation.setOptions({tabBarVisible: false})
  return (
    <RealTimeMapStack.Navigator>
    <RealTimeMapStack.Screen
        name="RealTimeMap"
        component={MapRealTime}
        initialParams={{ itemId: 42 }}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      />
      </RealTimeMapStack.Navigator>
  )
}





const ChatUserPageStack = createStackNavigator<TabTwoParamList>()
function ChatUserPageNavigator({navigation,route}) {
  // NAVIGATE' with payload
  navigation.setOptions({tabBarVisible: false})
  return (
    <ChatUserPageStack.Navigator>
    <ChatUserPageStack.Screen
        name="PrivateChatMessage"
        component={ChatPage}
        initialParams={{ userId: 42 }}
        options={{ headerTitle: 'Orders'  ,headerShown: true }}
      />
      </ChatUserPageStack.Navigator>
  )
}


//Service
const PartnersStack = createStackNavigator<TabTwoParamList>(); 
function PartnersNavigator({navigation,route}) {
  navigation.setOptions({tabBarVisible: false})
  return (
    <PartnersStack.Navigator>
    <PartnersStack.Screen
            name="PartnerDetails"
            component={PartnerDetails}
            options={{ headerTitle: 'Orders'  ,headerShown: false }}
          />
<PartnersStack.Screen
        name="Map"
        component={Map}
        initialParams={{ itemId: 42 }}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      />
 <PartnersStack.Screen
        name="Services"
        component={List}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      />
<PartnersStack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
        options={{ headerTitle: 'Service Details'  ,headerShown: false }}
      />
<PartnersStack.Screen
        name="ServiceSelector"
        component={ServiceSelector}
        options={{ headerTitle: 'Service Details'  ,headerShown: false }}
      />
<PartnersStack.Screen
        name="BookingSummary"
        component={BSummary}
        options={{ headerTitle: 'Summary'  ,headerShown: false }}
      />
<PartnersStack.Screen
        name="Success"
        component={SuccessOrder}
        options={{ headerTitle: 'Summary'  ,headerShown: false }}
      />
    </PartnersStack.Navigator>
  );
}






const OnboardingCoordinator = createStackNavigator<TabTwoParamList>(); 
function OnboardingNavigator({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <OnboardingCoordinator.Navigator>
      <OnboardingCoordinator.Screen
        name="ProfileSetup"
        component={ProfileSetup}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      /> 
    </OnboardingCoordinator.Navigator>
  );
}




const WelcomeCoordinator = createStackNavigator<TabTwoParamList>(); 
function WelcomeNavigator({navigation,route}) {
  const {setTrips,userAccount,getCurrentUser,userTrips,getSelectedVehicle,setOnboardingMethod,showOnboarding,showOnboardingUser} = React.useContext(BookingContext);
   const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  //WELCOME
  //LANDING
  //ONBOARDING
  const LandingItems = () =>  {
    // showOnboardingUser((item)=>{
    //   console.log('BOTTOM NAVIGATION ASYNC',item)
    // })
    return <>
<WelcomeCoordinator.Screen
          name="Landing"
          component={Landing}
          options={{headerShown: false }}
        />
<WelcomeCoordinator.Screen
        name="Login"
        component={LoginDriver}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
       <RegistrationHistory.Screen
        name="Apply"
        component={Useregistration}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
</>
  }
  return (
    <WelcomeCoordinator.Navigator>
      {showOnboarding ? 
       <WelcomeCoordinator.Screen
            name="Services"
            component={Welcome}
            options={{ headerTitle: 'Orders'  ,headerShown: false }}
          />   :   LandingItems()  }
    </WelcomeCoordinator.Navigator>
  );
}



{/* <DriverStack.Screen
        name="LoadDetails"
        component={LoadDetails}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      /> */}

      const LoadStack = createStackNavigator<TabTwoParamList>(); 
      function LoadNavigator({navigation,route}) {
        console.log('LoadNavigator')
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
        navigation.setOptions({tabBarVisible: false})
        return (
          <LoadStack.Navigator>
            <LoadStack.Screen
             name="LoadDetails"
             component={LoadDetails}
             options={{headerShown: false }}
             />  
            <LoadStack.Screen
             name="ViewQRDetails"
             options={{headerShown: false }}
             component={ViewQRDetails}
             />  
             
          </LoadStack.Navigator>
        );
      }

      

 const BookingLanding = createStackNavigator<TabTwoParamList>(); 
 function BookingLandingNavigator({navigation,route}) {
   const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
   navigation.setOptions({tabBarVisible: false})
   return (
     <BookingLanding.Navigator>
       <BookingLanding.Screen
        name="Service"
        component={Services}
        options={{headerShown: false }}
        />  
     </BookingLanding.Navigator>
   );
 }


const LoginLanding = createStackNavigator<TabTwoParamList>(); 
function LoginLandingNavigator({navigation,route}) {
  const {setTrips,userAccount,getCurrentUser,userTrips,getSelectedVehicle,setOnboardingMethod,showOnboarding,showOnboardingUser} = React.useContext(BookingContext);
  navigation.setOptions({tabBarVisible: false})
  //WELCOME
  //LANDING
  //ONBOARDING
  const LandingItems = () =>  {
    showOnboardingUser((item)=>{
      console.log('BOTTOM NAVIGATION ASYNC',item)
    })
    return <>
<LoginLanding.Screen
        name="Login"
        component={LoginDriver}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
       <RegistrationHistory.Screen
        name="Apply"
        component={Useregistration}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
</>
  }
  return (
    <LoginLanding.Navigator>
      <LoginLanding.Screen
       name="Landing"
      component={Landing}
      options={{headerShown: false }}
      /><LoginLanding.Screen
        name="Login"
        component={LoginDriver}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
       <RegistrationHistory.Screen
        name="Apply"
        component={Useregistration}
        options={{ headerTitle: 'Shop'  ,headerShown: false }}
      />
<RegistrationHistory.Screen
        name="PrivateChatMessage"
        component={ChatPage}
        initialParams={{ itemId: 42 }}
        options={{ headerTitle: 'Orders'  ,headerShown: false }}
      />
{/*       
<BottomTab.Screen
      name="RealTimeMap"
      component={RealTimeMapNavigator}
      options={{ 
        tabBarIcon: ({ color }) =>  <DeliverBox color={color}/>,
      }}
/> */}
    </LoginLanding.Navigator>
  );
}






const AppForceUpdate = createStackNavigator<TabTwoParamList>(); 
function AppForceUpdateNavigator({navigation,route}) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Service';
  navigation.setOptions({tabBarVisible: false})
  return (
    <AppForceUpdate.Navigator>
      <AppForceUpdate.Screen
       name="FoceUpdate"
       component={AppUpdate}
       options={{headerShown: false }}
       />  
    </AppForceUpdate.Navigator>
  );
}