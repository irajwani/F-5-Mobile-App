import React, { Component } from 'react'


import email from 'react-native-email'

import firebase from 'react-native-firebase';


import {removeFalsyValuesFrom} from '../../../localFunctions/arrayFunctions.js'

import Profile from '../../../components/Profile.js';

class OtherUserProfilePage extends Component {

  static navigationOptions = {
    header: null
    
  };

  constructor(props) {
    super(props);
    
    this.state = {
      profileData: false,
      numberProducts: 0,
      soldProducts: 0,
      sellItem: false,
      products: [],
      showBlockOrReportModal: false,
      report: '',
      showReportUserModal: false,
      isGetting: true,
      uid: firebase.auth().currentUser.uid,
      comments: false,
      noComments: false,

    }

  }

  componentDidMount() {
    let otherUserUid = this.props.navigation.state.params.uid;
    this.timeoutId = setTimeout(() => {
      this.loadRelevantData(this.state.uid, otherUserUid);
      this.loadReviews(otherUserUid);  
      this.timerId = setInterval(() => {
        this.loadReviews(otherUserUid);  
      }, 20000);
    }, 1);
      
  }

  componentWillUnmount() {
   clearTimeout(this.timeoutId);
   clearInterval(this.timerId); 
  }

  loadRelevantData = (yourUid, otherUserUid) => {
    this.setState({isGetting: true});
    firebase.database().ref('/Users/').on('value', (snap) => {
      var d = snap.val();

      let yourProfile = d[yourUid].profile;

      var rawUsersBlocked = d[yourUid].usersBlocked ? d[yourUid].usersBlocked : {};
      var yourUsersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
      // console.log(yourUsersBlocked);

      let profileData = d[otherUserUid].profile;
      

      this.setState({yourProfile, usersBlocked: yourUsersBlocked, yourUid: yourUid, otherUserUid: otherUserUid, profileData, isGetting: false})
    })
  }

  loadReviews = (otherUserUid) => {
    // this.setState({isGetting: true});
    firebase.database().ref(`/Users/${otherUserUid}/`).on('value', (snap) => { 
      var d = snap.val();
      var comments = false;
      if(d.comments) {
        comments = d.comments;
        this.setState({comments});
      }
      else {
        this.setState({noComments: true});
      }
      //Removed hard code this.state.comments to unhelpful object with one property
      
    })

  }

  blockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = true;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may no longer converse with you by choosing to purchase your products on the Market.\nGo Back.");
    // this.setState({showBlockOrReportModal: false});
  }

  unblockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = false;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may now attempt to purchase your products from the market.\nGo back.");
    // this.setState({showBlockOrReportModal: false});
  }

  reportUser = () => {
    this.setState({showBlockOrReportModal: false, showReportUserModal: true});
  }

  handleReportTextChange = (report) => this.setState({report})

  sendReport = (uid, report) => {
    const recipients = ['imadrajwani@gmail.com'] // string or array of email addresses
    email(recipients, {
        // Optional additional arguments
        //cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
        //bcc: 'mee@mee.com', // string or array of email addresses
        subject: `Report regarding User: ${uid}` ,
        body: report
    })
    .catch(console.error)
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navigateTo = (screen) => {
    this.props.navigation.navigate(screen, {otherUser: this.state.otherUserUid });
  }

  navToOtherUserProducts = () => this.navigateTo('OtherUserProducts')

  navToOtherUserSoldProducts = () => this.navigateTo('OtherUserSoldProducts')



  navToUserComments = () => {
    // const {params} = this.props.navigation.state;
    const {otherUserUid, comments, profileData, yourProfile} = this.state;
    this.props.navigation.navigate('UserComments', {yourProfile: yourProfile, theirProfile: profileData, comments: comments['a'] ? false : comments, uid: otherUserUid})
  }

  render() {

    var {report, profileData, usersBlocked, noComments, comments, yourUid, otherUserUid, isGetting} = this.state;

    return (
      <Profile
        currentUser={false}
        isGetting={isGetting}
        profileData={profileData}
        showAddListing={false}
        navBack={() => this.props.navigation.goBack()}

        navToOtherUserProducts={this.navToOtherUserProducts}
        navToOtherUserSoldProducts={this.navToOtherUserSoldProducts}

        usersBlocked={usersBlocked}
        otherUserUid={otherUserUid}
        blockUser={this.blockUser}
        unblockUser={this.unblockUser}

        handleReportTextChange={this.handleReportTextChange}
        report={report}
        sendReport={this.sendReport}

        noComments={noComments}
        comments={comments}
        navToUserComments={this.navToUserComments}
        navToOtherUserProfilePage={this.navToOtherUserProfilePage}
      />
    )


  }

}

export default OtherUserProfilePage;