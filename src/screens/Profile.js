import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import {
    Card,
    Text,
} from 'react-native-paper';
import {
    RefreshControl,
    ScrollView,
} from 'react-native-gesture-handler';
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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        HandleGetUser()
    }, []);


    //Get user
    const HandleGetUser = async () => {
        let res = await GetToken()
        console.log(res);
        setUser(res)
        setRefreshing(false);
    }





    //Get user
    const HandleDeleteUser = async () => {

        try {
            await AsyncStorage.clear();
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
                await ApiBindeDevice({
                    deviceId: uniqueId,
                    user: res,
                })
                updateDeviceID(uniqueId);
            }
            catch (error) {

                Toast.show({
                    type: 'error',
                    text1: 'Error Binding',
                    text2: 'Please contact the admin',
                });
                console.log(error);
            }

        });




    }


    useFocusEffect(
        React.useCallback(() => {
            HandleGetUser();
        }, [])
    );

    const displayName = user?.full_name || 'No name available';
    const username = user?.username || 'No username available';
    const deviceId = user?.deviceId || user?.device_id || 'Not bound';
    const initials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join('') || 'SA';








    return (

        <>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>



                    <View style={styles.content}>
                        <Logo />

                        <View style={styles.header}>
                            <Text style={styles.appTitle}>Slaughter App</Text>
                            <Text style={styles.appSubtitle}>User Profile</Text>
                        </View>

                        <Card style={styles.profileCard}>
                            <Card.Content>
                                <View style={styles.identityBlock}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{initials}</Text>
                                    </View>
                                    <Text style={styles.name}>{displayName}</Text>
                                    <Text style={styles.username}>@{username}</Text>

                                    <Button
                                        onPress={() => {
                                            HandleDeleteUser()
                                        }}
                                        mode='contained'
                                        buttonColor='#fee4e2'
                                        textColor='#b42318'
                                        style={styles.logoutButton}
                                    >
                                        Logout
                                    </Button>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Full name</Text>
                                    <Text style={styles.detailValue}>{displayName}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Username</Text>
                                    <Text style={styles.detailValue}>{username}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Device ID</Text>
                                    <Text style={styles.detailValue}>{deviceId}</Text>
                                </View>
                            </Card.Content>
                        </Card>



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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f6f7fb',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 22,
    },
    appTitle: {
        color: '#1f2937',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    appSubtitle: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    profileCard: {
        borderRadius: 8,
        backgroundColor: '#ffffff',
        elevation: 3,
    },
    identityBlock: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 18,
    },
    avatar: {
        alignItems: 'center',
        backgroundColor: '#ede9fe',
        borderRadius: 36,
        height: 72,
        justifyContent: 'center',
        marginBottom: 12,
        width: 72,
    },
    avatarText: {
        color: '#6d28d9',
        fontSize: 24,
        fontWeight: 'bold',
    },
    name: {
        color: '#111827',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    username: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    divider: {
        backgroundColor: '#e5e7eb',
        height: 1,
        marginBottom: 4,
    },
    detailRow: {
        borderBottomColor: '#f1f2f4',
        borderBottomWidth: 1,
        paddingVertical: 14,
    },
    detailLabel: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    detailValue: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        borderRadius: 8,
        marginTop: 16,
        minWidth: 160,
    },
});
