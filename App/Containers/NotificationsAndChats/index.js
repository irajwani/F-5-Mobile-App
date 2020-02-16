import React, { Component } from 'react'
import { Platform, Text, Dimensions, StyleSheet, ScrollView, SafeAreaView, View, Image, TouchableOpacity, Modal } from 'react-native'
import firebase from 'react-native-firebase';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { highlightGreen, graphiteGray, treeGreen, rejectRed, logoGreen, mantisGreen, darkGray, silver } from '../../colors';
import {avenirNextText} from '../../constructors/avenirNextText'

import ProgressiveImage from '../../components/ProgressiveImage';
import NothingHereYet from '../../components/NothingHereYet';
import { LoadingIndicator, CustomTouchableO, WhiteSpace } from '../../localFunctions/visualFunctions';

import { withNavigation } from 'react-navigation';
import { textStyles } from '../../StyleSheets/textStyles';

import {Images, Colors} from '../../Theme'

import {Config} from '../../Config'
import { TabHeader } from '../../components/HeaderBar';
let {API_URL} = Config;

const DaysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const {width} = Dimensions.get('window');

const pictureWidth = 60, pictureHeight = 60, pictureBorderRadius = 30;

const notificationHeaderText = "F5";
const noNotificationsText = "You have no notifications.";

const NotificationTextScroll = ({children, customFlex}) => (
  <View style={customFlex ? {flex: customFlex} : styles.detailsTextContainer}>
  <ScrollView style={{paddingBottom: 5,}} contentContainerStyle={styles.detailsScroll} >
    {children}
  </ScrollView>
  </View>
)

const NotificationActionButton = ({onPress, text, logo, enabled}) => (
  <TouchableOpacity style={{padding: 10, borderRadius: 5, backgroundColor: enabled ? mantisGreen : darkGray, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}} onPress={onPress}>
    <Icon 
      name={logo}
      size={35}
      color={enabled ? 'black' : '#fff'}
    />
    <Text style={{fontFamily: 'Avenir Next', fontWeight: "500", color: enabled ? 'black' : '#fff', fontSize: 30}}>{text}</Text>
  </TouchableOpacity>
)

class Chats extends Component {

  constructor(props) {
    super(props);
    this.state = { chats: [], isGetting: true, noChats: false };
  }

  componentWillMount() {
    var your_uid = this.props.uid;
    setTimeout(() => {
      this.getChats(your_uid);
    }, 1000);
  }

  getChats = (your_uid) => {
    firebase.database().ref().on('value', (snapshot) => {
      var d = snapshot.val();
      var chats = d.Users[your_uid].conversations ? d.Users[your_uid].conversations : false;
      chats = chats ? Object.values(chats) : false;
      // console.log(chats);
      
      this.leaveYourRooms(your_uid);
      this.setState({chats, yourUid: your_uid, noChats: chats ? true : false , isGetting: false});
    })
  }

  leaveYourRooms = (yourUid) => {
    // fetch(express_app_uri).then( res => console.log(res.json()))
    fetch(`${API_URL}leaveYourRooms/?user_id=${yourUid}`)
    .then( (response) => {
      if(response.ok) {
        console.log(response);
      }
      else {
        throw new Error("Failed to connect")
      }
      
      
    })
  }

  
  navToChat(chat) {
    const {productSellerId, id, buyer, seller, buyerAvatar, sellerAvatar, buyerIdentification, sellerIdentification} = chat;
    this.props.navigationProperty.navigate('CustomChat', {productSellerId, id, buyer, buyerAvatar, seller, sellerAvatar, buyerIdentification, sellerIdentification })
  }

  handleLongPress = (key) => {
    const state = {...this.state};
    state.chats[key].selected = !state.chats[key].selected;
    // console.log(state.chats[key].selected);
    this.setState(state);
    // const chat = state.chats.find( chat => chat.name == key);
    // state.chats.selected = !state.

    
  }

  deleteConversation = (chat) => {
    const {id, buyerIdentification, sellerIdentification} = chat;
    var buyerRef = '/Users/' + buyerIdentification + '/conversations/' + id + '/';
    var sellerRef = '/Users/' + sellerIdentification + '/conversations/' + id + '/';
    let promiseToDeleteBuyerRef = firebase.database().ref(buyerRef).remove();
    let promiseToDeleteSellerRef = firebase.database().ref(sellerRef).remove();
    Promise.all([promiseToDeleteBuyerRef, promiseToDeleteSellerRef])
    .then( ()=>{
      // console.log('Done deleting conversations for both buyer and seller');
      setTimeout(() => {
        this.getChats(this.state.yourUid);
      }, 500);
    })
    .catch( err => console.log(err));
  }
  

