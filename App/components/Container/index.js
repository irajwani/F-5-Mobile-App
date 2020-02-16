import React from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { Colors, Helpers } from '../../Theme'

const Container = ({children, style = null, center = null} ) => (
    <SafeAreaView style={[styles.container, style ? style : null, center ? {...Helpers.center} : null]}>
        {children}
    </SafeAreaView>
)

export default Container

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    }
})
