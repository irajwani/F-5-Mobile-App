import { createStackNavigator } from 'react-navigation-stack';

import MarketPlace from '../../Containers/MarketPlace';
import ProductDetails from '../../Containers/ProductDetails';
import CustomChat from '../../Containers/NotificationsAndChats/CustomChat';
import YourProducts from '../../Containers/MarketPlace/YourProducts';
import OtherUserProfilePage from '../../Containers/ProfilePage/OtherUserProfilePage';
import UserComments from '../../Containers/Comments/UserComments';
import ProductComments from '../../Containers/Comments/ProductComments';
import CreateItem from '../../Containers/CreateItem';
import PriceSelection from '../../Containers/CreateItem/PriceSelection';
import ConditionSelection from '../../Containers/CreateItem/ConditionSelection';
import MultiplePictureCamera from '../../components/MultiplePictureCamera';
import MultipleAddButton from '../../components/MultipleAddButton';
import CameraForEachPicture from '../../components/CameraForEachPicture';
import OtherUserProducts from '../../Containers/MarketPlace/OtherUserProducts';
import OtherUserSoldProducts from '../../Containers/MarketPlace/OtherUserSoldProducts';

import { StackStyles } from '../../Theme/NavigationStyles';

export const MarketToProductDetailsOrChatOrCommentsStack = createStackNavigator({
    MarketPlace: MarketPlace,
    YourProducts: YourProducts,
    ProductDetails: ProductDetails,
    CreateItem: CreateItem,
    MultiplePictureCamera: MultiplePictureCamera,
    MultipleAddButton: MultipleAddButton,
    CameraForEachPicture,
    PriceSelection: PriceSelection,
    ConditionSelection: ConditionSelection,
    ProductComments: ProductComments,
    OtherUserProfilePage: OtherUserProfilePage,
    UserComments: UserComments,
    CustomChat: CustomChat,
    OtherUserProducts,
    OtherUserSoldProducts,
},
{
    initialRouteName: 'MarketPlace',
    ...StackStyles
}
)
