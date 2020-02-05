import React from 'react';

import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import { Helpers, Fonts } from '../../Theme';

const Submit = ({onPress, text}) => (
    <TouchableOpacity onPress={onPress} style={styles.submitButton}>
        <Text style={styles.submitText}>{text}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    submitButton: {
        width: 90,
        height: 40,
        backgroundColor: '#fff',
        ...Helpers.center,
        borderRadius: 10,

    },

    submitText: {
        ...Fonts.style.normal,
        color: '#000000'
    }
})

export default {
    Submit,
}