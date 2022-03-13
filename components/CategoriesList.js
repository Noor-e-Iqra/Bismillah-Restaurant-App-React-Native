import React from "react";
import { COLORS, icons, SIZES, images, FONTS } from '../constants';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";

const CategoriesList = ({ onSelectCategory, selectedCategory, categories }) => {

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ ...styles.container, ...styles.shadow, backgroundColor: (selectedCategory?.id == item.id) ? COLORS.primary : COLORS.white, }}
                onPress={() => onSelectCategory(item)}>

                {/* Image */}
                <View style={{ ...styles.image_container, backgroundColor: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.lightGray }}>
                    <Image
                        source={item.icon}
                        resizeMode="contain"
                        style={{
                            height: 45,
                            width: 45
                        }} />
                </View>

                {/* Text */}
                <Text style={{ ...styles.text, color: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.black, }}>
                    {item.name}
                </Text>

            </TouchableOpacity>
        )

    }

    return (
        <View style={styles.view_container}>
            <Text style={styles.heading}>Categories</Text>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: SIZES.padding * 2, paddingLeft: 2 }} />
        </View>
    )
}
export default CategoriesList;

const styles = StyleSheet.create({
    container: {
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.padding,
        borderRadius: 40,
    },

    image_container: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },

    text: {
        textAlign: 'center',
        marginTop: SIZES.padding,
        ...FONTS.body4
    },

    view_container: {
        padding: SIZES.padding * 2,
        paddingBottom: 0,
    },

    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,


    },

    heading: {
        ...FONTS.h3
    }
})