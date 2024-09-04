import React, { useEffect, useState } from 'react';
import { Alert, View, Text, ScrollView } from 'react-native';
import { getMoney } from "../../lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const MoneyInSafe = () => {
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const result = await getMoney();
        console.log("Fetched result:", result); // Debug logging
        setAmount(result);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAmount();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6"> 
        <Text className="text-2xl text-white font-psemibold">        Last Amount of Money</Text>
        <Text className="text-2xl text-white font-psemibold">                           ${amount != null ? amount : "No data available"}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoneyInSafe;
