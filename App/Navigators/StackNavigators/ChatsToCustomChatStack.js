import { createStackNavigator } from 'react-navigation-stack';

import { StackStyles } from '../../Theme/NavigationStyles';

import NotificationsAndChats from '../../Containers/NotificationsAndChats';
import CustomChat from '../../Containers/NotificationsAndChats/CustomChat';

import OtherUserProfilePage from '../../Containers/ProfilePage/OtherUserProfilePage';

import UserComments from '../../Containers/Comments/UserComments';


import OtherUserProducts from '../../Containers/MarketPlace/OtherUserProducts';
import OtherUserSoldProducts from '../../Containers/MarketPlace/OtherUserSoldProducts';


export const ChatsToCustomChatStack = createStackNavigator({
    NotificationsAndChats: NotificationsAndChats,
    CustomChat: CustomChat,
    OtherUserProfilePage: OtherUserProfilePage,
    UserComments: UserComments,
    OtherUserProducts,
    OtherUserSoldProducts

},{
    initialRouteName: 'NotificationsAndChats',
    ...StackStyles
})
