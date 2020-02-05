import { createStackNavigator } from 'react-navigation-stack';

import CreateItem from '../../Containers/CreateItem';
import MultipleAddButton from '../../components/MultipleAddButton'
import MultiplePictureCamera from '../../components/MultiplePictureCamera'

import PriceSelection from '../../Containers/CreateItem/PriceSelection'
import ConditionSelection from '../../Containers/CreateItem/ConditionSelection'
import CameraForEachPicture from '../../components/CameraForEachPicture';

import { StackStyles } from '../../Theme/NavigationStyles';

export const MultipleAddButtonToMultiplePictureCameraToCreateItemStack = createStackNavigator({

    CreateItem: CreateItem,
    MultiplePictureCamera: MultiplePictureCamera,
    CameraForEachPicture: CameraForEachPicture,
    MultipleAddButton: MultipleAddButton,
    PriceSelection: PriceSelection,
    ConditionSelection: ConditionSelection,

}, {
    initialRouteName: 'CreateItem',
    ...StackStyles
}
)
