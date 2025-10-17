import React, { Component, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  FlatList
} from 'react-native';
import {
  ActivityIndicator,
  Card,
  DataTable,
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
import moment, { isMoment } from 'moment-timezone';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GetToken from '../api/helpers/GetToken';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import { hsdLogo } from '../components/ReceiptLogo';
import { getCashTickets, postCashTicket } from '../api/cash_tickets';

import { Button as RnButton } from 'react-native-paper'

export default function Cash_Tickets() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [user, setuser] = useState(null);
  const [data, setData] = useState([])
  const [selected_ticket, set_selected_ticket] = useState(null)
  const [showDialog, setshowDialog] = useState(false);
  const [from, setFrom] = useState(moment().tz("Asia/Taipei").format('yyyy-MM-DD'))
  const [mounted, setmounted] = useState(false)

  const [post_sent, set_post_sent] = useState(false)
  const onRefresh = useCallback(() => {
    // 
    handleGetData()
  }, []);



  useFocusEffect(
    React.useCallback(() => {
      handleGetData()
      HandleGetUser()
    }, [])
  );


  //Get user
  const HandleGetUser = async () => {
    let res = await GetToken()
    setuser(res)
  }













  const handleGetData = async () => {
    let res = await GetToken();
    try {
      let ApiResponse = await getCashTickets({
        token: res.token,
        tellerId: res.id
      })


      setData(ApiResponse?.data?.data)
    }
    catch (error) {
      console.log('Get data Error: ', error);

    }

  }



  const printReceipt = async (data) => {


    try {
      //PRINT RECEIPT
      if (data) {
        await BluetoothEscposPrinter.printPic(hsdLogo, { width: 500, });

        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

        await BluetoothEscposPrinter.printText(
          `Cash Ticket\n\n`, {
          codepage: 25,
          encoding: 'windows-1254',
          fonttype: 1,
          // widthtimes: 1,
          heigthtimes: 1,
        }
        );

        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.printColumn([16, 16],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          ['Ticket code: ', `${moment(data?.created_at).tz("Asia/Taipei").format('MMDDYY')}-${data?.id}`], {
          codepage: 25,
          encoding: 'windows-1254',
          fonttype: 1,
          heigthtimes: 1,
        }).then((res) => {

          console.log(res, 'res');
        }, (err) => {
          console.log(err, 'err');
        });
        await BluetoothEscposPrinter.printColumn([16, 16],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          ['Collector:', user?.full_name], {
          codepage: 25,
          encoding: 'windows-1254',
          fonttype: 1,
          heigthtimes: 1,
        })

        await BluetoothEscposPrinter.printColumn([16, 16],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          ['Amount:', `${data?.price}.00`], {
          codepage: 25,
          encoding: 'windows-1254',
          fonttype: 1,
          heigthtimes: 1,
        })

        await BluetoothEscposPrinter.printColumn([6, 26],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          ['Name:', `${data?.name}`], {
          codepage: 25,
          encoding: 'windows-1254',
          fonttype: 1,
          heigthtimes: 1,
        })
        await BluetoothEscposPrinter.printColumn([6, 26],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          ['Date:', moment(data?.created_at).tz("Asia/Taipei").format('MMM-DD-YY HH:mm')], {
          codepage: 25,
          encoding: 'windows-1254',
          fonttype: 1,
          heigthtimes: 1,
        })



        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

        await BluetoothEscposPrinter.printQRCode(
          `${moment(data?.created_at).tz("Asia/Taipei").format('MMDDYY')}-${data?.id}`,
          200,
          BluetoothEscposPrinter.ERROR_CORRECTION.L,
        );



        await BluetoothEscposPrinter.printText('\r\n\r\n', {});
        await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      }






    }
    catch (error) {

      console.log(error);



      setTimeout(() => {

        Toast.show({
          type: 'error',
          text1: 'Check Printer Device',
          text2: 'Cannot Print Receipt.',
        });

      }, 2000);


    }



  }




  return (

    <>
      <SafeAreaView style={{ padding: 10 }}>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>




          <FlatList data={data}
            renderItem={({ item, key }) => (


              <View>
                <Card mode='outlined' style={{ backgroundColor: item.isVoid == 1 ? '#ef4444' : key % 2 == 0 ? '#cbd5e1' : '#f1f5f9', marginBottom: 2 }}
                  onPress={async () => {

                    set_selected_ticket(item)
                    setshowDialog(true)


                  }}
                >

                  <View><Text style={{ fontSize: 30, fontWeight: 'bold' }}>₱ {item?.price}</Text></View>
                  <View><Text style={{ fontSize: 18, color: 'purple', fontWeight: 'bold' }}>{item?.name}</Text></View>

                </Card>
              </View>

            )}

          />







          <View>


            <Dialog.Container visible={showDialog}>


              <Dialog.Title>Confirm print ticket <Text style={{ color: 'red', fontSize: 30 }}>₱{selected_ticket?.price}</Text></Dialog.Title>


              {
                !post_sent ? <>
                  <View>
                    <Button label="Confirm" onPress={async () => {

                      try {

                        let res = await GetToken();


                        set_post_sent(true)

                        let ApiResponse = await postCashTicket({
                          collector_id: user?.id,
                          cash_ticket_id: selected_ticket?.id,
                          price: selected_ticket?.price,
                          name: selected_ticket?.name
                        }, res?.token)




                        if (ApiResponse?.data?.data) {
                          printReceipt(ApiResponse?.data?.data)
                          set_post_sent(false)
                          setshowDialog(false)
                        }

                      }
                      catch (e) {

                        console.log('Error dispense ticket: ', e);

                      }

                    }} >
                      Confirm
                    </Button>

                  </View></> :
                  <View><Text>Please wait...</Text></View>
              }




              <View>
                <RnButton style={{ backgroundColor: 'gray', borderRadius: 4, marginTop: 30, }} label="Confirm" onPress={async () => {
                  set_selected_ticket(null)
                  setshowDialog(false)
                }} >
                  Cancel
                </RnButton >

              </View>







            </Dialog.Container>
          </View>


          <Toast />
        </ScrollView>
      </SafeAreaView>




    </>
  )



}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, },
  text: { margin: 6, color: 'black' },
  containerStyle: { backgroundColor: 'white', padding: 10, maxHeight: 600 },
});