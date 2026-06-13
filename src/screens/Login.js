import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import TextInputComponent from '../components/TextInput';
import { loginUser } from '../api/user';
import { Col, Grid, Row } from 'react-native-paper-grid';
import DeviceInfo from 'react-native-device-info';
import { Card, Text } from 'react-native-paper';
import Logo from '../components/Logo';
import Button from '../components/Button';
import CheckBox from '@react-native-community/checkbox';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [ischecked, setIsChecked] = useState(true);
    const [showErrorLogin, setshowErrorLogin] = useState(false);
    const [curVer, setcurVer] = useState(null);



    const storeUser = async (data) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify({
                id: data?.id,
                token: data?.token,
                username: data?.username,
                full_name: data?.full_name,
            }));

            Toast.show({
                type: 'success',
                text1: 'Login Successful',
            });

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainStack' }],
                });
                },2000);

              


            } catch (error) {
                console.log(error);
            }
        };



        const onLoginPressed = async () => {
            if (username?.toString()?.length == 0 || password?.toString()?.length == 0 || username == null || password == null) {
                Toast.show({
                    type: 'error',
                    text1: 'Credentials invalid',
                    text2: 'Username or password invalid',
                });
            }
            else {


                DeviceInfo.getUniqueId().then(async (uniqueId) => {

                    try {

                        let ApiResponse = await loginUser({
                            username: username.toString().toLowerCase(),
                            password: password.toString().toLowerCase(),
                            deviceId: uniqueId,
                        });

                        console.log(ApiResponse?.data);
                        if (ApiResponse?.data?.data) {

                            storeUser(ApiResponse?.data?.data)

                        }
                        else {
                            Toast.show({
                                type: 'error',
                                text1: 'Credentials invalid',
                                text2: 'Username or password invalid',
                            });
                        }


                    }
                    catch (error) {

                        Toast.show({
                            type: 'error',
                            text1: 'Credentials invalid',
                            text2: 'Username or password invalid',
                        });
                        console.log('Error: ', error?.response);
                    }
                });




            }


        };








        return (

            <View style={{ padding: 10, marginTop: 0 }}>

                <Card style={{ padding: 20, backgroundColor: '#f1f5f9' }}>
                    <Logo />
                    <View><Text style={{ textAlign: 'center', marginBottom: 5, marginTop: 5, color: theme.colors.primary }}>{curVer}</Text></View>
                    <View><Text style={{ textAlign: 'center', fontSize: 20 }}>Slaughter App</Text></View>
                    {/* / <View><Text style={{ textAlign: 'center', fontSize: 12 }}>Utility App</Text></View> */}
                    <TextInputComponent
                        label="Username"
                        onChangeText={text => setUsername(text)}
                    />
                    <TextInputComponent
                        label="Password"
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                    />


                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={ischecked}
                            onValueChange={() => {
                                setIsChecked(!ischecked)
                            }}
                            style={styles.checkbox}
                        />
                        <Text style={styles.label}>Remember me?</Text>
                    </View>


                    <Button mode="contained" onPress={onLoginPressed}>
                        Login
                    </Button>



                </Card>


                <Toast />


            </View>


        );
    }

    export default Login;


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkboxContainer: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        checkbox: {
            alignSelf: 'center',
        },
        label: {
            margin: 8,
        },
    });