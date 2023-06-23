
import io from 'socket.io-client';
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
import { schedulePushNotification } from '../../screens/Cart/Notification';
export  let socket = {}
socket = io.connect("http://139.162.5.101:9099", {
	query: "userid=expoIOS",
	transports: ['websocket'], 
	reconnectionAttempts: 15 //Nombre de fois qu'il doit réessayer de se connecter
		  });
console.log('i was called again.')
        //   export const axiosV2 = (token,id)=>  Axios.create({
        //     baseURL:url,
        //     timeOut:3000,
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${token}`,
        //         "userID":id
        //     }
        // });
		

export async function setOnline(payload){
	try {
	console.log('hey')	
	 socket.emit("onlineUser",payload,(callback)=>{
	 console.log('onlineUser',callback)
	
		return callback
	 })
	
	} catch (error) {
		console.log('error in setOnline notifying',error,payload)
	}
}
export async function dynamicEmit(to,payload){
console.log('dynamicEmit',to)
	try {
	
		let callback = await socket.emit(to,payload, (callback)=>{
			console.log('callback',callback)
			return callback
		})



//  return await socket.emit(to,payload, (callback)=>{
// 	console.log('callback',callback)
// 	return callback
// })

	// 	 socket.emit(to,payload,(callback)=>{
	// 	return callback
	//  })
	
	} catch (error) {
		console.log('error in dynamicEmit notifying',error,to)
	}
}

export async function onlinePhase3(to,payload,callbackData){
	console.log('dynamicEmit',to)
		try {
		
			return await socket.emit(to,payload, (callback)=>{
				return callbackData(callback)
			})
	
	
	//  return await socket.emit(to,payload, (callback)=>{
	// 	console.log('callback',callback)
	// 	return callback
	// })
	
		// 	 socket.emit(to,payload,(callback)=>{
		// 	return callback
		//  })
		
		} catch (error) {
			console.log('error in dynamicEmit notifying',error,to)
		}
	}
export async function getActiveUsers(){
	try {

		let users = await socket.on("newJoiner",(data)=>	{
			return users
			var payload = {
			    title: 'New user found',
			    body: `user is active`
			};
		  schedulePushNotification(payload).then(() => {});
		
		})

	} catch (error) {
		console.log('error in notifyGroup notifying',error)
	}
}

export async function notifyGroup(groupID){
    try {
        // let davao = "davao-trucking"
        socket.emit("join",{room:groupID,payload: { reference: 'D6ES6N', state: 'didAccept' }},(callback)=>{
            console.log(callback)
			return callback
        })
     
    } catch (error) {
        console.log('error in notifyGroup notifying',error)
    }
}
export async function notifyGroupStatsPayload(emitID,payload){
    try {
        // let davao = "davao-trucking"
		// "load-stats-watcher"
       let stats = await socket.emit(emitID,payload,callback)
		return stats
    } catch (error) {
        console.log('error in notifyGroup notifying',error)
    }
}
export async function roomListenerStandard(groupID,payload,callback){
    try {
        // let davao = "davao-trucking"
        // socket.emit("join",{room:groupID},(callback)=>{
        //     console.log(callback)
        //     callback(callback)
        // })
   		socket.on(groupID,payload,(data)=>{ 
            return callback(data)
        })
	// let listener = await socket.on(groupID)
	// return  listener
    } catch (error) {
        console.log('error roomListenerStandard',error)
    }
}

export async function socketLeaveRoom(room){
	try {
        socket.emit("leave-room",{room:room})
	}catch(error){
		console.log("error leaveRoom",error)
	}
}
export async function initSocket(){
	try {
        let davao = "davao-trucking"
        socket.emit("join",{room:davao},(callback)=>{
            console.log(callback)
        })
		// socket.on("connection", (client) => {
		// client.join("luzon")
		// 	  });
	
		// socket.on("didLogged",(value)=>{
		// 	console.log("ehhhh cebu",value)
		
		// 	var param = {
		// 		title:`${value.data}`,
		// 		body: `Booking found in Cebu Please check `,
		// 	  }
		// })
			  let data = {"time": new Date()}





			//   io.broadcast.emit("loogy-cebu",data);
			// socket.emit('connection')
			// socket.broadcast.emit('loogy-cebu', "this is a test");
			// socket.on("loogy-cebu", (arg) => {
			// 	console.log(arg); // world
			// 	alert('We have socket')
			// });
	} catch (error) {
		console.log('error socekt',error)
	}
	}