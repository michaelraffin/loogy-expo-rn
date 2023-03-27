
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import StoreContext from './components/Context/MapContext';
import UserBookingContext from './components/Context/UserBookingContext';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

// const isLoadingComplete = useCachedResources();
// const colorScheme = useColorScheme();
// var width = Dimensions.get('window').width;
// var height = Dimensions.get('window').height;

// const toastConfig = {
// 	success: (props) => (
// 	  <BaseToast
// 		{...props}
// 		style={{ borderLeftColor: 'pink' }}
// 		contentContainerStyle={{ paddingHorizontal: 15 }}
// 		text1Style={{
// 		  fontSize: 15,
// 		  fontWeight: '400'
// 		}}
// 	  />
// 	),
// 	error: (props) => (
// 	  <ErrorToast
// 		{...props}
// 		text1Style={{
// 		  fontSize: 17
// 		}}
// 		text2Style={{
// 		  fontSize: 15
// 		}}
// 	  />
// 	),
// 	tomatoToast: ({ text1, props }) => (
// 	  <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
// 		<Text>{text1}</Text>
// 		<Text>{props.uuid}</Text>
// 	  </View>
// 	)
//   };


  const HomeScreen = () => (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category='h1'>HOME</Text>
    </Layout>
  );
  
  export default () => (
    <SafeAreaProvider>
    <ApplicationProvider {...eva} theme={eva.light}>
       <StoreContext>
      <UserBookingContext>
      <ApplicationProvider {...eva} theme={eva.light} >
    <Navigation  /> 
    </ApplicationProvider>
  </UserBookingContext>
    </StoreContext>
   <StatusBar style="dark"/>
   
    </ApplicationProvider>
     </SafeAreaProvider>
  );

// export default function App() {
//   const isLoadingComplete = useCachedResources();
//   const colorScheme = useColorScheme();

//   if (!isLoadingComplete) {
//     return null;
//   } else {
//     return (
//       <SafeAreaProvider>
//         <Toast config={toastConfig} />
//         <Navigation colorScheme={colorScheme} />
//         <StatusBar />
//       </SafeAreaProvider>
//     );
//   }
// }
