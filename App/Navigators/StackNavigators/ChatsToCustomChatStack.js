import { createStackNavigator } from 'react-navigation-stack';


import NotificationsAndChats from '../../Containers/NotificationsAndChats';
import { StackStyles } from '../../Theme/NavigationStyles';
// import CustomChat from '../views/CustomChat';

// import OtherUserProfilePage from '../views/OtherUserProfilePage';

// import UserComments from '../views/UserComments';


// import OtherUserProducts from '../views/OtherUserProducts';
// import OtherUserSoldProducts from '../views/OtherUserSoldProducts';


export const ChatsToCustomChatStack = createStackNavigator({
    NotificationsAndChats: NotificationsAndChats,
    // CustomChat: CustomChat,
    // OtherUserProfilePage: OtherUserProfilePage,
    // UserComments: UserComments,
    // OtherUserProducts,
    // OtherUserSoldProducts

},{
    initialRouteName: 'NotificationsAndChats',
    ...StackStyles
})
