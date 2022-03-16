import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { FONTS, categoryData, DATABASE_URL } from '../constants';
import { MenuList, Header } from "../components";
import { firebase } from '@react-native-firebase/database';
import { Globalstyles } from "../styles/GlobalStyle";
import { useSelector } from 'react-redux';

const Favorites = ({ navigation }) => {

    const { user } = useSelector(state => state.userReducer);
    const [favorites, setFavorites] = useState([]);
    const favoriteReference = firebase.app().database(DATABASE_URL).ref('/Favorite/');

    useEffect(() => {
        let array = [];
        if (user) {
            favoriteReference.on('value', snapshot => {
                snapshot.forEach((item) => {
                    var snapshotItem = item.val();
                    if (snapshotItem != null && snapshotItem.uid == user.uid) {
                        array.push(snapshotItem)
                    }
                })
                setFavorites(array)
                array = [];
            });
        } else
            setFavorites([])
    }, [user]);

    function removeFavorite(favoriteItemName) {
        firebase.app().database(DATABASE_URL).ref('/Favorite/' + favoriteItemName.name).remove();
    }

    return (
        <SafeAreaView style={Globalstyles.container_1}>
            <Header title='Favorites' navigation={navigation} />

            {
                (favorites.length != 0) ?

                    <MenuList navigation={navigation}
                        menu={favorites}
                        onPressFavorite={removeFavorite}
                        favorites={favorites.map((item) => item.name)}
                        categorySelected={true}
                        categories={categoryData} />

                    : <View style={styles.empty_text}>
                        <Text style={{ ...FONTS.h4 }}>Nothing added to Favorites</Text>
                    </View>
            }

        </SafeAreaView>
    )

}

export default Favorites;

const styles = StyleSheet.create({

    empty_text: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})