
import { createStackNavigator } from 'react-navigation-stack';

import ProfilePage from '../../Containers/ProfilePage';

import MultiplePictureCamera from '../../components/MultiplePictureCamera';
import MultipleAddButton from '../../components/MultipleAddButton';
import YourProducts from '../../Containers/MarketPlace/YourProducts';
import SoldProducts from '../../Containers/MarketPlace/SoldProducts';
import CreateItem from '../../Containers/CreateItem';

import UserComments from '../../Containers/Comments/UserComments';
import Settings from '../../Containers/Settings';

import OtherUserProfilePage from '../../Containers/ProfilePage/OtherUserProfilePage';
import CreateProfile from '../../Containers/CreateProfile';
import ConditionSelection from '../../Containers/CreateItem/ConditionSelection';
import PriceSelection from '../../Containers/CreateItem/PriceSelection';
import CameraForEachPicture from '../../components/CameraForEachPicture';

import OtherUserProducts from '../../Containers/MarketPlace/OtherUserProducts';
import OtherUserSoldProducts from '../../Containers/MarketPlace/OtherUserSoldProducts';

import { StackStyles } from '../../Theme/NavigationStyles';


export const ProfileToEditProfileStack = createStackNavigator({
    ProfilePage: ProfilePage,
    Settings: Settings,
    CreateProfile: CreateProfile,
    MultipleAddButton: MultipleAddButton,
    MultiplePictureCamera: MultiplePictureCamera,
    CameraForEachPicture: CameraForEachPicture,
    
    YourProducts: YourProducts,
    SoldProducts: SoldProducts,
    CreateItem: CreateItem,
    PriceSelection: PriceSelection,
    ConditionSelection: ConditionSelection,
    UserComments: UserComments,
    OtherUserProfilePage: OtherUserProfilePage,
    OtherUserProducts,
    OtherUserSoldProducts,
},
{   
    initialRouteName: 'ProfilePage',
    ...StackStyles
  })

