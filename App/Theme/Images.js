import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from './Colors';


const path = '../Assets/Images'

// const 

export default {
  logo: require(`${path}/logo.png`),
  menuBars: require(`${path}/menu-bars.png`),
  // backArrow: require(`${path}/white-arrow-back.png`),
  smallProfile: require(`${path}/smallProfile.jpg`),
  nothingHere: require(`${path}/nothing_here.png`),

  glass: require(`${path}/glass.png`),
  

  loginBg: require(`${path}/LoginBg.jpg`),
  createProfileBg: require(`${path}/CreateProfileBg.png`),

  google: require(`${path}/Google.png`),
  logout: require(`${path}/Logout.png`),

  usaFlag: require(`${path}/usa.png`),
  ukFlag: require(`${path}/uk.png`),
  pkFlag: require(`${path}/pk.png`),

  BackArrow: ({onPress}) => (
    <Icon 
      name='arrow-left'
      size={35}
      color={'black'}
      onPress={onPress}
    />
    
  ),

  PasswordsMatch: () => (
    <Icon 
      name='lock'
      size={30}
      color={Colors.secondary}
      
    />
  )
}