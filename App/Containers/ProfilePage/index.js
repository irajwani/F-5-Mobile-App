import React, { Component } from 'react'
import { AsyncStorage, Dimensions, StyleSheet } from 'react-native'

import firebase from 'react-native-firebase';

import Profile from '../../components/Profile.js';
const {width} = Dimensions.get('window');


class ProfilePage extends Component {

  static navigationOptions = {
    header: null
    // headerTitle: 'ProfileMyStyle',
    // headerStyle: {
    //   backgroundColor: 'red',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   fontFamily: 'Verdana'
    // },
  };

  constructor(props) {
    super(props);
    // this.gradientColors = {
    //   0: ['#7de853','#0baa26', '#064711'],
    //   1: ['#7de853','#0baa26', '#064711'],
    //   2: ['#7de853','#0baa26', '#064711'],
    //   3: ['#7de853','#0baa26', '#064711'],
    // }
    this.state = {
      profileData: false,
      // name: '',
      // email: '',
      // insta: '',
      // uri: '',
      // numberProducts: 0,
      // soldProducts: 0,
      // sellItem: false,
      // products: [],
      isGetting: true,
      noComments: false,
      // gradient: this.gradientColors[0],
      isMenuActive: false,
    //   backgroundColor: yellowGreen,

    }

    this.uid = firebase.auth().currentUser.uid;

  }

  async componentWillMount() {
    this.timerId = setTimeout(() => {
      this.getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(this.uid);
    }, 200);
    
  }

  componentWillUnmount = () => {
    clearTimeout(this.timerId)
  }

  updatePushToken = async (uid, token) => {
    var updates = {};
    updates[`/Users/${uid}/pushToken`] = token;
    firebase.database().ref().update(updates);
  }

  handlePushToken = async () => {
    var token = await AsyncStorage.getItem('fcmToken');
    if(token) {
      if(currentUser.pushToken == undefined || currentUser.pushToken != token) {
        this.updatePushToken(this.uid, token);
      }
    }
  }

  updateUsername = (username) => {
    var updates = {};
    updates[`/Users/${uid}/profile/username/`] = username;
    firebase.database().ref().update(updates);
  }

  getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(your_uid) {
    console.log(your_uid);
    const keys = [];
    //read the value of refreshed cloud db so a user may seamlessly transition from registration to profile page
    firebase.database().ref('/Users/' + your_uid + '/').on("value", async (snapshot) => {
      let currentUser = snapshot.val();
      // var d = snapshot.val();
      // let currentUser = d.Users[your_uid];
      // console.log(d.val(), d.Users, your_uid);

      //In the scenario where this is the person's first time logging in, update token in the cloud
      //Freer condition for now to update push token based on if whether FCM token is absent in cloud or if there is a new token (device),
      //to send notifs too
      var token = await AsyncStorage.getItem('fcmToken');
      if(token) {
        if(currentUser.pushToken == undefined || currentUser.pushToken != token) {
          this.updatePushToken(your_uid, token);
        }
      }
      
      
      var profileData = currentUser.profile

      var comments;
      if(currentUser.comments) {
        comments = currentUser.comments;
        this.setState({ profileData, comments, isGetting: false })
        // this.setState({comments})
      }
      else {
        this.setState({ profileData, noComments: true, isGetting: false })
      }
      
      
      
    })
    
    
  }

  navToSettings = () => {this.props.navigation.navigate('Settings')}

  logOut = () => {
    firebase.auth().signOut().then(() => {
      // var statusUpdate = {};
      // statusUpdate['Users/' + this.uid + '/status/'] = "offline";
      // await firebase.database().ref().update(statusUpdate);
      this.props.navigation.navigate('SignIn');
    })
  }


  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navToEditProfile = () => {
    this.props.navigation.navigate('CreateProfile', {editProfileBoolean: true})
  }

  toggleMenu = () => {
    this.setState({isMenuActive: !this.state.isMenuActive})
  }

  navToYourProducts = () => {this.props.navigation.navigate('YourProducts')}

  navToSoldProducts = () => {this.props.navigation.navigate('SoldProducts')}

  render() {
    var {isGetting, comments, noComments, profileData, isMenuActive} = this.state;
   
    return (
      <Profile
        currentUser={true}
        uid={this.uid}
        showAddListing={true}
        navToAddListing={()=>this.props.navigation.navigate('Sell')}
        profileData={profileData}
        isGetting={isGetting}
        navToSettings={this.navToSettings}
        
        logOut={this.logOut}
        navToEditProfile={this.navToEditProfile}
        navToYourProducts={this.navToYourProducts}
        navToSoldProducts={this.navToSoldProducts}
        noComments={noComments}
        comments={comments}
        navToOtherUserProfilePage={this.navToOtherUserProfilePage}
      />
    )


  }

}

export default ProfilePage;