/**
 * ============================================================
 * PUBLIC LOOK UP — UNFINISHED TRANSACTIONS
 * ------------------------------------------------------------
 * File    : screens/Public_Lookup.js
 * Purpose :
 * - Display list of PUBLIC transactions not yet completed
 * - Allow user to SELECT an existing transaction by ID
 * - Route user to:
 *     • Public_Cashier   (App 1)
 *     • Public_Slaughter (App 2)
 *
 * Scope :
 * - Phase 3B
 * - READ-ONLY
 * - API-backed
 *
 * Design Rules :
 * - View-only list
 * - Deterministic routing (status-based)
 * - NO guessing
 * ============================================================
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";

import GetToken from "../api/helpers/GetToken";
import { getPendingPublicTransactions } from "../api/public_transaction";

const Public_Lookup = () => {
  const navigation = useNavigation();

  // ============================================================
  // STATE
  // ============================================================
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // ============================================================
  // FETCH PENDING TRANSACTIONS
  // ============================================================
  const loadPendingTransactions = async () => {
    try {
      setRefreshing(true);

      const auth = await GetToken();

      const res = await getPendingPublicTransactions(auth);

      /**
       * Expected API format:
       * {
       *   message: "...",
       *   data: [ { id, or_number, agency, payor, status, created_at } ]
       * }
       */
      setTransactions(res?.data?.data || []);
    } catch (error) {
      console.log("❌ Lookup fetch error:", error?.response || error);
      setTransactions([]);
    } finally {
      setRefreshing(false);
    }
  };

  // ============================================================
  // LOAD ON SCREEN FOCUS
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      loadPendingTransactions();
    }, [])
  );

  // ============================================================
  // HANDLE RECORD SELECTION
  // ============================================================
  const handleSelect = (item) => {
    /**
     * Routing is explicit and deterministic
     * based solely on transaction.status
     */
    if (item.status === "cashier_only") {
      navigation.navigate("Public_Slaughter", {
        transaction_id: item.id,
      });
      return;
    }

    if (item.status === "slaughter_only") {
      navigation.navigate("Public_Cashier", {
        transaction_id: item.id,
      });
      return;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadPendingTransactions}
          />
        }
      >

        {/* ======================================================
           HEADER
        ====================================================== */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#28a745" }}>
            Slaughter House
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            PUBLIC — LOOK UP
          </Text>
        </View>

        {/* ======================================================
           TRANSACTION LIST
        ====================================================== */}
        {transactions.length === 0 && (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 40 }}>
            No pending transactions found.
          </Text>
        )}

        {transactions.map((item) => (
          <Card
            key={item.id}
            style={{
              padding: 16,
              marginBottom: 15,
              borderRadius: 12,
            }}
            onPress={() => handleSelect(item)}
          >
            <Text style={{ fontWeight: "bold" }}>
              Transaction ID: {item.id}
            </Text>

            <Text style={{ marginTop: 5, color: "#555" }}>
              OR #: {item.or_number}
            </Text>

            <Text style={{ marginTop: 2, color: "#555" }}>
              Agency: {item.agency}
            </Text>

            <Text style={{ marginTop: 5, color: "#777" }}>
              Status: {item.status.replace("_", " ").toUpperCase()}
            </Text>
          </Card>
        ))}

      </ScrollView>

      {/* ======================================================
         FOOTER — BACK ONLY
      ====================================================== */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 40,
            backgroundColor: "#28a745",
            borderRadius: 8,
          }}
          onPress={() => navigation.navigate("Public_Dashboard")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default Public_Lookup;
