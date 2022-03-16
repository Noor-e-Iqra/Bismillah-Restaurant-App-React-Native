import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Globalstyles } from '../styles/GlobalStyle';
import { CustomButton, ProgressBar } from '../components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { images } from '../constants';
import auth from "@react-native-firebase/auth"
import { setUser } from '../redux/actions';
import { useDispatch } from 'react-redux';


//validation schema for signin form
const signInSchema = yup.object({

    email: yup.string()
        .label('Email')
        .required()
        .matches(
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "email address is not valid"
        ),
    password: yup.string()
        .label('Password')
        .required()
        .min(8),

});

//signin user with email and password
const signInUser = async (values, navigation, screen, item, category, setClicked, dispatch) => {
    setClicked(true)
    try {
        let response = await auth().signInWithEmailAndPassword(values.email, values.password)
        if (response && response.user) {
            setClicked(false)
            dispatch(setUser(response.user))
            if (screen == 'Account') {
                navigation.navigate('menu', { screen: 'Account' })
            } else {
                navigation.navigate('Restaurant', {
                    currentItem: item, currentCategory: category
                })
            }
        }
    } catch (e) {
        Alert.alert("Error", e.message)
        setClicked(false)
    }
}


const SignIn = ({ navigation, route }) => {

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
        }

    }, []);

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <View style={Globalstyles.container_2}>

                {/*logo */}
                <Image
                    source={images.logo}
                    resizeMode='contain'
                    style={Globalstyles.logo} />

                <ScrollView >

                    {/* signin form */}
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={signInSchema}
                        onSubmit={(values) => {
                            signInUser(values, navigation, screen, item, category, setClicked, dispatch)
                        }}>

                        {(props) => (
                            <View>

                                {/* email field */}
                                <TextInput
                                    style={Globalstyles.input}
                                    placeholder=' Email'
                                    autoCapitalize='none'
                                    onChangeText={props.handleChange('email')}
                                    value={props.values.email}
                                    keyboardType='email-address'
                                    onBlur={props.handleBlur('email')} />
                                {props.touched.email && props.errors.email && (
                                    <Text style={Globalstyles.errorText}>{props.errors.email}</Text>
                                )}

                                {/* password field*/}
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

                                {/* signin button */}
                                <CustomButton text='Sign In' onPressButton={props.handleSubmit} />

                                {/* forgot password */}
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}
                                    style={Globalstyles.hyperlink_container}>
                                    <Text style={Globalstyles.hyperlink_text}>Forgot password?</Text>
                                </TouchableOpacity>


                            </View>
                        )}
                    </Formik>

                    {/* hyperlink signup */}
                    <View style={Globalstyles.hyperlink_container}>
                        <Text style={Globalstyles.account_text}>Don't have a account? </Text>

                        <TouchableOpacity onPress={() => navigation.navigate('SignUp', { screen: screen })}>
                            <Text style={Globalstyles.hyperlink_text}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView >

                {/* progress bar */}
                {clicked &&
                    <ProgressBar text="Wait for a while..." />
                }

            </View>
        </TouchableWithoutFeedback >


    )
}

export default SignIn;
