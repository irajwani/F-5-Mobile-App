import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import AuthStack from './StackNavigators/AuthStack'

import SplashScreen from '../Containers/SplashScreen'

import TabNavigator from './TabNavigator'

import { StackStyles } from '../Theme/NavigationStyles'

const AuthOrAppSwitch = createSwitchNavigator(
  {
      AuthStack,
      SplashScreen,
      AppStack: TabNavigator,
  },
  {
    initialRouteName: 'SplashScreen',
    ...StackStyles
  }
)

export default createAppContainer(AuthOrAppSwitch)