  renderChats = (chats) => {

      return(chats.map( (chat, index) => 
        (
         <TouchableOpacity 
         key={index} style={styles.specificChatExpandedContainer}
         onPress={() => this.navToChat(chat)}
         >

          <View  style={styles.specificChatContainer}>

            <TouchableOpacity onLongPress={() => this.handleLongPress(index)} onPress={() => this.navToChat(chat)} style={[styles.pictureContainer, {flexDirection: 'row'}]}>
              <View style={[styles.unreadDotContainer, {flex: 0.1}]}>
                  {chat.unread == true ? 
                    <View style={styles.unreadDot}/>
                    :
                    null
                  }
              </View>
              <View style={{flex: 0.9, alignItems: 'stretch', marginHorizontal: 4}}>
                <ProgressiveImage
                thumbnailSource={Images.smallProfile}
                source={this.state.yourUid == chat.sellerIdentification ? chat.buyerAvatar ? {uri: chat.buyerAvatar } : Images.logo : chat.sellerAvatar ? {uri: chat.sellerAvatar } : Images.logo   } 
                style={[styles.picture, {borderRadius: pictureBorderRadius}]} />
              </View>
              
            </TouchableOpacity>

            <TouchableOpacity onLongPress={() => this.handleLongPress(index)} onPress={() => this.navToChat(chat)} style={styles.textContainer}>
                {/* Name of message sender */}
              <Text style={[styles.otherPersonName, chat.unread == true ? {fontSize: 16, fontWeight: "700"} : null]}>{this.state.yourUid == chat.buyerIdentification ? (chat.seller.split(' '))[0] : (chat.buyer.split(' '))[0] }</Text>
              <Text style={[styles.lastMessageText, chat.unread == true ? {fontSize: 14, fontWeight: "700"} : null]}>
              {chat.lastMessage.lastMessageText ? chat.lastMessage.lastMessageSenderIdentification == chat.sellerIdentification ? `${(chat.seller.split(' '))[0]}: ${chat.lastMessage.lastMessageText.substring(0,60)}` : `${(chat.buyer.split(' '))[0]}: ${chat.lastMessage.lastMessageText.substring(0,60)}` : "Empty conversation"}
              </Text>
              <Text style={styles.lastMessageDate}>{DaysOfTheWeek[chat.lastMessage.lastMessageDate]}</Text>
            </TouchableOpacity>

            <TouchableOpacity onLongPress={() => this.handleLongPress(index)} onPress={() => this.navToChat(chat)} style={styles.pictureContainer}>
              <ProgressiveImage 
              thumbnailSource={Images.smallProfile}
              source={ {uri: chat.productImageURL }} 
              style={styles.picture} />
            </TouchableOpacity>

          </View>

          {chat.selected ? 
              
            <CustomTouchableO extraStyles={styles.deleteConversationButton} color={rejectRed} text={"Delete Conversation"} textSize={22} textColor={'#fff'} 
              onPress={() => this.deleteConversation(chat)} 
              disabled={false} 
            />
            
          :
            null
          }

         </TouchableOpacity>

          

         
          
        )
      ))
    
    
  }
  
