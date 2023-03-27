import {StyleSheet } from 'react-native';
    const styles = StyleSheet.create({
        contentContainer: {
          flex: 1,
          alignItems: 'center',
        },
        image: {
          // borderRadius:400,
          width: '100%',
          height: 400,
          resizeMode: 'cover',
      
          // {
            flex : 1,
            transform : [ { scaleX : 0.5 } ],
            backgroundColor : 'white',
            alignItems : 'center',
            justifyContent : 'center'
        // }
      
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        text: {
          margin: 2,
          marginTop: 20,
          marginBottom: 20,
          fontWeight: 'bold',
          marginRight: 150,
          marginLeft: 20
        },
        container: {
          backgroundColor: 'white',
          flex: 1,
          flexDirection: 'column',
          marginLeft: 20,
          marginRight: 20
        },
        layout: {
      
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }, container2: {
          marginTop: 30,
          flexDirection: 'row',
          marginRight: 16,
          marginLeft: 16
        }, containerMulti: {
          marginTop: 10,
          flexDirection: 'row',
          marginRight: 16,
          marginLeft: 16, marginBottom: 0
        }, containerMultiDate: {
          marginTop: 0,
          flexDirection: 'row',
          marginRight: 16,
          marginLeft: 16, marginBottom: 20
        },
        input: {
          flex: 1,
          margin: 2,
          marginLeft:11
        },  inputTouchableRight: {
          flex: 1,
          margin: 2,
      marginRight:20,
      marginLeft:15
        },
        inputRoundTripTouchable: {
          flex: 1,
          marginTop:2
        },
        inputRight: {
          flex: 1,
          margin: 2,
        }, InActiveinputRight: {
          flex: 1,
      
          margin: 2,
          opacity: 0.3
        },
      });
      