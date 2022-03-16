import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, SafeAreaView, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Globalstyles } from '../styles/GlobalStyle';
import { CustomButton } from '../components';
import ImagePicker from 'react-native-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import { InnerHeader, ProgressBar } from '../components';
import { FONTS, SIZES, COLORS, icons, DATABASE_URL } from '../constants';
import { firebase } from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

//validation schema for update
const updateSchema = yup.object({
    name: yup.string()
        .label('Name')
        .required()
        .min(3),

    phone: yup.string()
        .label('Phone number')
        .required()
        .matches(
            /^\d{11}$/, "Phone number is not valid")
});

//function for updating user information
const updateUser = async (values, navigation, user, image, setClicked) => {
    setClicked(true)
    const userReference = firebase
        .app()
        .database(DATABASE_URL)
        .ref('/Users/' + user.uid);

    try {
        if (image.includes("https:") || image == "default") {
            await userReference
                .update({
                    name: values.name,
                    phone: values.phone,
                }).then(() => {
                    console.log("User updated successfully")
                    setClicked(false)
                    navigation.goBack()

                }).catch((e) => {
                    setClicked(false)
                    Alert.alert("Error", e.message)
                })

        } else {
            const filename = image.substring(image.lastIndexOf('/') + 1);
            const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
            const reference = storage().ref("/Users profile pics/" + filename);

            await reference.putFile(uploadUri);
            const url = await reference.getDownloadURL();

            await userReference
                .update({
                    name: values.name,
                    phone: values.phone,
                    photoUrl: url
                }).then(() => {
                    console.log("User updated successfully")
                    setClicked(false)
                    navigation.goBack()

                }).catch((e) => {
                    Alert.alert("Error", e.message)
                    setClicked(false)
                })
        }

    } catch (e) {
        Alert.alert("Error", e.message)
        setClicked(false)
    }
}

const UpdateProfile = ({ route, navigation }) => {

    const [user, setUser] = useState({})
    const [image, setImage] = useState("")
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        const { currentUser } = route.params;
        setUser(currentUser)
        setImage(currentUser.photoUrl)

    }, []);

    //function for taking/selecting photo 
    const selectImage = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                setImage(source.uri);
            }
        });
    };


    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <SafeAreaView style={Globalstyles.container_1}>

                {/* Header */}
                <InnerHeader title='Update Profile' navigation={navigation} />

                <View style={Globalstyles.container_2}>

                    {/* User Photo */}
                    {
                        image == 'default' || image == '' || image == undefined ?
                            <View style={styles.image_view}>
                                <Image
                                    source={icons.user}
                                    resizeMode='center'
                                    style={{
                                        width: '50%',
                                        height: '50%',
                                    }} />
                            </View> :
                            <Image
                                source={{ uri: image }}
                                style={styles.image} />
                    }

                    {/* Change profile pic */}
                    <TouchableOpacity onPress={selectImage}>
                        <Text style={styles.hyperlink_text}>Change profile pic</Text>
                    </TouchableOpacity>

                    <ScrollView >
                        <Formik
                            enableReinitialize={true}
                            initialValues={{ name: user.name, phone: user.phone }}
                            validationSchema={updateSchema}
                            onSubmit={(values) => {
                                updateUser(values, navigation, user, image, setClicked)
                            }}>

                            {(props) => (
                                <View>
                                    {/* Name field */}
                                    <TextInput
                                        style={Globalstyles.input}
                                        placeholder='Name'
                                        onChangeText={props.handleChange('name')}
                                        value={props.values.name}
                                        onBlur={props.handleBlur('name')} />
                                    {props.touched.name && props.errors.name && (
                                        <Text style={Globalstyles.errorText}>{props.errors.name}</Text>
                                    )}

                                    {/* Phone number field */}
                                    <TextInput
                                        style={Globalstyles.input}
                                        placeholder={user.phone}
                                        onChangeText={props.handleChange('phone')}
                                        value={props.values.phone}
                                        keyboardType='numeric'
                                        onBlur={props.handleBlur('phone')} />
                                    {props.touched.phone && props.errors.phone && (
                                        <Text style={Globalstyles.errorText}>{props.errors.phone}</Text>
                                    )}

                                    {/* Save button */}
                                    <CustomButton text='Save' onPressButton={props.handleSubmit} />

                                </View>

                            )}
                        </Formik>
                    </ScrollView >

                    {/* progress bar */}
                    {clicked &&
                        <ProgressBar text="Updating..." />
                    }
                </View>


            </SafeAreaView>
        </TouchableWithoutFeedback >


    )
}

export default UpdateProfile;

const styles = StyleSheet.create({

    image_view: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 55,
        marginTop: SIZES.padding * 4,
        backgroundColor: COLORS.white
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 55,
        marginTop: SIZES.padding * 4,
        alignSelf: 'center'
    },

    hyperlink_text: {
        alignSelf: 'center',
        ...FONTS.body3, color: 'blue',
        textDecorationLine: 'underline',
        marginTop: SIZES.padding,
        marginBottom: SIZES.padding * 2
    }
})