  render() {
    const {chats} = this.state
    if(this.state.isGetting) {
      return ( 
        <View style={styles.LoadingIndicatorContainer}>
          <LoadingIndicator isVisible={this.state.isGetting} color={'black'} type={'Wordpress'}/>
        </View>  
        
      )
    }

    if(this.state.chats == false) {
      // Show nothing to the user if they have no chats
      return (
        
          <View style={[styles.screen, {padding: 10, }]}>
            
          </View>
        
      )
    }
    else {
      return (
        
          <ScrollView
            style={styles.screen} 
            contentContainerStyle={styles.cc}
          >
            {this.renderChats(chats)}
          </ScrollView>
        
      )
    }
    
  }
}

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state={
          isGetting:true, noNotifications: false, showDetails: false, 
          details: false, notificationType: false, notificationKey: false,
          currency: '',

        };
    }
  
    componentWillMount() {
      // this.getNotifications();
      setTimeout(() => {
        this.getNotifications();
      }, 1);
    }
  
    // navToChats() {
    //     this.props.navigation.navigate('Chats');
    // }
  
    getNotifications() {
      this.setState({isGetting: true});
      //get chats for particular user
      firebase.database().ref().once("value", (snapshot) => {
        var d = snapshot.val();
        const uid = this.props.uid;
        if(d.Users[uid].notifications) {
          const notifications = d.Users[uid].notifications 
          var location = d.Users[uid].profile.country;
          location = location.replace(/\s+/g, '').split(',')[1]
          var currency;
          switch(location) {
            case "UK":
              currency = '£';
              break;
            case "Pakistan":
              currency = 'Rs.';
              break;
            default:
              currency = '$';
              break;
          }
          // console.log('Whole Notifications Obj is: ' + notifications);
          this.setState({notifications, currency});
        } 
        else {
          this.setState({noNotifications: true})
        }
        
        
      })
      .then( () => { this.setState( {isGetting: false} );  } )
      .catch( (err) => {console.log(err) })
      
    }

    handleLongPress = (notificationType, key) => {
      const state = {...this.state};
      state.notifications[notificationType][key].selected = !state.notifications[notificationType][key].selected; 
      // console.log(state.chats[key].selected);
      this.setState(state);
      // const chat = state.chats.find( chat => chat.name == key);
      // state.chats.selected = !state.
  
      
    }
  
    deleteNotification = (notificationType, key) => {
      
      var ref = '/Users/' + this.props.uid + '/notifications/' + notificationType + '/' + key + '/';
      let promiseToDeleteNotification = firebase.database().ref(ref).remove();
      
      promiseToDeleteNotification
      .then( ()=>{
        // console.log('Done deleting conversations for both buyer and seller');
        setTimeout(() => {
          this.getNotifications();
        }, 500);
      })
      .catch( err => console.log(err));
    }

    navToEditItem = async (key) => {
      await firebase.database().ref(`/Products/${key}/`).once('value', (snapshot) => {
        var item = snapshot.val();
        this.setState({showDetails: false}, ()=>{
        // console.log("We wish to item with data: " + d);
        this.props.navigationProperty.navigate('CreateItem', {
          data: item, 
          pictureuris: item.uris.source, 
          price: item.text.price, 
          original_price: item.text.original_price, 
          post_price: item.text.post_price > 0 ? item.text.post_price : 0,
          condition: item.text.condition,
          type: item.text.type,
          size: item.text.size,
          editItemBoolean: true});

        });
        
      })
      
      // alert('Please take brand new pictures');
    }
  
    renderNotifications = () => {
      var {notifications} = this.state;
      //function executed if you have at least one notification of any variety
      //for each variety, similar UI but callbacks are different
      return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.cc}>
          {notifications.priceReductions ? this.renderNotificationList(notifications.priceReductions, 'Price Reduction Alert') : null}
          {notifications.purchaseReceipts ? this.renderNotificationList(notifications.purchaseReceipts, 'Purchase Receipt') : null}
          {notifications.itemsSold ? this.renderNotificationList(notifications.itemsSold, 'Item Sold!') : null}
          {notifications.moneyTransfers ? this.renderNotificationList(notifications.moneyTransfers, "Money Transfer") : null}
          {notifications.dispatchNotices ? this.renderNotificationList(notifications.dispatchNotices, "Dispatch Notice") : null}
          {this.renderDetailsModal()}
        </ScrollView>
        
      )
    }
  
    renderNotificationList = (notifs, notificationType) => {
      var nT;
      switch(notificationType) {
        case "Price Reduction Alert":
          nT = 'priceReductions';
          break;
        case "Purchase Receipt":
          nT = 'purchaseReceipts';
          break;
        case "Dispatch Notice":
          nT = 'dispatchNotices';
          break;
        case "Money Transfer":
          nT = 'moneyTransfers';
          break;
        default:
          nT = 'itemsSold'
          break
      }
      // console.log(notifs);
      //   console.log("OVER HEYAAAA" + notifs[0].uri);
      return Object.keys(notifs).map((notificationKey, index) => (
          <View
          key={index} style={styles.specificChatExpandedContainer}
          >
            <TouchableOpacity 
            onPress={() => this.showDetails(notifs[notificationKey],notificationType, notificationKey, nT)} 
            onLongPress={()=>this.handleLongPress(nT,notificationKey)}
            style={styles.specificChatContainer}
            >

              <View  
                style={[styles.pictureContainer, {flexDirection: 'row'}]}
                
              >
                <View style={[styles.unreadDotContainer, {flex: 0.1}]}>
                  {notifs[notificationKey].unreadCount == true ? 
                    <View style={styles.unreadDot}/>
                    :
                    null
                  }
                </View>
                <View style={{flex: 0.9, alignItems: 'stretch', marginHorizontal: 4}}>
                  <Image 
                  source={Images.logo} 
                  style={[styles.picture, {borderRadius: pictureBorderRadius}]} 
                  />
                </View>
              </View>
  
              <View 
                style={styles.textContainer}
              >
                <Text style={[styles.otherPersonName, notifs[notificationKey].unreadCount == true ? {fontSize: 16, fontWeight: "700"} : null]}>{notificationHeaderText}</Text>
                <Text style={[styles.lastMessageText, notifs[notificationKey].unreadCount == true ? {fontSize: 14, fontWeight: "700"} : null]}>{notificationType}</Text>
              </View>
  
              <View style={styles.pictureContainer}>
                <Image source={{uri: notifs[notificationKey].uri }} 
                style={styles.picture} />
              </View>
  
            </TouchableOpacity>

            {notifs[notificationKey].selected ? 
                          
              <CustomTouchableO extraStyles={styles.deleteConversationButton} color={rejectRed} text={"Delete Notification"} textSize={22} textColor={'#fff'} 
                onPress={() => this.deleteNotification(nT, notificationKey)} 
                disabled={false} 
              />
              
            :
              null
            }

          </View>


            ))
  
    }

    renderDetailsModal = () => {

      const {notificationType, details, currency} = this.state;
      const {deliveryOptionBody, productImageContainer, detailsTextContainer, detailsScroll,buttonContainer} = styles
      
      if(notificationType=="Item Sold!"){
        return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.showDetails}
        >
        <View style={styles.deliveryOptionModal}>

          <View style={styles.deliveryOptionHeader}>
                
            <FontAwesomeIcon
              name='arrow-left'
              size={1}
              color={logoGreen}
              />

            <Image style={styles.logo} source={Images.logo}/>
            

            <FontAwesomeIcon
              name='close'
              size={28}
              color={Colors.primary}
              onPress = { () => { 
                  this.setState({showDetails: false })
                  } }
              />

          </View>

          <View style={[productImageContainer, {padding: 10}]}>
            <ProgressiveImage 
              style= {styles.detailsImage} 
              thumbnailSource={ Images.glass }
              source={ {uri: details.uri} }
            />
          </View>

          <NotificationTextScroll>
            <Text style={styles.detailsText}>Hi {details.sellerName},</Text>
            <Text style={styles.detailsText}>
            
            Now that your item, {details.name}, has sold for {currency}{details.price} to {details.buyerName}, please make sure to send it on time so we can transfer your money accordingly.
            </Text>
            <WhiteSpace height={10}/>
            {details.address ?
              <Text style={styles.detailsText}>
              The buyer's address is:{'\n'}
              {details.address.addressOne + ", " + details.address.addressTwo + ", " + details.address.city + ", " + details.address.postCode}
              </Text>
            :
              null
            }
            
            {details.address ? <WhiteSpace height={10}/> : null}
            <Text style={styles.detailsText}>
            Once you've sent the item to the buyer, click on the button below so we can confirm the buyer has received it.
            </Text>
          </NotificationTextScroll>
          
            
          <View style={buttonContainer}>

            { details.deliveryStatus == 'shipped' ?
                <NotificationActionButton enabled={false} onPress={() => alert('Item cannot be "unsent" after you have marked it as sent!')} text={'Item Sent'} logo={'truck'}/>
              :
                <NotificationActionButton enabled={true} onPress={() => this.markItemAs('shipped',details.buyerId, details.sellerId)} text={'Item Sent'} logo={'check'}/>
            }

          </View>
              

          

        </View>
        </Modal>
      )
    }

    if(notificationType=="Money Transfer"){
      return (
      <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.showDetails}
      >
      <View style={styles.deliveryOptionModal}>

        <View style={styles.deliveryOptionHeader}>
              
          <FontAwesomeIcon
            name='arrow-left'
            size={1}
            color={logoGreen}
            />

          <Image style={styles.logo} source={Images.logo}/>
          

          <FontAwesomeIcon
            name='close'
            size={28}
            color={Colors.primary}
            onPress = { () => { 
                this.setState({showDetails: false })
                } }
            />

        </View>

        <View style={[productImageContainer, {padding: 10}]}>
          <ProgressiveImage 
            style= {styles.detailsImage} 
            thumbnailSource={ Images.glass }
            source={ {uri: details.uri} }
          />
        </View>

        <NotificationTextScroll>
          <Text style={styles.detailsText}>Hi {details.sellerName},</Text>
          <Text style={styles.detailsText}>
          Congratulations for successfully selling {details.name}. The payment has been released by our team and should be processed within 2-3 day working days. If the payment doesn't reach your account, contact us on f5.help@gmail.com.
          </Text>
        </NotificationTextScroll>
          
        <View style={buttonContainer}>
          <Text style={textStyles.information}>Transaction Complete!</Text>
        </View>
            

        

      </View>
      </Modal>
    )
  }



    

      else if(notificationType=="Purchase Receipt") {
        
        return (
          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showDetails}
          >
          <View style={styles.deliveryOptionModal}>
  
            <View style={styles.deliveryOptionHeader}>
                  
              <FontAwesomeIcon
                name='arrow-left'
                size={1}
                color={logoGreen}
                />
  
              <Image style={styles.logo} source={Images.logo}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={Colors.primary}
                onPress = { () => { 
                    this.setState({showDetails: false })
                    } }
                />
  
            </View>
  
            
            <View style={[productImageContainer, {padding: 10}]}>
              <ProgressiveImage 
                style= {styles.detailsImage} 
                thumbnailSource={ Images.glass }
                source={ {uri: details.uri} }
              />
            </View>
            
            

              
            <NotificationTextScroll customFlex={0.6}>
              <Text style={styles.detailsText}>
              Congratulations! You have successfully bought {details.name} for {currency}{details.price}.
              </Text>
              <WhiteSpace height={10}/>
              <Text style={styles.detailsText}>
              Your item will be delivered to:
              {details.address.addressOne + ", " + details.address.addressTwo + ", " + details.address.city + ", " + details.address.postCode}.
              </Text>
              <WhiteSpace height={10}/>
              <Text style={styles.detailsText}>
              Please note that it may take up to 2 weeks for the item to arrive via postal delivery. In case your item doesn't arrive, send us an email at f5.help@gmail.com.
              </Text>
            </NotificationTextScroll>
              
                
  
          </View>
          </Modal>
        )
      }

      else if(notificationType=="Dispatch Notice") {
        
        return (
          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showDetails}
          >
          <View style={styles.deliveryOptionModal}>
  
            <View style={styles.deliveryOptionHeader}>
                  
              <FontAwesomeIcon
                name='arrow-left'
                size={1}
                color={logoGreen}
                />
  
              <Image style={styles.logo} source={Images.logo}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={Colors.primary}
                onPress = { () => { 
                    this.setState({showDetails: false })
                    } }
                />
  
            </View>
  
            
              <View style={[productImageContainer, {padding: 10}]}>
                <ProgressiveImage 
                  style= {styles.detailsImage} 
                  thumbnailSource={ Images.glass }
                  source={ {uri: details.uri} }
                />
              </View>
              
              <NotificationTextScroll>
                <Text style={styles.detailsText}>
                Hi {details.buyerName},
                </Text>
                <WhiteSpace height={10}/>
                <Text style={styles.detailsText}>
                We're happy to tell you that your item, {details.name}, is on its way and will be with you soon. Once you've received the item, don't forget to press the item received button below so we can transfer the money to {details.sellerName}'s account.
                </Text>
                <WhiteSpace height={10}/>
                <Text style={styles.detailsText}>
                Please note that it may take up to 2 weeks for the item to arrive via postal delivery. In case your item doesn't arrive, send us an email at f5.help@gmail.com.
                </Text>
              </NotificationTextScroll>
                
              <View style={buttonContainer}>

                {details.deliveryStatus == 'shipped' ?
                    <NotificationActionButton enabled={true} onPress={()=>this.markItemAs('delivered', details.buyerId, details.sellerId)} text={'Item Received'} logo={'check'}/>
                  :
                    <NotificationActionButton enabled={false} onPress={()=>alert('You have confirmed your acquisition of this product')} text={'Item Received'} logo={'check-all'}/>
                }

              </View>
  
          </View>
          </Modal>
        )
      }

      else {
        // Price Reduction Notification
        return (
          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showDetails}
          >
          <View style={styles.deliveryOptionModal}>
  
            <View style={styles.deliveryOptionHeader}>
                  
              <FontAwesomeIcon
                name='arrow-left'
                size={1}
                color={logoGreen}
                />
  
              <Image style={styles.logo} source={Images.logo}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={Colors.primary}
                onPress = { () => { 
                    this.setState({showDetails: false })
                    } }
                />
  
            </View>
  
            <View style={[deliveryOptionBody, {flex: 0.82,padding: 5}]}>

              <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                <ProgressiveImage 
                  style= {styles.detailsImage} 
                  thumbnailSource={ Images.glass }
                  source={ {uri: details.uri} }
                />
              </View>

              <NotificationTextScroll customFlex={0.6}>
                <Text style={styles.detailsText}>We noticed your item, {details.name} has been on the marketplace for a week, and hasn't sold. In order to make it more likely to sell, we recommend you reduce your price to {currency}{Math.floor(0.90*details.price)}. Consider editing this item's details from its description page.</Text>
                
              </NotificationTextScroll>
              
            </View>
            
            {/* Custom Footer button in this case */}
            <View style={{flex: 0.08, justifyContent: 'center', alignItems: 'center', backgroundColor: logoGreen}}>
                <Text onPress={()=>this.navToEditItem(details.key)} style={[styles.detailsText, {color: "#fff", fontSize: 20, fontWeight: "500"}]}>Edit Item</Text>
            </View>
            
  
          </View>
          </Modal>
        )
      }
      



    }
  
    showDetails = (details, notificationType, key, notificationTypeProperty) => {
      //when one selects a specific notification, use the notificationType to determine what structure of details
      //to expect and use the details themselves of course, so set these 2 values in state
      console.log('show notification details');
      if(details.unreadCount == true) {
        var updates = {};
        switch(notificationType) {
          case "Price Reduction Alert":
            updates[`/Users/${this.props.uid}/notifications/priceReductions/${key}/unreadCount`] = false
            break;
          case "Purchase Receipt":
            updates[`/Users/${this.props.uid}/notifications/purchaseReceipts/${key}/unreadCount`] = false
            break;
          case "Dispatch Notice":
            updates[`/Users/${this.props.uid}/notifications/dispatchNotices/${key}/unreadCount`] = false
            break;
          case "Money Transfer":
            updates[`/Users/${this.props.uid}/notifications/moneyTransfers/${key}/unreadCount`] = false
            break;
          default:
            updates[`/Users/${this.props.uid}/notifications/itemsSold/${key}/unreadCount`] = false
            break
        }
        let promiseToMarkRead = firebase.database().ref().update(updates);
        promiseToMarkRead.then( () => {
          const {...state} = this.state;
          state.showDetails = true;
          state.details = details;
          state.notificationKey = key;
          state.notificationType = notificationType;
          state.notifications[notificationTypeProperty][key].unreadCount = false;
          this.setState(state);
        })
        .catch(e => console.log("Could not update unreadCount of notification because: " + e))
        
      }

      else {
        this.setState({showDetails: true, details, notificationKey: key, notificationType })
      }
      
      
    }

    markItemAs = (status,buyerId, sellerId) => {
      // console.log(notificationKey, status,buyerId, sellerId);
      let {notificationKey, details} = this.state;
      let updates = {};
      let newNotification = {...details, deliveryStatus: status, unreadCount: true};
      
      if(status == 'shipped') {        
        updates['/Users/' + buyerId + '/notifications/dispatchNotices/' + notificationKey + '/'] = newNotification;
        // updates['/Users/' + buyerId + '/notifications/dispatchNotices/' + notificationKey + '/deliveryStatus/'] = status;
      }
      else if(status == 'delivered') {
        updates['/Users/' + buyerId + '/notifications/dispatchNotices/' + notificationKey + '/deliveryStatus/'] = status;
        // TODO: create new money transfer notification on seller's notification branch
        updates['/Users/' + sellerId + '/notifications/moneyTransfers/' + notificationKey + '/'] = newNotification;
      }
      
      //Because we want to maintain the same value for deliveryStatus on all notifications thus far in one run of the logic chain
      //at the end of which moneyTransfer notification is dispatched..
      updates['/Users/' + sellerId + '/notifications/itemsSold/' + notificationKey + '/deliveryStatus/'] = status;

      let promiseToUpdateStatus = firebase.database().ref().update(updates);
      promiseToUpdateStatus.then(() => {
        // console.log("ALL DONEEEE");
        this.setState({showDetails: false}, ()=> {
          this.getNotifications();
        })
        
      });
      
      
      
    }

    
  
    render() {
      const {isGetting, noNotifications, notifications} = this.state;
      console.log(notifications);
      if(isGetting) {
          return (
            <View style={styles.LoadingIndicatorContainer}>
                <LoadingIndicator isVisible={isGetting} color={'black'} type={'Wordpress'}/>
            </View>
              
            
          )
      }
  
      if(noNotifications) {
        return (
        
            <View style={{flex: 0.85, padding: 10}}>
              <NothingHereYet specificText={noNotificationsText}/>
            </View>
              
        )
      }
  
      return this.renderNotifications()

    }
  }

