import React from "react";
import { COLORS, icons, SIZES, images, FONTS } from '../constants';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";

const MenuList = ({ navigation, menu, onPressFavorite, favorites, categorySelected, categories }) => {

    function getCategoryNameById(id) {
        let category = categories.filter(a => a.id == id)
        if (category.length > 0) {
            return category[0].name
        } else
            return ""
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.container}
                onPress={() => {
                    navigation.navigate('Restaurant', {
                        currentItem: item, currentCategory: (getCategoryNameById(item.category))
                    });
                }}>

                {/*  Food Image */}
                <Image
                    source={{ uri: item.photoUrl, cache: 'force-cache' }}
                    resizeMode='contain'
                    style={styles.image}
                />

                {/* Favorite Icon */}
                <TouchableOpacity style={styles.favorite_icon} onPress={() => onPressFavorite(item)}>
                    <Image
                        source={icons.like}
                        resizeMode='contain'
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: (favorites.includes(item.name)) ? 'red' : COLORS.darkgray
                        }}
                    />
                </TouchableOpacity>

                {/* Name & Price */}
                <View style={styles.name_price_container}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>Rs. {item.price}</Text>
                </View>

            </TouchableOpacity>
        )

    }

    return (
        <View style={{ flex: 1 }}>

            {!categorySelected ? <Text style={styles.heading}>Explore Popular</Text> : null}
            <FlatList
                data={menu}
                numColumns={2}
                keyExtractor={item => `${item.name}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 18,
                    paddingTop: 16

                }} />

        </View>

    )
}

export default MenuList;

const styles = StyleSheet.create({

    container: {
        margin: 8,
        width: (SIZES.width * 0.5 - 24),
        height: 200,
        elevation: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white
    },

    image: {
        width: '70%',
        height: '70%',
    },

    favorite_icon: {
        position: 'absolute',
        top: 14,
        right: 14
    },

    name_price_container: {
        padding: SIZES.padding,
        position: 'absolute',
        bottom: 0,
        height: 70,
        width: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    name: {
        ...FONTS.body4,
        color: COLORS.black,
        textAlign: 'center'
    },

    price: {
        ...FONTS.body3,
        color: COLORS.primary
    },
    heading: {
        ...FONTS.h3,
        paddingLeft: 16,
        paddingBottom: 10
    }

})