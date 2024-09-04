import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  ScrollView,
} from "react-native";

import { addNewValuableItem } from "../../lib/appwrite";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    Object_Name: "",
    Object_Description: "",
    Object_Value: 0,
  });

  const submit = async () => {
    if (
      (form.Object_Name === "") |
      (form.Object_Description === "")
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await addNewValuableItem({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Item added successfully");
      router.push("/MoneyInSafe");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        Object_Name: "",
        Object_Description: "",
        Object_Value: 0,
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Add Item</Text>

        <FormField
          title="Object Name"
          value={form.Object_Name}
          placeholder="The name of the object"
          handleChangeText={(e) => setForm({ ...form, Object_Name: e })}
          otherStyles="mt-10"
        />

        <FormField
          title="Item Description"
          value={form.Object_Description}
          placeholder="Description of the item"
          handleChangeText={(e) => setForm({ ...form, Object_Description: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="Value of the item"
          value={form.Object_Value.toString()}
          placeholder="Value of the item"
          handleChangeText={(e) => setForm({ ...form, Object_Value: parseFloat(e) })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Add"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