class NotificationsAndChats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChats: true,
            isGetting: true,
            unreadCount: 0,
            unreadChatsCount: 0,
            uid: false
        }
    }

    componentWillMount = () => {
      this.setState({uid: firebase.auth().currentUser.uid})
    }

    componentDidMount() {
      this.timerId = setTimeout(() => {
        this.getNotificationsCount();
        this.intervalId = setInterval(() => {
          this.getNotificationsCount();
        }, 10000);
      }, 1);
    }

    componentWillUnmount() {
      clearTimeout(this.timerId)
      clearInterval(this.intervalId)
    }
  
    getNotificationsCount() {
      //get chats for particular user
      firebase.database().ref(`/Users/${this.state.uid}`).once("value", (snapshot) => {
        var d = snapshot.val();
        let unreadCount = 0;
        let unreadChatsCount = 0;

        if(d.notifications) {
          if(d.notifications.priceReductions) {
          
            Object.values(d.notifications.priceReductions).forEach( n => {
              if(n.unreadCount) {
                unreadCount += 1
              }
            })
          
          }
        
          if(d.notifications.itemsSold) {
            
            Object.values(d.notifications.itemsSold).forEach( n => {
              if(n.unreadCount) {
                unreadCount += 1
              }
            })
            
          }

          if(d.notifications.purchaseReceipts) {
            
            Object.values(d.notifications.purchaseReceipts).forEach( n => {
              if(n.unreadCount) {
                unreadCount += 1
              }
            })
            
          }
        }

        if(d.conversations) {
          Object.values(d.conversations).forEach( c => {
            if(c.unread == true) {
              unreadChatsCount += 1
            }
          })
        }

        this.setState({unreadCount, unreadChatsCount, isGetting: false});
        
        
        
      })
      .catch( (err) => {console.log(err) })
      
    }

    NavBlock = (text, unreadMessagesCount, onPress) => {

      return (
        
    
        <TouchableOpacity 
        disabled={text == "Chats" ? this.state.showChats ? true : false : this.state.showChats ? false : true} 
        onPress={onPress} 
        style={[
          styles.upperNavTabButton, 
          text == "Chats" ? 
            this.state.showChats ? styles.upperNavTabBorder : null 
            : 
            !this.state.showChats ? styles.upperNavTabBorder : null
          ]}
        >
          <Text style={[styles.upperNavTabText, this.state.showChats ? {color: highlightGreen} : null]}>{text}</Text>
          {unreadMessagesCount > 0 ?
            <View style={styles.notificationCountContainer}>
              <Text style={{color: '#fff', fontSize: 17, fontWeight: '300'}}>{unreadMessagesCount}</Text>
            </View>
            :
            null
          }
        </TouchableOpacity>

        
      )
    }

    renderUpperNavTab = () => {
        let {unreadChatsCount, unreadCount} = this.state
        return (
          <View style={styles.upperNavTab}>

            {this.NavBlock("Chats", unreadChatsCount, ()=>this.setState({showChats: true}))}
            {this.NavBlock("Notifications", unreadCount, ()=>this.setState({showChats: false}))}
    
            {/* <TouchableOpacity disabled={this.state.showChats ? true : false} onPress={()=>this.setState({showChats: true})} style={[styles.upperNavTabButton, this.state.showChats ? {borderBottomColor: highlightGreen, borderBottomWidth: 1} : null]}>
              <Text style={[styles.upperNavTabText, this.state.showChats ? {color: highlightGreen} : null]}>Chats</Text>
              {this.state.unreadChatsCount > 0 ?
                <View style={styles.notificationCountContainer}>
                  <Text style={{color: '#fff', fontSize: 17, fontWeight: '300'}}>{this.state.unreadChatsCount}</Text>
                </View>
                :
                null
              }
            </TouchableOpacity>
            
            <TouchableOpacity disabled={this.state.showChats ? false : true} onPress={()=>this.setState({showChats: false})} style={[styles.upperNavTabButton, !this.state.showChats ? {borderBottomColor: highlightGreen, borderBottomWidth: 1} : null]}>
              <Text style={[styles.upperNavTabText, !this.state.showChats ? {color: highlightGreen} : null]}>Updates</Text>
              {this.state.unreadCount > 0 ?
                <View style={styles.notificationCountContainer}>
                  <Text style={{color: '#fff', fontSize: 17, fontWeight: '300'}}>{this.state.unreadCount}</Text>
                </View>
                :
                null
              }
            </TouchableOpacity> */}
            
          </View>
        )
      }
