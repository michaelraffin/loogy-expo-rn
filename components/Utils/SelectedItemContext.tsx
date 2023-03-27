import React from "react"; 
const SelectedItemContext = React.createContext({
    item:{},
    update: () => {},
  }); 
  export default SelectedItemContext;
  