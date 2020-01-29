import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import {SignUpToCreateProfileStack} from './StackNavigators/SignUpToCreateProfileStack'

import SplashScreen from '../Containers/SplashScreen'

import TabNavigator from './TabNavigator'

import { StackStyles } from '../Theme/NavigationStyles'

const AuthOrAppSwitch = createSwitchNavigator(
  {
      AuthStack: SignUpToCreateProfileStack,
      SplashScreen,
      AppStack: TabNavigator,
  },
  {
    initialRouteName: 'SplashScreen',
    ...StackStyles
  }
)

export default createAppContainer(AuthOrAppSwitch)
