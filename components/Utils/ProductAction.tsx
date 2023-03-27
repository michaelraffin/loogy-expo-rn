import React, { createContext,Component,useState } from 'react' 
export const ThemeContext = React.createContext({});



// const [productUpdate, setProduct] = useState(0);
// export default function User() {
//   function didUpdate () {
//               alert('showww')
//        }
//     return ( 
// <ThemeContext.Provider value={productUpdate}>
//   </ThemeContext.Provider> 
//     )
// }

class User extends Component {
    state={
status:true
    }
    didUpdate=()=>{
        this.setState({
            status:false
          })
      alert('showww')
    }
    viewCard=()=>{
      this.setState({
        status:!status
      })
    }

    render() { 
      return ( 
        // <ThemeContext.Provider value={this.state}>
  <ThemeContext.Provider value={{...this.state, viewCard :this.viewCard}}> 
  {this.props.children}
  </ThemeContext.Provider>
       );
    }
  }
   
  export default User;



const LanguageContext = React.createContext({
  language: "en",
  setLanguage: () => {}
});

export default LanguageContext;
