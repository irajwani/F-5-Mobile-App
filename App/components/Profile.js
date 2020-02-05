import React, { Component } from 'react'
import { Keyboard, Platform, Dimensions, Animated, Modal, Text, TextInput, StyleSheet, ImageBackground, View, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, FlatList } from 'react-native'


import Svg, { Path } from 'react-native-svg';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import firebase from 'react-native-firebase';

import Dialog, { DialogTitle, DialogButton, SlideAnimation } from 'react-native-popup-dialog';


import { highlightGreen,lightGreen, silver } from '../colors.js';
import { LoadingIndicator } from '../localFunctions/visualFunctions.js';
import ProgressiveImage from './ProgressiveImage';
import { stampShadow } from '../StyleSheets/shadowStyles';
import {  Images, Fonts, Colors, Helpers } from '../Theme';
import randomUsernameString from '../fashion/randomUsernameString.js';
const {width} = Dimensions.get('window');

const iconSize = 35;

const randomUsername = new randomUsernameString();

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

const DismissKeyboardView = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
  </TouchableWithoutFeedback>
)

const ButtonContainer = ({children, text, onPress}) => (
  <TouchableOpacity onPress={() => onPress()} style={{flexDirection: 'row', flex: 0.5, justifyContent: 'flex-start', alignItems: 'center', margin: 8}}>
    {children}
    <View style={styles.buttonTextContainer}>
      <Text style={{color: '#fff', ...Fonts.medium, fontWeight: "300"}}>{text}</Text>
    </View>
  </TouchableOpacity>
)

const minutiaContainer = {marginHorizontal: 2, justifyContent: 'center', alignItems: 'center'};

const ProfileMinutia = ({icon, text}) => (
  <View style={{flexDirection: 'row', margin: 0}}>
    <View style={minutiaContainer}>
      <Icon name={icon} size={20} color={'black'}/>
    </View>
    <View style={minutiaContainer}>
      <Text style={[ {fontSize: 14, color: 'black'}]}>{text}</Text>
    </View>
  </View>

)

