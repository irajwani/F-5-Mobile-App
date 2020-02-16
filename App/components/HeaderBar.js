import React from 'react';
import { View, StyleSheet, Image, Text } from "react-native";
import { logoGreen } from "../colors";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Images, Colors, Fonts } from '../Theme';

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

const TabHeader = ({text}) => (
    <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>{text}</Text>
    </View>
)

export {HeaderBar, TabHeader}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.secondary,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },

    logo: {
        width: 50,
        height: 50,
    },

    tabHeader: {
        flex: 0.1,
        flexDirection: 'row',
        backgroundColor: Colors.grey,
        paddingLeft: 10,
        alignItems: 'center',
    },

        tabHeaderText: {
            ...Fonts.style.medium,
            color: Colors.tertiary,
            fontWeight: "400"

        }
})