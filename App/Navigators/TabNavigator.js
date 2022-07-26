import React from 'react';

import { createBottomTabNavigator } from 'react-navigation-tabs'; // Version can be specified in package.json

import { ProfileToEditProfileStack } from './StackNavigators/ProfileToEditProfileStack';
import { MarketToProductDetailsOrChatOrCommentsStack } from './StackNavigators/MarketToProductDetailsOrChatOrCommentsStack';
import { MultipleAddButtonToMultiplePictureCameraToCreateItemStack } from './StackNavigators/CreateItemToPictureCameraStack';

import { ChatsToCustomChatStack } from './StackNavigators/ChatsToCustomChatStack';
import { highlightGreen } from '../colors';
import { BadgeIcon, MarketplaceIcon } from '../localFunctions/visualFunctions';
import { Colors } from '../Theme';
// import firebase from '../cloud/firebase';
// import {unreadCount} from '../localFunctions/dbFunctions';
// const uid = firebase.auth().currentUser.uid;

let iconName;
let iconSize = 25;

ProfileToEditProfileStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused, tintColor }) => {
    iconName = focused ? 'account-circle' : 'account';
    iconSize = focused ? 30 : 25;
    return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={false} />;
  }
};

MarketToProductDetailsOrChatOrCommentsStack.navigationOptions = {
  tabBarLabel: "Market",
  tabBarIcon: ({ focused, tintColor }) => {
    iconSize = focused ? 30 : 25;
    return <MarketplaceIcon strokeWidth={"8"} focused={focused}/>
  }
};

MultipleAddButtonToMultiplePictureCameraToCreateItemStack.navigationOptions = {
  tabBarLabel: "Sell",
  tabBarIcon: ({ focused, tintColor }) => {
    iconName = focused ? 'plus-circle' : 'plus-circle-outline';
    iconSize = focused ? 30 : 25;
    return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={false} />;
  }
};

ChatsToCustomChatStack.navigationOptions = {
  tabBarLabel: "Chats",
  tabBarIcon: ({ focused, tintColor }) => {
    iconName = focused ? 'forum' : 'forum-outline';
    iconSize = focused ? 30 : 25;
    return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={true} />;
  }
};

// wishListToProductDetailsOrChatOrCommentsStack.navigationOptions = {
//   tabBarLabel: "Favorites",
//   tabBarIcon: ({ focused, tintColor }) => {
//     iconName = 'basket';
//     iconSize = focused ? 30 : 25;
//     return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={false} />;
//   }
// };



const TabNavigator = createBottomTabNavigator(
            {

              
              Profile: ProfileToEditProfileStack,
              
              Market: MarketToProductDetailsOrChatOrCommentsStack,
              
              Sell: MultipleAddButtonToMultiplePictureCameraToCreateItemStack,
              
              Chats: ChatsToCustomChatStack,
              
              // WishList: wishListToProductDetailsOrChatOrCommentsStack,
              
            },
            {
              // defaultNavigationOptions: ({ navigation }) => ({
                
              //   tabBarIcon: ({ focused, horizontal, tintColor }) => {
              //     const { routeName } = navigation.state;
              //     // const unreadCount = navigation.getParam('unreadCount', false);
              //     // let unreadCount = false;
              //     // setTimeout(() => {
              //     //   let unreadCount = getUnreadCount(firebase.auth().currentUser.uid);
              //     //   setInterval(() => {
              //     //     unreadCount = getUnreadCount(firebase.auth().currentUser.uid);
              //     //     console.log("Is it true that one deserves notification badge?" + unreadCount);
              //     //   }, 20000);
                    
              //     // }, 1);
              //     //TODO: Is below susceptible to app crash upon lack of network?
              //     // let unreadCount = getUnreadCount(firebase.auth().currentUser.uid);
              //     let iconName;
              //     let iconSize = 25;
              //     if (routeName === 'Profile') {
              //       iconName = focused ? 'account-circle' : 'account';
              //       iconSize = focused ? 30 : 25;
              //     } else if (routeName === 'Market') {
              //       iconName = 'shopping';
              //       iconSize = focused ? 30 : 25;
              //       return <MarketplaceIcon strokeWidth={"8"} focused={focused}/>
              //     } else if (routeName === 'Sell') {
              //         iconName = focused ? 'plus-circle' : 'plus-circle-outline';
              //         iconSize = focused ? 30 : 25;
              //       }

              //       else if (routeName === 'Chats') {
              //         iconName = focused ? 'forum' : 'forum-outline';
              //         iconSize = focused ? 30 : 25;
              //         // IconComponent = BadgeIcon;
              //         return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={true} />;
              //       }

              //       else if (routeName === 'WishList') {
              //         iconName = 'basket';
              //         iconSize = focused ? 30 : 25;
              //       }
          
              //     // You can return any component that you like here! We usually use an
              //     // icon component from react-native-vector-icons
              //     // return <Icon name={iconName} size={iconSize} color={tintColor}/>
              //     return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={false} />;
              //     // return 
              //   },
              // }),
              // tabBarComponent: TabBarBottom,
              // tabBarPosition: 'bottom',
              tabBarOptions: {
                activeTintColor: Colors.tertiary,
                inactiveTintColor: 'black',
                // showIcon: true,
                showLabel: false

              },
              animationEnabled: true,
              // swipeEnabled: false,
            }
          ); 
        
    
export default TabNavigator;
