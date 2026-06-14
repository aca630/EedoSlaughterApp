/**
 * ============================================================
 * PUBLIC CASHIER — ENCODING SCREEN (APP 1)
 * ------------------------------------------------------------
 * File    : screens/Public_Cashier.js
 * Purpose :
 * - Cashier-side encoding for PUBLIC slaughter transactions
 * - Captures OR + Agency + Payor + Head counts (Small/Large)
 * - Captures animal head breakdown (Goat/Hog/Cow/Carabao)
 *
 * Scope :
 * - UI + SAVE (Phase 3A)
 * - Calls backend API to create PUBLIC transaction
 * - No computation
 *
 * Notes :
 * - This follows the original design: App 1 includes OR and heads
 * - Kilos + PMF will be handled in Public Slaughter (App 2)
 * ============================================================
 */

import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import TextInputComponent from "../components/TextInput";

import Toast from "react-native-toast-message";
import GetToken from "../api/helpers/GetToken";
import { postPublicCashierTransaction } from "../api/public_transaction";

const Public_Cashier = () => {
  const navigation = useNavigation();

  // ============================================================
  // STATE — FORM FIELDS
  // ============================================================
  const [orNumber, setOrNumber] = useState("");
  const [agency, setAgency] = useState("");
  const [payor, setPayor] = useState("");

  // Small
  const [smallHeads, setSmallHeads] = useState("");
  const [goatHeads, setGoatHeads] = useState("");
  const [hogHeads, setHogHeads] = useState("");

  // Large
  const [largeHeads, setLargeHeads] = useState("");
  const [cowHeads, setCowHeads] = useState("");
  const [carabaoHeads, setCarabaoHeads] = useState("");

  // ============================================================
  // SUBMIT STATE (PREVENT DOUBLE SAVE)
  // ============================================================
  const [submitting, setSubmitting] = useState(false);

  /**
   * ============================================================
   * FORM VALIDATION (UI)
   * ------------------------------------------------------------
   * Rules:
   * - OR, Agency, Payor are required
   * - At least ONE of:
   *     • Small Heads
   *     • Large Heads
   * ============================================================
   */
  const isFormValid =
    orNumber.trim() !== "" &&
    agency.trim() !== "" &&
    payor.trim() !== "" &&
    (Number(smallHeads) > 0 || Number(largeHeads) > 0);

  /**
   * ============================================================
   * HANDLE SUBMIT — PUBLIC CASHIER (APP 1)
   * ------------------------------------------------------------
   * Flow:
   * 1. Block double submit
   * 2. Get auth token
   * 3. Build payload (explicit, no guessing)
   * 4. POST to backend
   * 5. Reset form
   * 6. Return to Public Dashboard
   * ============================================================
   */
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const auth = await GetToken();

      const payload = {
        or_number: orNumber.trim(),
        agency: agency.trim(),
        payor: payor.trim(),

        small_heads: parseInt(smallHeads || "0", 10),
        goat_heads: parseInt(goatHeads || "0", 10),
        hog_heads: parseInt(hogHeads || "0", 10),

        large_heads: parseInt(largeHeads || "0", 10),
        cow_heads: parseInt(cowHeads || "0", 10),
        carabao_heads: parseInt(carabaoHeads || "0", 10),
      };

      console.log("📦 PUBLIC CASHIER PAYLOAD:", payload);

      const res = await postPublicCashierTransaction(auth, payload);

      console.log("✅ API RESPONSE:", res?.data);

      Toast.show({
        type: "success",
        text1: "Saved successfully",
        text2: "Public cashier transaction recorded.",
        visibilityTime: 2000,
      });

      // 🔄 RESET FORM
      setOrNumber("");
      setAgency("");
      setPayor("");
      setSmallHeads("");
      setGoatHeads("");
      setHogHeads("");
      setLargeHeads("");
      setCowHeads("");
      setCarabaoHeads("");

      // 🔙 RETURN TO DASHBOARD
      navigation.navigate("Public_Dashboard");

    } catch (error) {
      console.log("❌ SAVE ERROR:", error?.response?.data || error);

      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* ======================================================
           HEADER
        ====================================================== */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#28a745" }}>
            Slaughter House
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            PUBLIC — CASHIER
          </Text>
        </View>

        {/* ======================================================
           CASHIER INPUTS (APP 1)
        ====================================================== */}
        <Card style={{ padding: 16, borderRadius: 12 }}>
          <TextInputComponent label="OR Number" value={orNumber} onChangeText={setOrNumber} />
          <TextInputComponent label="Agency" value={agency} onChangeText={setAgency} />
          <TextInputComponent label="Payor" value={payor} onChangeText={setPayor} />

          <TextInputComponent
            label="# of Heads (Small)"
            value={smallHeads}
            onChangeText={setSmallHeads}
            keyboardType="numeric"
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextInputComponent
                label="Goat"
                value={goatHeads}
                onChangeText={setGoatHeads}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInputComponent
                label="Hog"
                value={hogHeads}
                onChangeText={setHogHeads}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TextInputComponent
            label="# of Heads (Large)"
            value={largeHeads}
            onChangeText={setLargeHeads}
            keyboardType="numeric"
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextInputComponent
                label="Cow"
                value={cowHeads}
                onChangeText={setCowHeads}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInputComponent
                label="Carabao"
                value={carabaoHeads}
                onChangeText={setCarabaoHeads}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        {/* ======================================================
           SUBMIT BUTTON
        ====================================================== */}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            disabled={!isFormValid || submitting}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Card
              style={{
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: isFormValid ? "#28a745" : "#d3d3d3",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                {submitting ? "Saving..." : "Submit"}
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ======================================================
         FOOTER NAVIGATION
      ====================================================== */}
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
        <TouchableOpacity style={footerBtn} onPress={() => navigation.navigate("MainStack", { screen: "Dashboard" })}>
          <Text>Main</Text>
        </TouchableOpacity>

        <TouchableOpacity style={footerBtn} onPress={() => navigation.navigate("Public_Dashboard")}>
          <Text>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[footerBtn, activeFooter]}
          onPress={() => navigation.navigate("Public_Slaughter")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Slaughter</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

// ============================================================
// FOOTER STYLES
// ============================================================
const footerBtn = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const activeFooter = {
  backgroundColor: "#28a745",
};

export default Public_Cashier;
