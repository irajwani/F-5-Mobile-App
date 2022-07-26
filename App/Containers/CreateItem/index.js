import React, { Component } from 'react'
import { Platform, SafeAreaView, Text, TextInput, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native'
import {StackActions,NavigationActions,withNavigation} from 'react-navigation';

import {Button, ButtonGroup, Divider} from 'react-native-elements';
import Dialog, { DialogTitle, DialogContent, DialogFooter, DialogButton, SlideAnimation } from 'react-native-popup-dialog';

import MultipleAddButton from '../../components/MultipleAddButton';

import firebase from 'react-native-firebase';

import ImageResizer from 'react-native-image-resizer';

import Container from "../../components/Container"
import {TabHeader} from "../../components/HeaderBar"

import {Fonts, Metrics} from '../../Theme';
import { highlightGreen,lightGreen, silver, confirmBlue, woodBrown, rejectRed, treeGreen, avenirNext, darkGray, lightGray, highlightYellow, profoundPink, graphiteGray } from '../../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DismissKeyboardView, WhiteSpace, GraySeparation, LoadingIndicator } from '../../localFunctions/visualFunctions';
import { avenirNextText } from '../../constructors/avenirNextText';
import { textStyles } from '../../StyleSheets/textStyles';
import { HeaderBar } from '../../components/HeaderBar';

const priceAdjustmentReminder = "* F5 takes 10% of the selling price of your product to process payments through PayPal. Be sure to mark up your selling price accordingly.";
paypalReminder = "* If you don't provide a PayPal ID, we can't transfer your money in case of a sale."
const Bullet = '\u2022';
const categories = ["Men", "Women", "Accessories"]


const silverBorderTop = {borderTopWidth: 0.8,borderColor: silver}, silverBorderBottom = {borderBottomWidth: 0.8,borderColor: silver};

//For Resized Image
const maxWidth = 320, maxHeight = 320, suppressionLevel = 0;


const TextForMissingDetail = ({detail}) => {
 return (
 <Text style={new avenirNextText('black', 22, "400")}>{Bullet + " " + detail}</Text>
 )
}

const ChevronRight = () => (
    <Icon 
        name="chevron-right"
        size={40}
        color={lightGray}
    />
)
 

class CreateItem extends Component {
 constructor(props) {
    super(props);

    //extract data if we came to this screen to edit an existing item:
    var item = this.props.navigation.getParam('data', false);
    var isComingFrom = this.props.navigation.getParam('isComingFrom', false);

    this.state = {
        currency: '',
        uri: undefined,
        name: item ? item.text.name : '',
        brand: item ? item.text.brand : '', //empty or value selected from list of brands
        // price: 0,
        // original_price: 0,
        // size: 2,
        // type: 'Trousers',
        gender: item ? categories.indexOf(item.text.gender) : 1,
        // condition: 'Slightly Used',
        // insta: '',
        description: item ? item.text.description ? item.text.description : '' : '',
        typing: true,
        canSnailMail: item ? item.text.post_price > 0 ? true : false : false,
        paypal: item ? item.text.paypal ? item.text.paypal : '' : '',
        isUploading: false,
        pictureuris: 'nothing here',
        helpDialogVisible: false,
        /////////
        //EDIT ITEM STUFF
        editItemBoolean: this.props.navigation.getParam('editItemBoolean', false),
        oldItemPostKey: item ? item.key : false,
        oldUploadDate: item ? item.text.time : false,
        isComingFrom: isComingFrom ? isComingFrom : false,



        /////////

        /////RESIZE IMAGE STUFF
        resizedImage: false,
    }
 }

 componentWillMount = async () => {
    var uid = await firebase.auth().currentUser.uid;
    firebase.database().ref(`/Users/${uid}/profile/country/`).once('value',(snap)=>{
        var location = snap.val();
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
        this.setState({currency});
    })    
 }

//Nav to Fill In:

//1. Price and Original Price
navToFillPrice = (typeOfPrice) => {
 this.props.navigation.navigate('PriceSelection', {typeOfPrice: typeOfPrice, currency: this.state.currency})
}

navToFillBrand = () => {
    this.props.navigation.navigate('PriceSelection', {brandInput: true})
}

//2. Type and Condition
navToFillConditionOrType = (gender, showProductTypes) => {
 this.props.navigation.navigate('ConditionSelection', {gender: gender, showProductTypes: showProductTypes});
}

navToFillSizeBasedOn = (type,gender) => {
 this.props.navigation.navigate('ConditionSelection', {type: type, gender: gender, showProductSizes: true,});
}

helpUserFillDetails = () => {
 this.setState({helpDialogVisible: true})
 // alert(`Please enter details for the following fields:\n${this.state.name ? name}`)
}

updateFirebaseAndNavToProfile = (pictureuris, mime = 'image/jpg', uid, type, price, post_price, brand, condition, size, oldItemPostKey, oldItemUploadDate) => {
 this.setState({isUploading: true}); 
 // if(priceIsWrong) {
 // alert("You must a choose a non-zero positive real number for the selling price/retail price of this product");
 // return;
 // }

 //Locally stored in this component:
 var {name, description, gender, paypal} = this.state;

 
 // : if request.auth != null;
 switch(gender) {
    case 0:
    gender = 'Men'
    break; 
    case 1:
    gender = 'Women'
    break;
    case 2:
    gender = 'Accessories'
    break;
    default:
    gender = 'Men'
    // console.log('no gender was specified')
 }

 //TODO: check if in Edit Item mode, and update cloud DB with only those text values that have actually changed

 var updates = {}; 
 var actualPostKey;

 if(oldItemPostKey) {
    actualPostKey = oldItemPostKey
 }
 else {
    actualPostKey = firebase.database().ref().child(`Users/${uid}/products`).push().key;
 }

 var productTextPath = '/Users/' + uid + '/products/' + actualPostKey + '/text/';

 if(this.state.editItemBoolean) {
    console.log('Partial Update')
    var item = this.props.navigation.getParam('data', false);
    var oldValues = item.text;
    if(price != oldValues.price) {
        updates[productTextPath + 'price/'] = price;
    }
    if(name != oldValues.name) {
        updates[productTextPath + 'name/'] = name;
    }
    if(brand != oldValues.brand) {
        updates[productTextPath + 'brand/'] = brand;
    }
    if(gender != oldValues.gender) {
        updates[productTextPath + 'gender/'] = gender;
    }
    // if(original_price != oldValues.original_price) {
    //     console.log('Editing Original Price')
    //     updates[productTextPath + 'original_price/'] = original_price;
    // }
    if(type != oldValues.type) {
        updates[productTextPath + 'type/'] = type;
    }
    if(condition != oldValues.condition) {
        updates[productTextPath + 'condition/'] = type;
    }
    if(size != oldValues.size) {
        updates[productTextPath + 'size/'] = type;
    }
 }

 else {
    var postData = {
        name: name,
        brand: brand,
        price: price,

        type: type,
        size: size,
        description: description ? description.replace(/\s*$/,'') : 'Seller did not specify a description',
        gender: gender,
        condition: condition,
        sold: false,
        likes: 0,
        comments: '',
        time: oldItemPostKey ? oldItemUploadDate : Date.now(), //for now, do ot override initial upload Date
        dateSold: '',
        post_price: post_price ? post_price : 0,
        paypal: paypal, //TODO: test if paypal value is remembered and the user can't see it
        
     };
    
     updates[productTextPath] = postData;

     var productViewsPath = '/Users/' + uid + '/products/' + actualPostKey + '/usersVisited/'; //TODO: iOS
     updates[productViewsPath] = '';
 }
 
 updates['/Users/' + uid + '/profile/isNoob/'] = false;
 
 return {
    database: firebase.database().ref().update(updates),
    storage: this.uploadToStore(pictureuris, uid, actualPostKey)
 }

}

uploadToStore = (pictureuris, uid, postKey) => {
    var picturesProcessed = 0;

    pictureuris.forEach(async (uri, index, array) => {
    // console.log("Picture's Original URL:" + uri);
    //TODO: Will this flow work in EditItem mode for Image Uris placed in firebasestorage: NO it won't, just do simpler thing and
    //don't touch the cloud if these images have not been changed
        if(uri.includes('firebasestorage')) {
            picturesProcessed++;
            if(picturesProcessed == array.length) {
                this.callBackForProductUploadCompletion();
            }
        
        }

        else {

        
            let resizedImageThumbnail = await ImageResizer.createResizedImage(uri,maxWidth, maxHeight,'JPEG',suppressionLevel);
            let resizedImageProductDetails = await ImageResizer.createResizedImage(uri,3000, 3000,'JPEG',suppressionLevel);
            let imageUris = [uri, resizedImageThumbnail.uri, resizedImageProductDetails.uri];
            console.log("raw Image URI's:")
            console.log(imageUris)
            
            imageUris.forEach((imageUri, imageIndex, imageArray) => {
            // console.log("Picture URL:", imageUri, imageIndex)
            const storageUpdates = {};
            const uploadUri = Metrics.platform === 'ios' ? imageUri.replace('file://', '') : uri

            //THIS IS FINE, Just store images in firebase storage
            // const imageRef = 
            firebase.storage().ref().child(`Users/${uid}/${postKey}/${imageIndex == 0 ? index : imageIndex == 1 ? index+'-thumbnail' : index+'-pd'}`)
            .putFile(uploadUri, {contentType: mime})
            .then(uploadTask => {
                return uploadTask.downloadURL
            })
            .then((url) => {
                console.log(url);

                if(imageIndex == 0) {
                    storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/source/' + index + '/'] = url;
                }

                else if(imageIndex == 1){
                    storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/thumbnail/' + index + '/'] = url;
                }

                else {
                    storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/pd/' + index + '/'] = url;
                }
                
                firebase.database().ref().update(storageUpdates);
                picturesProcessed++;
                if(picturesProcessed == (imageArray.length*array.length)) {
                    this.callBackForProductUploadCompletion();
                }

            })
            .catch(err => {
                // alert(err);
                this.callBackForProductUploadCompletion(isError = true);

            })



        })
    
    
    


    }
 
 })

}
// uploadToStore = (pictureuris, uid, postKey) => {
// //sequentially add each image to cloud storage (pay attention to .child() method) 
// //and then retrieve url to upload on realtime db
// // var picturesProcessed = 0;
 
// // const uploadUri = Platform.OS === 'ios' ? pictureuris[1].replace('file://', '') : uri
// // ImageResizer.createResizedImage(uploadUri,20, 20,'JPEG',80)
// // .then( newUri => {
// // console.log("Resized Image: " + newUri);
// // // this.setState({resizedImage: newUri});

// // })
// // .catch( e => console.log('error resizing image because of: ' + e))
 
// // pictureuris.forEach( (uri, index, array) => {



// // if(uri.includes('firebasestorage')) { 

// // }
// // else {
 
// // }
 
// // })

// pictureuris.forEach( (uri, index, array) => {
// var storageUpdates = {};
// if(uri.includes('firebasestorage')) {
// //if the person did not take brand new pictures and chose to maintain the URIS received in EditItem mode
// storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/' + index + '/'] = uri;
// firebase.database().ref().update(storageUpdates);
// picturesProcessed++;
// if(picturesProcessed == array.length) {
// this.callBackForProductUploadCompletion();
// }
// }

// else {
// const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
// let uploadBlob = null
// const imageRef = firebase.storage().ref().child(`Users/${uid}/${postKey}/${index}-thumbnail`);
// fs.readFile(uploadUri, 'base64')
// .then((data) => {
// return Blob.build(data, { type: `${mime};BASE64` })
// })
// .then((blob) => {
// console.log('got to blob')
// uploadBlob = blob
// return imageRef.put(blob, { contentType: mime })
// })
// .then(() => {
// uploadBlob.close()
// return imageRef.getDownloadURL()
// })
// .then((url) => {
// console.log(url);
// storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/' + index + '/'] = url;
// firebase.database().ref().update(storageUpdates);
// picturesProcessed++;
// if(picturesProcessed == array.length) {
// this.callBackForProductUploadCompletion();
// }
// })
// }
 
 
 

// // } )

// // for(const uri of pictureuris) {
// // var i = 0;
// // console.log(i);
 
// // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
// // let uploadBlob = null
// // const imageRef = firebase.storage().ref().child(`Users/${uid}/${newPostKey}/${i}`);
// // fs.readFile(uploadUri, 'base64')
// // .then((data) => {
// // return Blob.build(data, { type: `${mime};BASE64` })
// // })
// // .then((blob) => {
// // console.log('got to blob')
// // i++;
// // uploadBlob = blob
// // return imageRef.put(blob, { contentType: mime })
// // })
// // .then(() => {
// // uploadBlob.close()
// // return imageRef.getDownloadURL()
// // })
// // .then((url) => {
// // console.log(url);
// // })
 
 
// // }
// }

 callBackForProductUploadCompletion = (isError=false) => {
     //TODO: Some way to inform user product has been uploaded
    // alert(`Product named ${this.state.name} successfully uploaded to Market!`);
    // alert(`Your product ${this.state.name} is being\nuploaded to the market.\nPlease do not resubmit the same product.`);
    //TODO: example of how in this instance we needed to remove pictureuris if its sitting in the navigation params
    
    // isEditItem ? Navigate to Initial Screen in current Stack : Navigate to different Stack
    
    setTimeout(() => {
        this.startOver()
        // If coming from product details due to edit item, stay in your stack and go to marketplace screen
        // If coming from YourProducts/SoldProducts to edit item then popToTop first and then go to Market stack
        if(this.state.oldItemPostKey) {
            if(this.state.isComingFrom == "productDetails" ) {
                this.props.navigation.navigate('MarketPlace');
            }
            else {
                let resetStack = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({routeName: 'ProfilePage'})
                    ],
                  });
                  
                  this.props.navigation.dispatch(resetStack);
                  this.props.navigation.navigate('Market');
            }
            
        }
        else {
            //
            this.props.navigation.navigate('Market');
        }
        
        if(isError) {
            alert('There was an error in uploading your product. Please try again.')
        }
        else {
            alert('Product successfully uploaded. Note that it may take up to 1 minute for the product to be visible in the marketplace.')
        }
                 
    }, this.state.oldItemPostKey ? 1 : 1);
    
 }

 deleteProduct = async (uid, key) => {
    await firebase.database().ref('/Users/' + uid + '/products/' + key).remove();
    await firebase.database().ref('/Users/' + uid + '/notifications/priceReductions/' + key)
    .remove()
    .catch(err => console.log(err));
    this.setState({isUploading: false,})
    alert('Your product has been successfully deleted.');
    this.props.navigation.popToTop();
    // let promiseToUpdateProductsBranch = firebase.database().ref('/Products/' + key).remove();
    // let promiseToDeleteProduct = firebase.database().ref('/Users/' + uid + '/products/' + key).remove();
    //Additionally, schedule deletion of any priceReductionNotification notifications that affect this product
    // let promiseToDeleteNotifications = 
    //TODO: What should happen to purchase receipts and item sold? 
    // Promise.all([promiseToDeleteProduct, promiseToDeleteNotifications])
    // .then( ()=>{
    //     // this.props.navigation.navigate(`${parentScreenInStack}`);
    // })
    // .then( () => {
    //     console.log('product has been successfully removed')
    // })
    // .catch( (err)=> {
    //     console.log(err);
    // });

 }

 startOver = () => {
    this.props.navigation.setParams({pictureuris: 'nothing here', price: 0, type: false, size: false, condition: false});
    this.setState({ 
    uri: undefined,
    name: '',
    brand: '',
    // price: 0,
    // original_price: 0,
    // size: 2,
    // type: 'Trousers',
    gender: 1,
    // condition: 'Slightly Used',
    insta: '',
    description: '',
    typing: true,
    paypal: '',
    isUploading: false,
    });
 }

 getColorFor = (c) => {
    var color;
    switch(c) {
        case "New With Tags":
            color = 'black';
            break;
        case "New Without Tags":
            color = 'black';
            break;
        case "Slightly Used":
            color = 'black';
            break;
        case "Used":
            color = 'black'
            break;
        default:
            color = 'black'
    }
    return color;
 }

