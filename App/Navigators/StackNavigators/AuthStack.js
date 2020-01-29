import { createStackNavigator } from 'react-navigation-stack';

import CreateProfile from '../views/CreateProfile';
import SignIn from '../views/SignIn';
import Welcome from '../views/Welcome';
import MultiplePictureCamera from '../components/MultiplePictureCamera';
import MultipleAddButton from '../components/MultipleAddButton';
// import HomeScreen from '../views/HomeScreen';
// import ViewPhotos from '../views/ViewPhotos';
import CameraForEachPicture from '../components/CameraForEachPicture';
import { StackStyles } from '../../Theme/NavigationStyles';

export const SignUpToCreateProfileStack = createStackNavigator({
    
    Welcome,
    SignIn: SignIn,
    CreateProfile: CreateProfile,
    MultipleAddButton: MultipleAddButton,
    CameraForEachPicture: CameraForEachPicture,
    MultiplePictureCamera: MultiplePictureCamera,
    // ViewPhotos: ViewPhotos,

    
    // AppStack: HomeScreen,
},
{   
    initialRouteName: 'Welcome',
    ...StackStyles
  })

