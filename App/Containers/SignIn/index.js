import React, { Component } from 'react';
import { View, Modal, ImageBackground, Text, TextInput, Platform, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'react-native-firebase';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {avenirNextText} from '../../constructors/avenirNextText'

import {lightGray, logoGreen, darkGreen} from '../../colors'
import { LoadingIndicator, SignInTextInput, CustomTextInput } from '../../localFunctions/visualFunctions.js';

import {geocodeKey} from '../../credentials/keys';
// import { isUserRegistered } from '../../Services/AuthService.js';
import { Images, Helpers } from '../../Theme';
import NavigationService from '../../Services/NavigationService';

const passwordResetText = "Enter your email and we will send you a link to reset your password"

//THIS PAGE: 
//Allows user to sign in or sign up and handles the flow specific to standard sign in, or standard sign up.

class ViewWithChildAtPosition extends Component { 

    constructor(props){
        super(props);
    }

    render() {
        const {flex} = this.props;

        return (
            <View style={{flex: flex, backgroundColor: this.props.color ? this.props.color : null, paddingHorizontal: 2, justifyContent: 'flex-start', alignItems: 'center'}}>
                {this.props.children}
            </View>
        )
        }
}



//currently no barrier to logging in and signing up
class SignIn extends Component {

    constructor(props) {
      super(props);
      this.state = { 
        products: [], email: '', uid: '', pass: '', loading: false, loggedIn: false, 
        googleIconColor: '#db3236', fbIconColor: "#3b5998",
        saveUsernamePass: true,
        showPasswordReset: false,

        //userLocation
        currentLocation: false,
      };
    }

    async componentWillMount () {

        await AsyncStorage.getItem('saveUsernamePass')
        .then( (data) => {
            // console.log(data);
            this.setState({saveUsernamePass: data == "true" ? true : false}, () => {
                if(this.state.saveUsernamePass) {
                    AsyncStorage.multiGet(['previousEmail', 'previousPassword'] ).then((data)=> {
                        this.setState({email: data[0][1] ? data[0][1] : '', pass: data[1][1] ? data[1][1] : '', }) 
                    })
                }
                
            })
        })
        .catch( () => {
            console.log("Error Retrieving Data")
        })

        
        
    }


    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
              const currentLocation = JSON.stringify(position);
              let {latitude, longitude} = position.coords;
              fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geocodeKey}`)
              .then(async response => {
                  let country;
                  if(response.ok) {
                    let json = JSON.parse(response.resp.data).results;
                    
                    await json[0].address_components.forEach(comp => {
                        if(comp.types.includes('country')) {
                            switch(comp.short_name) {
                                case "US":
                                    country = "USA";
                                    break;
                                case "GB":
                                    country = "UK";
                                    break;
                                default:
                                    country = "Pakistan";
                                    break;
                            }
                        }
                    })
                  }
                  else {
                    country = false;
                  }
                  return country
              })
              .then(country => {
                  this.setState({currentLocation: country})
              })
              .catch(err => {
                  alert(err);
              })
              
            },
            error => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    

    

    // Invoked when onSignInPress() AND signInWithGoogle()  are pressed: 
    // that is when user presses Sign In Button, or when they choose to sign up or sign in through Google 
    //The G and F UserBooleans are used only in the attemptSignUp function to determine what data to navigate with to the CreateProfile Screen.
    successfulLoginCallback = () => {
        this.setState({loading: false}, () => {NavigationService.navigate('AppStack')});
    }

    //Invoked when user tries to sign in even though they don't exist in the system yet
    attemptSignUp = (socialUser, googleUserBoolean, facebookUserBoolean) => {
        //check if user wishes to sign up through standard process (the former) or through google or through facebook so 3 cases
        //
        // console.log('attempting to sign up', socialUser);
        let {currentLocation} = this.state;
        this.setState({loading: false});
        !socialUser ? 
            NavigationService.navigate('CreateProfile', {user: false, googleUserBoolean: false, facebookUserBoolean: false, currentLocation})
        :
            googleUserBoolean && !facebookUserBoolean ? 
                NavigationService.navigate('CreateProfile', {user: socialUser, googleUserBoolean: true, facebookUserBoolean: false, pictureuris: [socialUser.user.photo], currentLocation})
            :
                NavigationService.navigate('CreateProfile', {user: socialUser, googleUserBoolean: false, facebookUserBoolean: true, pictureuris: [socialUser.user.picture.data.url], currentLocation})
                //this.props.navigation.navigate('CreateProfile', {user, googleUserBoolean, pictureuris: [user.photoURL],})
    }

    

    onSignInPress = () => {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state;

        if (!email || !pass) {
            alert("You cannot Sign In if your email and/or password fields are blank.");
            this.setState({loading: false});
        }
        else if (!pass.length >= 6) {
            alert("Your password's length must be greater or equal to 6 characters.");
            this.setState({loading: false});
        }
        else {
//now that person has input text, their email and password are here
        
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(() => {
                // console.log("Have I affected auth behavior?")
                //This function behaves as an authentication listener for user. 
                //If user signs in, we only use properties about the user to:
                //1. notifications update on cloud & local push notification scheduled notifications 4 days from now for each product that deserves a price reduction.
                firebase.auth().onAuthStateChanged( (user) => {
                    if(user) {
                        // console.log(`User's Particular Identification: ${user.uid}`);
                        //could potentially navigate with user properties like uid, name, etc.
                        //TODO: once you sign out and nav back to this page, last entered
                        //password and email are still there

                        // this.saveEmailForFuture(email);
                        // AsyncStorage.setItem('previousEmail', email);
                        this.state.saveUsernamePass ? AsyncStorage.multiSet([ ['previousEmail', email], ['previousPassword', pass] ]) : null;

                        this.successfulLoginCallback();
                        
                        // this.setState({loading: false, loggedIn: true})
                        
                    }
                })
                          //this.authChangeListener();
                          //cant do these things:
                          //firebase.database().ref('Users/7j2AnQgioWTXP7vhiJzjwXPOdLC3/').set({name: 'Imad Rajwani', attended: 1});
            })
            .catch( () => {
                let err = 'Authentication failed, please sign up or enter correct credentials.';
                this.setState( { loading: false } );
                alert(err);
            })

            //TODO:unmute
            // .catch( () => {
            //     //if user fails to sign in with email, try to sign them in with google?
            //     this.signInWithGoogle();
            // })

        }

        
            

    }

    arrayToObject(arr, keyField) {
        Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})))
    }

    toggleSaveUsernamePass = () => {
        this.setState({saveUsernamePass: !this.state.saveUsernamePass}, () => {
            AsyncStorage.setItem('saveUsernamePass', this.state.saveUsernamePass ? "true" : "false");
        });
    }

    toggleShowPasswordReset = () => {
        this.setState({showPasswordReset: !this.state.showPasswordReset});
    }

    renderPasswordResetModal = () => {
        return (
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showPasswordReset}
            >
                <View style={[styles.signInContainer, {backgroundColor: '#122021', padding: 0, marginHorizontal: 0, marginTop: Platform.OS == 'ios' ? 22 : 0}]}>
                    <View style={styles.headerBar}>
                        <FontAwesomeIcon
                        name='close'
                        size={28}
                        color={'black'}
                        onPress={this.toggleShowPasswordReset}
                        />
                    </View>
                    <View style={styles.passwordResetContainer}>

                        <View style={{flex: 0.2, margin: 5, alignItems: 'center'}}>
                            <Text style={new avenirNextText("#fff", 18, "300")}>{passwordResetText}</Text>
                        </View>

                        <View style={{flex: 0.2, margin: 5}}>
                            <TextInput 
                            maxLength={40} 
                            placeholder={"Email Address"} 
                            placeholderTextColor={lightGray}
                            value={this.state.email} onChangeText={email => this.setState({ email })}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={"transparent"}
                            style={[{height: 50, width: 280 }, new avenirNextText('#fff', 20, "300")]}
                            
                            />
                        </View>
                        
                        
                        <TouchableOpacity 
                        onPress={()=> {
                            firebase.auth().sendPasswordResetEmail(this.state.email)
                            .then( async () => {
                                await this.toggleShowPasswordReset;
                                alert('Password Reset Email successfully sent! Please check your inbox for instructions on how to reset your password');
                            })
                            .catch( () => {
                                alert('Please input a valid email address');
                            })
                        }}
                        style={{backgroundColor: "#fff", margin: 10, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={new avenirNextText('black', 18, "300", 'center')}>SEND</Text>
                        </TouchableOpacity>
                        

                    </View>
                </View>
            </Modal>
        )
    }

    


    render() {

        const {loading} = this.state;
        // console.log("Hello Sign In Page");
        // AsyncStorage.getItem('previousEmail').then((d)=>console.log(d + 'getItem'))
        
        
        return (
            <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={Images.createProfileBg} style={{flex: 1}}>



            <View style={styles.signInContainer}>

                
                    <View style={styles.companyLogoContainer}>

                        

                    </View>
                    
                    <View style={styles.twoTextInputsContainer}>
                        
                        
                        <View>
                        <View style={styles.inputContainer}>

                            <View style={styles.input}>
                                <TextInput
                                secureTextEntry={false}
                                style={styles.inputText}
                                placeholder={'Email Address'}
                                placeholderTextColor={lightGray}
                                onChangeText={email => this.setState({email})}
                                value={this.state.email}
                                multiline={false}
                                autoCorrect={false}
                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={"transparent"}
                                keyboardType={'email-address'}
                                returnKeyType={'next'}
                                onSubmitEditing={()=>{this.passInput.focus()}}
                                />         
                            </View>
                            
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.input}>
                                <TextInput
                                secureTextEntry={true}
                                style={styles.inputText}
                                placeholder={'Password'}
                                placeholderTextColor={lightGray}
                                onChangeText={pass => this.setState({ pass })}
                                value={this.state.pass}
                                multiline={false}
                                
                                autoCorrect={false}
                                
                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={"transparent"}
                                returnKeyType={'done'}
                                ref={ref => this.passInput = ref}
                                
                                
                                />         
                            </View>
                        </View>
                        </View>
                        
                        

                        

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 15, marginHorizontal: 15}}>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 5}}>
                                <TouchableOpacity onPress={this.toggleSaveUsernamePass} style={{height: 25, width: 25, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                    {this.state.saveUsernamePass ?
                                        <Icon
                                        name="check"
                                        size={22}
                                        color={"#fff"} 
                                        />
                                    :
                                        null
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 5}}>
                                <Text onPress={this.toggleSaveUsernamePass} style={new avenirNextText("#fff", 14, "300")}>Remember Username & Password</Text>
                            </View>
                        </View>

                        {loading ? 
                            null
                        :
                            <TouchableOpacity 
                            onPress={this.toggleShowPasswordReset}
                            style={styles.forgotPasswordContainer}>
                                <Text style={new avenirNextText('#fff', 14, "300")}>Forgot Password?</Text>
                            </TouchableOpacity>
                        }

                        

                    </View>
                
                {loading ? 
                    <View style={styles.allAuthButtonsContainer}>
                        <LoadingIndicator />
                    </View>
                :
                    
                        
                <View style={[styles.allAuthButtonsContainer]}>

                    <ViewWithChildAtPosition flex={1/7}  >
                        
                            {/* <Icon
                                name="google" 
                                size={30} 
                                color={this.state.googleIconColor}
                                onPress={() => this.signInWithGoogle()}
                            /> */}
                        
                    </ViewWithChildAtPosition>

                    <View style={styles.twoAuthButtonsContainer}>
                        
                            
                            <TouchableOpacity
                                style={styles.authButton}
                                onPress={() => {this.onSignInPress()} } 
                            >
                                <Text>Sign In</Text>
                            </TouchableOpacity>
                            

                            
                            <TouchableOpacity
                                
                                style={styles.authButton}
                                onPress={() => {NavigationService.goBack()} } 
                            >
                                <Text>Back</Text>
                            </TouchableOpacity>
                            
                        
                    </View>

                    <ViewWithChildAtPosition flex={1/7} >

                        {/* <Icon
                            name="facebook-box" 
                            size={33} 
                            color={this.state.fbIconColor}
                            onPress={() => this.signInWithFacebook()}
                        /> */}
                            
                    </ViewWithChildAtPosition>

                </View>
                }

                    
            {this.renderPasswordResetModal()}
            </View>
            </ImageBackground>
            </SafeAreaView>
                    )


                    

            
        }

}

