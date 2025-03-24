// import MapView, { Marker, PROVIDER_DEFAULT } from "@/components/MapView";
import { useDriverStore, useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { data, icons } from "@/constants";
import { MarkerData, Driver } from "@/types/type";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useFetch } from "@/lib/fetch";
import { MapViewRoute } from "react-native-maps-routes";

const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  // console.log("Drivers from driver api in Map.tsx: ", drivers);
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (mapReady) {
      if (Array.isArray(drivers)) {
        if (!userLatitude || !userLongitude) return;

        const newMarkers = generateMarkersFromData({
          data: drivers,
          userLatitude,
          userLongitude,
        });
        setMarkers(newMarkers);
      }
    }
  }, [drivers, userLatitude, userLongitude, mapReady]);
  // }, [drivers, mapReady]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        // Sets the drivers in our store
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  const handleMapReady = () => {
    setMapReady(true);
  };

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={Platform.OS === "web" ? "google" : PROVIDER_DEFAULT}
      //googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}
      className="flex-1 w-full h-full rounded-2xl "
      tintColor="black"
      style={styles.map}
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
      onMapReady={handleMapReady}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewRoute
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude!,
              longitude: destinationLongitude!,
            }}
            apiKey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#0286ff"
            strokeWidth={3}
            mode="DRIVE"
          />
        </>
      )}
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
