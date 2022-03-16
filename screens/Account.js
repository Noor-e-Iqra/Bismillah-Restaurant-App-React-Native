import React, { useState, useEffect } from 'react';
import { Alert, Text, View, Image, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Globalstyles } from '../styles/GlobalStyle';
import { FONTS, SIZES, COLORS, icons, images, DATABASE_URL } from '../constants';
import SignUp from './SignUp';
import { Header, CustomButton } from '../components';
import { firebase } from '@react-native-firebase/database';
import { setUser } from '../redux/actions';
import { useDispatch } from 'react-redux';


const signOutUser = async (setUserInfo, dispatch) => {
    try {
        await firebase.auth().signOut();
        setUserInfo(null)
        dispatch(setUser(null))

    } catch (e) {
        Alert.alert("Error", e.message)
    }
}

const Account = ({ navigation }) => {

    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const userReference = firebase.app().database(DATABASE_URL).ref('/Users/' + currentUser.uid);
                userReference.on('value', snapshot => {
                    setUserInfo(snapshot.val())
                });
            }
        });

        return unsubscribe;

    }, [navigation]);

    return (

        <>
            {userInfo ?
                <SafeAreaView style={Globalstyles.container_1}>
                    {/* Header */}
                    <Header title='Account' icon={icons.logout} onPressIcon={() => signOutUser(setUserInfo, dispatch)} />

                    <View style={Globalstyles.container_2}>
                        {/* User Photo */}
                        {userInfo.photoUrl == 'default' || userInfo.photoUrl == '' || userInfo.photoUrl == undefined ?
                            <View style={styles.image_container}>
                                <Image
                                    source={icons.user}
                                    resizeMode='center'
                                    style={{
                                        width: '50%',
                                        height: '50%',
                                    }}
                                />
                            </View> :
                            <Image
                                source={{ uri: userInfo.photoUrl }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 55,
                                    marginTop: SIZES.padding * 4,
                                    alignSelf: 'center'
                                }}
                            />}
                        {/* User Name */}
                        <Text style={styles.name}>{userInfo.name}</Text>

                        {/* Email */}
                        <View style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
                            <Image
                                source={icons.email}
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.black
                                }}
                            />
                            <Text style={styles.contact_text}> {userInfo.email}</Text>
                        </View>

                        {/* Phone */}
                        <View style={{ flexDirection: 'row', marginTop: SIZES.padding }}>
                            <Image
                                source={icons.phone}
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                            <Text style={styles.contact_text}>{userInfo.phone}</Text>
                        </View>

                        {/* Update Button */}
                        <CustomButton text='Update'
                            onPressButton={() => { navigation.navigate('UpdateProfile', { currentUser: userInfo }) }} />
                    </View>
                </SafeAreaView>
                :
                //    Sign Up Screen
                <SignUp navigation={navigation} fromScreen='Account' setUserInfo={setUserInfo} />}
        </>

    )

}

export default Account;

const styles = StyleSheet.create({

    image_container: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 55,
        marginTop: SIZES.padding * 4,
        backgroundColor: COLORS.white
    },
    name: {
        alignSelf: 'center',
        ...FONTS.h2,
        marginTop: SIZES.padding
    },
    contact_text: {
        ...FONTS.body3,
        color: COLORS.black,
        marginLeft: SIZES.padding
    },

});