import { createStackNavigator } from 'react-navigation-stack';

// import Welcome from '../../Containers/Welcome';

import CreateProfile from '../../Containers/CreateProfile';
import SignIn from '../../Containers/SignIn';
// import SignIn from '../views/SignIn';

import MultiplePictureCamera from '../../components/MultiplePictureCamera';
import MultipleAddButton from '../../components/MultipleAddButton';

import CameraForEachPicture from '../../components/CameraForEachPicture';
import { StackStyles } from '../../Theme/NavigationStyles';

const AuthStack = createStackNavigator({
    
    SignIn,
    CreateProfile,
    MultipleAddButton: MultipleAddButton,
    CameraForEachPicture: CameraForEachPicture,
    MultiplePictureCamera: MultiplePictureCamera,
    
},
{   
    initialRouteName: 'SignIn',
    ...StackStyles
}
)

export default AuthStack

