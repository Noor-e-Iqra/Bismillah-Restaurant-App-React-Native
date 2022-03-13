import React, { useState, useEffect } from 'react';
import { Alert, Text, View, Image, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Globalstyles } from '../styles/GlobalStyle';
import { FONTS, SIZES, COLORS, icons, images, DATABASE_URL } from '../constants';
import SignUp from './SignUp';
import { Header, CustomButton } from '../components';
import { firebase } from '@react-native-firebase/database';


const signOutUser = async (setUser) => {
    try {
        await firebase.auth().signOut();
        setUser(null)

    } catch (e) {
        Alert.alert("Error", e.message)
    }
}

const Account = ({ navigation }) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const userReference = firebase.app().database(DATABASE_URL).ref('/Users/' + currentUser.uid);
                userReference.on('value', snapshot => {
                    setUser(snapshot.val())
                });
            }
        });

        return unsubscribe;

    }, [navigation]);

    return (

        <>
            {user ?
                <SafeAreaView style={Globalstyles.container_1}>
                    {/* Header */}
                    <Header title='Account' icon={icons.logout} onPressIcon={() => signOutUser(setUser)} />

                    <View style={Globalstyles.container_2}>
                        {/* User Photo */}
                        {user.photoUrl == 'default' || user.photoUrl == '' || user.photoUrl == undefined ?
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
                                source={{ uri: user.photoUrl }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 55,
                                    marginTop: SIZES.padding * 4,
                                    alignSelf: 'center'
                                }}
                            />}
                        {/* User Name */}
                        <Text style={styles.name}>{user.name}</Text>

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
                            <Text style={styles.contact_text}> {user.email}</Text>
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
                            <Text style={styles.contact_text}>{user.phone}</Text>
                        </View>

                        {/* Update Button */}
                        <CustomButton text='Update'
                            onPressButton={() => { navigation.navigate('UpdateProfile', { currentUser: user }) }} />
                    </View>
                </SafeAreaView>
                :
                //    Sign Up Screen
                <SignUp navigation={navigation} fromScreen='Account' setUser={setUser} />}
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