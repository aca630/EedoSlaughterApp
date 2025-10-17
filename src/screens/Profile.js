import React, { Component, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    Card,
    FAB,
    Modal,
    Portal,
    Provider,
    RadioButton,
    SegmentedButtons,
    Snackbar,
    Text,
    TextInput,
} from 'react-native-paper';
import {
    RefreshControl,
    ScrollView,
    TouchableOpacity,
} from 'react-native-gesture-handler';
import { useCallback, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import Button from '../components/Button';
import Dialog from "react-native-dialog";
import Logo from '../components/Logo';
import { ApiBindeDevice } from '../api/bind';
import DeviceInfo from 'react-native-device-info';
import GetToken from '../api/helpers/GetToken';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Profile() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState(null);
    // const DeviceuniqueId = DeviceInfo.getUniqueId();
    const [showConfirmDialogSubmit, setshowConfirmDialogSubmit] = useState(false);
    const [showErrorBind, setshowErrorBind] = useState(false);
    const [showSuccessrBind, setshowSuccessrBind] = useState(false);
    const [curVer, setcurVer] = useState(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        HandleGetUser()
    }, []);


    //Get user
    const HandleGetUser = async () => {
        let res = await GetToken()
        console.log(res);
        setUser(res)
    }





    //Get user
    const HandleDeleteUser = async () => {

        try {
            const savedUser = await AsyncStorage.clear();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error logging out',
                text2: 'Please contact the admin',
            });
            console.log('Error', error);
        }
    }

    //Get user
    const updateDeviceID = async (uniqueId) => {
        try {
            await AsyncStorage.mergeItem("user", JSON.stringify(
                {
                    deviceId: uniqueId
                }
            ));
            setshowConfirmDialogSubmit(false)
            Toast.show({
                type: 'success',
                text1: 'Binding Device Success',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error Binding',
                text2: 'Please contact the admin',
            });
            console.log(error);
        }
    }



    const handleBindDevice = async () => {

        DeviceInfo.getUniqueId().then(async (uniqueId) => {
            let res = await GetToken();
            try {
                let ApiResponse = await ApiBindeDevice({
                    deviceId: uniqueId,
                    user: res,
                })
                updateDeviceID(uniqueId);
            }
            catch (error) {

                showErrorBind(true)
                console.log(error);
            }

        });




    }


    useFocusEffect(
        React.useCallback(() => {
            HandleGetUser();
        }, [])
    );








    return (

        <>
            <SafeAreaView style={{ padding: 10 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>



                    <View style={{ padding: 20 }}>
                        <Logo />

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: 'black' }}>Collector app</Text>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: 'black' }}>Name: {user?.full_name}</Text>
                        </View>


                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: 'black' }}>Username: {user?.username}</Text>
                        </View>


                        <View>
                            <View><Button onPress={() => {

                                HandleDeleteUser()
                            }} mode='outlined' style={{ backgroundColor: 'white' }}><Text style={{ color: 'red' }}>Logout</Text></Button></View>


                        </View>



                    </View>


                    <View>
                        <Dialog.Container visible={showConfirmDialogSubmit}>
                            <Dialog.Title>Confirm Bind Device</Dialog.Title>
                            <Dialog.Description>
                                Do you want to bind this device?
                            </Dialog.Description>
                            <Dialog.Button color={'red'} label="Cancel" onPress={() => {
                                setshowConfirmDialogSubmit(false)
                            }} />
                            <Dialog.Button label="Confirm" onPress={async () => {


                                handleBindDevice()
                            }} />
                        </Dialog.Container>
                    </View>

                </ScrollView>
            </SafeAreaView>

            <Toast />
        </>
    )


}