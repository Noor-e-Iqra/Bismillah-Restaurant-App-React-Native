import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, icons, SIZES, FONTS } from '../constants';

const Header = ({ title, navigation }) => {
    return (

        <View style={styles.container}>

            {/* Go Back */}
            <TouchableOpacity style={styles.go_back}
                onPress={() => navigation.goBack()}>
                <Image
                    source={icons.back}
                    resizeMode="contain"
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.black
                    }}
                />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

        </View >
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: COLORS.lightGray,
        elevation: 1.5
    },

    title: {
        ...FONTS.h2,
        marginLeft: SIZES.padding * 2
    },

    go_back: {
        width: 50,
        justifyContent: 'center',
        paddingLeft: SIZES.padding * 2
    }
})