import React, { createContext, useContext, useState } from 'react';
export const MapContext = createContext()
const initialState = {
  selectedMap: 'test',  
  didTapped : (e)=>{
    console.log('welcome to mapCOntext',e)
  }
}

function StoreContext({ children}) { 
  const [address, setAddress] = useState({place_name:'',geometry:{coordinates:[]}});
  function didSetAddress(e){
    setAddress(e)
    console.log('CHILDREN',address)
  }
  function getUpdateState(){
    return  address
}
  const values = {address,getUpdateState,didSetAddress}
  return (
    <MapContext.Provider value={values}>{children}</MapContext.Provider>
  );
}
export default StoreContext
  const ThemeContext = React.createContext('light');