// createRoom(key) {
// //create a new room with product id, and add buyer as member of room. 
// const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
// // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
// const tokenProvider = new Chatkit.TokenProvider({
// url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
// });
 
// // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
// // For the purpose of this example we will use single room-user pair.
// const chatManager = new Chatkit.ChatManager({
// instanceLocator: CHATKIT_INSTANCE_LOCATOR,
// userId: CHATKIT_USER_NAME,
// tokenProvider: tokenProvider
// });

 
// //In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
// chatManager.connect().then(currentUser => { 
// this.currentUser = currentUser;
// this.currentUser.createRoom({
// name: key,
// private: false,
// addUserIds: null
// }).then(room => {
// console.log(`Created room called ${room.name}`)
// })
// .catch(err => {
// console.log(`Error creating room ${err}`)
// })
// })
// }


 render() {
    const {navigation} = this.props;
    const {isUploading} = this.state;
    const uid = firebase.auth().currentUser.uid; 
    

    // List of values we navigate over to CreateItem from other components:
    var pictureuris = navigation.getParam('pictureuris', 'nothing here');
    var price = navigation.getParam('price', 0);
    // var original_price = navigation.getParam('original_price', 0);
    var condition = navigation.getParam('condition', false); 
    var type = navigation.getParam('type', false); 
    var brand = navigation.getParam('brand', false);
    var size = navigation.getParam('size', false);
    var post_price = navigation.getParam('post_price', 0);
    
    console.log(brand);
    ////

    ///
    ///If there is a change in this.state.gender, remove the product type value

    ///

    //When the condition to submit a product has partially been satisfied:
    var userChangedAtLeastOneField = (this.state.name) || (this.state.description) || (this.state.brand) || ( (Number.isFinite(price)) && (price > 0) ) || ( (Array.isArray(pictureuris) && pictureuris.length >= 1) ) || (this.state.paypal);
    var partialConditionMet = (this.state.name) || (brand) || ( (Number.isFinite(price)) && (price > 0) ) || ( (Array.isArray(pictureuris) && pictureuris.length >= 1) ) || (condition);
    //The full condition for when a user is allowed to upload a product to the market
    var conditionMet = (this.state.name) && (brand) && (Number.isFinite(price)) && (price > 0) && (Array.isArray(pictureuris) && pictureuris.length >= 1) && (type) && ( (this.state.gender == 2 ) || (this.state.gender < 2) && (size) ) && (condition);
    //var priceIsWrong = (original_price != '') && ((price == 0) || (price.charAt(0) == 0 ) || (original_price == 0) || (original_price.charAt(0) == 0) )
    // console.log(conditionMet);
    //console.log(priceIsWrong);
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    // categoryColors[this.state.gender] color selectedType based on gender

    if(isUploading) {
        return (
            <View style={{marginTop: Platform.OS == "ios" ? 22 : 0, flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
            <View style={{height: 200, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
            <LoadingIndicator isVisible={isUploading} color={lightGreen} type={'Wordpress'}/>
            <WhiteSpace height={20}/>
            <Text style={{paddingVertical: 1, paddingHorizontal: 10, fontFamily: 'Avenir Next', fontSize: 18, fontWeight: '500', color: highlightGreen, textAlign: 'center'}}>
            Your product {this.state.name} is being uploaded to the market. Please do not resubmit the same product.
            </Text>
            </View>
            
            </View>
        )
    }

    return (
    
        <Container>
            <TabHeader text={"Create Item"}/>
            {/* {this.state.editItemBoolean ? <HeaderBar customFlex={0.13} navigation={this.props.navigation} hideCross={true}/> : null} */}
            <ScrollView
            style={{flex: this.state.editItemBoolean ? 0.77 : 0.9}}
            contentContainerStyle={styles.contentContainer}
            >

                <Divider style={{ backgroundColor: '#fff', height: 12 }} />
                
                <Text style={[styles.detailHeader, {fontSize: 18, textAlign: 'center'}]}>Picture(s) of Product:</Text>
                <Divider style={{ backgroundColor: '#fff', height: 8 }} />

                <MultipleAddButton navToComponent={'CreateItem'} pictureuris={pictureuris}/>
                {/* {pictureuris[1] ? <Image style={{width: 60, height: 60}} source={{uri: pictureuris[1]}} /> : null}
                {this.state.resizedImage ? <Image style={{width: 60, height: 60}} source={{uri: this.state.resizedImage}}/> : null} */}
                <WhiteSpace height={10}/>
                
                
                <Text style={[styles.detailHeader, {fontSize: 18, textAlign: 'center'}]}>Category</Text>
                <ButtonGroup
                    onPress={ (index) => {
                    if(index != this.state.gender) {
                    navigation.setParams({type: false});
                    // type = '';
                    this.setState({gender: index});
                    }
                    
                    }}
                    selectedIndex={this.state.gender}
                    buttons={ ['Men', 'Women', 'Accessories'] }
                    containerStyle={styles.buttonGroupContainer}
                    buttonStyle={styles.buttonGroup}
                    textStyle={styles.buttonGroupText}
                    selectedTextStyle={styles.buttonGroupSelectedText}
                    selectedButtonStyle={styles.buttonGroupSelectedContainer}
                />
                
                <TouchableHighlight underlayColor={'#fff'} style={[styles.navToFillDetailRow, silverBorderBottom]} 
                onPress={() => {
                navigation.setParams({size: false});
                this.navToFillConditionOrType(this.state.gender, showProductTypes = true);
                
                } }>
                    <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0}]}>
                    
                        <View style={[styles.detailHeaderContainer, {flex: type ? 0.25 : 0.8}]}>
                            <Text style={styles.detailHeader}>Type</Text>
                        </View>

                        {type?
                        <View style={[styles.displayedPriceContainer, {flex: 0.55}]}>
                            <Text style={[styles.displayedCondition, {color: 'black', fontSize: 15, fontWeight: "300"}]}>{type}</Text>
                        </View>
                        :
                        null
                        }

                        <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                            <ChevronRight/>  
                        </View>

                    </View>
                </TouchableHighlight>

                

                
                <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start', ...silverBorderBottom}}>
                    <View style={[styles.detailHeaderContainer, {marginTop: 12}]}>
                        <Text style={styles.detailHeader}>Name</Text>
                    </View>
                    
                    <TextInput
                    style={{height: 50, width: 280, ...textStyles.generic, ...Fonts.medium}}
                    placeholder={"e.g. White COS sweater"}
                    placeholderTextColor={lightGray}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                    multiline={false}
                    maxLength={16}
                    autoCorrect={false}
                    autoCapitalize={'words'}
                    clearButtonMode={'while-editing'}
                    underlineColorAndroid={"transparent"}
                    /> 
                    
                </View>

                

                
                
                


                <DismissKeyboardView>
                <View style={[styles.descriptionContainer, silverBorderBottom]}>

                    <View style={[styles.descriptionHeaderContainer, {marginTop: 12}]}>
                        <Text style={styles.detailHeader}>Description</Text>
                    </View>

                    {/* <WhiteSpace height={1}/> */}

                    <View style={styles.descriptionInputContainer}>

                        <TextInput
                        style={styles.descriptionInput}
                        placeholder={"e.g. Only worn a few times, true to size."}
                        placeholderTextColor={lightGray}
                        onChangeText={(description) => this.setState({description})}
                        value={this.state.description}
                        multiline={true}
                        numberOfLines={4}
                        scrollEnabled={true}
                        underlineColorAndroid={"transparent"}
                        />

                    </View>

                </View>
                </DismissKeyboardView>

                <GraySeparation/>

                {/* Brand */}
                
                
                <TouchableHighlight underlayColor={'#fff'} style={[styles.navToFillDetailRow, silverBorderTop]} onPress={() => this.navToFillBrand()}>
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
                
                    <View style={[styles.detailHeaderContainer, {flex: brand ? 0.35 : 0.8}]}>
                        <Text style={styles.detailHeader}>Brand</Text>
                    </View>

                    
                    <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
                        <Text style={[styles.displayedCondition, { color: brand ? 'black' : 'gray', fontWeight: "400"}]}>{brand ? brand : ""}</Text>
                    </View>
                    
                    
                    

                    <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                        <ChevronRight/>
                    </View>

                </View>
                </TouchableHighlight>

                
                {/* Size */}

                { type && this.state.gender != 2 ?
                
                

                <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillSizeBasedOn(type, this.state.gender)}>
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
                
                    <View style={[styles.detailHeaderContainer, {flex: size ? 0.35 : 0.8}]}>
                        <Text style={styles.detailHeader}>Size</Text>
                    </View>

                    
                    <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
                        <Text style={[styles.displayedCondition, { color: size ? 'black' : 'gray', fontWeight: "400"}]}>{size ? size : ""}</Text>
                    </View>
                    
                    
                    

                    <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                        <ChevronRight/>
                    </View>

                </View>
                </TouchableHighlight>
                
                
                :
                null
                }

                
                {/* Condition */}

                <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillConditionOrType(this.state.gender, false)}>
                    
                    <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
                    <View style={[styles.detailHeaderContainer, {flex: condition ? 0.35 : 0.8}]}>
                        <Text style={styles.detailHeader}>Condition</Text>
                    </View>

                    {condition?
                    <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
                        <Text style={styles.displayedCondition}>{condition}</Text>
                    </View>
                    :
                    null
                    }

                    <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                        <ChevronRight/>
                    </View>

                    </View>

                    
                </TouchableHighlight>

                <GraySeparation/>
                
                {/* <TouchableHighlight underlayColor={'#fff'} style={[styles.navToFillDetailRow, silverBorderTop, silverBorderBottom]} onPress={() => this.navToFillPrice("retailPrice")}>
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0}]}>
                
                    <View style={[styles.detailHeaderContainer, {flex: original_price > 0 ? 0.5 : 0.8}]}>
                        <Text style={styles.detailHeader}>Retail Price (Optional)</Text>
                    </View>

                    {original_price > 0 ?
                    <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                        <Text style={styles.displayedPrice}>{this.state.currency+original_price}</Text>
                    </View>
                    :
                    null
                    }

                    <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                        <ChevronRight/>
                    </View>

                </View>
                </TouchableHighlight> */}

                

                


                <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice("sellingPrice")}>
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0}]}>
                
                    <View style={[styles.detailHeaderContainer, {flex: price > 0 ? 0.5 : 0.8}]}>
                        <Text style={styles.detailHeader}>Selling Price</Text>
                    </View>

                    {price > 0 ?
                        <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                            <Text style={[styles.displayedPrice, {color: treeGreen}]}>{this.state.currency + price}</Text>
                        </View>
                    :
                        null
                    }

                    <View style={[styles.navToFillDetailIcon, {flex: price > 0 ? 0.2 : 0.2 }]}>
                        <ChevronRight/>
                    </View>

                </View>
                </TouchableHighlight>

                
                
                {/* <View style={[styles.priceAdjustmentReminderContainer, silverBorderBottom]}>
                    <Text style={styles.priceAdjustmentReminder}>{priceAdjustmentReminder}</Text>
                </View> */}





                {/* {this.state.editItemBoolean ? 
                    null
                :
                <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start', ...silverBorderBottom}}>
                    <View style={[styles.detailHeaderContainer, {marginTop: 12}]}>
                        <Text style={styles.detailHeader}>PayPal Email Address</Text>
                    </View>
                    <TextInput
                    style={{height: 50, width: 280, ...textStyles.generic, ...Fonts.medium}}
                    placeholder={"example@domain.com"}
                    placeholderTextColor={lightGray}
                    onChangeText={(paypal) => this.setState({paypal})}
                    value={this.state.paypal}
                    multiline={false}
                    autoCorrect={false}
                    autoCapitalize={'words'}
                    clearButtonMode={'while-editing'}
                    keyboardType={'email-address'}
                    underlineColorAndroid={"transparent"}
                    /> 
                </View>
                
                
                } */}

                
                {/* TODO: Disclaimer Text {this.state.editItemBoolean || this.state.paypal ? 
                    null 
                :
                    <View style={[styles.priceAdjustmentReminderContainer, silverBorderBottom]}>
                        <Text style={[styles.priceAdjustmentReminder, {color: 'red'}]}>{paypalReminder}</Text>
                    </View>
                } */}

                <View style={styles.navToFillDetailRow}>

                    <View style={[styles.detailHeaderContainer, {paddingHorizontal: 6,flex: 0.8}]}>
                        <Text style={[styles.detailHeader]}>Can you post this item?</Text>
                    </View>

                    <View style={[styles.checkBoxContainer, {flex: 0.2}]}>
                    <TouchableOpacity 
                    onPress={() => this.setState({canSnailMail: !this.state.canSnailMail})}
                    style={[styles.checkBox, this.state.canSnailMail ? {borderStyle: 'solid'} : {borderStyle: 'dashed'} ]}
                    >
                        {this.state.canSnailMail ?
                        <Icon 
                        name="check"
                        size={35}
                        color={lightGreen}
                        />
                        :
                        null
                        }
                    </TouchableOpacity>
                    </View>

                </View>

                


                {this.state.canSnailMail ?
                <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice("postPrice")}>
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
                
                    <View style={[styles.detailHeaderContainer, {flex: post_price > 0 ? 0.5 : 0.8}]}>
                        <Text style={styles.detailHeader}>Cost of post</Text>
                    </View>

                    {post_price > 0 ?
                        <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                            <Text style={styles.displayedPrice}>{this.state.currency + post_price}</Text>
                        </View>
                    :
                        null
                    }

                    <View style={[styles.navToFillDetailIcon, {flex: post_price > 0 ? 0.2 : 0.2 }]}>
                        <ChevronRight/>
                    </View>
                
                </View>
                </TouchableHighlight>
                :
                null
                }

                

                <WhiteSpace height={15} /> 
                
                <View style={{alignItems: 'center'}}>
                    <Button
                    large
                    disabled = { partialConditionMet ? false : true}
                    buttonStyle={{
                    backgroundColor: conditionMet ? "#22681d" : highlightYellow,
                    width: 300,
                    // height: 50,
                    borderColor: "transparent",
                    paddingHorizontal: 30,
                    paddingVertical: 15,
                    borderWidth: 0,
                    borderRadius: 5,
                    }}
                    // icon={{name: this.state.editItemBoolean ? 'auto-fix' : 'check-all', type: 'material-community'}}
                    title={this.state.editItemBoolean ? 'Submit changes' : 'Create listing'}
                    onPress={() => {
                    conditionMet ?
                        this.state.editItemBoolean ?
                            this.updateFirebaseAndNavToProfile(pictureuris, mime = 'image/jpg', uid, type, price, post_price, brand, condition, size, this.state.oldItemPostKey, this.state.oldUploadDate)
                            :
                            this.updateFirebaseAndNavToProfile(pictureuris, mime = 'image/jpg', uid, type, price, post_price, brand, condition, size, false, false)
                        :
                        this.helpUserFillDetails();
                    } } 
                    />
                </View>

                

                {this.state.editItemBoolean ?
                    <View style={styles.actionButtonContainer}>
                        <Button
                            buttonStyle={{
                            backgroundColor: profoundPink,
                            width: 180,
                            height: 80,
                            borderColor: "transparent",
                            borderWidth: 3,
                            borderRadius: 40,
                            }}
                            icon={{name: 'delete-empty', type: 'material-community'}}
                            title='Delete Product'
                            onPress={() => { 
                            this.deleteProduct(uid, this.state.oldItemPostKey);
                            } }
                        />
                    </View>
                :
                null
                }


                <Dialog
                visible={this.state.helpDialogVisible}
                dialogAnimation={new SlideAnimation({
                slideFrom: 'top',
                })}
                dialogTitle={<DialogTitle title="You forgot to fill in:" titleTextStyle={new avenirNextText('black', 22, "500")} />}
                // actions={[ 
                // <DialogButton
                // text="OK"
                // onPress={() => {this.setState({ helpDialogVisible: false });}}
                // textStyle={{color: 'black'}}
                // />,
                // ]}
                footer={
                <DialogFooter>
                    <TouchableOpacity style={{width: 90, height: 40, justifyContent: 'center'}} onPress={() => {this.setState({ helpDialogVisible: false });}}>
                        <Text style={{...textStyles.generic, color: 'black'}}>OK</Text>
                    </TouchableOpacity>
                </DialogFooter>
                }
                onTouchOutside={() => {
                this.setState({ helpDialogVisible: false });
                }}
                >
                <DialogContent>
                    <View style={styles.dialogContentContainer}>
                    { pictureuris == 'nothing here' ? <TextForMissingDetail detail={'Picture(s) of product'} /> : null }
                    { !this.state.name ? <TextForMissingDetail detail={'Name'} /> : null }
                    { !this.state.brand ? <TextForMissingDetail detail={'Brand'} /> : null }
                    { !price ? <TextForMissingDetail detail={'Selling price'} /> : null }
                    { !type ? <TextForMissingDetail detail={'Type of product'} /> : null }
                    { !size ? <TextForMissingDetail detail={'Size'} /> : null }
                    { !condition ? <TextForMissingDetail detail={'Condition'} /> : null }
                    { !this.state.paypal ? <TextForMissingDetail detail={'PayPal Email ID so we can send your payment'} /> : null }
                    </View>
                </DialogContent>
                </Dialog>

                <Divider style={{ backgroundColor: '#fff', height: 10 }} />

            </ScrollView>
        </Container>
    
    
    
    
    )
 }
}

