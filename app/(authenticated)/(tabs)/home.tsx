import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { act } from "react";
import Colors from "@/constants/Colors";
import { RoundBtn } from "@/components/round-btn";
import { Dropdown } from "@/components/dropdown";
import { useBalanceStore } from "@/store/balance-store";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import WidgetList from "@/components/scrollable-list/widget-list";
import { useHeaderHeight } from "@react-navigation/elements";
const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();

  const headerHeight = useHeaderHeight();
  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 100) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: "Added money",
    });
  };
  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>$</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn icon={"add"} text="Add money" onPress={onAddMoney} />
        <RoundBtn
          icon={"refresh"}
          text="Exchange"
          onPress={clearTransactions}
        />
        <RoundBtn icon={"list"} text="Details" />
        <Dropdown />
      </View>
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transaction}>
        {transactions.length === 0 ? (
          <Text style={{ color: Colors.gray }}>No transactions</Text>
        ) : (
          transactions.map((t) => (
            <View
              key={t.id}
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <View style={styles.circle}>
                <Ionicons
                  name={t.amount > 0 ? "add" : "remove"}
                  size={24}
                  color={Colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text>{t.title}</Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {t.date.toLocaleString()}
                </Text>
              </View>
              <Text>{t.amount}$</Text>
            </View>
          ))
        )}
      </View>
      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList />
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
  transaction: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Page;
