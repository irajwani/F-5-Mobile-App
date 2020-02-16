import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from './Colors';


const path = '../Assets/Images'

// const 

export default {
  fullLogo: require(`${path}/fullLogo.png`),
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

  profileBackground: require(`${path}/ProfileBackground.png`),

  BackArrow: ({onPress}) => (
    <Icon 
      name='arrow-left'
      size={35}
      color={'#fff'}
      onPress={onPress}
    />
    
  ),

  SmallBackArrow: ({onPress, color = "#fff"}) => (
    <Icon 
      name='arrow-left'
      size={28}
      color={color}
      onPress={onPress}
    />
    
  ),

  Info: ({onPress}) => (
    <Icon
      name='information-variant'
      size={35}
      color={'#fff'}
      onPress={onPress} 
    />
  ),

  Logout: ({onPress}) => (
    <Icon
      name='exit-run'
      size={35}
      color={'#fff'}
      onPress={onPress} 
    />
  ),

  PasswordsMatch: () => (
    <Icon 
      name='lock'
      size={30}
      color={Colors.secondary}
      
    />
  ),

  Facebook: ({onPress}) => (
    <Icon 
      name='facebook'
      size={30}
      color={Colors.facebook}
      onPress={onPress}
    />
  ),
}