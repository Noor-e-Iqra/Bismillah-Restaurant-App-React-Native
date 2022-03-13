import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { FONTS, DATABASE_URL } from '../constants';
import { OrderList } from "../components";
import { Globalstyles } from "../styles/GlobalStyle";
import { Header } from "../components";
import { firebase } from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"


const Order = ({ navigation }) => {

    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null)
    const orderReference = firebase.app().database(DATABASE_URL).ref('/Order/');

    useEffect(() => {
        auth().onAuthStateChanged(onAuthStateChanged)
        let array = [];
        if (user != null) {
            orderReference.on('value', snapshot => {
                snapshot.forEach((snapshotItem) => {
                    var item = snapshotItem.val()
                    if (item.uid == user.uid)
                        array.push(item)
                })
                setOrders(array);
                array = [];
            });
        } else
            setOrders([])
    }, [user]);

    function onAuthStateChanged(user) {
        setUser(user)
    }

    function deleteOrder(oid) {
        firebase.app().database(DATABASE_URL).ref('/Order/' + oid).remove();

    }

    return (

        <SafeAreaView style={Globalstyles.container_1}>
            <Header title='Orders' navigation={navigation} />
            {
                (orders.length != 0) ?
                    <OrderList navigation={navigation} orders={orders} deleteOrder={deleteOrder} />
                    :
                    <View style={styles.empty_text}>
                        <Text style={{ ...FONTS.h4 }}>Nothing Ordered Yet!</Text>
                    </View>

            }
        </SafeAreaView>
    )

}

export default Order;

const styles = StyleSheet.create({
    empty_text: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})