{/* {userChangedAtLeastOneField ?
 
 <View style={styles.actionButtonContainer}>
 <Button
 small
 buttonStyle={{
 backgroundColor: '#fff',
 width: 140,
 height: 50,
 borderColor: "transparent",
 borderWidth: 0,
 borderRadius: 0,
 }}
 icon={{name: 'delete', type: 'material-community', size: 20, color: graphiteGray}}
 title='START OVER'
 onPress={() => {
 this.startOver();
 } } 
 />
 </View>
 
 :
 null
 } */}

const styles = StyleSheet.create({
 contentContainer: {
 flexGrow: 1, 
 backgroundColor: '#fff',
 flexDirection: 'column',
 justifyContent: 'space-between',
 // alignContent:'center',
 // alignItems: 'center',
 // paddingTop: 15
 
 },

 descriptionContainer: {paddingVertical: 4, paddingHorizontal: 3},

 descriptionHeaderContainer: {flex: 0.2,justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 6},

 descriptionHeader: {fontFamily: 'Avenir Next', fontSize: 19, fontWeight: "400"},

 descriptionInputContainer: {flex: 0.8, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: 2,  paddingHorizontal: 6},

 descriptionInput: {width: 280, height: 60, marginBottom: 10},

 navToFillDetailRow: {
 // backgroundColor: 'red',
 flexDirection: 'row',
 justifyContent: 'center',
 alignItems: 'center',
 paddingTop: 4,
 paddingHorizontal: 4,
 paddingVertical: 6,
 ...silverBorderBottom,
//  borderTopWidth: 0.5,

 // height: 
 },

 navToFillDetailIcon: {
 justifyContent: 'flex-end',
 alignItems: 'flex-end'
 },

 detailHeaderContainer: {
 justifyContent: 'center',
 alignItems: 'flex-start',
 marginTop: 5,
 
 },

 detailHeader: {
    ...textStyles.generic,
    ...Fonts.medium,
    fontWeight: "600",
 },

 displayedPriceContainer: {
 justifyContent: 'center',
 alignItems: 'flex-end'
 },

 displayedPrice: {
 fontFamily: avenirNext,
 fontSize: 21,
 fontWeight: '600',
 color: darkGray

 },

 priceAdjustmentReminderContainer: {
 justifyContent: 'center',
 padding: 10,
 borderBottomWidth: 0.5,
 borderColor: darkGray
 },

 priceAdjustmentReminder: {...textStyles.generic, color: graphiteGray, textAlign: "left", fontSize: 13},

 displayedCondition: new avenirNextText('black', 16, "300"),

 imageadder: {
 flexDirection: 'row'
 },

 promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'},

 modalPicker: {
 flexDirection: 'column',
 paddingLeft: 20,
 paddingRight: 20,
 justifyContent: 'flex-start',
 alignItems: 'center',
 },

 subHeading: {
 fontFamily: avenirNext,
 color: '#0c5759',
 fontSize: 15,
 textDecorationLine: 'underline',
 },

 picker: {
 width: 280,
 // justifyContent: 'center',
 // alignContent: 'center',
 //alignItems: 'center'
 // height: height/2
 },

 pickerText: {
 fontFamily: avenirNext,
 fontSize: 22,
 fontWeight: 'bold'
 },

 men: {
 color: confirmBlue
 },

 accessories: {
 color: woodBrown
 },

 women: {
 color: rejectRed
 },

 optionSelected: {
 fontFamily: avenirNext,
 fontWeight: 'bold',
 fontSize: 18,
 color: '#0c5925'
 },

 buttonGroupText: {
    fontFamily: 'Avenir Next',
    fontSize: 14,
    fontWeight: '300',
    color: 'black'
 },

 buttonGroupSelectedText: {
    color: '#fff'
 },

 buttonGroupContainer: {
    height: 40,
    backgroundColor: '#edeff2',
    borderWidth: 1,
    borderColor: 'black'
 },
 
 buttonGroupSelectedContainer: {
    backgroundColor: treeGreen
 },

 actionButtonContainer: {padding: 5, alignItems: 'center'},

 dialogContentContainer: {
 padding: 5,
 },

 checkBoxContainer: {
 padding: 10,
 alignItems: 'center'
 },

 checkBox: {
 width: 40,
 height: 40,
 borderWidth: 1.2,
 borderColor: 'black',
 borderRadius: 10,
 }
})