// TODO: flex values are messed up here, renderUpperNavTab should also be with LoadingIndicator
    render() {
        if(this.state.isGetting) {
          return (
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 22 : 0}]}>
              <LoadingIndicator isVisible={this.state.isGetting} color={'black'} type={'Wordpress'}/>
            </View>
          )
        }

        else {
          return (
            <SafeAreaView style={styles.container}>
                <TabHeader text={"Messages"}/>
                {this.renderUpperNavTab()}
                {this.state.showChats ?
                  <Chats uid={this.state.uid} navigationProperty={this.props.navigation}/>
                :
                  <Notifications uid={this.state.uid} navigationProperty={this.props.navigation}/>
                }
              
                
            </SafeAreaView>
        )
        }
        
    }
}

export default withNavigation(NotificationsAndChats);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    
  },
  upperNavTab: {
    flex: 0.1,
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
    upperNavTabButton: {
      // backgroundColor: ,
      // width: navTabButtonWidth,
      // height: 50,
      
      // borderWidth: 1.3,
      // borderRadius: 30,
      // borderColor: "#fff",
      flex: 0.5,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth:1,
      borderBottomColor: '#fff'
    },

    upperNavTabText: new avenirNextText('black', 18, "300"),

    upperNavTabBorder: {
      borderBottomColor: Colors.tertiary, borderBottomWidth: 2
    },

  notificationCountContainer: { 
    justifyContent: 'center', alignItems: 'center',
    zIndex: 999,
    top: 10,
    right: 15,
    position: 'absolute',
     borderRadius: 10, width: 20, height: 20, backgroundColor: treeGreen
  },
  ////////////////
  screen: { flex: 0.8, backgroundColor: '#fff' },

  cc: {
    paddingHorizontal: 6, alignItems: 'center'
  },

  specificChatExpandedContainer: {
    flexDirection: 'column',
  },

  specificChatContainer: {
    flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 0,
    borderBottomColor: silver, borderBottomWidth: 0.6,
    width: width - 8,

  },

  pictureContainer: {
    flex: 0.25,
    alignItems: 'center'
  },

  unreadDotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 3
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: treeGreen
  },

  picture: {
    width: pictureWidth,
    height: pictureHeight,
  },

  textContainer: {
    flex: 0.5,
  },

  otherPersonName: new avenirNextText(false, 15, '500', 'left'),

  lastMessageText: new avenirNextText(graphiteGray, 13, '400'),

  lastMessageDate: new avenirNextText(treeGreen, 11, '300'),

  deleteConversationButtonContainer: {
    flexDirection: 'row',
    borderBottomColor: graphiteGray,
    borderBottomWidth: 0.5,

  },

  deleteConversationButton: {
    padding: 10,
    alignItems: 'center'
    // position: 'absolute'
  },

  ////////
  ////Notification Details Modal
  deliveryOptionModal: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: Platform.OS == "ios" ? 22 : 0
  },
  
  deliveryOptionHeader: {
    flex: 0.1,
    //TODO: find nottGreen hex code
    backgroundColor: logoGreen,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },

