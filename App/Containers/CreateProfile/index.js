import React, { Component } from 'react'
import { ImageBackground, Linking, Dimensions, Text, StyleSheet, SafeAreaView, View,Image, ScrollView, Platform, Modal, TouchableOpacity, Keyboard, KeyboardAvoidingView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';

import firebase from 'react-native-firebase';
import MultipleAddButton from '../../components/MultipleAddButton.js';

import { EulaTop, EulaBottom, TsAndCs, PrivacyPolicy, EulaLink } from '../../legal/Documents.js';
import { lightGray, treeGreen, bobbyBlue, mantisGreen, bgBlack, flashOrange, logoGreen, woodBrown, darkGreen, silver } from '../../colors.js';

import {LoadingIndicator, CustomTextInput} from '../../localFunctions/visualFunctions';
import { shadow } from '../../constructors/shadow.js';

import { avenirNextText } from '../../constructors/avenirNextText.js';
import { center } from '../../constructors/center.js';

import { Images, Fonts, Colors, Helpers } from '../../Theme';
import NavigationService from '../../Services/NavigationService.js';
import AuthInput from '../../components/Input/AuthInput.js';

let {BackArrow, Info} = Images;

const {width, height} = Dimensions.get('window');
const resizedWidth = 5000, resizedHeight = 5000;

// TODO: store these in common file as thumbnail spec for image resizing
const maxWidth = 320, maxHeight = 320, suppressionLevel = 0;
// const inputHeightBoost = 4;
const info = "In order to sign up, ensure that the values you input meet the following conditions:\n1. Take a profile picture of yourself. If you wish to keep your image a secret, just take a picture of your finger pressed against your camera lens to simulate a dark blank photo.\n2. Use a legitimate email address as other buyers and sellers need a way to contact you if the functionality in F5 is erroneous for some reason.\n3. Your Password's length must be greater than or equal to 6 characters. To add some security, consider using at least one upper case letter and one symbol like !.\n4. Please limit the length of your name to 40 characters.\n5. An Example answer to the 'city, country abbreviation' field is: 'Nottingham, UK' "
const limeGreen = '#2e770f';

// const locations = [{country: "UK", flag: "🇬🇧"},{country: "Pakistan", flag: "🇵🇰"},{country: "USA", flag: "🇺🇸"}]
//TODO: *Variable
const locations = [
    // {country: "UK", flag: "uk"},
    {country: "Pakistan", flag: "pk"},
    // {country: "USA", flag: "usa"}
];

const Bullet = '\u2022';

const avatarUri = "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Placeholders%2Fblank.jpg?alt=media&token=38926661-a722-4305-94ad-b8ad9a78dcdf";

// const Blob = RNFetchBlob.polyfill.Blob;
// const fs = RNFetchBlob.fs;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

// const Fetch = RNFetchBlob.polyfill.Fetch
// // replace built-in fetch
// window.fetch = new Fetch({
//     // enable this option so that the response data conversion handled automatically
//     auto : true,
//     // when receiving response data, the module will match its Content-Type header
//     // with strings in this array. If it contains any one of string in this array, 
//     // the response body will be considered as binary data and the data will be stored
//     // in file system instead of in memory.
//     // By default, it only store response data to file system when Content-Type 
//     // contains string `application/octet`.
//     binaryContentTypes : [
//         'image/',
//         'video/',
//         'audio/',
//         'foo/',
//     ]
// }).build()

// const { State: TextInputState } = TextInput;

// const CustomTextInput = ({placeholder, onChangeText, value, autoCapitalize, maxLength, secureTextEntry}) => (
//     <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
//         <TextInput
//         secureTextEntry={secureTextEntry ? true : false}
//         style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
//         placeholder={placeholder}
//         placeholderTextColor={lightGray}
//         onChangeText={onChangeText}
//         value={value}
//         multiline={false}
//         maxLength={maxLength}
//         autoCorrect={false}
//         autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
//         clearButtonMode={'while-editing'}
//         underlineColorAndroid={"transparent"}
        
//         />         
//     </View>
// )

const TextForMissingDetail = ({detail}) => {
    return (
        <Text style={new avenirNextText('black', 22, "400")}>{Bullet + " " + detail}</Text>
    )
}

class CreateProfile extends Component {
  constructor(props) {
      super(props);
      var {params} = this.props.navigation.state;
    //   //set values to google account info if they tried to sign up with google 
    //   //(technically they've already signed in to firebase auth but THAT IS IT, 
    //   //now we have to fake the process of them continuing to sign up)
    //   const {user} = params.user ? user : false;
    // If person navigates here to edit their current profile, they should be able to update their profile
      this.editProfileBoolean = this.props.navigation.getParam('editProfileBoolean', false)
      this.state = {
          uid:  this.editProfileBoolean ? firebase.auth().currentUser.uid : '',
          username: '',
          email: params.googleUserBoolean || params.facebookUserBoolean ? params.user.user.email : '',
          pass: '',
          pass2: '',
          firstName: params.googleUserBoolean || params.facebookUserBoolean ? params.user.user.name.split(" ")[0] : '',
          lastName: params.googleUserBoolean || params.facebookUserBoolean ? params.user.user.name.split(" ")[1] : '',
          city: '',    
          country: params.currentLocation ? params.currentLocation : "Pakistan",
        //   size: 1,
          uri: undefined,
          insta: '',
          fabActive: true,
          modalVisible: false,
          termsModalVisible: false,
          privacyModalVisible: false,
          infoModalVisible: false,
          createProfileLoading: false,

          //////COUNTRY SELECT STUFF
          showCountrySelect: false,

          ////EDIT PROFILE STUFF
          editProfileBoolean: false,
          previousUri: false,

          //Keyboard Aware View Stuff
          keyboardShown: false,
        //   shift: new Animated.Value(0),
      }
  }

//   componentWillMount = () => {
//     this.keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
//     this.keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
//   }

  componentDidMount() {

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
      //If you navigate here for the purpose of editing your profile, 
      //then you should see your current values, be able to edit them and then save your info.
    var editProfileBoolean = this.props.navigation.getParam('editProfileBoolean', false)
    if(editProfileBoolean) {
        this.getProfile(this.state.uid);
    }
    
  }

   keyboardDidShow() {
    this.setState({keyboardShown: true})
  }

  keyboardDidHide() {
    this.setState({keyboardShown: false})
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

//   componentWillUnmount = () => {
//     this.keyboardDidShowSub.remove();
//     this.keyboardDidHideSub.remove();
//   }

//   handleKeyboardDidShow = (event) => {
//     const { height: windowHeight } = Dimensions.get('window');
//     const keyboardHeight = event.endCoordinates.height;
//     const currentlyFocusedField = TextInputState.currentlyFocusedField();
//     UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
//       const fieldHeight = height;
//       const fieldTop = pageY;
//       const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
//       if (gap >= 0) {
//         return;
//       }
//       Animated.timing(
//         this.state.shift,
//         {
//           toValue: gap,
//           duration: 1000,
//           useNativeDriver: true,
//         }
//       ).start();
//     });
//   }

//   handleKeyboardDidHide = () => {
//     Animated.timing(
//       this.state.shift,
//       {
//         toValue: 0,
//         duration: 1000,
//         useNativeDriver: true,
//       }
//     ).start();
//   }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }
  //Invoked when you 'Accept' EULA as a Google User trying to sign up
  createProfileForGoogleOrFacebookUser = async (user, pictureuri, socialPlatform) => {
    console.log('Initiate FB or Google Sign Up')
    this.setState({createProfileLoading: true});
    if(socialPlatform == "google") {
        const {idToken, accessToken} = user;
        const credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        const socialUser = await firebase.auth().signInWithCredential(credential);
        const {email, pass} = this.state
        const linkWithEmailCredential = await firebase.auth.EmailAuthProvider.credential(email, pass);
        console.log(credential);
        firebase.auth().currentUser.linkAndRetrieveDataWithCredential(linkWithEmailCredential).then( (usercred) => {
            // console.log(usercred);
            this.updateFirebase(this.state, pictureuri, mime='image/jpg',socialUser.uid, );
            // console.log("Account linking success", usercred.user);
        }, function(error) {
            console.log("Account linking error", error);
        });   
    }
    else {
        const {accessToken} = user;
        const credential = await firebase.auth.FacebookAuthProvider.credential(accessToken);
        const socialUser = await firebase.auth().signInWithCredential(credential);
        const {email, pass} = this.state
        const linkWithEmailCredential = await firebase.auth.EmailAuthProvider.credential(email, pass);
        console.log(credential);
        firebase.auth().currentUser.linkAndRetrieveDataWithCredential(linkWithEmailCredential).then( (usercred) => {
            // console.log(usercred);
            this.updateFirebase(this.state, pictureuri, mime='image/jpg',socialUser.uid, );
            // console.log("Account linking success", usercred.user);
        }, function(error) {
            console.log("Account linking error", error);
        });
    }
       
    
    
    
  }



  //Invoked when you 'Accept' EULA as a User trying to sign up through standard process
  createProfile = (email, pass, pictureuri) => {
      this.setState({createProfileLoading: true});
    //   console.log("Initiate Sign Up");
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(() => {
            firebase.auth().onAuthStateChanged( ( user ) => {
                
                if(user) {
                    // console.log("User Is: " + user)
                    const {uid} = user;
                    this.updateFirebase(this.state, pictureuri, mime = 'image/jpg', uid );
                    // alert('Your account has been created.\nPlease use your credentials to Sign In.');
                    // this.props.navigation.navigate('SignIn'); 
                }
                else {
                    alert('Oops, there was an error with account registration!');
                }
            })
            }
        )
        .catch(() => {
            this.setState({ error: 'You already have a F5 account. Please use your credentials to Sign In', createProfileLoading: false, email: '', pass: '', pass2: '' });
            alert(this.state.error)
        });
  }

//   addToUsersRoom() {
    
//     const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;

//     const tokenProvider = new Chatkit.TokenProvider({
//         url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
//       });
  
//     // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
//     // For the purpose of this example we will use single room-user pair.
//     const chatManager = new Chatkit.ChatManager({
//     instanceLocator: CHATKIT_INSTANCE_LOCATOR,
//     userId: CHATKIT_USER_NAME,
//     tokenProvider: tokenProvider
//     });

//     chatManager.connect().then(currentUser => {
//         this.currentUser = currentUser;
//         console.log(this.currentUser);
//         var {rooms} = this.currentUser;
//         console.log(rooms); 
//         this.currentUser.joinRoom({
//             roomId: 15868783 //Users
//           })
//             .then(() => {
//               console.log('Added user to room')
//             })
//         }
//     )
//     //otherwise this function does nothing;
//   }

  //Invoked when one creates a profile for the very first time
  updateFirebase(data, uri, mime = 'image/jpg', uid) {
      console.log('Initiate Firebase Update')
    //TODO: size shouldn't be here
    var updates = {};
    var updateEmptyProducts = {};
    
    //In case user enters a handle with an @ preceding it,
    data.insta = data.insta ? data.insta[0] == '@' ? data.insta.replace('@', '') : data.insta : '';

    var postData = {
        name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
        username: data.username,
        country: data.city + ", " + data.country,
        // size: data.size,
        insta: data.insta,
        //Boolean to control if whether Upload Item notification should be sent
        isNoob: true

        //TODO: Add user uid here to make navigation to their profile page easier. 
        //Occam's razor affirms the notion: To have it available to append to any branch later, it must exist for the first time at the source.
    }
    //Now we have all information for profile branch of a user

    
    updates['/Users/' + uid + '/profile/'] = postData; 
    // updates['/Users/' + uid + '/status/'] = 'offline';
    updates['/Users/' + uid + '/products/'] = '';
    updates['/Users/' + uid + '/appUsage/'] = 0;
    //Now we have a user who may go through the app without components crashing
    
    let promiseToUploadPhoto = new Promise(async (resolve, reject) => {
        //We want to take a user's uri, resize the photos (necessary when picture is locally taken),
        //and then upload them to cloud storage, and store the url refs on cloud db;

        if(uri.includes('googleusercontent') || uri.includes('platform')) {
            // console.log(`We already have a googlePhoto url: ${uri}, so need for interaction with cloud storage`)
            
            // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            resolve(uri);
        }

        else if(uri == "nothing here") {
            resolve(avatarUri)
        }

        else {
            // console.log('user has chosen picture manually through photo lib or camera.')
            // let resizedImage = await ImageResizer.createResizedImage(uri,resizedWidth, resizedHeight,'JPEG',suppressionLevel);
            // const uploadUri = Platform.OS === 'ios' ? resizedImage.uri.replace('file://', '') : resizedImage.uri
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            // let uploadBlob = null
            // const imageRef = 
            firebase.storage().ref().child(`Users/${uid}/profile`)
            .putFile(uploadUri, {contentType: mime})
            .then(uploadTask => {
                return uploadTask.downloadURL
            })
            .then((url) => {
    
                resolve(url)
                
            })
            .catch((error) => {
                reject(error)
            });
        }
    
        
    
    })
    
    

    return {
        databaseProfile: firebase.database().ref().update(updates), 
        storage: promiseToUploadPhoto.then((url) => {
            //update db with profile picture url
            var profileUpdates = {};
            profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
            firebase.database().ref().update(profileUpdates);
            return url
                
            }).then( (url) => {
                if(url.includes('googleusercontent') || url.includes('facebook')) {
                    this.setState({createProfileLoading: false, modalVisible: false}, 
                        () => {
                            // console.log('DONE DONE DONE');
                            this.props.navigation.navigate('AppStack'); 
                        })
                }
                else {
                    this.successfulProfileCreationCallback(url);
                }
                
            })
            
        } 

  }

  successfulProfileCreationCallback = (url) => {
    // console.log("Profile Picture Cloud URL is: " + url);
    // this.props.navigation.state.params.googleUserBoolean || this.props.navigation.state.params.googleUserBoolean ? alert('Your account has been created.\nPlease enter your credentials to Sign In from now on.\n') : alert('Your account has been created.\nPlease use your credentials to Sign In.\n'); 
    // alert('Your account has been created.\nPlease use your credentials to Sign In.\n'); 
    this.setState({createProfileLoading: false, modalVisible: false});
    this.props.navigation.navigate('AppStack');
  }

  ///////////////////////
  //EDIT PROFILE FUNCTIONS

  getProfile = (uid) => {
      var profile;

      firebase.database().ref().once("value", (snap) => {
        profile = snap.val().Users[uid].profile;

        //pull uri as well and store it in pictureuris, and if there's no uri, MAB doesn't show anything
        var {name, country, insta, username} = profile;
        this.setState({
            editProfileBoolean: true, 
            username, firstName: name.split(" ")[0], lastName: name.split(" ")[1], 
            city: country.split(", ")[0],country: country.split(", ")[1], 
            insta, 
            previousUri: profile.uri ? profile.uri : false 
        })


      })
  }

  editProfile(data, uri, mime = 'image/jpg', uid) {
    
    this.setState({createProfileLoading: true});
    var updates = {};
    // switch(data.size) {
    //     case 0:
    //         data.size = 'Extra Small'
    //         break; 
    //     case 1:
    //         data.size = 'Small'
    //         break;
    //     case 2:
    //         data.size = 'Medium'
    //         break;
    //     case 3:
    //         data.size = 'Large'
    //         break;
    //     case 4:
    //         data.size = 'Extra Large'
    //         break;
    //     case 5:
    //         data.size = 'Extra Extra Large'
    //         break;
    //     default:
    //         data.size = 'Medium'
    //         console.log('no gender was specified')
    // }

    data.insta = data.insta ? data.insta[0] == '@' ? data.insta.replace('@', '') : data.insta : '';

    // var postData = {
    //     name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
    //     country: data.city + ", " + data.country,
    //     // size: data.size,
    //     insta: data.insta,
        
    // }

    let profileRef = '/Users/' + uid + '/profile/';
    if(data.username) {
        updates[profileRef + 'username/'] = data.username;     
    }
    updates[profileRef + 'name/'] = data.firstName + " " + data.lastName; 
    updates[profileRef + 'country/'] = data.city + ", " + data.country;
    updates[profileRef + 'insta/'] = data.insta;
    // updates['/Users/' + uid + '/status/'] = 'online'; //TODO: Leave for later. Originally made to check if a person is in the chat room

    let promiseToUploadPhoto = new Promise(async (resolve, reject) => {

        if(uri.includes('googleusercontent') || uri.includes('platform') || uri.includes('firebasestorage')) {
            // console.log(`We already have a url for this image: ${uri}, so need for interaction with cloud storage, just store URL in cloud db`);
            
            // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            resolve(uri);
        }

        else if(uri == "nothing here") {
            resolve(avatarUri)
        }

        else {
            // console.log('user has chosen picture manually through photo lib or camera, store it on cloud and generate a URL for it.')
            // let resizedImage = await ImageResizer.createResizedImage(uri,resizedWidth, resizedHeight,'JPEG',suppressionLevel);
            // const uploadUri = Platform.OS === 'ios' ? resizedImage.uri.replace('file://', '') : resizedImage.uri
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            firebase.storage().ref().child(`Users/${uid}/profile`)
            .putFile(uploadUri, {contentType: mime})
            .then(uploadTask => {
                return uploadTask.downloadURL;
            })
            .then((url) => {
    
                resolve(url)
                
            })
            .catch((error) => {
            reject(error)
            })
        }
    
        
    
    })

    return {database: firebase.database().ref().update(updates), 
            storage: promiseToUploadPhoto.then((url) => {
                //update db with profile picture url
                var profileUpdates = {};
                profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
                firebase.database().ref().update(profileUpdates);
                return url
                    
                }).then( (url) => {
                    if(url.includes('googleusercontent') || url.includes('facebook')) {
                        this.setState({createProfileLoading: false}, 
                            () => {
                                // console.log('DONE DONE DONE');
                                this.props.navigation.navigate('ProfilePage'); 
                            })
                    }
                    else {
                        // alert('Your profile has successfully been updated!'); 
                        this.setState({createProfileLoading: false});
                        this.props.navigation.navigate('ProfilePage');
                    }
                    
                })
    }
  }

  toggleShowCountrySelect = () => {
    this.setState({showCountrySelect: !this.state.showCountrySelect});
  }

  renderLocationSelect = () => (
    <View style={[{flexDirection: 'row'}]}>
        <View style={{flex: 0.7, marginHorizontal: 5, marginRight: 10}}>
            <AuthInput             
            placeholder={"City"} 
            value={this.state.city} 
            onChangeText={city => this.setState({ city })}
            maxLength={16}
            returnKeyType={'default'}
            />
            
        </View>

        <TouchableOpacity style={{flex: 0.3, ...Helpers.center}} onPress={this.toggleShowCountrySelect}>
            <Text 
            // style={styles.inputText}
            style={[styles.inputText, {color: Colors.secondary }]}
            >
            {this.state.country}
            </Text>
        </TouchableOpacity>
    
    </View>
  )

  renderLocationSelectModal = () => (
    <Modal
    animationType="slide"
    transparent={false}
    visible={this.state.showCountrySelect}
    >
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerBar}>
                <FontAwesomeIcon
                name='close'
                size={28}
                color={Colors.primary}
                onPress={this.toggleShowCountrySelect}
                />
            </View>

            <View style={styles.locationSelectBody}>
                {locations.map((location, index) => (
                    <TouchableOpacity key={index} onPress={()=>{
                        this.setState({country: location.country}, this.toggleShowCountrySelect)
                    }} 
                    style={[{flexDirection: 'row'}, {borderBottomColor: '#fff', borderBottomWidth: 1}]}>
                        <View style={styles.specificLocationContainer}>
                            <Image style={{width: 30, height: 30}} source={ location.flag == "usa" ? Images.usaFlag : location.flag == "uk" ? Images.ukFlag : Images.pkFlag }/>
                        </View>
                        <View style={styles.specificLocationContainer}>
                            <Text style={{...Fonts.style.h3, color: Colors.secondary}}>{location.country}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

        </SafeAreaView>
    </Modal>
  )

  renderPasswordsMatch = (doMatch) => {
      doMatch ? 
        <View style={styles.passwordStatusRow}>
            <Text style={[styles.passwordStatusText, {color: mantisGreen}]}>Passwords Match!</Text>
            <Icon 
                name="verified" 
                size={30} 
                color={mantisGreen}
            />
        </View>
        :
        null
  }

  renderAuthInputFields = (passwordConditionMet) => (
      <View>
                            
        <AuthInput 
        maxLength={40} 
        placeholder={"Email Address"} 
        value={this.state.email} 
        onChangeText={email => this.setState({ email })}
        keyboardType={'email'}            
        />

        

        <AuthInput 
        placeholder={"Password"} 
        value={this.state.pass} 
        onChangeText={pass => this.setState({ pass })}
        maxLength={16}
        secureTextEntry
        />

        

        
        <View style={{
            flexDirection: 'row', 
            // borderWidth: this.state.pass && this.state.pass2 ? 0.5 : 0, borderColor: passwordConditionMet ? mantisGreen : flashOrange
            }}>
            <View style={{flex: passwordConditionMet ? 1 : 0.85}}>
                <AuthInput 
                placeholder={"Retype Password"} 
                value={this.state.pass2} 
                onChangeText={pass2 => this.setState({ pass2 })}
                maxLength={16}
                secureTextEntry
                />
            </View>
            {passwordConditionMet && 
            <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
                <Icon 
                    name="verified" 
                    size={30} 
                    color={Colors.success}
                />
            </View>
            }

        </View>

        

        
        

        {/* {this.state.pass && this.state.pass2?
            passwordConditionMet ?
            <View style={styles.passwordStatusRow}>
            <Text style={[styles.passwordStatusText, {color: mantisGreen}]}>Passwords Match!</Text>
            <Icon 
                name="verified" 
                size={30} 
                color={mantisGreen}
            />
            </View> 
            :
            <View style={styles.passwordStatusRow}>
            <Text style={[styles.passwordStatusText, {color: flashOrange}]}>Passwords Don't Match!</Text>
            <Icon 
                name="alert-circle" 
                size={30} 
                color={flashOrange}
            />
            </View>
        :
        null
        } */}




    </View>
  )

  renderEditableInputFields = (passwordConditionMet) => (
      <View>
        <AuthInput maxLength={20} placeholder={"Username"} value={this.state.username} onChangeText={username => this.setState({ username })}/>

        <View style={{flexDirection: 'row', }}>
            
                <AuthInput 
                placeholder={"First Name"} 
                value={this.state.firstName} 
                onChangeText={firstName => this.setState({ firstName })}
                maxLength={13}
                isHalf
                />
            
            
                <AuthInput 
                placeholder={"Last Name"} 
                value={this.state.lastName} 
                onChangeText={lastName => this.setState({ lastName })}
                maxLength={13}
                isHalf
                />
            
        </View>

        {!this.state.editProfileBoolean ?

            this.renderAuthInputFields(passwordConditionMet)
            :
            null
        } 

        {/* <CustomTextInput 
        placeholder={"Instagram Handle (w/o @)"} 
        value={this.state.insta} 
        onChangeText={insta => this.setState({ insta })}
        maxLength={16}
        /> */}

        {this.renderLocationSelect()}

        
      </View>
  )

  renderTermsModal = () => (
    //   {/* Modal to show Terms and Conditions */}
      <Modal
      animationType="fade"
      transparent={false}
      visible={this.state.termsModalVisible}
      onRequestClose={() => {
          Alert.alert('Modal has been closed.');
      }}
      >
          <View style={styles.modal}>
              <Text style={styles.modalHeader}>Terms & Conditions of Use</Text>
              <ScrollView contentContainerStyle={styles.licenseContainer}>
                  <Text>{TsAndCs}</Text>
              </ScrollView>
              <Text onPress={() => { this.setState({modalVisible: true, termsModalVisible: false}) }} style={styles.gotIt}>
                  Got It!
              </Text>
          </View>
      </Modal>
  )

  renderPrivacyModal = () => (
    // {/* Modal to show Privacy Policy */}
    <Modal
    animationType="fade"
    transparent={false}
    visible={this.state.privacyModalVisible}
    onRequestClose={() => {
        Alert.alert('Modal has been closed.');
    }}
    >
        <View style={styles.modal}>
            <Text style={styles.modalHeader}>Privacy Policy of F5: Fashion Marketplace</Text>
            <ScrollView contentContainerStyle={styles.licenseContainer}>
                <Text>{PrivacyPolicy}</Text>
            </ScrollView>
            <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
                Got It!
            </Text>
        </View>
    </Modal>
  )


  ///////////////


  render() {
    const {navigation} = this.props;
    const {params} = navigation.state

    const {createProfileLoading} = this.state;
    // console.log(params);
    //TODO: navigation.getParam would do wonders here;
    // var googleUserBoolean = params.googleUserBoolean ? params.googleUserBoolean : false;
    var googleUser = params.googleUserBoolean ? true : false;
    var facebookUser = params.facebookUserBoolean ? true : false;
    
    //may be reusing booleans here, but this check on isUserGoogleUser? alright logically so far
    
    var user = params.googleUserBoolean || params.facebookUserBoolean ? params.user : null; //data for google user
    // var googlePhotoURL = params.user.photoURL ? params.user.photoURL : false ;
    // googleUser && googlePhotoURL ? pictureuris = [googlePhotoURL] : 'nothing here';

    var pictureuris = navigation.getParam('pictureuris', "nothing here");
    // console.log(pictureuris);
    (this.state.previousUri && pictureuris == "nothing here") ? pictureuris = [this.state.previousUri] : null;
    // console.log(pictureuris);
    // console.log(pictureuris[0].includes('googleusercontent'))
    // console.log(googleUser, googleUserBoolean, pictureuris);
    // (Array.isArray(pictureuris) && pictureuris.length == 1)
    var conditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (this.state.city) && (this.state.pass == this.state.pass2) && (this.state.pass.length >= 6);
    var passwordConditionMet = (this.state.pass == this.state.pass2) && (this.state.pass.length > 0);
    // var googleUserConditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1);
    var editProfileConditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country);
    
    
    if(pictureuris[0].includes('googleusercontent')) {
        googleUserBoolean = true
    }

    if(createProfileLoading) {
        return (
            <SafeAreaView style={styles.loadingIndicatorContainer}>
                <LoadingIndicator isVisible={createProfileLoading} color={treeGreen} type={'Wordpress'}/>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
        

            <View style={styles.headerRow}>
                <View style={{flex: 0.1, justifyContent: 'flex-start'}}>
                    <BackArrow 
                        onPress={() => NavigationService.goBack()}
                    />
                </View>
                <View style={{flex: 0.80, justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text style={{color: Colors.primary, fontWeight: "400", fontSize: 26}}>
                        {this.state.editProfileBoolean ? "Edit Profile" : "Sign Up" }
                    </Text>
                </View>
                <View style={{flex: 0.1, justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Info
                        onPress={() => this.setState({infoModalVisible: true}) } 
                    />
                    
                </View>    
            </View>

            <ScrollView style={styles.inputsRow} contentContainerStyle={{...Helpers.center, paddingBottom: this.state.keyboardShown ? height/5 : 0}}>
                <MultipleAddButton navToComponent={'CreateProfile'} pictureuris={pictureuris} />
            {
                Platform.OS == 'ios' ?
                    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80} enabled={this.state.keyboardShown ? true : false}>
                          
                        
                        {this.renderEditableInputFields(passwordConditionMet)}

                    
                    </KeyboardAvoidingView>
                :
                    <View>
                        
                        
                        {this.renderEditableInputFields(passwordConditionMet)}

                    </View>
            }
    
            {this.renderLocationSelectModal()}
    
            

            

            
            
        </ScrollView>

        
        <TouchableOpacity style={styles.signUpButtonContainer} disabled={this.state.editProfileBoolean ? editProfileConditionMet ? true: false : conditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
            <TouchableOpacity
                disabled = { this.state.editProfileBoolean ? editProfileConditionMet ? false : true : conditionMet ? false: true}
                style={styles.signUpButton}
                onPress={
                    () => {
                        
                        if(this.state.editProfileBoolean) {
                            this.editProfile(this.state, pictureuris[0], mime = 'image/jpg', this.state.uid);
                        }
                        else {
                            this.setModalVisible(true);
                        }
                    
                    }} 
            >
                <Text style={{...Fonts.style.medium, fontWeight: "400", color: '#fff'}}>{this.state.editProfileBoolean ? "Edit Profile" : "Create Account" }</Text>
            </TouchableOpacity>
        </TouchableOpacity>

        {/* Modal to show legal docs and agree to them before one can create Profile */}
        <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}
            >
            <View style={styles.modal}>
                
                <Text style={styles.modalHeader}>End-User License Agreement for F5</Text>
                <ScrollView contentContainerStyle={styles.licenseContainer}>
                    <Text>{EulaTop}</Text>
                    <Text style={{color: bobbyBlue}} onPress={() => Linking.openURL(EulaLink)}>{EulaLink}</Text>
                    <Text>{EulaBottom}</Text>
                </ScrollView>
                <View style={styles.documentOpenerContainer}>
                    <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, termsModalVisible: true})}}>
                        Terms & Conditions
                    </Text>
                    <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, privacyModalVisible: true})}}>
                        See Privacy Policy
                    </Text>
                </View>
                <View style={styles.decisionButtons}>
                    <TouchableOpacity
                        style={[styles.decisionButton, {backgroundColor: 'black'}]}
                        onPress={() => {this.setModalVisible(false); }} 
                    >
                        <Text style={new avenirNextText('#fff', 16, "500")}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.decisionButton, {backgroundColor: mantisGreen}]}
                        onPress={() => {
                            googleUser ? 
                            this.createProfileForGoogleOrFacebookUser(user, pictureuris == "nothing here" ? "" : pictureuris[0], 'google') 
                            : 
                                facebookUser ? 
                                    this.createProfileForGoogleOrFacebookUser(user, pictureuris[0], 'facebook') 
                                    : 
                                    this.createProfile(this.state.email, this.state.pass, pictureuris[0]) ;
                        }} 
                    >
                        <Text style={new avenirNextText('#fff', 16, "500")}>Accept</Text>
                    </TouchableOpacity>
                </View>
    
            </View>
            </Modal>
            
            {this.renderTermsModal()}
            {this.renderPrivacyModal()}
    
            
    
            {/* Modal to explicate details required to sign up */}
            <Dialog
            visible={this.state.infoModalVisible}
            dialogAnimation={new SlideAnimation({
            slideFrom: 'top',
            })}
            dialogTitle={<DialogTitle title="You forgot to fill in:" titleTextStyle={new avenirNextText('black', 22, "500")} />}
            actions={[ 
            <DialogButton
            text="OK"
            onPress={() => {
                this.setState({ infoModalVisible: false })
            }}
            textStyle={{color: 'black'}}
            />,
            ]}
            onTouchOutside={() => {
            this.setState({ infoModalVisible: false });
            }}
            >
            <DialogContent>
                <View style={{padding: 5,}}>
                
                { !this.state.email ? <TextForMissingDetail detail={'Email Address'} /> : null }
                { !passwordConditionMet ? <TextForMissingDetail detail={'Matching Passwords'} /> : null }
                { !this.state.firstName ? <TextForMissingDetail detail={'First Name'} /> : null }
                { !this.state.lastName ? <TextForMissingDetail detail={'Last Name'} /> : null }
                { !this.state.city ? <TextForMissingDetail detail={'City'} /> : null }
                
                
                
                </View>
            </DialogContent>
            </Dialog>
        
        
        </SafeAreaView>
        )
      
    

  }
}

