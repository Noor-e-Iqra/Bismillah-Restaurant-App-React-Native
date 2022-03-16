import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Globalstyles } from '../styles/GlobalStyle';
import { CustomButton, ProgressBar } from '../components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { images, DATABASE_URL } from '../constants';
import { firebase } from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"
import { setUser } from '../redux/actions';
import { useDispatch } from 'react-redux';


// validation schema for signup form
const signUpSchema = yup.object({
    name: yup.string()
        .label('Name')
        .required()
        .min(3),

    email: yup.string()
        .label('Email')
        .required()
        .matches(
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email address is not valid"),

    password: yup.string()
        .label('Password')
        .required()
        .min(8),

    phone: yup.string()
        .label('Phone number')
        .required()
        .matches(
            /^\d{11}$/,
            "Phone number is not valid")
});

// function for creating user with email and password
const createUser = async (values, navigation, screen, item, category, setUserInfo, setClicked, dispatch) => {
    setClicked(true)
    try {

        let response = await auth().createUserWithEmailAndPassword(values.email, values.password)
        if (response) {
            let uid = firebase.auth().currentUser.uid;
            if (uid) {
                const usersReference = firebase
                    .app()
                    .database(DATABASE_URL)
                    .ref('/Users/' + uid);

                usersReference.set({ name: values.name, email: values.email, phone: values.phone, uid: uid, photoUrl: "default" })
                    .then(() => {
                        console.log("User created successfully")
                        setClicked(false)
                        dispatch(setUser(response.user))
                        if (screen == 'Account') {
                            if (setUserInfo != null) {
                                usersReference.on('value', snapshot => {
                                    setUserInfo(snapshot.val())
                                });
                            } else {
                                navigation.navigate('menu', { screen: 'Account' })
                            }
                        } else {
                            navigation.navigate('Restaurant', {
                                currentItem: item, currentCategory: category
                            })
                        }

                    }).catch((e) => {
                        Alert.alert("Error", e.message)
                        setClicked(false)
                    })

            }
        }
    } catch (e) {
        Alert.alert("Error", e.message)
        setClicked(false)
    }
}

const SignUp = ({ navigation, route, fromScreen, setUserInfo }) => {

    const dispatch = useDispatch();
    const [screen, setScreen] = useState(null)
    const [item, setItem] = useState(null)
    const [category, setCategory] = useState(null)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {

        if (route) {
            const { screen, currentItem, currentCategory } = route.params;
            setScreen(screen)
            setItem(currentItem)
            setCategory(currentCategory)
        } else if (fromScreen) {
            setScreen(fromScreen)
        }

    }, []);

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <View style={Globalstyles.container_2}>

                {/* Logo */}
                <Image
                    source={images.logo}
                    resizeMode='contain'
                    style={Globalstyles.logo} />

                <ScrollView >

                    {/* signup form */}
                    <Formik
                        initialValues={{ name: '', email: '', password: '', phone: '' }}
                        validationSchema={signUpSchema}
                        onSubmit={(values) => {
                            createUser(values, navigation, screen, item, category, setUserInfo, setClicked, dispatch)
                        }}>

                        {(props) => (
                            <View>
                                {/* name field */}
                                <TextInput
                                    style={Globalstyles.input}
                                    placeholder=' Name'
                                    onChangeText={props.handleChange('name')}
                                    value={props.values.name}
                                    onBlur={props.handleBlur('name')} />
                                {props.touched.name && props.errors.name && (
                                    <Text style={Globalstyles.errorText}>{props.errors.name}</Text>
                                )}

                                {/* email field */}
                                <TextInput
                                    style={Globalstyles.input}
                                    placeholder=' Email'
                                    onChangeText={props.handleChange('email')}
                                    value={props.values.email}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    onBlur={props.handleBlur('email')} />
                                {props.touched.email && props.errors.email && (
                                    <Text style={Globalstyles.errorText}>{props.errors.email}</Text>
                                )}

                                {/* password field */}
                                <TextInput
                                    style={Globalstyles.input}
                                    placeholder=' Password'
                                    onChangeText={props.handleChange('password')}
                                    value={props.values.password}
                                    secureTextEntry
                                    onBlur={props.handleBlur('password')} />
                                {props.touched.password && props.errors.password && (
                                    <Text style={Globalstyles.errorText}>{props.errors.password}</Text>
                                )}

                                {/* phone number field */}
                                <TextInput
                                    style={Globalstyles.input}
                                    placeholder=' Phone number'
                                    onChangeText={props.handleChange('phone')}
                                    value={props.values.phone}
                                    keyboardType='numeric'
                                    onBlur={props.handleBlur('phone')} />
                                {props.touched.phone && props.errors.phone && (
                                    <Text style={Globalstyles.errorText}>{props.errors.phone}</Text>
                                )}

                                {/* signup button */}
                                <CustomButton text='Sign Up' onPressButton={props.handleSubmit} />

                                {/* progress bar */}
                                {clicked &&
                                    <ProgressBar text="Wait for a while..." />
                                }
                            </View>
                        )}
                    </Formik>

                    {/* signin hyperlink */}
                    <View style={Globalstyles.hyperlink_container}>
                        <Text style={Globalstyles.account_text}>Already have a account? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn', { screen: screen, currentItem: item, currentCategory: category })}>
                            <Text style={Globalstyles.hyperlink_text}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView >

            </View>
        </TouchableWithoutFeedback >


    )
}

export default SignUp;
