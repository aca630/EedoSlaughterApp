
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
import TextInputComponent from '../components/TextInput';
import Toast from "react-native-toast-message"; 
import { postPrivateTransaction, getLatestPrivateTransaction } from "../api/private_transaction";
import printPrivateReceipt from "./Private_Print";
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from "react-native";



const Dashboard = ({ props }) => {
    const navigation = useNavigation()
    const [isBind, setisBind] = useState(false);
    const [user, setuser] = useState(null);
    const [data, setData] = useState([])
    const [from, setFrom] = useState(moment().tz("Asia/Taipei").format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().tz("Asia/Taipei").add(1, 'days').format('yyyy-MM-DD'))
    const [refreshing, setRefreshing] = useState(false);
   
    const [ORNumber, setORNumber] = useState('');
    const [Agency, setAgency] = useState('');
    const [Owner, setOwner] = useState('');
    const [HeadsSmall, setHeadsSmall] = useState('');
    const [HeadsLarge, setHeadsLarge] = useState('');
    const [PMF, setPMF] = useState('');

    /**
     * SMALL ANIMAL IDENTIFICATION (manual input)
     */
    const [SmallKilos, setSmallKilos] = useState('');
    const [GoatHeads, setGoatHeads] = useState('');
    const [HogHeads, setHogHeads] = useState('');

    /**
     * LARGE ANIMAL IDENTIFICATION (manual input)
     */
    const [LargeKilos, setLargeKilos] = useState('');
    const [CowHeads, setCowHeads] = useState('');
    const [CarabaoHeads, setCarabaoHeads] = useState('');

   
    const isFormValid =
      ORNumber.trim() !== '' &&
      Agency.trim() !== '' &&
      Owner.trim() !== '' &&
      (HeadsSmall || HeadsLarge);   

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

const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
  if (submitting) return;
  setSubmitting(true);

  try {
    const or_no = (ORNumber || '').trim();
    const agency = (Agency || '').trim();
    const owner = (Owner || '').trim();
    const small_heads = parseInt(HeadsSmall || '0', 10);
    const large_heads = parseInt(HeadsLarge || '0', 10);
   

    // ✅ Basic field validation
    if (!or_no || !agency || !owner) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill in OR No., Agency, and Owner.',
      });
      setSubmitting(false);
      return;
    }

    const auth = await GetToken();

    // ✅ Define payload
    const payload = {
      // Transaction header
      date: from,
      or_no,
      agency,
      owner,

      // Official computation basis
      small_heads,
      large_heads,

      // SMALL identification (manual)
      small_kilos: parseInt(SmallKilos || '0', 10),
      goat_heads: parseInt(GoatHeads || '0', 10),
      hog_heads: parseInt(HogHeads || '0', 10),

      // LARGE identification (manual)
      large_kilos: parseInt(LargeKilos || '0', 10),
      cow_heads: parseInt(CowHeads || '0', 10),
      carabao_heads: parseInt(CarabaoHeads || '0', 10),

      // Flat PMF
      pmf: PMF,
    };


    console.log('📦 Sending Payload:', payload);
    console.log('🔑 Token:', auth?.token);

    const res = await postPrivateTransaction(auth, payload);

console.log('✅ API Response:', res?.data);

// ✅ Fetch latest saved record
// ============================================================
// 🖨️ AUTO-PRINT EXACT SAVED TRANSACTION (ID-BASED)
// ============================================================
const savedId = res?.data?.data?.id;

if (savedId) {
  await printPrivateReceipt(savedId);
} else {
  console.log('❌ No transaction ID returned for printing');
}


