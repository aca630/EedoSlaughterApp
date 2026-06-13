
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { Col, Row, Grid } from 'react-native-paper-grid';
import GetToken from "../api/helpers/GetToken";
import React, { useState } from "react";
import { useCallback, useEffect } from 'react';
import { GetCollectorTotalCashTicketsPerDay } from "../api/saleshits";
import moment from "moment-timezone";
import { ScrollView,RefreshControl,} from "react-native-gesture-handler";



const Dashboard = ({ props }) => {
    const navigation = useNavigation()
    const [isBind, setisBind] = useState(false);
    const [user, setuser] = useState(null);
    const [data, setData] = useState([])
    const [from, setFrom] = useState(moment().tz("Asia/Taipei").format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().tz("Asia/Taipei").add(1, 'days').format('yyyy-MM-DD'))
    const [refreshing, setRefreshing] = useState(false);
    const HandleCheckBind = async () => {

        let res = await GetToken()
        console.log(res?.deviceId, ' bindxxxxxaadx');
        console.log(res?.deviceId != undefined, ' bindxx');
        if (res?.deviceId != undefined) {
            setisBind(true)
        }

    }

      const onRefresh = useCallback(() => {
        // 
        handleGetData()
      }, []);
    

    const handleGetData = async () => {
        let res = await GetToken();

        setData([]);
        try {
            let ApiResponse = await GetCollectorTotalCashTicketsPerDay({
                from: from,
                to: moment(from).tz("Asia/Taipei").add(1, 'days').format('yyyy-MM-DD'),
                token: res.token,
                id: res.id

            })

            console.log(ApiResponse?.data?.data);
            
            setData(ApiResponse?.data?.data[0])
            setRefreshing(false);


        }
        catch (error) {
            console.log('Get Bets Error: ', error);

        }

    }


    useEffect(() => {
        handleGetData()
    }, [from])

    useFocusEffect(
        React.useCallback(() => {
            handleGetData()
            HandleCheckBind()
        }, [])
    );

    return (


         <SafeAreaView style={{ padding: 10 }}>
                <ScrollView refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
        <View>



            <View><Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#ad46ff' }}>Collector Cash Ticket App</Text></View>



            <View><Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold',}}>{from}</Text></View>

            <View style={{
                borderBottomColor: '#ad46ff',
                borderBottomWidth: 1, paddingBottom: 10
            }}>
                <View><Text style={{ textAlign: 'center', fontSize: 50, fontWeight: 'bold', color: '#ad46ff', }}>{(data?.total ?? 0)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text></View>
                <View><Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Cash on Hand</Text></View>
            </View>


            <Grid style={{ maxHeight: 100 }}>
                <Row>


                    <Col>
                        <View>
                            <Card style={{ height: 80 }} onPress={() => {
                                navigation.navigate('Cash_Tickets')
                            }}>
                                <Grid style={{ maxHeight: 100 }} >
                                    <Row>
                                        <Col >
                                            <View>
                                                <Text style={{ fontSize: 100 }}>
                                                    aa
                                                </Text>
                                            </View>
                                        </Col>
                                        <Col size={2}>
                                            <View><Text style={{ fontWeight: 'bold', fontSize: 18, color: '#ad46ff', marginTop: 10 }}> Cash Tickets</Text></View>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Card>
                        </View>
                    </Col>





                </Row>
            </Grid>
        </View>

             </ScrollView>
               </SafeAreaView>
         

    )

}

export default Dashboard;
