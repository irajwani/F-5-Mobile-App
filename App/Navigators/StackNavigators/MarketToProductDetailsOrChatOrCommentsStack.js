import { createStackNavigator } from 'react-navigation-stack';

import MarketPlace from '../../Containers/MarketPlace';
// import ProductDetails from '../views/ProductDetails';
// import CustomChat from '../views/CustomChat';
// import YourProducts from '../views/YourProducts';
// import OtherUserProfilePage from '../views/OtherUserProfilePage';
// import UserComments from '../views/UserComments';
// import ProductComments from '../views/ProductComments';
// import CreateItem from '../views/CreateItem';
// import PriceSelection from '../views/PriceSelection';
// import ConditionSelection from '../views/ConditionSelection';
// import MultiplePictureCamera from '../components/MultiplePictureCamera';
// import MultipleAddButton from '../components/MultipleAddButton';
// import CameraForEachPicture from '../components/CameraForEachPicture';
// import OtherUserProducts from '../views/OtherUserProducts';
// import OtherUserSoldProducts from '../views/OtherUserSoldProducts';
import { StackStyles } from '../../Theme/NavigationStyles';

export const MarketToProductDetailsOrChatOrCommentsStack = createStackNavigator({
    MarketPlace: MarketPlace,
    // YourProducts: YourProducts,
    // ProductDetails: ProductDetails,
    // CreateItem: CreateItem,
    // MultiplePictureCamera: MultiplePictureCamera,
    // MultipleAddButton: MultipleAddButton,
    // CameraForEachPicture,
    // PriceSelection: PriceSelection,
    // ConditionSelection: ConditionSelection,
    // ProductComments: ProductComments,
    // OtherUserProfilePage: OtherUserProfilePage,
    // UserComments: UserComments,
    // CustomChat: CustomChat,
    // OtherUserProducts,
    // OtherUserSoldProducts,
},
{
    initialRouteName: 'MarketPlace',
    ...StackStyles
}
)
