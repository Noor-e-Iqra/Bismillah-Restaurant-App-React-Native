import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Globalstyles } from "../styles/GlobalStyle";
import { CartItems, InnerHeader } from "../components";
import { DATABASE_URL } from "../constants";
import { firebase } from '@react-native-firebase/database';
import { useSelector } from 'react-redux';

const Cart = ({ navigation }) => {

    const { user } = useSelector(state => state.userReducer);
    const [cartItems, setCartItems] = useState(null)
    const cartReference = firebase.app().database(DATABASE_URL).ref('/Cart/');

    useEffect(() => {
        if (user) {
            let array = [];
            cartReference.on('value', snapshot => {
                snapshot.forEach((snapshotItem) => {
                    var item = snapshotItem.val()
                    if (item.uid == user.uid)
                        array.push(item)
                })
                setCartItems(array);
                array = [];
            });
        } else
            setCartItems([])

    }, [user]);


    // function for saving order data in firebase
    function confirmOrder() {
        let durations = cartItems.map((item) => (parseInt(item.duration.charAt(item.duration.length - 6) +
            item.duration.charAt(item.duration.length - 5))))

        let total_duration = durations.reduce((a, b) => a + (b || 0), 0);

        let array = []
        const Oid = firebase.app().database(DATABASE_URL).ref('/Order/').push();

        array.push({ total: getTotal(), oid: Oid.key, totalItems: cartItems.length, uid: user.uid, time: total_duration })

        for (let index = 0; index < cartItems.length; index++) {
            var key = `item${index + 1}`;
            var obj = {};
            obj[key] = cartItems[index].qty + ' ' + cartItems[index].name + ' Rs.' + cartItems[index].price;
            array.push(obj)
        }

        Oid.set(Object.assign(...array));
        navigation.navigate('menu', { screen: 'Order' })
    }

    //function to delete a cart item
    function deleteItem(name) {
        firebase.app().database(DATABASE_URL).ref('/Cart/' + name).remove();

    }

    //function for getting total price
    function getTotal() {
        let total = 0;
        if (cartItems != null)
            total = cartItems.reduce((a, b) => a + (b.total || 0), 0);
        return total
    }

    //function for changing item quantity
    function changeQty(item, action) {
        const itemReference = firebase.app().database(DATABASE_URL).ref('/Cart/' + item.name);
        if (action == '+') {
            itemReference.update({ qty: item.qty + 1, total: (item.qty + 1) * item.price })
                .then(() => console.log('qty increased!'));
        } else {
            if (item.qty > 1) {
                itemReference.update({ qty: item.qty - 1, total: (item.qty - 1) * item.price })
                    .then(() => console.log('qty decreased!'));
            }
        }
    }


    return (

        <SafeAreaView style={Globalstyles.container_1}>
            <InnerHeader title='My Cart' navigation={navigation} />
            <CartItems
                cartItems={cartItems}
                getTotal={getTotal}
                deleteItem={deleteItem}
                changeQty={changeQty}
                confirmOrder={confirmOrder}
                navigation={navigation} />
        </SafeAreaView>
    )

}

export default Cart;
