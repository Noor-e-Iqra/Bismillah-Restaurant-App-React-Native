import React, { useEffect, useState } from "react";
import { COLORS, icons, SIZES, images, FONTS } from '../constants';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput } from "react-native";
import CartIcon from "./CartIcon";
import { firebase } from '@react-native-firebase/database';
import database from '@react-native-firebase/database'
import auth from "@react-native-firebase/auth"

const HomeHeader = ({ userPhoto, searchMenu, navigation }) => {

    return (

        <View style={styles.container}>

            {/* user photo */}
            <TouchableOpacity style={styles.user_photo} onPress={() => navigation.navigate('menu', { screen: 'Account' })}>
                <Image
                    source={userPhoto == "default" ? icons.profile_user : { uri: userPhoto }}
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 30,

                    }}
                />
            </TouchableOpacity>

            {/* search bar */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                <View style={styles.search_bar_image}>
                    <Image
                        source={icons.search}
                        style={{
                            width: 20,
                            height: 20,
                            marginStart: 16,
                            marginEnd: 8,
                            tintColor: COLORS.darkgray
                        }}
                    />
                    <TextInput style={styles.search_bar_text} placeholder='Search'
                        onChangeText={(text) => searchMenu(text)} />
                </View>
            </View>

            {/* cart image */}
            <CartIcon navigation={navigation} />

        </View>
    )
}

export default HomeHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 50
    },

    user_photo: {
        width: 50,
        paddingLeft: SIZES.padding * 2,
        justifyContent: 'center'

    },

    search_bar_image: {
        flexDirection: 'row',
        width: '85%',
        height: '100%',
        backgroundColor: COLORS.lightGray3,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: SIZES.radius,
    },

    search_bar_text: {
        ...FONTS.h4,
        flex: 1,
        marginEnd: 16
    },

})