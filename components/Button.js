import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, icons, SIZES, FONTS } from '../constants';

const CustomButton = ({ text, onPressButton }) => {

    return (

        <View style={styles.button_container}>
            <TouchableOpacity style={styles.button} onPress={onPressButton} >
                <Text style={styles.button_text}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton;

const styles = StyleSheet.create({
    button_container: {
        marginTop: SIZES.padding * 3,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: COLORS.primary,
        width: '100%',
        padding: SIZES.padding,
        alignItems: 'center',
        borderRadius: SIZES.radius
    },

    button_text: {
        ...FONTS.h2,
        color: COLORS.white
    }
})