export default withNavigation(CreateItem)


{/* <ProductLabel color={'black'} title='Select a Size'/> 
 <ButtonGroup
 onPress={ (index) => {this.setState({size: index})}}
 selectedIndex={this.state.size}
 buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
 containerStyle={styles.buttonGroupContainer}
 buttonStyle={styles.buttonGroup}
 textStyle={styles.buttonGroupText}
 selectedTextStyle={styles.buttonGroupSelectedText}
 selectedButtonStyle={styles.buttonGroupSelectedContainer}
 /> */}

{/* <View style={styles.modalPicker}>
 <CustomModalPicker subheading={'Product Condition:'}>
 <Picker style={styles.picker} itemStyle={[styles.pickerText, {color: 'black'}]} selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
 <Picker.Item label = "New With Tags" value = "New With Tags" />
 <Picker.Item label = "New Without Tags" value = "New Without Tags" />
 <Picker.Item label = "Slightly Used" value = "Slightly Used" />
 <Picker.Item label = "Used" value = "Used" />
 </Picker>
 </CustomModalPicker> 
 <Text style={styles.optionSelected}>{this.state.condition}</Text>
 </View> */}

{/* <TextField 
 label="Optional Description (e.g. Great for chilly weather)"
 value={this.state.description}
 onChangeText = { (desc)=>{this.setState({description: desc})}}
 multiline = {true}
 characterRestriction = {180}
 textColor={basicBlue}
 tintColor={darkGreen}
 baseColor={darkBlue}
 /> */}


