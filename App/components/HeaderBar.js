import React from 'react';
import { View, StyleSheet, Image } from "react-native";
import { logoGreen } from "../colors";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Images } from '../Theme';

const HeaderBar = ({customFlex,navigation,hideCross}) => (
    <View style={[styles.headerContainer, {flex: customFlex ? customFlex : 0.1}]}>
        
        <FontAwesomeIcon
        name='arrow-left'
        size={28}
        color={"black"}
        onPress={()=>navigation.goBack()}
        />

        <Image style={styles.logo} source={Images.logo}/>
              
        <FontAwesomeIcon
        name='close'
        size={28}
        color={hideCross ? logoGreen : 'black'}
        onPress={()=>navigation.goBack()}
        />
          
    </View>
)

export {HeaderBar}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: logoGreen,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },

    logo: {
        width: 50,
        height: 50,
    }
})