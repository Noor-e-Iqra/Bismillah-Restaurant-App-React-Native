import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { COLORS, SIZES, FONTS, icons } from '../constants';

const OrderList = ({ navigation, orders, deleteOrder }) => {

    function displayOrderItems(item) {
        var items = '\n';
        for (let i = 1; i <= item.totalItems; i++)
            items = items + item[`item${i}`] + '\n'

        return items

    }

    const renderItem = ({ item, index }) => {

        return (

            <View style={styles.container}>

                {/* Order No */}
                <View style={{ padding: SIZES.padding * 2, }}>

                    {/* Order No */}
                    <View style={styles.row}>
                        <Text style={styles.order_no_text}>Order : {index + 1}</Text>

                        {/* Time */}
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={icons.time} style={{ height: 20, width: 20, tintColor: COLORS.primary }} />
                            <Text style={{ ...FONTS.body4, color: COLORS.black }}>  {item.time} mins</Text>
                        </View>
                    </View>

                    {/* Order Items */}
                    <Text style={styles.order_items_text}>{displayOrderItems(item)}</Text>


                    {/* Total */}
                    <View style={styles.total}>
                        <Text style={{ ...FONTS.body3, color: COLORS.black }}>Total: </Text>
                        <Text style={{ ...FONTS.body2, color: COLORS.black }}>Rs. {item.total}</Text>
                    </View>

                    {/* Track & Cancel buttons */}
                    <View style={styles.buttons_container}>
                        <TouchableOpacity style={{ ...styles.buttons, marginRight: 40 }}
                            onPress={() => navigation.navigate('OrderDelivery', { time: item.time + 10 })}>
                            <Text style={styles.buttons_text}>Track Order</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...styles.buttons, backgroundColor: 'red' }}
                            onPress={() => deleteOrder(item.oid)}>
                            <Text style={styles.buttons_text}>Cancel Order</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View >

        )

    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={orders}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{
                    padding: 16,
                }} />
        </View>
    )
}

export default OrderList;

const styles = StyleSheet.create({
    container: {
        margin: 8,
        elevation: 3,
        width: SIZES.width - 45,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white
    },
    order_no_text: {
        ...FONTS.h4,
        color: COLORS.black,
    },
    order_items_text: {
        ...FONTS.body4,
        color: COLORS.black

    },
    total: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray3,
        paddingVertical: 8,
        borderBottomColor: COLORS.lightGray3,
        borderBottomWidth: 1
    },
    buttons_container: {
        padding: SIZES.padding * 2,
        paddingBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    buttons: {
        backgroundColor: COLORS.primary,
        width: SIZES.width * 0.35,
        padding: SIZES.padding,
        alignItems: 'center',
        borderRadius: SIZES.radius
    },
    buttons_text: {
        ...FONTS.body4,
        color: COLORS.white
    },
    row: {
        paddingBottom: 8,
        borderBottomColor: COLORS.lightGray3,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})