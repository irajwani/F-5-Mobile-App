import React, { Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, TouchableOpacity, Image } from 'react-native'
import {GoogleSignin} from '@react-native-community/google-signin'

import { Metrics, Images, Fonts } from '../../Theme';

import { mantisGreen, limeGreen, fbBlue } from '../../colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { evenShadow } from '../../StyleSheets/shadowStyles';
import NavigationService from '../../Services/NavigationService';

const {platform,screenWidth} = Metrics;

const WelcomeButton = ({backgroundColor, text, color, icon = false, onPress}) => (
    <TouchableOpacity underlayColor={'transparent'} style={[styles.welcomeButton, {backgroundColor}, platform == "ios" ? evenShadow : null]} onPress={onPress}>
        {icon &&
        <View style={{flex: 0.12, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10,}}>
            {icon == "facebook" ?
            <Icon
            name={icon} 
            size={35} 
            color={'white'}
            />
            :
            <Image
            source={Images.google}
            style={{width: 35, height: 35}}    
            />
            }
        </View>
        }
        <View style={{flex: icon ? 0.88 : 1, justifyContent: 'center', alignItems: icon ? 'flex-start' : 'center', paddingVertical: 15, paddingHorizontal: 2,}}>
            <Text style={{...Fonts.style.normal, fontSize: icon == "facebook" ? 17 : 20, color, letterSpacing: 1.2, fontWeight: "200"}}>{text}</Text>
        </View>
    </TouchableOpacity>
)

export default class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentLocation: false,
        }
    }

    componentDidMount() {
        platform === "ios" ?
            GoogleSignin.configure({
                iosClientId: '791527199565-kfkgft1g8p2tamioshmqj8pa38r3sesh.apps.googleusercontent.com',
            })
            :
            GoogleSignin.configure();
    }

    signInWithGoogle = () => {
        !this.state.loading ? this.setState({loading: true}) : null;
        // console.log('trying to sign with google')
        GoogleSignin.signIn()
        .then((data) => {
            //TODO: Since "google sign in with account" pop up does not show after person selects an account, 
            //need a way to unlink google account and revive original chain fully so user may use another google account to sign up
            //maybe look at other apps
            console.log(data);
            
            let {idToken, accessToken, user} = data;
            let socialInformation = {
                idToken, accessToken, user
            }
            return socialInformation;
            
        })
        .then(async (socialInformation) => {
            // console.log(socialInformation.user.email)
            let {data} = await isUserRegistered(socialInformation.user.email);
            if(data.isRegistered) {
                this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
            }
            else {
                alert('here')
                this.setState({loading: false}, () => {this.attemptSignUp(socialInformation, true, false)})
            }
            
            
            // console.log("STATUS:" + JSON.stringify(isRegistered));
            // this.successfulLoginCallback(currentUser, googleUserBoolean = true, facebookUserBoolean = false);
            // console.log('successfully signed in:', currentUser);
            // console.log(JSON.stringify(currentUser.toJSON()))
        })
        .catch( (err) => {
            platform === 'ios' ? console.log('user canceled google signin') : alert("Whoops! Here's what happened: " + err); 
            this.setState({loading: false});
        })
    }

    successfulLoginCallback = () => {
        this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
    }

    attemptSignUp = (socialUser, googleUserBoolean, facebookUserBoolean) => {
        //check if user wishes to sign up through standard process (the former) or through google or through facebook so 3 cases
        console.log('Navigating to CreateProfile')
        let {currentLocation} = this.state;
        this.setState({loading: false});
        !socialUser ? 
            NavigationService.navigate('CreateProfile', {user: false, googleUserBoolean: false, facebookUserBoolean: false, currentLocation})
        :
            googleUserBoolean && !facebookUserBoolean ? 
                NavigationService.navigate('CreateProfile', {user: socialUser, googleUserBoolean: true, facebookUserBoolean: false, pictureuris: [socialUser.user.photo], currentLocation})
            :
                NavigationService.navigate('CreateProfile', {user: socialUser, googleUserBoolean: false, facebookUserBoolean: true, pictureuris: [socialUser.user.picture.data.url], currentLocation})
                
    }

    renderButtons = () => {
        return (
            <View>

                <WelcomeButton 
                onPress={()=>{this.props.navigation.navigate('SignIn')}}
                backgroundColor={limeGreen} text={"Log in to your account"} color={'black'}

                />

                {/* <WelcomeButton 
                onPress={()=>{
                    this.signInWithFacebook()
                }}
                backgroundColor={fbBlue} text={"Sign up with Facebook"} color={'#fff'} icon={'facebook'}
                    
                /> */}

                <WelcomeButton 
                onPress={() => this.signInWithGoogle()}
                backgroundColor={"#fff"} text={"Sign up with Google"} color={'black'} icon={'google'}
                />    
                

                <WelcomeButton 
                onPress={()=>{
                    this.attemptSignUp(user = false, googleUserBoolean = false, facebookUserBoolean = false)
                }}
                backgroundColor={'black'} text={"Create New Account"} color={'#fff'}
                    
                />

            </View>
        )
    }

    

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ImageBackground source={Images.loginBg} style={styles.buttonsContainer}>
                    {this.renderButtons()}
                </ImageBackground>
            
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    buttonsContainer: {flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25},
    welcomeButton: {
        width: 0.8*screenWidth, flexDirection: 'row', borderRadius: 25, margin: 10, 
         
    },
})



// async componentWillMount () {
       
//     let newUser = await AsyncStorage.getItem('newUser');
//     AsyncStorage.getItem('saveUsernamePass')
//     .then( (data) => {
//         // console.log(data);
//         this.setState({saveUsernamePass: data == "true" ? true : false}, () => {
//             if(this.state.saveUsernamePass) {
//                 AsyncStorage.multiGet(['previousEmail', 'previousPassword'] ).then((data)=> {
//                     this.setState({email: data[0][1] ? data[0][1] : '', pass: data[1][1] ? data[1][1] : '', }) 
//                 })
//             }
            
//         })
//     })
//     .then( () => {
//         if(newUser == 'false') {
//             this.setState({newUser: false})
//         }
//         else {
//             AsyncStorage.setItem('newUser', 'false', () => {
//                 //since this person is a new user, show them tutorials screen,
//                 //and also set newUser to false so they don't see tutorial in future
//                 this.setState({newUser: true})
//             });
//         }
        
//     })
//     .catch( () => {
//         console.log("Error Retrieving Data")
//     })

    
    
// }