import MapView, { PROVIDER_DEFAULT } from "@/components/MapView";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
// import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  // const region = {}
  return (
    <MapView
      provider={Platform.OS === "web" ? "google" : PROVIDER_DEFAULT}
      googleMapsApiKey={`${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`}
      className="flex-1 w-full h-full rounded-2xl"
      tintColor="black"
      style={styles.map}
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      //initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      <Text>Map</Text>
    </MapView>
  );
};

// TODO: Implement using a remap as per https://www.nativewind.dev/guides/third-party-components
const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 16,
    tintColor: "black",
  },
});

export default Map;
