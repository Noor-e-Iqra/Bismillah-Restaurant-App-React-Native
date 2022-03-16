import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { Globalstyles } from "../styles/GlobalStyle";
import { CustomButton, CartIcon } from "../components";
import { COLORS, icons, SIZES, images, FONTS, DATABASE_URL } from '../constants';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { firebase } from '@react-native-firebase/database';
import { useSelector } from 'react-redux';

const Restaurant = ({ route, navigation }) => {

    const { user } = useSelector(state => state.userReducer);
    const [item, setItem] = useState(null)
    const [category, setCategory] = useState(null)

    useEffect(() => {
        const { currentItem, currentCategory } = route.params;
        setItem(currentItem)
        if (currentCategory == "Sand\nWiches")
            setCategory(currentCategory.replace("\nW", "w"))
        else
            setCategory(currentCategory.replace("\n", " "))
    }, [])


    //function for adding item in cart in firebase 
    function addToCart() {
        const REFERENCE_URL = '/Cart/' + item?.name;
        const cartReference = firebase.app().database(DATABASE_URL).ref(REFERENCE_URL);
        if (user) {
            cartReference.set({ ...item, "qty": 1, "total": item?.price, "uid": user.uid, "category": category }).then(() => {
                console.log("Added to Cart")
            }).catch(e => console.log(e))
        } else {
            navigation.navigate('SignUp', { screen: 'Restaurant', currentItem: item, currentCategory: category })
        }

    }

    // Header function
    function renderHeader() {
        return (

            <View style={{ flexDirection: 'row', height: 50 }}>

                {/* Go back */}
                <TouchableOpacity style={styles.go_back}
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: COLORS.black
                        }} />
                </TouchableOpacity>

                {/* Category */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.category}>
                        <Text style={{ ...FONTS.h3 }}>{category}</Text>
                    </View>
                </View>

                {/* Cart */}
                <CartIcon navigation={navigation} />

            </View>
        )
    }

    //function for displaying food item information
    function renderFoodInfo() {

        return (
            <>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.food_image}>

                        {/* Food Image */}
                        <Image
                            source={{ uri: item?.photoUrl }}
                            resizeMode='contain'
                            style={{
                                width: SIZES.width - 24,
                                height: '95%',


                            }} />

                    </View>
                </View>

                <View style={styles.bottom_container}>

                    {/* Name */}
                    <Text style={styles.name}>{item?.name}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{item?.description}</Text>

                    {/* Duration */}
                    <View style={styles.row_container}>
                        <Text style={styles.duration_text}>Duration:</Text>
                        <Text style={styles.duration_text}>{item?.duration}</Text>
                    </View>

                    <View style={styles.row_container}>

                        {/* Price */}
                        <Text style={styles.price}>Rs. {item?.price}</Text>

                        {/* Rating */}
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={icons.star}
                                resizeMode="contain"
                                style={{
                                    width: 23,
                                    height: 23,
                                }} />
                            <Text style={styles.rating}>{item?.rating}</Text>
                        </View>

                    </View>

                    {/* Add to Cart Button */}
                    <View style={{ margin: SIZES.padding * 2, marginTop: 0 }}>
                        <CustomButton text='Add to Cart' onPressButton={() => addToCart()} />
                    </View>


                </View>

                {
                    isIphoneX() &&
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                            backgroundColor: COLORS.white
                        }}>

                    </View>
                }

            </>

        )
    }

    return (
        <SafeAreaView style={Globalstyles.container_1}>
            {renderHeader()}
            {renderFoodInfo()}
        </SafeAreaView>
    )

}

export default Restaurant;

const styles = StyleSheet.create({

    food_image: {
        height: SIZES.height * 0.30,
        marginTop: 16,
        paddingBottom: 20,

    },

    bottom_container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 5,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    name: {
        ...FONTS.h3, textAlign: 'center',
        paddingVertical: SIZES.padding * 2,
        marginHorizontal: SIZES.padding * 3,
        borderBottomColor: COLORS.lightGray3,
        borderBottomWidth: 1
    },

    description: {
        ...FONTS.body4, textAlign: 'center',
        paddingVertical: SIZES.padding * 2,
        marginHorizontal: SIZES.padding * 3,
        color: COLORS.black,
        borderBottomColor: COLORS.lightGray3,
        borderBottomWidth: 1
    },

    row_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SIZES.padding * 2,
        paddingHorizontal: SIZES.padding * 3,

    },

    duration_text: {
        marginLeft: SIZES.padding,
        ...FONTS.body3,
        color: COLORS.black
    },

    price: {
        marginLeft: SIZES.padding,
        ...FONTS.h3
    },

    rating: {
        marginLeft: SIZES.padding,
        ...FONTS.h4
    },

    go_back: {
        width: 50,
        paddingLeft: SIZES.padding * 2,
        justifyContent: 'center'
    },

    category: {
        height: '100%',
        width: '75%',
        backgroundColor: COLORS.lightGray3,
        paddingHorizontal: SIZES.padding * 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZES.radius
    },

    cart: {
        width: 50,
        paddingRight: SIZES.padding * 2,
        justifyContent: 'center'
    }
})