const SaleGraphic = () => (
  <Svg height={"60%"} width={"60%"} fill={'#fff'} viewBox="0 0 47.023 47.023">
      <Path d="M45.405,25.804L21.185,1.61c-1.069-1.067-2.539-1.639-4.048-1.603L4.414,0.334C2.162,0.39,0.349,2.205,0.296,4.455
L0.001,17.162c-0.037,1.51,0.558,2.958,1.627,4.026L25.848,45.38c2.156,2.154,5.646,2.197,7.8,0.042l11.761-11.774
C47.563,31.494,47.561,27.958,45.405,25.804z M8.646,14.811c-1.695-1.692-1.696-4.435-0.005-6.13
c1.692-1.693,4.437-1.693,6.13-0.003c1.693,1.692,1.694,4.437,0.003,6.129C13.082,16.501,10.338,16.501,8.646,14.811z
M16.824,22.216c-0.603-0.596-1.043-1.339-1.177-1.797l1.216-0.747c0.157,0.48,0.488,1.132,0.997,1.634
c0.548,0.541,1.061,0.6,1.403,0.256c0.324-0.329,0.26-0.764-0.152-1.618c-0.575-1.17-0.667-2.219,0.091-2.987
c0.888-0.9,2.32-0.848,3.565,0.38c0.594,0.588,0.908,1.146,1.083,1.596l-1.216,0.701c-0.111-0.309-0.34-0.831-0.857-1.341
c-0.518-0.51-0.999-0.522-1.269-0.247c-0.333,0.336-0.182,0.778,0.246,1.708c0.59,1.265,0.549,2.183-0.183,2.928
C19.696,23.566,18.272,23.645,16.824,22.216z M22.596,27.758l0.929-1.756l-1.512-1.493l-1.711,0.985l-1.238-1.223l6.82-3.686
l1.566,1.547l-3.572,6.891L22.596,27.758z M24.197,29.337l5.207-5.277l1.2,1.183l-4.221,4.273l2.099,2.072l-0.989,1.002
L24.197,29.337z M35.307,31.818l-2.059-2.032l-1.083,1.096l1.942,1.917l-0.959,0.972l-1.941-1.917l-1.235,1.251l2.168,2.142
l-0.965,0.979l-3.366-3.322l5.209-5.276l3.255,3.215L35.307,31.818z" stroke="#fff" strokeWidth="0.8"/>
      <Path d="M23.068,23.788l1.166,1.151l1.499-2.741C25.347,22.434,23.068,23.788,23.068,23.788z" stroke="#fff" strokeWidth="0.8"/>
  </Svg>
)

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProductImages: this.props.showAddListing ? ['add listing'] : [],
            isMenuActive: false,
            isOptionModalActive: false,
            isReportModalActive: false,

            isDrawerActive: false,
            drawerHeight: new Animated.Value(0),
        }
    }

    componentWillMount = async () => {
      await this.fetchProductImages(this.props.currentUser ? this.props.uid : this.props.otherUserUid);
    }

    fetchProductImages = (uid) => {
      firebase.database().ref('/Users/' + uid + '/').on("value", async (snapshot) => {
        let currentUser = snapshot.val();
        
        if(currentUser.products != undefined) {
          let {...state} = this.state;
          let Products = Object.values(currentUser.products)
          let ProductImages = Products.map(product => {
            return product.uris.pd[0]
          })
          // state.ProductImages.concat(ProductImages);
          console.log(ProductImages);
          
          this.setState({ProductImages: [...ProductImages,...state.ProductImages]})
        }

        
      })
    }

    toggleMenu = () => {
        this.setState({isMenuActive: !this.state.isMenuActive})
    }

    toggleOptionModal = () => {
      this.setState({isOptionModalActive: !this.state.isOptionModalActive})
    }

    toggleReportModal = () => {
      this.setState({isReportModalActive: !this.state.isReportModalActive})
    }

    nextModal = () => {
      this.setState({isOptionModalActive: false, isReportModalActive: true});
    }

    renderExitModal = (logOut) => (
        <Dialog
          visible={this.state.isMenuActive}
          dialogAnimation={new SlideAnimation({
          slideFrom: 'top',
          })}
          dialogTitle={<DialogTitle title="Do you want to log out?" titleTextStyle={{...Fonts.style.medium}} />}
          actions={[ 
          <DialogButton
          text="NO"
          style={{backgroundColor: Colors.lightgrey}}
          textStyle={{color: 'black'}}
          onPress={this.toggleMenu}
          />,
          <DialogButton
          text="YES"
          textStyle={{color: 'black'}}
          onPress={() => {
            this.toggleMenu();
            logOut();
            }}
          />,
          ]}
          onTouchOutside={this.toggleMenu}
          >
        </Dialog>
    )

    renderOptionModal = (usersBlocked, otherUserUid, blockUser, unblockUser) => (
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isOptionModalActive}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
          <View style={[styles.modal, {marginTop: Platform.OS == "ios" ? 22 : 0}]}>
            <Text style={styles.modalHeader}>Block or Report This User</Text>
            <Text style={styles.modalText}>If you block this user, then they cannot initiate a chat with you regarding one of your products.</Text>
            <Text style={styles.modalText}>This will delete all chats you have with this individual, so if you decide to unblock this user later, they will have to initiate new chats with you.</Text>
            <Text style={styles.modalText}>If you believe this user has breached the Terms and Conditions for usage of NottMyStyle (for example, through proliferation of malicious content, or improper language), then please explain this to the NottMyStyle Team through email by selecting Report User.</Text>
            <View style={styles.documentOpenerContainer}>
                {usersBlocked.includes(otherUserUid) ?
                    <Text style={styles.blockUser} 
                    onPress={() => {
                      unblockUser(otherUserUid); 
                      //this.setState({showBlockOrReportModal: false});
                      }}>
                        Unblock User
                    </Text>
                :
                    <Text style={styles.blockUser} 
                    onPress={() => {
                      blockUser(otherUserUid);
                      //this.setState({showBlockOrReportModal: false});
                      }}>
                        Block User
                    </Text>
                }
                
                <Text style={styles.reportUser} onPress={this.nextModal}>
                    Report User
                </Text>
            </View>
            <TouchableHighlight
              onPress={this.toggleOptionModal}
            >
              <Text style={styles.hideModal}>Back</Text>
            </TouchableHighlight>
          </View>
       </Modal>
    )

    renderReportModal = (report, handleReportTextChange, sendReport, otherUserUid) => (
       <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isReportModalActive}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
        <DismissKeyboardView>
            <View style={styles.reportModal}>
                <Text style={styles.reportModalHeader}>Please Explain What You Wish To Report About This User</Text>
                <TextInput
                    style={styles.reportInput}
                    onChangeText={handleReportTextChange}
                    value={report}
                    multiline={true}
                    numberOfLines={4}
                    underlineColorAndroid={"transparent"}
                />
                <TouchableOpacity
                    style={{
                    backgroundColor: highlightGreen,
                    //#2ac40f
                    width: (width)*0.40,
                    height: 40,
                    borderColor: "#226b13",
                    borderWidth: 0,
                    borderRadius: 20,
                    ...Helpers.center,
                    }}
                    onPress={() => sendReport(otherUserUid, report)} 
                >
                    <Text>Send</Text>
                </TouchableOpacity>
                
                <TouchableHighlight
                    onPress={this.toggleReportModal}>
                    <Text style={styles.hideModal}>Back</Text>
                </TouchableHighlight>
            </View>
          </DismissKeyboardView>
        </Modal> 
    )

    toggleDrawer = () => {
      
      this.setState({isDrawerActive: !this.state.isDrawerActive}, () => {
        // Animated.
        Animated.spring(
          this.state.drawerHeight,
          {
            duration: 300,
            toValue: this.state.isDrawerActive ? 300 : 0,
            friction: 10
          }
        )
        .start();
      })
      
    }

    renderReviewsModal = (currentUser, noComments, comments, navToUserComments, navToOtherUserProfilePage) => (
      <Animated.View style={styles.footerContainer}>

        <TouchableOpacity onPress={this.toggleDrawer}>
          <View style={styles.pillContainer}>
              <View style={styles.pill}/>
          </View>

          <View style={[styles.reviewsHeaderContainer, { justifyContent: !currentUser? 'space-between' : 'center', }]}>
          
              <Text style={styles.reviewsHeader}>REVIEWS</Text>
              {!currentUser && 
              <FontAwesomeIcon 
                name="edit" 
                // style={styles.users}
                size={35} 
                color={'black'}
                onPress={navToUserComments}
              /> 
              }
            
          </View>

        </TouchableOpacity>

        
        {this.renderReviews(noComments, comments, navToOtherUserProfilePage)}
        

        
      </Animated.View>
    )

    renderReviews = (noComments, comments, navToOtherUserProfilePage) => (
      
        
      <Animated.ScrollView style={[styles.reviewsContainer, {
        height: this.state.drawerHeight,
        // height: this.state.drawerHeight.interpolate({inputRange: [0, 10],outputRange: [0, 10]})
        }]}
      >
            
            
            {noComments ? null : Object.keys(comments).map(
                    (comment) => (
                    <View key={comment} style={styles.commentContainer}>
  
                        <View style={styles.commentPicAndTextRow}>
  
                          {comments[comment].uri ?
                          <TouchableOpacity
                          onPress={() => navToOtherUserProfilePage(comments[comment].uid)}
                          style={styles.commentPic}
                          >
                            <ProgressiveImage 
                              style= {styles.commentPic} 
                              thumbnailSource={Images.smallProfile}
                              source={ {uri: comments[comment].uri} }
                            />
                          </TouchableOpacity>                          
                          :
                            <Image style= {styles.commentPic} source={ Images.smallProfile }/>
                          }
                            
                          <TouchableOpacity onPress={() => navToOtherUserProfilePage(comments[comment].uid)} style={styles.textContainer}>
                              <Text style={ styles.commentName }> {comments[comment].name} </Text>
                              <Text style={styles.comment}> {comments[comment].text}  </Text>
                          </TouchableOpacity>
  
                        </View>
  
                        <View style={styles.commentTimeRow}>
  
                          <Text style={ styles.commentTime }> {comments[comment].time} </Text>
  
                        </View>
  
                        
  
                        
                        
                    </View>
                    
                )
                        
                )}
            
          
        </Animated.ScrollView>
        
    )

    render() {
        if(this.props.currentUser) {
          var {
            // PP
            currentUser,
            uid,
            profileData,
            isGetting, 

            navToSettings,

            logOut,

            navToEditProfile,
            navToYourProducts,
            navToSoldProducts,

            noComments,
            comments,
            navToOtherUserProfilePage,
          } = this.props;
        }
        else {
          var {
            currentUser,
            profileData,
            isGetting,
            /////// OUPP
            navBack,

            navToOtherUserProducts,
            navToOtherUserSoldProducts,

            navToUserComments,

            otherUserUid,
            usersBlocked,
            blockUser,
            unblockUser,

            report,
            handleReportTextChange,
            sendReport,
            noComments,
            comments,
            navToOtherUserProfilePage,

          } = this.props;
        }

        var {uri, name, username, country, insta} = profileData;
        var {ProductImages} = this.state;
        ProductImages = ProductImages.filter(onlyUnique)
        console.log(this.state.ProductImages)
        
        if(isGetting){
            return(
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}>
                <LoadingIndicator isVisible={isGetting} color={lightGreen} type={'Wordpress'}/>
              </View>
            )
          }
       
      
          return (
            <SafeAreaView style={styles.mainContainer}>
            
      
              <ImageBackground source={Images.profileBackground} style={styles.linearGradient}>
                
                {/* <View style={[styles.oval, {backgroundColor: this.props.navigation.getParam('backgroundColor', this.state.backgroundColor)}]}/> */}
                
                  
                  {/* Top Icons */}
      
                  <View style={styles.iconRow}>
                    
                    {currentUser ? 
                    <Icon 
                      name="settings" 
                      size={iconSize} 
                      color={'black'}
                      onPress={navToSettings}
                    />
                    :
                    <Icon 
                      name="arrow-left"   
                      size={iconSize - 5} 
                      color={'black'}
                      onPress={navBack}
                    />    
                    }
      
                    {currentUser ?
                    <TouchableOpacity onPress={this.toggleMenu}>
                      <Image style={{width: iconSize, height: iconSize}} source={Images.logout}/>
                    </TouchableOpacity>
                    :
                    <Icon 
                      name="account-alert"      
                      size={iconSize} 
                      color={'#020002'}
                      onPress={this.toggleReportModal}
                    />
                    }
                
                    
                      
                    
                  </View>  
      
                  {/* Profile pic, name etc. */}
      
                  <View style={styles.profileRow}>
                    {uri ?
                    <TouchableOpacity style={{...stampShadow}} onPress={currentUser ? navToEditProfile : null}>
                      <ProgressiveImage 
                      style= {styles.profilepic} 
                      thumbnailSource={ Images.smallProfile }
                      source={ {uri: uri} }
                      
                      />
                    </TouchableOpacity> 
                      : 
                      <Image style= {styles.profilepic} source={Images.smallProfile}/>
                    }
                    
                    <View style={{alignItems: 'center'}}>
                      <Text style={[styles.name, {textAlign: 'center'}]}>{username ? username : randomUsername}</Text>
        
                      <ProfileMinutia icon={'city'} text={country} />
        
                      {insta ? <ProfileMinutia icon={'instagram'} text={`@${insta}`} /> : null}
                    </View>
      
                    
                  </View>  
      
                  
                  <View style={styles.labelRow}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>On Sale</Text>
                    </View>

                  </View> 
      
            
            </ImageBackground>

            
            <View style={styles.productsContainer}>

                

              <FlatList
                style={styles.productScrollContainer}
                contentContainerStyle={styles.productScrollContentContainer}
                horizontal={true}
                data={ProductImages}
                renderItem={(item, index) => (
                  (this.props.showAddListing && item.item == 'add listing') ?
                    <TouchableOpacity key={index} style={[styles.productImage, styles.addListing]} onPress={this.props.navToAddListing}>
                      <Icon 
                        name={'plus'} size={70} color={'black'}
                      />
                    </TouchableOpacity>
                      :
                    <TouchableOpacity key={index} onPress={currentUser ? navToYourProducts : navToOtherUserProducts}>
                      <ProgressiveImage 
                      source={{uri: item.item}} 
                      style={styles.productImage}
                      thumbnailSource={ Images.smallProfile }
                      />
                    </TouchableOpacity>
                  )}
                // keyExtractor={item => item.key}
              />

            </View>
            
            {this.renderReviewsModal(currentUser, noComments, comments, navToUserComments, navToOtherUserProfilePage)}
            {/* {this.renderReviews(currentUser, noComments, comments, navToUserComments, navToOtherUserProfilePage)} */}
      
                  
            
                              
            {currentUser && this.renderExitModal(logOut)}
            {currentUser ? null : this.renderOptionModal(usersBlocked, otherUserUid, blockUser, unblockUser)}
            {currentUser ? null : this.renderReportModal(report, handleReportTextChange, sendReport, otherUserUid)}

            </SafeAreaView>
            
      
      
          )
    }
}

