import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
    const { loading, isLogged } = useGlobalContext();
  
    if (!loading && isLogged) return <Redirect href="/MoneyInSafe" />;
  
  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{
            height: '100%'
        }}>
            <View className="w-full justify-center items-center min-h-[70vh] px-4">
                <Image
                    source={images.logo}
                    className="w-[230px] h-[244px]"
                    resizeMode="contain"
                />
            </View>
            <CustomButton
                title="Continue with Email"
                handlePress={() => router.push('/sign-in')}
                containerStyles="w-full mt-7"
            />
        </ScrollView>
        <StatusBar backgroundColor='#161622'
            style='light'
        />
    </SafeAreaView>
  );
}