export default SignIn;


const styles = StyleSheet.create({

  //SIGNIN OR SIGNUP Page
    firstContainer: {
      flex: 1,
      // marginTop: 5,
      //marginBottom: 5,
      padding: 40,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      //alignContent
      backgroundColor: '#122021',
      //#fff
    },

  //SIGN IN PAGE
    signInContainer: {
      flex: 1,
    //   marginHorizontal: 15,
    //   marginTop: 20,
      //marginBottom: 5,
    //   padding: 15,
      flexDirection: 'column',
      // justifyContent: 'space-between',
      // alignContent: 'center',
    //   backgroundColor: '#122021',
      //#fff
    },
    companyLogoContainer: {
      flex: 0.25,
      justifyContent: 'flex-end',
      alignItems: 'center',
    //   backgroundColor: '#122021',
      paddingBottom: 10,
      paddingHorizontal: 5,
    },
    companyLogo: {
      //resizeMode: 'container',
      borderColor:'#207011',
      // alignItems:'center',
      // justifyContent:'center',
      width:90,
      height:100,
    //   backgroundColor:'#122021',
      borderRadius:45,
      borderWidth: 1,
      //marginLeft: (width/4)-10,
      // paddingLeft: 25,
      // paddingRight: 25
  
  },

  twoTextInputsContainer: {
    flex: 0.4,
    // justifyContent: 'flex-start',
    // backgroundColor: 'red',
    // alignItems: 'center',
    // paddingHorizontal: 10
    // backgroundColor: 'red'
  },

  inputContainer: {
      marginVertical: 7,
    //   marginHorizontal: 5,
      justifyContent: 'center'
    //   alignItems: 'center'
  },

//   placeholderContainer: {
//     position: 'absolute', flex: 1, justifyContent: 'flex-start', alignItems: 'center'
//   },

  input: {
    // height: 60, 
    borderRadius: 0,
    padding: 15,
    backgroundColor: 'black',
    borderBottomWidth: 4,
    borderColor: darkGreen,
    // justifyContent: 'center', alignItems: 'flex-start',
    // ...new shadow(2,2, color = lightGray, -1, 1)
},

  inputText: { fontFamily: 'Avenir Next', fontSize: 15, fontWeight: "500", color:'#fff'},

  allAuthButtonsContainer: {
    flex: 0.30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },

  twoAuthButtonsContainer: {
    flex: 5/7,
    // backgroundColor: 'white',
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },

    authButton: {
        backgroundColor: darkGreen,
        borderWidth: 0,
        borderRadius: 5,
        marginVertical: 10,
        padding: 15,
        ...Helpers.center,
    },

  forgotPasswordContainer: {
    //   flex: 0.05,
      flexDirection: 'row',
      justifyContent: 'center',
    //   marginLeft: 15,
      alignItems: 'center',
      
  },

  headerBar: {
      flex: 0.07,
      flexDirection: 'row',
      padding: 10,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: logoGreen
  },

  passwordResetContainer: {
    flex: 0.93,
    paddingVertical: 5,
    paddingHorizontal: 10
  },

    authButtonText: { fontWeight: "bold" },
    container: {
      alignItems: 'stretch',
      flex: 1
    },
    body: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },
    inputStyle: {
         paddingRight: 5,
         paddingLeft: 5,
         paddingBottom: 2,
         color: 'blue',
         fontSize: 18,
         fontWeight: '200',
         flex: 2,
         height: 100,
         width: 300,
         borderColor: 'gray',
         borderWidth: 1,
  },
  
  
     containerStyle: {
         height: 45,
         flexDirection: 'column',
          alignItems: 'flex-start',
          width: '75%',
          borderColor: 'gray',
         borderBottomWidth: 1,
     },
    aicontainer: {
      flex: 1,
      justifyContent: 'center'
    }
    ,
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
    ,
    toolbar: {
          height: 56,
      backgroundColor: '#e9eaed',
    },
    textInput: {
      height: 40,
      width: 200,
      borderColor: 'red',
      borderWidth: 1
    },
    transparentButton: {
      marginTop: 10,
      padding: 15
    },
    transparentButtonText: {
      color: '#0485A9',
      textAlign: 'center',
      fontSize: 16
    },
    primaryButton: {
      margin: 10,
      padding: 15,
      backgroundColor: '#529ecc'
    },
    primaryButtonText: {
      color: '#FFF',
      textAlign: 'center',
      fontSize: 18
    },
    image: {
      width: 100,
      height: 100
    },


    





  });
// if(loggedIn) {
//     return <HomeScreen/>
// }

//TODO:unmute
{/* <GoogleSigninButton
                            style={{ width: 200, height: 48 }}
                            size={GoogleSigninButton.Size.Standard}
                            color={GoogleSigninButton.Color.Light}
                            onPress={ () => this.signInWithGoogle() }

                        /> */}