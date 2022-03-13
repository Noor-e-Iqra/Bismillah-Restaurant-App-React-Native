import React from 'react';
import { Alert, Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Globalstyles } from '../styles/GlobalStyle';
import { CustomButton } from '../components';
import { InnerHeader } from '../components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FONTS, SIZES, COLORS } from '../constants';
import { firebase } from '@react-native-firebase/database';
import { SafeAreaView } from 'react-native-safe-area-context';

//validation schema for email
const emailSchema = yup.object({

    email: yup.string()
        .label('Email')
        .required()
        .matches(
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email address is not valid"
        ),

});

//function for sending reset password link to email
const sendLink = async (email, navigation) => {
    try {
        await firebase.auth().sendPasswordResetEmail(email)
        Alert.alert("Success :)", "Password Reset link has been sent to your email")
        navigation.navigate('SignIn')

    } catch (e) {
        Alert.alert("Error", e.message)
    }
}

const ForgotPassword = ({ navigation }) => {

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <SafeAreaView style={Globalstyles.container_1}>

                {/* Header */}
                <InnerHeader title='Forgot Password' navigation={navigation} />

                <View style={Globalstyles.container_2}>
                    <Text style={styles.text}>
                        Enter your registered email for the reset password link
                    </Text>

                    <ScrollView >
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={emailSchema}
                            onSubmit={(values) => {
                                sendLink(values.email, navigation)
                            }}>

                            {(props) => (
                                <View>
                                    {/* Email field */}
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

                                    {/* Send Link button */}
                                    <CustomButton text='Send Link' onPressButton={props.handleSubmit} />

                                </View>
                            )}
                        </Formik>
                    </ScrollView >

                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback >

    )
}

export default ForgotPassword;

const styles = StyleSheet.create({

    text: {
        ...FONTS.body3,
        color: COLORS.black,
        marginVertical: SIZES.padding * 3
    }

})