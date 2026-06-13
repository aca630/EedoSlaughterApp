/**
 * ============================================================
 * PRIVATE HISTORY — VIEW SCREEN
 * ------------------------------------------------------------
 * File: screens/Private_History_View.js
 *
 * PURPOSE:
 * - Display FULL details of a selected private transaction
 * - Mirrors EXACTLY what appears on printed receipt
 * - Uses COMPUTED backend data (audit-safe)
 *
 * DATA SOURCE:
 * - GET /api/private_transaction/compute-by-id/{id}
 *
 * INPUT:
 * - route.params.transaction_id
 *
 * FOOTER:
 * - Back → returns to History list
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment-timezone";
import axios from "axios";

import GetToken from "../api/helpers/GetToken";
import printPrivateReceipt from "./Private_Print";

const Private_History_View = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaction_id } = route.params;

  const [data, setData] = useState(null);

  // ============================================================
  // FETCH TRANSACTION DETAILS (COMPUTED, PRINT-READY)
  // ============================================================
  const fetchDetails = async () => {
    try {
      const auth = await GetToken();

      const res = await axios.get(
        `http://192.168.1.202:8000/api/private_transaction/compute-by-id/${transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: "application/json",
          },
        }
      );

      setData(res?.data?.data);
    } catch (err) {
      console.log("❌ History view error:", err?.response?.data || err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (!data) {
    return (
      <SafeAreaView>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Loading…
        </Text>
      </SafeAreaView>
    );
  }

  // ============================================================
  // VISIBILITY FLAGS (MATCH PRINT LOGIC)
  // ============================================================
  const hasSmallAnimals =
    (data.heads?.small ?? 0) > 0 ||
    (data.animals?.small_kilos ?? 0) > 0 ||
    (data.animals?.goat_heads ?? 0) > 0 ||
    (data.animals?.hog_heads ?? 0) > 0;

  const hasLargeAnimals =
    (data.heads?.large ?? 0) > 0 ||
    (data.animals?.large_kilos ?? 0) > 0 ||
    (data.animals?.cow_heads ?? 0) > 0 ||
    (data.animals?.carabao_heads ?? 0) > 0;

  // ============================================================
  // UI
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 120 }}>
        {/* HEADER */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "#ad46ff",
            marginBottom: 14,
          }}
        >
          Transaction Details
        </Text>

        {/* BASIC INFO */}
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <Text>OR #: {data.or_no}</Text>
          <Text>Agency: {data.agency}</Text>
          <Text>Payor: {data.owner}</Text>
          <Text>
            Date:{" "}
            {moment(data.created_at)
              .tz("Asia/Taipei")
              .format("MMM DD, YYYY HH:mm")}
          </Text>
        </Card>

        {/* ANIMAL DETAILS (REFERENCE ONLY) */}
        {(hasSmallAnimals || hasLargeAnimals) && (
          <Card style={{ padding: 14, marginBottom: 14 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              ANIMAL DETAILS
            </Text>

            {hasSmallAnimals && (
              <>
                <Text style={{ fontWeight: "bold" }}>SMALL CATTLES</Text>
                {data.heads.small > 0 && <Text>Heads: {data.heads.small}</Text>}
                {data.animals.small_kilos > 0 && (
                  <Text>Kilos: {data.animals.small_kilos}</Text>
                )}
                {data.animals.goat_heads > 0 && (
                  <Text>Goat: {data.animals.goat_heads}</Text>
                )}
                {data.animals.hog_heads > 0 && (
                  <Text>Hog: {data.animals.hog_heads}</Text>
                )}
                <View style={{ marginBottom: 8 }} />
              </>
            )}

            {hasLargeAnimals && (
              <>
                <Text style={{ fontWeight: "bold" }}>LARGE CATTLES</Text>
                {data.heads.large > 0 && <Text>Heads: {data.heads.large}</Text>}
                {data.animals.large_kilos > 0 && (
                  <Text>Kilos: {data.animals.large_kilos}</Text>
                )}
                {data.animals.cow_heads > 0 && (
                  <Text>Cow: {data.animals.cow_heads}</Text>
                )}
                {data.animals.carabao_heads > 0 && (
                  <Text>Carabao: {data.animals.carabao_heads}</Text>
                )}
              </>
            )}
          </Card>
        )}

        {/* CHARGES */}
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            NATURE OF COLLECTION / AMOUNT
          </Text>
          <Text>Corral Fee (CF): ₱ {data.charges.cf.toFixed(2)}</Text>
          <Text>Slaughter Fee (SF): ₱ {data.charges.sf.toFixed(2)}</Text>
          <Text>Slaughter Permit (SPF): ₱ {data.charges.spf.toFixed(2)}</Text>
          <Text>Post Mortem Fee (PMF): ₱ {data.charges.pmf.toFixed(2)}</Text>
        </Card>

        {/* TOTAL */}
        <Card style={{ padding: 14 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            TOTAL AMOUNT
          </Text>
          <Text style={{ fontSize: 22 }}>
            ₱ {data.charges.total.toFixed(2)}
          </Text>
        </Card>

        {/* REPRINT */}
        <TouchableOpacity
          style={{
            marginTop: 30,
            backgroundColor: "#ad46ff",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => printPrivateReceipt(transaction_id)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Reprint Receipt
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FOOTER */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          justifyContent: "center",
          alignItems: "center",
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Private_History_View;
 