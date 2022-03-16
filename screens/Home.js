import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { COLORS, categoryData, DATABASE_URL } from '../constants';
import { Globalstyles } from "../styles/GlobalStyle";
import { MenuList, CategoriesList, HomeHeader } from "../components";
import { firebase } from '@react-native-firebase/database';
import { useSelector } from 'react-redux';

const Home = ({ navigation }) => {

    const { user } = useSelector(state => state.userReducer);
    const [menu, setMenu] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [userPhoto, setUserPhoto] = useState(null)
    const [favorites, setFavorites] = useState([]);
    const [categorySelected, setCategorySelected] = useState(false)
    const menuReference = firebase.app().database(DATABASE_URL).ref('/Menu/');

    useEffect(() => {
        let array = [];
        menuReference.on('value', snapshot => {
            snapshot.forEach((item) => {
                var snapshotItem = item.val();
                if (snapshotItem.rating >= 4.8) {
                    array.push(snapshotItem)
                }
            })
            setMenu(array);
            array = []
        });
        getFavorites()
        getUserPhoto()
        setCategorySelected(false)
        setSelectedCategory(null)

    }, [user]);


    function getFavorites() {
        if (user) {
            let array = [];
            const favoriteReference = firebase.app().database(DATABASE_URL).ref('/Favorite/');
            favoriteReference.on('value', snapshot => {
                snapshot.forEach((item) => {
                    var snapshotItem = item.val();
                    if (snapshotItem != null && snapshotItem.uid == user.uid) {
                        array.push(snapshotItem.name)
                    }
                })
                setFavorites(array)
                array = [];
            });
        } else
            setFavorites([])
    }

    function getUserPhoto() {
        if (user) {
            const userReference = firebase.app().database(DATABASE_URL).ref('/Users/' + user.uid + '/photoUrl');
            userReference.on('value', snapshot => {
                setUserPhoto(snapshot.val())
            });
        } else
            setUserPhoto("default")

    }

    function onSelectCategory(category) {
        setCategorySelected(true)
        let array = [];
        menuReference.on('value', snapshot => {
            snapshot.forEach((item) => {
                var snapshotItem = item.val();
                if (snapshotItem.category == category.id) {
                    array.push(snapshotItem)
                }
            })
            setMenu(array);
        });
        setSelectedCategory(category)
    }

    function addToFavorite(favoriteItem) {
        if (user) {
            const REFERENCE_URL = '/Favorite/' + favoriteItem.name;
            const favoriteReference = firebase.app().database(DATABASE_URL).ref(REFERENCE_URL);

            favoriteReference.once('value').then(snapshot => {
                var item = snapshot.val()
                if (item != null) {
                    firebase.app().database(DATABASE_URL).ref(REFERENCE_URL).remove();
                    setFavorites(favorites.filter(a => a != item.name))
                } else {
                    favoriteReference.set({ ...favoriteItem, "uid": user.uid }).then(() => {
                        console.log("Added to favorite")
                    }).catch(e => console.log(e))
                    setFavorites([...favorites, favoriteItem.name]);
                }

            });
        } else
            Alert.alert("", "Please Sign up/Sign in to add this to favorite")

    }

    function searchMenu(text) {
        let array = [];
        menuReference.on('value', snapshot => {
            snapshot.forEach((item) => {
                var snapshotItem = item.val();
                if (snapshotItem.name.toLowerCase().includes(text.toLowerCase())) {
                    array.push(snapshotItem)
                }
            })
            setMenu(array);
            array = []
        });
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <SafeAreaView style={Globalstyles.container_1}>
                <HomeHeader userPhoto={userPhoto} searchMenu={searchMenu} navigation={navigation} />

                <CategoriesList onSelectCategory={onSelectCategory}
                    selectedCategory={selectedCategory}
                    categories={categoryData} />

                <MenuList navigation={navigation}
                    menu={menu}
                    onPressFavorite={addToFavorite}
                    favorites={favorites}
                    categorySelected={categorySelected}
                    categories={categoryData} />
            </SafeAreaView>

        </TouchableWithoutFeedback>
    )

}

export default Home;