// ✅ Success toast with auto-close
Toast.show({
  type: 'success',
  text1: 'Saved successfully!',
  text2: 'Private transaction recorded.',
  visibilityTime: 2000,
});

    // ✅ Clear all inputs
    setORNumber('');
    setAgency('');
    setOwner('');
    setHeadsSmall('');
    setHeadsLarge('');
    setPMF('');
    setSmallKilos('');
    setGoatHeads('');
    setHogHeads('');
    setLargeKilos('');
    setCowHeads('');
    setCarabaoHeads('');

  } catch (error) {
    console.log('Error saving:', error?.response?.data || error);
    Toast.show({
      type: 'error',
      text1: 'Save failed',
      text2: 'Please try again.',
    });
  } finally {
    setSubmitting(false);
  }
};





    return (



         <SafeAreaView style={{ padding: 10 }}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 90 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
        <View>



            <View><Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#ad46ff' }}>Slaughter House</Text></View>
            <View><Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold',}}>{from}</Text></View>

            <View style={{
                borderBottomColor: '#ad46ff',
                borderBottomWidth: 1, paddingBottom: 10
            }}>
                
            <TextInputComponent
              label="OR Number"
              value={ORNumber}
              onChangeText={text => setORNumber(text)}
            />
            <TextInputComponent
              label="Agency"
              value={Agency}
              onChangeText={text => setAgency(text)}
            />
            <TextInputComponent
              label="Payor"
              value={Owner}
              onChangeText={text => setOwner(text)}
            />
            <TextInputComponent
              label="# of Heads (Small)"
              value={HeadsSmall}
              onChangeText={text => setHeadsSmall(text)}
              keyboardType="numeric"
            />

            {/* 🔹 SMALL ANIMAL DETAILS */}
            <TextInputComponent
              label="# of Kilos (Small)"
              value={SmallKilos}
              onChangeText={text => setSmallKilos(text)}
              keyboardType="numeric"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInputComponent
                  label="Goat"
                  value={GoatHeads}
                  onChangeText={text => setGoatHeads(text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <TextInputComponent
                  label="Hog / Swine"
                  value={HogHeads}
                  onChangeText={text => setHogHeads(text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TextInputComponent
              label="# of Heads (Large)"
              value={HeadsLarge}
              onChangeText={text => setHeadsLarge(text)}
              keyboardType="numeric"
            />
            {/* 🔹 LARGE ANIMAL DETAILS */}
            <TextInputComponent
              label="# of Kilos (Large)"
              value={LargeKilos}
              onChangeText={text => setLargeKilos(text)}
              keyboardType="numeric"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInputComponent
                  label="Cow"
                  value={CowHeads}
                  onChangeText={text => setCowHeads(text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <TextInputComponent
                  label="Carabao"
                  value={CarabaoHeads}
                  onChangeText={text => setCarabaoHeads(text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {/* 🟣 PMF DROPDOWN INSERTED HERE */}
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontSize: 14,
                  color: '#333',
                }}
              >
                Post Mortem Fee (PMF)
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                }}
              >
                <Picker
                  selectedValue={PMF}
                  onValueChange={(value) => setPMF(value)}
                  style={{ height: 60 }}
                >
                  <Picker.Item label="Select PMF Amount" value="" />
                  <Picker.Item label="50" value="50" />
                  <Picker.Item label="100" value="100" />
                  <Picker.Item label="150" value="150" />
                  <Picker.Item label="200" value="200" />
                  <Picker.Item label="250" value="250" />
                  <Picker.Item label="300" value="300" />
                  <Picker.Item label="350" value="350" />
                  <Picker.Item label="400" value="400" />
                  <Picker.Item label="450" value="450" />
                  <Picker.Item label="500" value="500" /> 
                  <Picker.Item label="550" value="550" /> 
                  <Picker.Item label="600" value="600" />
                  <Picker.Item label="650" value="650" />
                  <Picker.Item label="700" value="700" />
                  <Picker.Item label="750" value="750" />
                  <Picker.Item label="800" value="800" />
                  <Picker.Item label="850" value="850" />
                  <Picker.Item label="900" value="900" />
                  <Picker.Item label="950" value="950" />
                  <Picker.Item label="1000" value="1000" />
                </Picker>
              </View>
            </View>   

            </View>
            


      <Grid style={{ maxHeight: 100 }}>
        <Row>
          <Col>
            <View>
              <Card
                style={{
                  height: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  backgroundColor: isFormValid ? '#ad46ff' : '#d3d3d3',
                  opacity: submitting ? 0.7 : 1,
                }}
                // 🧩 Ignore press if submitting or invalid
                onPress={() => {
                  if (!isFormValid || submitting) return;
                  handleSubmit();
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: 'white',
                  }}
                >
                  {submitting ? 'Saving…' : 'Submit'}
                </Text>
              </Card>
            </View>
          </Col>
        </Row>
      </Grid>
      
        </View>
             </ScrollView>
<View
  style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    height: 70,
  }}
>
  {/* MAIN */}
  <TouchableOpacity
    style={footerBtn}
    onPress={() => navigation.navigate("Dashboard")}
  >
    <Text>Main</Text>
  </TouchableOpacity>

{/* DASHBOARD */}
<TouchableOpacity
  style={[footerBtn, activeFooter]}
  onPress={() => navigation.navigate("Private_Dashboard")}
>
  <Text style={{ color: "#fff", fontWeight: "bold" }}>
    Dashboard
  </Text>
</TouchableOpacity>


  {/* HISTORY */}
  <TouchableOpacity
    style={footerBtn}
    onPress={() => navigation.navigate("Private_History")}
  >
    <Text>History</Text>
  </TouchableOpacity>
</View>

                <Toast />
               </SafeAreaView>
         

    )

}

/**
 * ============================================================
 * FOOTER STYLES (TRANSACT PAGE)
 * ------------------------------------------------------------
 * - Used ONLY by the bottom navigation buttons
 * - Kept local to this screen (not reusable by design)
 * ============================================================
 */
const footerBtn = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const activeFooter = {
  backgroundColor: "#ad46ff",
};

export default Dashboard;
