import React,{createContext} from "react"; 
const CartContext = React.createContext({
    cartDetails:{cartItems:[],cartDeliveryOptions:{}},
    updateDetails: () => {},
  }); 
  export default CartContext;
  