// Price Reduction
  deliveryOptionBody: {
    flex: 0.9,
    padding: 10,
    alignItems: 'center'
    // backgroundColor: ''
  },

//Purchase Receipts/Items Sold

  productImageContainer: {
    flex: 0.3,
    alignItems: 'center',
    margin: 10
  },

  logo: {
    width: 45,
    height: 45,
  },

  detailsImage: {
    width: 150,
    height: 150,
  },

  detailsTextContainer: {
    flex: 0.45
  },

  detailsScroll: {
    justifyContent: 'center',
    margin: 5,
    paddingVertical: 5
  },

  detailsText: {...textStyles.generic, fontSize: 22,textAlign: "left", color: 'black'},


  buttonContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },



  ///////


  LoadingIndicatorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff'},

  // rowContainer: {
  //   flexDirection: 'row',
  //   paddingTop: 10,
  //   paddingBottom: 10,
  //   paddingLeft: 5,
  //   paddingRight: 5,
  //   justifyContent: 'space-evenly',
  //   alignItems: 'center',
  //   backgroundColor: '#fff'
  // },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  productprofilepic: {
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:95,
    height:95,
    backgroundColor:'#fff',
    borderRadius: 48,
    borderWidth: 2
  },
  profilepic: {
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:35,
    height:35,
    backgroundColor:'#fff',
    borderRadius: 18,
    borderWidth: 0.4

},
  profilecolor: {
    borderColor: '#187fe0'
  },
  productcolor: {
    borderColor: '#86bb71'
  },
infoandbuttoncontainer: {
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-around',
  padding: 10,
  //paddingTop: 5,
  //paddingBottom: 5,
},
info: {
  
},  
productinfo: {
  color: "black",
  fontSize: 11,
  fontFamily: 'Iowan Old Style',
},
sellerinfo: {
  fontSize: 13,
  color: "#185b10",
  fontFamily: 'Times New Roman'
},
messagebutton: {
  backgroundColor: "#185b10",
  width: 75,
  height: 45,
  borderWidth: 2,
  borderRadius: 5,
  borderColor: "#185b10"
},
separator: {
  backgroundColor: 'black',
  width: width,
  height: 4
},  
})