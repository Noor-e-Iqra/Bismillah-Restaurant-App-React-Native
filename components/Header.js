import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, icons, SIZES, FONTS } from '../constants';
import CartIcon from "./CartIcon";

const Header = ({ title, icon, onPressIcon, navigation }) => {
    return (

        <View style={styles.container}>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/*Cart/Logout image*/}
            {icon ?
                <TouchableOpacity style={styles.cart} onPress={onPressIcon}>
                    <Image
                        source={icon}
                        resizeMode="contain"
                        style={{
                            width: 35,
                            height: 35,
                        }}
                    />
                </TouchableOpacity> :
                <CartIcon navigation={navigation} />
            }
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        backgroundColor: COLORS.lightGray,
        elevation: 1.5
    },

    title: {
        ...FONTS.h2,
        marginLeft: SIZES.padding * 2
    },

    cart: {
        width: 50,
        justifyContent: 'center'
    }
})