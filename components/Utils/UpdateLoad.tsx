import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import {axios,axiosV2} from '../../components/Utils/ServiceCall'
import {BookingContext}from  '../../components/Context/UserBookingContext'

async function ModifyThisLoad(e,modifyStatus,user,userLocation) { 
        try {    
          const data =   {id:e.item.referenceOrder,queryType:'custom' ,storeOwner:'storeOwner',isAPI:true, status:modifyStatus,taker:user.data, takerLocation:userLocation} 
          const response = await axiosV2(user.authToken,user.email).post('/Loogy/modifyLoad', data)
          return  response
        }catch (error) { 
          if (error.response.data.stack.includes('InvalidTokenError')) {
            alert('Pleas try again...')
          }else {
            alert('Pleas try again...')
          }
        }
    }
    
  export {
    ModifyThisLoad
 };