import React from 'react';
import { View, StatusBar, LogBox } from 'react-native';
import { COLORS } from './constants';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';
import RNBootSplash from "react-native-bootsplash";
import { Restaurant, OrderDelivery, Cart, Order, SignUp, UpdateProfile, SignIn, ForgotPassword } from './screens';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const Stack = createStackNavigator();

const App = () => {

  return (
    <>
      <StatusBar backgroundColor={COLORS.lightGray} barStyle='dark-content' />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer onReady={() => RNBootSplash.hide()}>
            <Stack.Navigator screenOptions={{ headerShown: false }}
              initialRouteName={'menu'}>
              <Stack.Screen name='menu' component={Tabs} />
              <Stack.Screen name='Restaurant' component={Restaurant} />
              <Stack.Screen name='OrderDelivery' component={OrderDelivery} />
              <Stack.Screen name='Cart' component={Cart} />
              <Stack.Screen name='Order' component={Order} />
              <Stack.Screen name='SignUp' component={SignUp} />
              <Stack.Screen name='SignIn' component={SignIn} />
              <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
              <Stack.Screen name='UpdateProfile' component={UpdateProfile} />

            </Stack.Navigator>
          </NavigationContainer >
        </PersistGate>
      </Provider>
    </>
  )
}

export default App;