const styles = StyleSheet.create({
  
    halfPageScrollContainer: {
      flex: 1,
      width: width,
      backgroundColor: "#fff",
      
    },
    halfPageScroll: {
      backgroundColor: "#fff",
      // justifyContent: 'center',

      // alignItems: 'center',
      paddingTop: 5,
      paddingHorizontal: 10,
      // justifyContent: 'space-evenly'
    },
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
      padding: 0,
      backgroundColor: '#fff',
      // marginTop: 18
    },
    
  
    linearGradient: {
      flex: 0.65,
      // ...lowerShadow,
      // overflow: 'hidden',
      // position: "relative",
      // backgroundColor: "blue",
      //backgroundColor: 'red',
      // borderWidth:2,
      // borderColor:'black',
      
      // alignSelf: 'center',
      // width: width,
      // overflow: 'hidden', // for hide the not important parts from circle
      // height: 175,
    },

    footerContainer: {
      flex: 0.1, position: "absolute",zIndex: 1,
      bottom: 0,
      width: "100%",
    },

      pillContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
      },

        pill: {
          backgroundColor: Colors.white,
          width: 55,
          height: 5,
          borderRadius: 15,
        },

      reviewsHeaderContainer: {
        flexDirection: 'row', 
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center',
        flex: 0.8,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: 'black',
        
        
      },

      reviewsContainer: {
        width: "100%",
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: silver,
        // height: 0,
      },
  
    // footerContainer: {
    //   flex: 0.2,
    //   flexDirection: 'column',
    //   backgroundColor: '#fff',
    //   justifyContent: 'center',
    //   // alignItems: 'center',
    //   padding: 10,
    //   justifyContent: 'space-evenly'
    // },
  
 
    iconRow: {
      flex: 0.12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 10,
      paddingHorizontal: 20,
      // marginVertical: 25,
      // backgroundColor: 'red'
      // height: 150,
    },
  
    profileRow: {
      flex: 0.81,
      // marginTop: 25,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // backgroundColor: '#fff',
      // marginVertical: 20
    },
  
      profilepic: {
        //flex: 1,
        // width: profilePicSize,
        // height: profilePicSize,
        // borderRadius: profilePicSize/2,
        width: 160,
        height: 160,
        alignSelf: 'center',
        borderRadius: 80,
        borderColor: '#fff',
        borderWidth: 0,
        ...stampShadow,
        // opacity: 0.1
      },

      name: {
        
        ...Fonts.h4,
      },
  
    productsContainer: {
      flex: 0.3,    
      // backgroundColor: "#fff",
      // flexDirection: 'row',
      
      // borderBottomColor: 'black',
      // borderBottomWidth: 1,
      // backgroundColor: 'red',    
      // borderRadius: width/5,
      // width: width,
      // height: width,
      // top: 0, // show the bottom part of circle
      // overflow: 'hidden',
      // marginLeft: -100,
    },

      labelRow: {
        flex: 0.07,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        // backgroundColor: 'red',

      },

        labelContainer: {
          marginLeft: 15,
          textAlign: 'center',
          backgroundColor: 'black',
          padding: 2,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        },

          label: {
            ...Fonts.style.small,
            fontSize: 12,
            color: '#fff'

          },

      productScrollContainer: {
        // borderRadius: 10,
        borderColor: "black",
        borderTopWidth: 1,
        // borderBottomWidth: 1,
        // flex: 0.8,
        backgroundColor: '#fff',
        // marginHorizontal: 4,
        
      },

      productScrollContentContainer: {
        paddingVertical: 15,
        justifyContent: 'center',
        // alignItems: 'center'
      },

        productImage: {
          width: width/3 - 15,
          height: width/3 - 15,
          marginHorizontal: 5,
        },

        addListing: {
          // backgroundColor: 'red',
          borderColor: 'black',
          borderWidth: 2.5,
          borderStyle: 'dashed',
          justifyContent: 'center',
          alignItems: 'center',
        },
      
  
      blackCircle: {
        // marginBottom: 10,
        width: 55,
        height: 55,
        borderRadius: 27.5,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        // borderColor: '#fff',
        // borderWidth: 0.3,
        // ...stampShadow,
      },
  
    ///////// 
    // On Sale and Sold buttons
  
    buttonTextContainer: {
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      width: width/2.8,
      position: 'absolute',
      zIndex: -1,
      // left: 37,
      left: 30,
    },
  
    /////////////
    /////////////

  
  reviewsHeader: {
    fontSize: 30,
    fontWeight: "200",
    letterSpacing: 1,
    color: '#fff'
  },
  
  commentContainer: {
    flexDirection: 'column',
    borderWidth: 0,
    borderRadius: 10,
    // width: width - 15,
    backgroundColor: "#fff",
    // shadowOpacity: 0.5,
    // shadowRadius: 1.3,
    // shadowColor: 'black',
    // shadowOffset: {width: 0, height: 0},
    padding: 5,
    marginVertical: 4
  
  },
  
  commentPicAndTextRow: {
    flexDirection: 'row',
    width: width - 20,
    padding: 10
  },
  
  commentPic: {
    //flex: 1,
    width: 70,
    height: 70,
    alignSelf: 'center',
    borderRadius: 35,
    borderColor: '#fff',
    borderWidth: 0
  },
  
  commentName: {
    color: highlightGreen,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left"
  },
  
  comment: {
    fontSize: 16,
    color: 'black',
    textAlign: "center",
  },  
  
  commentTimeRow: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  
  commentTime: {
    textAlign: "right",
    fontSize: 16,
    color: 'black'
  },
  
  
  
  textContainer: {
  flex: 1,
  flexDirection: 'column',
  padding: 5,
  },

  /////////////////
  /////////////////

  modal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 30},
modalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold"
},
modalText: {
    textAlign: 'justify',
    fontSize: 15,
    fontFamily: 'Times New Roman',
    fontWeight: "normal"
},
hideModal: {
    paddingTop: 40,
    fontSize: 20,
    color: 'green',
    fontWeight:'bold'
  },

documentOpenerContainer: {
    height: 130,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center'
},
blockUser: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Times New Roman'
},
reportUser: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Times New Roman',
},

reportModal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 25, marginTop: 22},
reportModalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold",
    paddingBottom: 20,
},

reportInput: {width: width - 40, height: 120, marginBottom: 50, borderColor: highlightGreen, borderWidth: 1}

  

  
  });
