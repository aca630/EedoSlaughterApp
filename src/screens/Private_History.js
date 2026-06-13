/**
 * ============================================================
 * PRIVATE HISTORY — LIST SCREEN
 * ------------------------------------------------------------
 * File: screens/Private_History.js
 *
 * PURPOSE:
 * - Displays PRIVATE transactions for a selected date
 * - Sorted by created_at DESC (latest first)
 * - Minimal list view:
 *     OR #
 *     Payor
 *
 * FEATURES:
 * - Date selector (Android & iOS safe)
 * - Pull-to-refresh
 * - Tap item → Private_History_View
 *
 * FOOTER:
 * - Main       → Dashboard (Private / Public selector)
 * - Dashboard  → Private_Dashboard
 * - History    → Current screen
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment-timezone";
import axios from "axios";

import GetToken from "../api/helpers/GetToken";

const Private_History = () => {
  const navigation = useNavigation();

  // ============================================================
  // STATE (ALL HOOKS TOP-LEVEL — SAFE)
  // ============================================================
  const [selectedDate, setSelectedDate] = useState(
    moment().tz("Asia/Taipei").format("YYYY-MM-DD")
  );
  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ============================================================
  // FETCH HISTORY
  // ============================================================
  const fetchHistory = async () => {
    try {
      const auth = await GetToken();
      setRefreshing(true);

      const res = await axios.get(
        "http://192.168.1.202:8000/api/private_transaction/history",
        {
          params: { date: selectedDate },
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: "application/json",
          },
        }
      );

      setRecords(res?.data?.data || []);
    } catch (err) {
      console.log("❌ History fetch error:", err?.response?.data || err);
      setRecords([]);
    } finally {
      setRefreshing(false);
    }
  };

  // ============================================================
  // AUTO FETCH WHEN DATE CHANGES
  // ============================================================
  useEffect(() => {
    fetchHistory();
  }, [selectedDate]);

  // ============================================================
  // DATE PICKER HANDLER (ANDROID SAFE)
  // ============================================================
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);

    if (event?.type === "dismissed") return;

    if (date) {
      setSelectedDate(
        moment(date).tz("Asia/Taipei").format("YYYY-MM-DD")
      );
    }
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchHistory} />
        }
      >
        {/* HEADER */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "#ad46ff",
            marginBottom: 10,
          }}
        >
          Transaction History
        </Text>

        {/* DATE SELECTOR */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Card style={{ padding: 14, marginBottom: 12 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              Selected Date
            </Text>
            <Text>{selectedDate}</Text>
          </Card>
        </TouchableOpacity>

        {/* DATE PICKER */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(`${selectedDate}T00:00:00`)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* EMPTY STATE */}
        {records.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            No transactions found.
          </Text>
        )}

        {/* LIST */}
        {records.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate("Private_History_View", {
                transaction_id: item.id,
              })
            }
          >
            <Card style={{ marginBottom: 10, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                OR # {item.or_no}
              </Text>
              <Text style={{ color: "#555", marginTop: 4 }}>
                {item.owner}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FOOTER */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          height: 70,
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          style={footerBtn}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text>Main</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={footerBtn}
          onPress={() => navigation.navigate("Private_Dashboard")}
        >
          <Text>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[footerBtn, activeFooter]}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            History
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ============================================================
// STYLES
// ============================================================
const footerBtn = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const activeFooter = {
  backgroundColor: "#ad46ff",
};

export default Private_History;
