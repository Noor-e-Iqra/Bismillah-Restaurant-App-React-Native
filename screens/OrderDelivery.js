import React, { useState, useEffect } from "react";
import { Linking } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, icons, SIZES, images, FONTS } from '../constants';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';


const OrderDelivery = ({ route }) => {

    const mapView = React.useRef();
    const [currentRestaurant, setCurrentRestaurant] = useState(null)
    const [streetName, setStreetName] = useState("")
    const [fromLocation, setFromLocation] = useState({})
    const [toLocation, setToLocation] = useState({})
    const [region, setRegion] = useState(null)
    const [duration, setDuration] = useState(0)
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {

        let { time } = route.params;
        setDuration(time)

        const locations = {
            streetName: "Street No. 07",
            myLocation: {
                latitude: 25.410776,
                longitude: 68.275936
            },
            resLocation: {
                latitude: 25.411011,
                longitude: 68.271427
            },
        }

        let fromLoc = locations.resLocation
        let toLoc = locations.myLocation
        let street = locations.streetName
        let mapRegion = {
            latitude: (fromLoc.latitude + toLoc.latitude) / 2,
            longitude: (fromLoc.longitude + toLoc.longitude) / 2,
            latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
        }

        setCurrentRestaurant({
            courier: {
                avatar: images.avatar,
                name: "Ahmad",
                phone: "03342838233"
            }

        })

        setStreetName(street)
        setFromLocation(fromLoc)
        setToLocation(toLoc)
        setRegion(mapRegion)
        setCoordinates([{ latitude: fromLoc.latitude, longitude: fromLoc.longitude }, { latitude: toLoc.latitude, longitude: toLoc.longitude }])

    }, [])

    //zoom in function
    function zoomIn() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2
        }
        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 200)
    }

    //zoom out function
    function zoomOut() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2
        }
        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 200)
    }


    //Map function
    function renderMap() {

        // delivery boy icon
        const deliveryBoy = () => (
            <Marker
                coordinate={fromLocation}>
                <View style={styles.innerView_1}>
                    <View style={styles.innerView_2}>
                        <Image
                            source={images.avatar}
                            style={{
                                height: 25,
                                width: 25,
                                borderRadius: 10
                            }} />
                    </View>
                </View>
            </Marker>
        )

        // home icon
        const homeIcon = () => (
            <Marker
                coordinate={toLocation}
                anchor={{ x: 0.5, y: 0.5 }}>
                <Image
                    source={icons.home}
                    style={{
                        height: 40,
                        width: 40,
                    }} />
            </Marker>
        )

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapView}
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}>
                    {deliveryBoy()}
                    {homeIcon()}

                    <Polyline
                        coordinates={coordinates}
                        strokeColor='red'
                        strokeWidth={3} />
                </MapView>
            </View>
        )
    }

    // Header function 
    function renderDestinationHeader() {
        return (
            <View style={styles.topView}>
                <View style={styles.topView_inner}>
                    <Image
                        source={icons.pin}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: COLORS.darkgray,
                            marginRight: SIZES.padding
                        }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.header_text}>{streetName}</Text>
                    </View>
                    <Text style={styles.header_text}>{Math.ceil(duration)} mins</Text>
                </View>
            </View>
        )
    }

    // Delivery boy info function
    function renderDeliveryInfo() {
        return (
            <View style={styles.bottomView}>
                <View style={styles.bottomView_inner}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        {/* Avatar */}
                        <Image
                            source={currentRestaurant?.courier.avatar}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25
                            }} />

                        {/* Name */}
                        <View style={{ flex: 1, marginLeft: SIZES.padding }}>
                            <Text style={styles.name}>{currentRestaurant?.courier.name}</Text>
                            <Text style={styles.deliveryBoy}>Delivery Boy</Text>
                        </View>

                    </View>

                    {/* phone */}
                    <TouchableOpacity style={styles.call}
                        onPress={() => Linking.openURL(`tel:${currentRestaurant?.courier.phone}`)}>
                        <Image
                            source={icons.phone}
                            style={{
                                width: 30,
                                height: 30,
                                tintColor: COLORS.white
                            }} />
                    </TouchableOpacity>

                </View>
            </View >
        )
    }

    //zoom buttons function
    function renderZoomButtons() {
        return (

            <View style={styles.zoomView}>

                {/* Zoom In  button*/}
                <TouchableOpacity style={styles.zoom}
                    onPress={() => zoomIn()}>
                    <Text style={styles.zoom_text}>+</Text>
                </TouchableOpacity>

                {/* Zoom Out button */}
                <TouchableOpacity style={styles.zoom}
                    onPress={() => zoomOut()}>
                    <Text style={styles.zoom_text}>-</Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {(fromLocation.latitude && toLocation.latitude) ? renderMap() : null}
            {renderDestinationHeader()}
            {renderDeliveryInfo()}
            {renderZoomButtons()}
        </View>
    )

}

export default OrderDelivery;

const styles = StyleSheet.create({

    innerView_1: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white
    },

    innerView_2: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary
    },

    topView: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    topView_inner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width * 0.9,
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        elevation: 3
    },

    header_text: {
        ...FONTS.body3,
        color: COLORS.black
    },

    bottomView: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomView_inner: {
        width: SIZES.width * 0.9,
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding * 3,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white,
        elevation: 3
    },
    name: {
        ...FONTS.h4,
        color: COLORS.black
    },

    deliveryBoy: {
        ...FONTS.body4,
        color: COLORS.darkgray
    },

    call: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: SIZES.padding,
        borderRadius: 30,
        height: 50,
        width: 50,
        position: 'absolute',
        right: 16,
        top: 28
    },

    zoomView: {
        position: 'absolute',
        bottom: SIZES.height * 0.35,
        right: SIZES.padding * 2,
        width: 60,
        height: 130,
        justifyContent: 'space-between',
    },

    zoom: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        elevation: 3
    },

    zoom_text: {
        ...FONTS.body1,
        color: COLORS.black
    }
})