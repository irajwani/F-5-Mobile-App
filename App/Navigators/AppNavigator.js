import React from 'react'

import {View} from 'react-native'

import { createAppContainer, createSwitchNavigator } from 'react-navigation'
// import {createStackNavigator} from 'react-navigation-stack'
// import { Animated, Easing } from 'react-native'

import AuthStack from './StackNavigators/AuthStack'

import SplashScreen from '../Containers/SplashScreen'

import TabNavigator from './TabNavigator'

import { StackStyles } from '../Theme/NavigationStyles'

const AuthOrAppSwitch = createSwitchNavigator(
  {
      AuthStack: SignUpToCreateProfileStack,
      AuthLoadingScreen: SplashScreen,
      AppStack: TabNavigator,
  },
  {
    initialRouteName: 'AuthLoadingScreen',
    ...StackStyles
  }
)

export default createAppContainer(AuthOrAppSwitch)
