import React,{useState} from 'react';
import { StyleSheet, View, Text,TouchableOpacity,Image,ImageBackground,Dimensions } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import {Card,Radio, RadioGroup,Spinner,Button} from '@ui-kitten/components'; 
 import {UserContext} from '../Utils/UserContextAPI'
 import {Small} from '../Loader/Loader';
import {currencyFormat} from '../Utils/StoreDetails' 
import Colors from '../../constants/Colors';
var defaultColor =  Colors.buttonTheme//"#353b48"
var NidzdefaultColor = "#b13636"
export default  React.memo (({ tapped }: { path: string }) => {
// var Image_Http_URL ={ uri: 'https://firebasestorage.googleapis.com/v0/b/mamnidz-67305.appspot.com/o/Flowers-bouquet%2FScreen%20Shot%202018-09-04%20at%208.14.47%20PM.png?alt=media&token=1da622cf-ada3-4921-83b0-3d851703632d'};
var Image_Http_URL ={ uri: 'https://scontent.fmnl9-2.fna.fbcdn.net/v/t1.0-9/133062997_670673320292451_3457467490911310937_n.jpg?_nc_cat=107&ccb=2&_nc_sid=8bfeb9&_nc_ohc=Ea26CBOdayIAX-1P_pp&_nc_ht=scontent.fmnl9-2.fna&oh=408eae8f0c4de050398ccf808ad3983a&oe=600D4A80'};

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
// const [items, setItems] = useState([
//     { name: 'TURQUOISE', code: '#1abc9c' },
//     { name: 'EMERALD', code: '#2ecc71' },
//     { name: 'PETER RIVER', code: '#3498db' },
//     { name: 'AMETHYST', code: '#9b59b6' },
//     { name: 'WET ASPHALT', code: '#34495e' },
//     { name: 'GREEN SEA', code: '#16a085' },
//     { name: 'NEPHRITIS', code: '#27ae60' },
//     { name: 'BELIZE HOLE', code: '#2980b9' },
//     { name: 'WISTERIA', code: '#8e44ad' },
//     { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
//     { name: 'SUN FLOWER', code: '#f1c40f' },
//     { name: 'CARROT', code: '#e67e22' },
//     { name: 'ALIZARIN', code: '#e74c3c' },
//     { name: 'CLOUDS', code: '#ecf0f1' },
//     { name: 'CONCRETE', code: '#95a5a6' },
//     { name: 'ORANGE', code: '#f39c12' },
//     { name: 'PUMPKIN', code: '#d35400' },
//     { name: 'POMEGRANATE', code: '#c0392b' },
//     { name: 'SILVER', code: '#bdc3c7' },
//     { name: 'ASBESTOS', code: '#7f8c8d' },
//   ]);
  
 function viewItem(e) {  
  //  console.log(tempImage)
  tapped(e) 
  } 

   function ddd(data) {
    let initialPrice = 0
    currencyFormat(data.price).then((price)=>{
      console.log('pricee',price)
      return  initialPrice =  price
    })
  }
 function card(items){ 
  
  // const gallerySection = currencyFormat(e.price).then((price) => {
  //   return (
  //     <div>
  //       ...
  //     </div>
  //   );
  // });


  let initialPrice = 0
  let element = (e)=> (
     <Text>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(e)}</Text>

    //  <Text>{e}</Text>
)


// const YourImage = (e) => (
//   <FastImage
//       style={{ width: 200, height: 200 }}
//       source={{
//           uri:e,
//           // headers: { Authorization: 'someAuthToken' },
//           priority: FastImage.priority.normal,
//       }}
//       resizeMode={FastImage.resizeMode.contain}
//   />
// )

    return(
      
      <FlatGrid
      itemDimension={width/3}
      data={items}
      style={styles.gridView}
      spacing={20}
      renderItem={({ item }) =>  
     
      (
        
        <TouchableOpacity  onPress={()=>viewItem(item)}> 
       <View style={ item.status ? styles.itemContainer: styles.itemDisabledContainer}> 
       {/* {YourImage(item.imgUrl)} */}
       {/* <CachedImage source={{ uri: item.imgUrl}} /> */}
         <Image source={{uri:item.imgUrl}} style={styles.image}/> 
          <View style={{
            position: 'absolute',
            bottom:0,
            left:0,}}> 
          <Button style={ item.status ? styles.button : styles.disableButton} size='tiny'>
                 {element(item.price)}    
         </Button>
          </View> 
        </View> 
        {item.status ? displayTitle(item) :<Text style={styles.itemName}>Out of stock</Text>}
        {/* {console.log(""item)} */}
        {/* <Text style={styles.itemName}>{item.title.substring(0, 20) }</Text> */}
      </TouchableOpacity>

      )}
    />
    )
  }
function displayTitle(item){
  try { 
    return <Text style={styles.itemName}>{item.title.substring(0, 20) }</Text>
  }catch (error){
    return <Text style={styles.itemName}>Empty</Text>
  }
}
  function showLoader(){
    return(
      <FlatGrid
     
      itemDimension={width/2}
      data={[1,2,3,4,5,6]}
      style={styles.gridLoader}
      spacing={5}
      renderItem={({ item }) => (
        <TouchableOpacity  > 
       <View style={[styles.itemContainerEmpty]}>
        <Small  animate={true}/>
        </View> 
      </TouchableOpacity>

      )}
    />
    )
  }
  return (   
       <UserContext.Consumer>  
      {items =>  
      items.length? card(items) : showLoader() 
      } 
    </UserContext.Consumer> 
      
   
  );
})
 
const styles = StyleSheet.create({
  title:{
    bottom:1,
    borderRadius:100,
},
    button:{
      color:'black',
        borderColor:defaultColor,
        backgroundColor:defaultColor,
        bottom:0,
        borderRadius:100,
        width:'auto'
    },
    disableButton:{
      color:'black',
        borderColor:'#dcdde1',
        backgroundColor:'#dcdde1',
        bottom:0,
        borderRadius:100,
        opacity:0.8,
        width:'auto'
    },

    image: {

      borderRadius:20, 
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  gridLoader: {
    marginLeft: -30,
    flex: 1,
  },
  
  itemDisabledContainer: {
    justifyContent: 'flex-end',
    borderRadius: 200, 
    opacity:0.8,
    padding: 10,
    height: 150,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 200, 
    // backgroundColor:'red',
    padding: 10,
    height: 150,
  },
  itemContainerEmpty: {
    justifyContent: 'flex-end',
    borderRadius: 200, 
    // backgroundColor:'red',
    padding: 10,
    height: 200,
  },
  itemName: {
    fontSize: 11,
  marginTop:5,
    color: 'black',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '700',
    fontSize: 12,
    color: 'black',
  },
});