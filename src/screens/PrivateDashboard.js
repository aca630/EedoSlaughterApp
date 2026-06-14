/**
 * ============================================================
 * PRIVATE DASHBOARD
 * ------------------------------------------------------------
 * Purpose:
 * - Show DAILY PRIVATE income
 * - Allow backdated viewing via Date Picker
 * - Act as NAVIGATION HUB for Private module
 *
 * Notes:
 * - UI / layout untouched
 * - ONLY backend aggregation call updated
 * ============================================================
 */

import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment-timezone";

import GetToken from "../api/helpers/GetToken";
// 🔽 UPDATED API (daily aggregated total)
import { GetPrivateDailyTotal } from "../api/saleshits";

const PrivateDashboard = () => {
  const navigation = useNavigation();

  // ============================================================
  // STATE
  // ============================================================
  const [selectedDate, setSelectedDate] = useState(
    moment().tz("Asia/Taipei").format("YYYY-MM-DD")
  );
  const [totalIncome, setTotalIncome] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ============================================================
  // FETCH PRIVATE INCOME FOR SELECTED DATE
  // (Option A: compute on the fly, filter by created_at)
  // ============================================================
  const fetchPrivateIncome = async () => {
    try {
      // 🔐 Get authenticated collector token
      const auth = await GetToken();

      // 📡 Call backend daily aggregation endpoint
      const res = await GetPrivateDailyTotal({
        from: selectedDate,
        to: moment(selectedDate)
          .tz("Asia/Taipei")
          .add(1, "days")
          .format("YYYY-MM-DD"),
        token: auth.token,
      });

      // 💰 Extract total (single value, not array)
      const amount = res?.data?.data?.total_amount ?? 0;
      setTotalIncome(amount);

    } catch (error) {
      console.log("❌ Error loading private income:", error);
      setTotalIncome(0);
    }
  };

  // ============================================================
  // LIFECYCLE
  // - Auto-refresh on screen focus
  // - Auto-refresh when date changes
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      fetchPrivateIncome();
    }, [selectedDate])
  );

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchPrivateIncome().finally(() => setRefreshing(false));
  };

  // ============================================================
  // DATE PICKER HANDLER
  // ============================================================
const handleDateChange = (event, date) => {
  setShowDatePicker(false);

  // 🔒 Android dismiss protection
  if (event?.type === "dismissed") return;

  if (date) {
    setSelectedDate(
      moment(date).tz("Asia/Taipei").format("YYYY-MM-DD")
    );
  }
};


  // ============================================================
  // UI (UNCHANGED)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#ad46ff" }}>
            Slaughter House
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            PRIVATE DASHBOARD
          </Text>
        </View>

        {/* DATE SELECTOR */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Card style={{ padding: 16, marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Selected Date
            </Text>
            <Text style={{ fontSize: 16 }}>
              {selectedDate}
            </Text>
          </Card>
        </TouchableOpacity>

{/* DATE PICKER */}
{showDatePicker && (
  <DateTimePicker
    value={moment(selectedDate, "YYYY-MM-DD")
      .tz("Asia/Taipei")
      .toDate()}
    mode="date"
    display={Platform.OS === "ios" ? "spinner" : "default"}
    maximumDate={new Date()}
    onChange={handleDateChange}
  />
)}



        {/* TOTAL INCOME */}
        <Card
          style={{
            padding: 20,
            marginBottom: 30,
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Text style={{ fontSize: 14, color: "#555" }}>
            TOTAL PRIVATE INCOME
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#3b2c85",
              marginTop: 5,
            }}
          >
            ₱ {Number(totalIncome).toFixed(2)}
          </Text>
        </Card>
      </ScrollView>

      {/* FIXED FOOTER */}
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
        <TouchableOpacity
          style={footerBtn}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text>Main</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[footerBtn, activeFooter]}
          onPress={() => navigation.navigate("Private_Transaction")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Transact
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={footerBtn}
          onPress={() => navigation.navigate("Private_History")}
        >
          <Text>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ============================================================
// STYLES (UNCHANGED)
// ============================================================
const footerBtn = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const activeFooter = {
  backgroundColor: "#ad46ff",
};

export default PrivateDashboard;
