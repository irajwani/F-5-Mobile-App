import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, Helpers } from '../../Theme';


export default StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    ...Helpers.center,
    height: Metrics.screenHeight,
    backgroundColor: Colors.black,

  },

    // companyName: {
    //   ...Fonts.style.h1,
    //   color: Colors.secondary,
    //   letterSpacing: 2,
    // },

    companyLogo: {
      width: 250,
      height: 250,
    },


  
})
