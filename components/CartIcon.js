import React, { useEffect, useState } from "react";
import { COLORS, icons, SIZES, FONTS, DATABASE_URL } from '../constants';
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { firebase } from '@react-native-firebase/database';
import { useSelector } from 'react-redux';

const CartIcon = ({ navigation }) => {
    const { user } = useSelector(state => state.userReducer);
    const [cartItemsNum, setCartItemsNum] = useState(0)
    const cartReference = firebase.app().database(DATABASE_URL).ref('/Cart/');

    useEffect(() => {
        if (user) {
            cartReference.on('value', snapshot => {
                setCartItemsNum(snapshot.numChildren());
            });

        } else {
            setCartItemsNum(0)
        }

    }, [user]);

    return (
        <>
            {/* cart image */}
            <TouchableOpacity style={styles.cart}
                onPress={() =>
                    navigation.navigate('Cart')}>

                <Image
                    source={icons.cart}
                    resizeMode="contain"
                    style={{
                        width: 35,
                        height: 35,
                    }}
                />
                {/* cart items number */}
                <View style={styles.num}>
                    <Text style={styles.text}>{cartItemsNum}</Text>
                </View>
            </TouchableOpacity>
        </>

    )
}

export default CartIcon;

const styles = StyleSheet.create({
    num: {
        position: 'absolute',
        top: 0,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        height: 18,
        width: 18,
        borderRadius: 18
    },

    cart: {
        width: 50,
        paddingRight: SIZES.padding * 2,
        justifyContent: 'center'
    },

    text: {
        ...FONTS.body5,
        color: COLORS.white
    }
})