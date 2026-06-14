/**
 * ============================================================
 * PUBLIC SLAUGHTER — ENCODING SCREEN (APP 2)
 * ------------------------------------------------------------
 * File    : screens/Public_Slaughter.js
 * Purpose :
 * - Slaughter-side encoding for PUBLIC slaughter transactions
 * - Supports:
 *     • Manual entry (Dashboard → no ID)
 *     • ID-based preload (Lookup → with ID)
 *
 * Rules :
 * - NO guessing
 * - Explicit field mapping
 * - SAME transaction table as Public Cashier (App 1)
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import TextInputComponent from "../components/TextInput";
import { Picker } from "@react-native-picker/picker";

import Toast from "react-native-toast-message";
import GetToken from "../api/helpers/GetToken";
import {
  getPublicTransactionById,
  updatePublicSlaughterTransaction,
} from "../api/public_transaction";

const Public_Slaughter = () => {
  const navigation = useNavigation();
  const route = useRoute();

  /**
   * ============================================================
   * ROUTE PARAM (OPTIONAL)
   * - Exists ONLY when coming from Lookup
   * ============================================================
   */
  const transactionId = route?.params?.transaction_id ?? null;

  // ============================================================
  // STATE
  // ============================================================

  const [agency, setAgency] = useState("");
  const [payor, setPayor] = useState("");

  // Small animals
  const [smallHeads, setSmallHeads] = useState("");
  const [smallKilos, setSmallKilos] = useState("");
  const [goatHeads, setGoatHeads] = useState("");
  const [hogHeads, setHogHeads] = useState("");

  // Large animals
  const [largeHeads, setLargeHeads] = useState("");
  const [largeKilos, setLargeKilos] = useState("");
  const [cowHeads, setCowHeads] = useState("");
  const [carabaoHeads, setCarabaoHeads] = useState("");

  // PMF
  const [PMF, setPMF] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /**
   * ============================================================
   * FORM VALIDATION
   * ============================================================
   */
  const isFormValid =
    (Number(smallHeads) > 0 || Number(largeHeads) > 0) &&
    PMF !== "";

  /**
   * ============================================================
   * LOAD EXISTING TRANSACTION (LOOKUP MODE)
   * ============================================================
   */
  const loadTransaction = async (id) => {
    try {
      const auth = await GetToken();
      const res = await getPublicTransactionById(auth, id);
      const data = res?.data?.data;

      if (!data) return;

      // 🔒 Explicit mapping — NO guessing
      setAgency(data.agency ?? "");
      setPayor(data.payor ?? "");

      setSmallHeads(String(data.small_heads ?? ""));
      setSmallKilos(String(data.small_kilos ?? ""));
      setGoatHeads(String(data.goat_heads ?? ""));
      setHogHeads(String(data.hog_heads ?? ""));

      setLargeHeads(String(data.large_heads ?? ""));
      setLargeKilos(String(data.large_kilos ?? ""));
      setCowHeads(String(data.cow_heads ?? ""));
      setCarabaoHeads(String(data.carabao_heads ?? ""));

      setPMF(String(data.pmf_amount ?? ""));
    } catch (err) {
      console.log("❌ Failed to load public slaughter transaction", err);
    }
  };

  /**
   * ============================================================
   * EFFECT — LOAD DATA IF ID EXISTS
   * ============================================================
   */
  useEffect(() => {
    if (transactionId) {
      loadTransaction(transactionId);
    }
  }, [transactionId]);

  /**
   * ============================================================
   * SUBMIT — SLAUGHTER UPDATE
   * ============================================================
   */
  const handleSubmit = async () => {
    if (!isFormValid || submitting) return;

    setSubmitting(true);

    try {
      const auth = await GetToken();

      const payload = {
        agency,
        payor,

        small_heads: parseInt(smallHeads || 0, 10),
        small_kilos: parseInt(smallKilos || 0, 10),
        goat_heads: parseInt(goatHeads || 0, 10),
        hog_heads: parseInt(hogHeads || 0, 10),

        large_heads: parseInt(largeHeads || 0, 10),
        large_kilos: parseInt(largeKilos || 0, 10),
        cow_heads: parseInt(cowHeads || 0, 10),
        carabao_heads: parseInt(carabaoHeads || 0, 10),

        pmf_amount: PMF,
      };

      await updatePublicSlaughterTransaction(auth, transactionId, payload);

      Toast.show({
        type: "success",
        text1: "Saved successfully",
        text2: "Public slaughter transaction updated.",
      });

      navigation.navigate("Public_Dashboard");
    } catch (error) {
      console.log("❌ Save failed", error);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef5ea" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* HEADER */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#28a745" }}>
            Slaughter House
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            PUBLIC — SLAUGHTER
          </Text>
        </View>

        {/* INPUTS */}
        <Card style={{ padding: 16, borderRadius: 12 }}>
          <TextInputComponent label="Agency" value={agency} onChangeText={setAgency} />
          <TextInputComponent label="Payor" value={payor} onChangeText={setPayor} />

          <TextInputComponent label="# of Heads (Small)" value={smallHeads} onChangeText={setSmallHeads} keyboardType="numeric" />
          <TextInputComponent label="# of Kilos (Small)" value={smallKilos} onChangeText={setSmallKilos} keyboardType="numeric" />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextInputComponent label="Goat" value={goatHeads} onChangeText={setGoatHeads} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <TextInputComponent label="Hog" value={hogHeads} onChangeText={setHogHeads} keyboardType="numeric" />
            </View>
          </View>

          <TextInputComponent label="# of Heads (Large)" value={largeHeads} onChangeText={setLargeHeads} keyboardType="numeric" />
          <TextInputComponent label="# of Kilos (Large)" value={largeKilos} onChangeText={setLargeKilos} keyboardType="numeric" />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextInputComponent label="Cow" value={cowHeads} onChangeText={setCowHeads} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <TextInputComponent label="Carabao" value={carabaoHeads} onChangeText={setCarabaoHeads} keyboardType="numeric" />
            </View>
          </View>

          {/* PMF */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ marginBottom: 5, fontWeight: "bold" }}>PMF</Text>
            <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
              <Picker selectedValue={PMF} onValueChange={setPMF} style={{ height: 60 }}>
                <Picker.Item label="Select PMF Amount" value="" />
                {[50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000].map(v => (
                  <Picker.Item key={v} label={`${v}`} value={`${v}`} />
                ))}
              </Picker>
            </View>
          </View>
        </Card>

        {/* SUBMIT */}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity disabled={!isFormValid || submitting} onPress={handleSubmit}>
            <Card style={{
              height: 70,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              backgroundColor: isFormValid ? "#28a745" : "#d3d3d3",
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                {submitting ? "Saving…" : "Submit"}
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderColor: "#ddd",
        height: 70,
      }}>
        <TouchableOpacity style={footerBtn} onPress={() => navigation.navigate("MainStack", { screen: "Dashboard" })}>
          <Text>Main</Text>
        </TouchableOpacity>
        <TouchableOpacity style={footerBtn} onPress={() => navigation.navigate("Public_Dashboard")}>
          <Text>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[footerBtn, activeFooter]} onPress={() => navigation.navigate("Public_Cashier")}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Cashier</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

// FOOTER STYLES
const footerBtn = { flex: 1, justifyContent: "center", alignItems: "center" };
const activeFooter = { backgroundColor: "#28a745" };

export default Public_Slaughter;
