import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import Welcome from '../../Containers/Welcome';

// import CreateProfile from '../views/CreateProfile';
// import SignIn from '../views/SignIn';

// import MultiplePictureCamera from '../components/MultiplePictureCamera';
// import MultipleAddButton from '../components/MultipleAddButton';

// import CameraForEachPicture from '../components/CameraForEachPicture';
import { StackStyles } from '../../Theme/NavigationStyles';

export const SignUpToCreateProfileStack = createStackNavigator({
    
    Welcome,
    // SignIn: SignIn,
    // CreateProfile: CreateProfile,
    // MultipleAddButton: MultipleAddButton,
    // CameraForEachPicture: CameraForEachPicture,
    // MultiplePictureCamera: MultiplePictureCamera,
    
    },
    {   
    initialRouteName: 'Welcome',
    ...StackStyles
  }
)

