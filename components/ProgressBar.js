import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { FONTS, SIZES, COLORS } from '../constants';

const ProgressBar = ({ text }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color='black' />
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}
export default ProgressBar;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.padding * 2,
        alignSelf: 'center'
    },

    text: {
        marginTop: 14,
        color: COLORS.black,
        ...FONTS.body3
    }
})