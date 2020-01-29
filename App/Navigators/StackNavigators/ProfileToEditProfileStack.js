
import { createStackNavigator } from 'react-navigation-stack';

import ProfilePage from '../../Containers/ProfilePage';

// import MultiplePictureCamera from '../components/MultiplePictureCamera';
// import MultipleAddButton from '../components/MultipleAddButton';
// import YourProducts from '../views/YourProducts';
// import SoldProducts from '../views/SoldProducts';
// import CreateItem from '../views/CreateItem';

// import UserComments from '../views/UserComments';
// import Settings from '../views/Settings';

// import OtherUserProfilePage from '../views/OtherUserProfilePage';
// import CreateProfile from '../views/CreateProfile';
// import ConditionSelection from '../views/ConditionSelection';
// import PriceSelection from '../views/PriceSelection';
// import CameraForEachPicture from '../components/CameraForEachPicture';

// import OtherUserProducts from '../views/OtherUserProducts';
// import OtherUserSoldProducts from '../views/OtherUserSoldProducts';

import { StackStyles } from '../../Theme/NavigationStyles';


export const ProfileToEditProfileStack = createStackNavigator({
    ProfilePage: ProfilePage,
    // Settings: Settings,
    // CreateProfile: CreateProfile,
    // MultipleAddButton: MultipleAddButton,
    // MultiplePictureCamera: MultiplePictureCamera,
    // CameraForEachPicture: CameraForEachPicture,
    
    // YourProducts: YourProducts,
    // SoldProducts: SoldProducts,
    // CreateItem: CreateItem,
    // PriceSelection: PriceSelection,
    // ConditionSelection: ConditionSelection,
    // UserComments: UserComments,
    // OtherUserProfilePage: OtherUserProfilePage,
    // OtherUserProducts,
    // OtherUserSoldProducts,
},
{   
    initialRouteName: 'ProfilePage',
    ...StackStyles
  })

