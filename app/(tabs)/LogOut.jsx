import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

import { icons } from "../../constants";
import {getUserItems, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider"; 
import InfoBox from "../../components/InfoBox";
import {useEffect, useState } from 'react';

const LogOut = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [items, setItems] = useState([]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  useEffect(() => {
    async function fetchItems() {
      try {
        const userItems = await getUserItems();
        setItems(userItems);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    }

    fetchItems();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

              <InfoBox
                title={user?.name}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />

              <ScrollView contentContainerStyle={styles.container}>
                {items.map((item) => (
                  <InfoBox
                    key={item.$id}
                    title={item.Object_Name}
                    subtitle={item.Object_Description}
                    containerStyles="mt-5 p-4 bg-gray-800 rounded-lg"
                    titleStyles="text-lg text-white"
                  />
                ))}
              </ScrollView>
            </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default LogOut;
