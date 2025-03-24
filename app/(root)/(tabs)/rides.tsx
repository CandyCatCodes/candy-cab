import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "@/lib/fetch";
import RideCard from "@/components/RideCard";
import { Ride } from "@/types/type";
import { images } from "@/constants";

const Rides = () => {
  const { user } = useUser();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`,
  );

  const { height: windowHeight } = useWindowDimensions();

  return (
    <SafeAreaView>
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        style={Platform.OS === "web" ? { height: windowHeight } : {}}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaBold mb-2 mt-2">
                All Rides
              </Text>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;
