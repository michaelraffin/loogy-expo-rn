import React, { createContext, useContext, useEffect, useState } from 'react';
import {saveEntry,getEntry,removeItem,getEntryV2} from '../../components/Utils/StoreDetails'
export const BookingContext = React.createContext({
  selectedMap: 'test',  
  userAccount:null,
  isLoggedIn:false,
  availableUsers:[],
  didTapped : (e)=>{
    console.log('welcome to ',e)
  }
})
function StoreContext({ children}) { 
  const [isBackload, setBackloadType] = useState({type:'Backload'})
  const [userTrips, setAddress] = useState({place_name:'',journey:[]})
  const [loadType, setLoad] = useState('')
  const [userAccount, setUserAccount] = useState({user:null,data:null,driverDetails:{warehouse:null}})
  const [driverDetails, setDriverInfo] = useState(null)
  const [orderType, setServiceType] = useState('Public') // Bidding / Private/ Public
  const [vehicle, setUserVehicle] = useState({place_name:'',journey:[]})
  const  [showOnboarding, setOnboarding] = useState(true)
  const  [typeOfView, setTypeOfView] = useState('LOGIN')  // WELCOME || LOGIN || PROFILE || MAIN-APP || FORCE-UPDATE
  const  [userCurrentLocation, setCurrentLocation] = useState(null)  // WELCOME || LOGIN || PROFILE || MAIN-APP
  const  [availableUsers, setAvailableUsers] = useState([])  // WELCOME || LOGIN || PROFILE || MAIN-APP


  
  useEffect(()=>{
    //This should not be here
    
    getEntry('showOnboarding').then(item=>{
      console.log('async get entry',item )
      console.log('user location by context',userCurrentLocation)
    })

    try {
    
      if (driverDetails === null) {
        getEntryV2('@isNew').then(item =>{
          if (item !== null && item === 'isNew4') {
            setTypeOfView('LOGIN')
          }else {
            setTypeOfView('WELCOME')
          } 
        })
      }

    } catch (error) {
      console.log ('ERROR in  useEffect Context: ',error)
    }
    
  })


  function setDriverDetails(e){
    try {
      
    setDriverInfo
    } catch (error) {
      console.log ('ERROR in error Context: ',error)
    }
  }

  function setTrips(e,type){
    try {
      setAddress(e)
      setLoad(type)  
    } catch (error) {
      console.log ('ERROR in setTrips Context: ',error)
    }
    
  }
  function setSelectedVehicle(e){
    try {
      setUserVehicle(e)  
    } catch (error) {
      console.log ('ERROR in setSelectedVehicle Context: ',error)
    }
    
  }
  function setUserAccountContext(e){ 
    try {
      setUserAccount(e) 
      if (e.user_details === null || e.driverDetails != undefined ||  e.user_details === null || e.user_details.logisticName === undefined) {
        setTypeOfView('PROFILE-SETUP')
      }else {
        setTypeOfView('MAIN')
      }
    } catch (error) {
      //Error default to setup
      setTypeOfView('PROFILE-SETUP')
      console.log ('ERROR in setUserAccountContext Context: ',error)
    } 
  }
  function setUserByEmailAccountContext(e){ 
    setUserAccount(e) 
  }
  function setLoginByEmailService(e){ 
    try {
    
      setDriverInfo(e)
      if (e !=  undefined &&  e.user_details === null  || e.user_details.name === undefined) {
        //TEMPORY DISABLE
        setTypeOfView('PROFILE-SETUP')
      } else {
        //TEMPORY DISABLE
        setTypeOfView('MAIN')
      }

    } catch (error) {
      console.log ('ERROR in setLoginByEmailService Context: ',error)
    }

    
  }


  function setLoginByAuthService(user){
    // if (user.app_metadata.provider === "google" || user.app_metadata.provider === "facebook") {
    //   setDriverInfo(user)
    //   setTypeOfView('PROFILE-SETUP')
    //   return 
    //  }
    try {
    
      if (user !=  undefined && user.user_details === null) {
        setDriverInfo(user)
        // setTypeOfView('PROFILE-SETUP')
      } else {
        setDriverInfo(user)
        // setTypeOfView('MAIN')
      }  
    } catch (error) {
      console.log ('ERROR in setLoginByAuthService Context: ',error)
    }
    
  }


  function setOnboardingMethod(e){
    try {
      setTypeOfView('LOGIN')
      // saveEntry(false,'showOnboarding').then(()=>{
        setOnboarding(false)
      // })  
    } catch (error) {
      setOnboarding(false)
      console.log ('ERROR in setOnboardingMethod Context: ',error)
    }
    
  }
  function setBackload(e){
    try {
      setBackloadType(e)
    } catch (error) {
      
      console.log ('ERROR in setBackload Context: ',error)
    }
      
  }
  
  function setOrderTypeAction(e){ 
    setServiceType(e)
  }
  function getUpdateState(){
    return  userTrips 
  }
  const  didTapped =(e)=>{
    try {
      setUserVehicle(e)  
    } catch (error) {
      
    }
    
  }
  const getSelectedVehicle = ()=> {
    return  vehicle
  }
  const getCurrentUser = ()=> { 
    return  userAccount
  }
  const setLocation =(e)=>{
    try {
      setCurrentLocation(e)  
    } catch (error) {
      console.log ('ERROR in setLocation Context: ')
    }
    
  }
  const getCurrentUserLocation = ()=> { 
    console.log('User Context Location  ',userCurrentLocation)
    return  userCurrentLocation
  }
  const getAllAvailableUsers = ()=> { 
    return  availableUsers
  }
  
  const setAvailableUsersNearby = (e)=>{ 
    setAvailableUsers(e)
    console.log('welcome to context',availableUsers.length)
  }
    
  async function showOnboardingUser(){
    try {
       getEntry('showOnboarding').then(status => {
        return status
       })
    } catch (error) {
      return false
    }
    
  }
  const values = {setOrderTypeAction,getAllAvailableUsers,setAvailableUsersNearby,availableUsers,getCurrentUserLocation,isBackload,setBackload,setUserByEmailAccountContext,setLoginByAuthService,setLocation,getCurrentUserLocation,typeOfView,setTypeOfView,setOnboardingMethod,showOnboardingUser,showOnboarding,driverDetails,userTrips,getUpdateState,setTrips,setSelectedVehicle,setUserVehicle,didTapped,getSelectedVehicle,setUserAccountContext,getCurrentUser,setLoginByEmailService,loadType,userAccount,setDriverDetails}
  return (
    <BookingContext.Provider value={values}>
      {children}</BookingContext.Provider>
  );
}
export default StoreContext
