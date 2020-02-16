import React, { Component } from 'react'
import { TextInput, View, Text } from 'react-native'
import { Metrics, Fonts, Colors, Helpers } from '../../Theme'

const AuthInput = ({placeholder, onChangeText, value, secureTextEntry, keyboardType, maxLength = false, isHalf = false}) => (
    <View style={{width: isHalf ? (Metrics.screenWidth - 20)/2 : Metrics.screenWidth - 20, height: 50,marginBottom: 10 }}>
        <View style={{flex: 0.25, justifyContent: 'flex-start', }}>
            <Text style={{...Fonts.style.small, fontWeight: "600", color: Colors.lightgrey,}}>{placeholder}</Text>
        </View>
        <TextInput
        secureTextEntry={secureTextEntry ? true : false}
        style={{flex: 0.75, ...Fonts.style.medium, ...Helpers.thinBottomBorder, color: 'black'}}
        placeholder={""}
        placeholderTextColor={Colors.grey}
        onChangeText={onChangeText}
        value={value}
        multiline={false}
        
        autoCorrect={false}
        autoCapitalize={'none'}
        clearButtonMode={'while-editing'}
        underlineColorAndroid={"transparent"}
        keyboardType={keyboardType == "email" ? 'email-address' : 'default'}
        maxLength={maxLength ? maxLength : null}
        underlineColorAndroid={"transparent"}
        returnKeyType={"next"}
        />         
    </View>
)

export default AuthInput