// <View style={styles.modalPicker}>
// <CustomModalPicker subheading={'Product Type:'}>
// {this.showPicker(this.state.gender)} 
// </CustomModalPicker>
// <Text style={styles.optionSelected}>{this.state.type}</Text>
// </View> 
// {/* product age (months) */}
// <View style = { {alignItems: 'center', flexDirection: 'column'} } >
// <NumericInput 
// value={this.state.months} 
// onChange={months => this.setState({months})} 
// type='plus-minus'
// initValue={0}
// minValue={0}
// maxValue={200}
// totalWidth={240} 
// totalHeight={50} 
// iconSize={25}
// valueType='real'
// rounded 
// textColor='black' 
// iconStyle={{ color: 'white' }} 
// upDownButtonsBackgroundColor='#E56B70'
// rightButtonBackgroundColor={limeGreen} 
// leftButtonBackgroundColor={darkGreen}
// containerStyle={ {justifyContent: 'space-evenly', padding: 10,} } 
// />
// <Text> Months since you bought the product </Text>
// </View>


{/* <Jiro
 label={'Name (e.g. )'}
 value={this.state.name}
 onChangeText={name => this.setState({ name })}
 maxLength={16}
 autoCorrect={false}
 autoCapitalize={'words'}
 
 // this is used as active border color
 borderColor={treeGreen}
 // this is used to set backgroundColor of label mask.
 // please pass the backgroundColor of your TextInput container.
 backgroundColor={'#F9F7F6'}
 inputStyle={{ color: 'black' }}
 /> */}