export default CreateProfile;

const styles = StyleSheet.create({

    loadingIndicatorContainer: {
        flex: 1, 
        // height: "100%",
        // width: "100%",
        // left: 0,
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: bgBlack
    },

    mainContainer: {
        flex: 1,
        backgroundColor: Colors.primary,
        // height: '100%',
        // justifyContent: 'space-around',
        // left: 0,
        // position: 'absolute',
        // top: 0,
        // width: '100%'
    },
    // mainContainer: {
    //     marginTop: 22,
    //     // borderTopWidth: 1,
    //     // borderTopColor: treeGreen,
    //     paddingTop: 5,
    // },
    container: {
        
        // flexGrow: 1, 
        // flexDirection: 'column',
        // justifyContent: 'center',
        // // paddingBottom: 30,
        // //alignItems: 'center'
        // // marginTop: 20,
        // paddingLeft: 10,
        // paddingRight: 10,

        

    },

    headerRow: {
        flex: 0.1,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: Colors.secondary,
        // margin: 5,
        paddingVertical: 5, paddingHorizontal: 10,
    },

    pictureRow: {
        // flex: 0.35,
        ...Helpers.center,
        margin: 5,
        // marginBottom: 10,
    },

    inputsRow: {
        flex: 0.7,
        flexGrow: 1,
        marginTop: 10,
    },

    inputContainer: {
        marginVertical: 7,
        marginHorizontal: 5,
        // padding: 10,
        // justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    
    //   placeholderContainer: {
    //     position: 'absolute', flex: 1, justifyContent: 'flex-start', alignItems: 'center'
    //   },
    
    input: {
      height: 38, borderRadius: 4, backgroundColor: '#fff', 
      padding: 10, 
      // justifyContent: 'center', alignItems: 'flex-start',
      ...new shadow(2,2, color = mantisGreen, -1, 1)
    },
    
    inputText: { fontFamily: 'Avenir Next', fontSize: 16, fontWeight: "500", color: "#fff"},

    signUpButtonContainer: {flex: 0.2,justifyContent: 'center', alignItems: 'center', marginBottom: 4},

    signUpButton: {
        width: "70%",
        height: 40,
        borderRadius: 20,
        ...Helpers.center,
        backgroundColor: Colors.secondary,
        // width: 175,
        // height: 60,
        // borderRadius: 10,
        // backgroundColor: "#fff",
        // justifyContent: 'center', alignItems: 'center',
        // ...new shadow(4,1,darkGreen, 0,4)
    },

    headerBar: {
        flex: 0.07,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: logoGreen
    },

    locationSelectBody: {
        flex: 0.93,
        margin: 5
        // paddingVertical: 5,
        // paddingHorizontal: 10
    },

    specificLocationContainer: {margin: 5, justifyContent: 'center', alignItems: 'center'},

    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, marginTop: 22},
    modalHeader: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Iowan Old Style',
        fontWeight: "bold"
    },
    acceptText: {
        fontSize: 20,
        color: 'blue'
    },
    rejectText: {
        fontSize: 20,
        color: 'red'
    },
    hideModal: {
      fontSize: 20,
      color: 'green',
      fontWeight:'bold'
    },
    licenseContainer: {
        flexGrow: 0.8, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    documentOpenerContainer: {
        height: 100,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 15,
        alignItems: 'center'
    },
    documentOpener: {
        color: limeGreen,
        fontSize: 25,
        fontFamily: 'Times New Roman'
    },
    decisionButtons: {
        width: width - 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    decisionButton: {
        width: 70,
        height: 40,
        borderRadius: 10,
        ...new center(),
        ...new shadow(2,2,'black', -1,1)
    },

    gotIt: {
        fontWeight: "bold",
        color: limeGreen,
        fontSize: 20
    },

    passwordStatusRow: {
        flexDirection: 'row',
        // width: width - 30,
        height: 35,
        marginVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    passwordStatusText: {
        fontSize: 20,
        fontWeight: "300",
        fontFamily: "Avenir Next"
    },

    buttonGroupText: {
        fontFamily: 'Iowan Old Style',
        fontSize: 17,
        fontWeight: '300',
    },

    buttonGroupSelectedText: {
        color: 'black'
    },

    buttonGroupContainer: {
        height: 40,
        backgroundColor: Colors.grey,
        marginBottom: 10,
    },
    
    buttonGroupSelectedContainer: {
        backgroundColor: limeGreen
    },

    info: {
        fontFamily: 'Iowan Old Style',
        fontSize: 15,
        textAlign: 'auto',
        letterSpacing: 1.5
    }
})

{/* <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
                <Button  
                    buttonStyle={ {
                        backgroundColor: 'black',
                        // width: width/3 +20,
                        // height: height/15,
                        borderRadius: 5,
                    }}
                    icon={{name: 'chevron-left', type: 'material-community'}}
                    title='Back'
                    onPress={() => this.props.navigation.goBack() } 
                />
                <Button  
                    buttonStyle={ {
                        backgroundColor: treeGreen,
                        // width: width/3 +20,
                        // height: height/15,
                        borderRadius: 5,
                    }}
                    icon={{name: 'help', type: 'material-community'}}
                    title='Help'
                    onPress={() => this.setState({infoModalVisible: true}) } 
                />
            </View> */}

// if(googleUserBoolean) {
//     return (
//         <ScrollView style={styles.mainContainer} contentContainerStyle={styles.container}>
//           <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
//               <Button  
//                   buttonStyle={ {
//                       backgroundColor: 'black',
//                       // width: width/3 +20,
//                       // height: height/15,
//                       borderRadius: 5,
//                   }}
//                   icon={{name: 'chevron-left', type: 'material-community'}}
//                   title='Back'
//                   onPress={() => this.props.navigation.navigate('SignIn') } 
//               />
//               <Button  
//                   buttonStyle={ {
//                       backgroundColor: treeGreen,
//                       // width: width/3 +20,
//                       // height: height/15,
//                       borderRadius: 5,
//                   }}
//                   icon={{name: 'help', type: 'material-community'}}
//                   title='Help'
//                   onPress={() => this.setState({infoModalVisible: true}) } 
//               />
//           </View>
//           <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center'}}>Choose Profile Picture:</Text>
          
//           <MultipleAddButton navToComponent = {'CreateProfile'} pictureuris={pictureuris} />
  
//           <Sae
//                 style={styles.nameInput}
//                 label={'First Name'}
//                 iconClass={Icon}
//                 iconName={'account'}
//                 iconColor={'black'}
//                 value={this.state.firstName}
//                 onChangeText={firstName => this.setState({ firstName })}
//                 autoCorrect={false}
//                 inputStyle={{ color: 'black' }}
//           />

//           <Sae
//                 style={styles.nameInput}
//                 label={'Last Name'}
//                 iconClass={FontAwesomeIcon}
//                 iconName={'users'}
//                 iconColor={'black'}
//                 value={this.state.lastName}
//                 onChangeText={lastName => this.setState({ lastName })}
//                 autoCorrect={false}
//                 inputStyle={{ color: 'black' }}
//            />
          
//           <Sae
//               label={'City, Country Abbreviation'}
//               iconClass={FontAwesomeIcon}
//               iconName={'globe'}
//               iconColor={highlightGreen}
//               value={this.state.country}
//               onChangeText={country => this.setState({ country })}
//               autoCorrect={false}
//               inputStyle={{ color: highlightGreen }}
//           />
  
//           <Sae
//               label={'@instagram_handle'}
//               iconClass={FontAwesomeIcon}
//               iconName={'instagram'}
//               iconColor={profoundPink}
//               value={this.state.insta}
//               onChangeText={insta => this.setState({ insta })}
//               autoCorrect={false}
//               inputStyle={{ color: profoundPink }}
//           />
  
          
//           <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center', marginTop: 10}}>What size clothes do you wear?</Text>
//           <ButtonGroup
//               onPress={ (index) => {this.setState({size: index})}}
//               selectedIndex={this.state.size}
//               buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
//               containerStyle={styles.buttonGroupContainer}
//               buttonStyle={styles.buttonGroup}
//               textStyle={styles.buttonGroupText}
//               selectedTextStyle={styles.buttonGroupSelectedText}
//               selectedButtonStyle={styles.buttonGroupSelectedContainer}
//           />
  
//           {/* Modal to show legal docs and agree to them before one can create Profile */}
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={this.state.modalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//             <View style={styles.modal}>
              
//               <Text style={styles.modalHeader}>End-User License Agreement for F5</Text>
//               <ScrollView contentContainerStyle={styles.licenseContainer}>
//                   <Text style={{fontFamily: 'Avenir Next'}}>{EulaTop}</Text>
//                   <Text style={{color: bobbyBlue}} onPress={() => Linking.openURL(EulaLink)}>{EulaLink}</Text>
//                   <Text style={{fontFamily: 'Avenir Next'}}>{EulaBottom}</Text>
//               </ScrollView>
//               <View style={styles.documentOpenerContainer}>
//                   <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, termsModalVisible: true})}}>
//                       Terms & Conditions
//                   </Text>
//                   <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, privacyModalVisible: true})}}>
//                       See Privacy Policy
//                   </Text>
//               </View>
//               <View style={styles.decisionButtons}>
//                   <Button
//                       title='Reject' 
//                       titleStyle={{ fontWeight: "300" }}
//                       buttonStyle={{
//                       backgroundColor: rejectRed,
//                       //#2ac40f
//                       width: (width)*0.40,
//                       height: 45,
//                       borderColor: "#226b13",
//                       borderWidth: 0,
//                       borderRadius: 10,
//                       }}
//                       containerStyle={{ marginTop: 0, marginBottom: 0 }}
//                       onPress={() => {this.setModalVisible(false); }} 
//                   />
//                   <Button
//                       title='Accept' 
//                       titleStyle={{ fontWeight: "300" }}
//                       buttonStyle={{
//                       backgroundColor: confirmBlue,
//                       //#2ac40f
//                       width: (width)*0.40,
//                       height: 45,
//                       borderColor: "#226b13",
//                       borderWidth: 0,
//                       borderRadius: 10,
//                       }}
//                       containerStyle={{ marginTop: 0, marginBottom: 0 }}
//                       onPress={() => {console.log('Sign Up Initiated'); googleUser ? this.createProfileForGoogleUser(user, pictureuris[0]) : this.createProfile(this.state.email, this.state.pass, pictureuris[0]) ;}} 
//                   />
//               </View>
  
//             </View>
//           </Modal>
  
//           {/* Modal to show Terms and Conditions */}
//           <Modal
//             animationType="fade"
//             transparent={false}
//             visible={this.state.termsModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <Text style={styles.modalHeader}>Terms & Conditions of Use</Text>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text>{TsAndCs}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({modalVisible: true, termsModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
  
//           {/* Modal to show Privacy Policy */}
//           <Modal
//             animationType="fade"
//             transparent={false}
//             visible={this.state.privacyModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <Text style={styles.modalHeader}>Privacy Policy of F5</Text>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text>{PrivacyPolicy}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
  
//           {/* Modal to explicate details required to sign up */}
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={this.state.infoModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text style={styles.info}>{info}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({infoModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
          
//           <TouchableOpacity disabled = {googleUserConditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
//               <Button
//                   disabled = {googleUserConditionMet ? false: true}
//                   large
//                   buttonStyle={{
//                       backgroundColor: treeGreen,
//                       width: width - 50,
//                       height: 85,
//                       borderColor: "transparent",
//                       borderWidth: 0,
//                       borderRadius: 5
//                   }}
//                   icon={{name: 'save', type: 'font-awesome'}}
//                   title='SAVE'
//                   onPress={
//                       () => {
//                       this.setModalVisible(true);
//                       }} 
//               />
//           </TouchableOpacity>
          
//         </ScrollView>
//       )

// }

