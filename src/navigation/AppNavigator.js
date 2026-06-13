import React, { useState, useEffect, use } from "react";
import {
  View,
  Text,
  Platform,
  ToastAndroid,
  NativeEventEmitter,
  DeviceEventEmitter,
  Button,
  PermissionsAndroid
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BluetoothManager, BluetoothEscposPrinter, } from "react-native-bluetooth-escpos-printer";
import { hsdLogo } from '../components/ReceiptLogo';
// import Parent from './normal/Parent';
// import Login from './screens/Login';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from "../screens/Dashboard";
import Private_Transaction from "../screens/Private_Transaction";
import PrivateDashboard from '../screens/PrivateDashboard';
import Private_History from "../screens/Private_History";
import Private_History_View from "../screens/Private_History_View";
import PublicDashboard from "../screens/PublicDashboard";
import Public_Cashier from "../screens/Public_Cashier";
import Public_Slaughter from "../screens/Public_Slaughter";
import Public_Lookup from "../screens/Public_Lookup";


import Login from "../screens/Login";
import Cash_Tickets from "../screens/Cash_Tickets";
import { ActivityIndicator } from "react-native-paper";
import MainStack from "./MainStack";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // 🧠 State hooks (replaces this.state)
  const [devices, setDevices] = useState(null);
  const [pairedDs, setPairedDs] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [boundAddress, setBoundAddress] = useState("");
  const [debugMsg, setDebugMsg] = useState("");
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const listeners = [];

  const ensureBluetoothPermissions = async () => {
    if (Platform.OS !== "android") {
      return true;
    }

    try {
      if (Platform.Version >= 31) {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ];
        const result = await PermissionsAndroid.requestMultiple(permissions);

        return permissions.every(
          permission => result[permission] === PermissionsAndroid.RESULTS.GRANTED
        );
      }

      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log("Bluetooth permission error:", error);
      return false;
    }
  };


  //   // 🧭 Function to get user from AsyncStorage
  const handleGetUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        const currentUser = JSON.parse(savedUser);
        setUser(currentUser);
      }
    } catch (error) {
      console.log(error);
    }
  };


  //  Function to open or close Bluetooth
  const openBluetooth = async (v) => {
    console.log(v,' vvvvxxxxxxxx');
    const hasBluetoothPermission = await ensureBluetoothPermissions();
    if (!hasBluetoothPermission) {
      setLoading(false);
      return;
    }

    if (v) {
      BluetoothChecker()
    } else {
      BluetoothManager.enableBluetooth().then(
        (r) => {


          const firstDevice = JSON.parse(r[0]);


          BluetoothManager.connect(firstDevice?.address ?? null).then(
            (s) => {
              setLoading(false);
              setBoundAddress(firstDevice?.address ?? null);
            },
            (e) => {
              setLoading(false);
              alert(e);
            }
          );
        },
        (err) => {
          setLoading(false);
          alert(err);
        }
      );
    }
  };

  // 🧠 Handle already paired devices
  const deviceAlreadyPaired = (rsp) => {
    let ds = [];
    try {
      ds = typeof rsp.devices === "object" ? rsp.devices : JSON.parse(rsp.devices);
    } catch (e) {}
    if (ds && ds.length) {
      setPairedDs((prev) => [...prev, ...ds]);
    }
  };

  // 🧩 Handle newly found devices
  const deviceFoundEvent = (rsp) => {
    try {
      const device =
        typeof rsp.device === "object" ? rsp.device : JSON.parse(rsp.device);
      if (device) {
        setFoundDs((prev) => {
          const duplicated = prev.findIndex((x) => x.address === device.address);
          if (duplicated === -1) return [...prev, device];
          return prev;
        });
      }
    } catch (e) {
      // ignore
    }
  };


  const BluetoothChecker = async () => {
    const hasBluetoothPermission = await ensureBluetoothPermissions();
    if (!hasBluetoothPermission) {
      setLoading(false);
      return;
    }

     // check if bluetooth enabled
     BluetoothManager.isBluetoothEnabled().then(
      (enabled) => {
        setBleOpend(Boolean(enabled));
        // ToastAndroid.show("Device Bluetooth is On!", ToastAndroid.LONG);
        setLoading(false);
      },
      (err) => console.log(err)
    );

    // create event listeners
    if (Platform.OS === "android") {


      listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => deviceAlreadyPaired(rsp)
        )
      );

      listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          (rsp) => deviceFoundEvent(rsp)
        )
      );

      listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => setBoundAddress("")
        )
      );

      listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show("Device Not Support Bluetooth!", ToastAndroid.LONG);
          }
        )
      );
    }
  }
  // 🧩 Setup listeners when component mounts
  useEffect(() => {

    BluetoothChecker()

  }, []);

  // 🧩 Another effect like second componentDidMount
  useEffect(() => {
   openBluetooth(bleOpend);
    handleGetUser();


  }, []);




  const printReceipt = async () => {
    try {

      console.log(BluetoothEscposPrinter.ALIGN.CENTER,' BluetoothEscposPrinter.ALIGN.CENTER');

      await BluetoothEscposPrinter.printPic(hsdLogo, { width: 250,left:70 });
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printerLeftSpace(10);
      await BluetoothEscposPrinter.printText("Hello, this is a test print!\n", {
        codepage: 25,
        encoding: 'windows-1254',
        fonttype: 1,
        // widthtimes: 1,
        heigthtimes: 1,
      });
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printerLeftSpace(10);
      await BluetoothEscposPrinter.printQRCode(
        `${'test'}`,
        250,
        BluetoothEscposPrinter.ERROR_CORRECTION.L,
      );

      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});


    } catch (error) {
      console.log("Print error:", error);
    }
  }


  useEffect(() => {
    handleGetUser();
    setTimeout(() => {
      setIsMounted(true);
    }, 3000);

  }, []);

  return (
    <>

      {isMounted ?
        <>
          <Stack.Navigator initialRouteName={user !== null ? 'MainStack' : 'Login'}>

            <Stack.Screen
              name="MainStack"
              component={MainStack}
              options={{ headerShown: false }}
            />



            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Cash_Tickets"
              component={Cash_Tickets}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Private_Transaction"
              component={Private_Transaction}
              options={{ headerShown: false }}
            />         

            <Stack.Screen
              name="Private_Dashboard"
              component={PrivateDashboard}
              options={{ headerShown: false }}
            />   

            <Stack.Screen
              name="Private_History"
              component={Private_History}
              options={{ headerShown: false }}
            />                        

            <Stack.Screen
              name="Private_History_View"
              component={Private_History_View}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Public_Cashier"
              component={Public_Cashier}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Public_Dashboard"
              component={PublicDashboard}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Public_Slaughter"
              component={Public_Slaughter}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Public_Lookup"
              component={Public_Lookup}
              options={{ headerShown: false }}
            />


          </Stack.Navigator>

        </> : <ActivityIndicator />}
    </>
  );
}
