import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class Welcome extends Component {
    render() {
        return (
            <View>
                <Text> Welcome </Text>
            </View>
        )
    }
}



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