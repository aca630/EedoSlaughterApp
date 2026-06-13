
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


<SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#f6f7fb' }}>
  <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 'bold',
          color: '#ad46ff',
          marginBottom: 40,
        }}
      >
        Slaughter House
      </Text>

      {/* 🟣 Top Button - Private */}
      <Card
        style={{
          width: '80%',
          marginBottom: 40,
          borderRadius: 12,
          backgroundColor: '#ffffff',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 5,
        }}
        onPress={() => navigation.navigate('Private_Dashboard')}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#3b2c85',
              flex: 1,
            }}
          >
            Private
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: '#ad46ff',
            }}
          >
            🔒
          </Text>
        </View>
      </Card>

      {/* 🟢 Bottom Button - Public */}
      <Card
        style={{
          width: '80%',
          borderRadius: 12,
          backgroundColor: '#ffffff',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 5,
        }}
        onPress={() => navigation.navigate('Public_Dashboard')}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#3b2c85',
              flex: 1,
            }}
          >
            Public
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: '#28a745',
            }}
          >
            🌐
          </Text>
        </View>
      </Card>
    </View>
  </ScrollView>
</SafeAreaView>

         

    )

}

export default Dashboard;
