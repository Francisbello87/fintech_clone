import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { act } from "react";
import Colors from "@/constants/Colors";
import { RoundBtn } from "@/components/round-btn";
import { Dropdown } from "@/components/dropdown";
import { useBalanceStore } from "@/store/balance-store";

const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();
  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 100) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: "Added money",
    });
  };
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>$</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn icon={"add"} text="Add money" onPress={onAddMoney} />
        <RoundBtn icon={"refresh"} text="Exchange" />
        <Dropdown />
        <RoundBtn icon={"list"} text="Details" />

        {/* <RoundBtn icon={''} text="Add money" onPress={onAddMoney}/> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    marginTop: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  balance: {
    fontSize: 60,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
export default Page;
