import React from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const PublicDashboard = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <View style={{ padding: 16 }}>

        {/* HEADER */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#28a745" }}>
            Slaughter House
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            PUBLIC DASHBOARD
          </Text>
        </View>

        {/* CASHIER BUTTON */}
        <Card
          style={{
            padding: 20,
            marginBottom: 20,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate("Public_Cashier")}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Cashier
          </Text>
          <Text style={{ color: "#555", marginTop: 5 }}>
            OR, Agency, Payor Encoding
          </Text>
        </Card>

        {/* SLAUGHTER BUTTON */}
        <Card
          style={{
            padding: 20,
            borderRadius: 12,
          }}
          onPress={() => navigation.navigate("Public_Slaughter")}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Slaughter
          </Text>
          <Text style={{ color: "#555", marginTop: 5 }}>
            Animal & PMF Recording
          </Text>
        </Card>

{/* ======================================================
   LOOK UP BUTTON
====================================================== */}
        <Card
          style={{
            padding: 20,
            marginTop: 20,
            borderRadius: 12,
  }}
  onPress={() => navigation.navigate("Public_Lookup")}
>
  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
    Look Up
  </Text>
  <Text style={{ color: "#555", marginTop: 5 }}>
    Continue unfinished transactions
  </Text>
</Card>

        <Card
          style={{
            padding: 20,
            marginTop: 30,
            borderRadius: 12,
            backgroundColor: "#28a745",
          }}
          onPress={() => navigation.navigate("MainStack", { screen: "Dashboard" })}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
            Main
          </Text>
          <Text style={{ color: "#fff", marginTop: 5 }}>
            Back to main dashboard
          </Text>
        </Card>


      </View>
    </SafeAreaView>
  );
};

export default PublicDashboard;
