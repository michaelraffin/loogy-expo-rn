import React,{createContext} from "react"; 
 
const CartState = React.createContext({ 
  itemDetails:{},
    updateDetails: () => {},
}); 
export default CartState;
