import React, { useEffect, useState, PureComponent, useRef, useContext } from 'react';
import { notifyGroup,roomListenerStandard,getActiveUsers,setOnline,socket,dynamicEmit} from '../../components/Utils/SocketManager';
import { BookingContext } from '../../components/Context/UserBookingContext';
import { MapContext } from '../../components/Context/MapContext';
export default function CityEmit() {
	const {setUserVehicle,getCurrentUser,getCurrentUserLocation} = React.useContext(BookingContext);
    let socketListerner = ()=> { 
        try {
            let cebu = "davao-trucking"
              let id =  "D6ES6N"
            let payload = {reference:id,state:"didLogin",owner:"expo"}
            let xxx = {room:cebu,payload}
            let userCoordinates = 'android' === 'android' ?[{lat:getCurrentUserLocation().coordinates.latitude}, {long:getCurrentUserLocation().coordinates.longitude}] : [{lat:14.514462}, {long:121.03785}]
            setOnline({
                room: 'davao-trucking',
                payload: { reference: 'D6ES6N', state: 'didOnline',source:"expo",coordinates:userCoordinates,country:'android' === 'android' ? "ph" : "ph", 
              }
              })
        } catch (error) {
            console.log('error in',socketListerner)
        }
    } 
}