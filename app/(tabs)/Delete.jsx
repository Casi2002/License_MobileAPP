import React from 'react'
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  ScrollView,
} from "react-native";

import { deleteChosedValuableItem } from "../../lib/appwrite";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { useGlobalContext } from "../../context/GlobalProvider";

const Delete = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    Object_Name: "",
  });

  const submit = async () => {
    if (
      (form.Object_Name === "")
    ) {
      return Alert.alert("Please provide the name of the item you want to delete");
    }

    setUploading(true);
    try {
      await deleteChosedValuableItem({
        ...form,
      });

      Alert.alert("Success", "Item deleted successfully");
      router.push("/MoneyInSafe");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        Object_Name: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Delete Item</Text>

        <FormField
          title="Object Name"
          value={form.Object_Name}
          placeholder="The name of the object"
          handleChangeText={(e) => setForm({ ...form, Object_Name: e })}
          otherStyles="mt-10"
        />


        <CustomButton
          title="Submit & Delete"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Delete