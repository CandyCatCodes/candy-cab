import { Driver, MarkerData } from "@/types/type";
import { fetchAPI } from "./fetch";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      id: driver.driver_id,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3;
  // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3;
  // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  ) {
    console.log("Missing required parameters");
    return;
  }

  try {
    // console.log("Calculating driver times with inputs:", {
    //   userLat: userLatitude,
    //   userLng: userLongitude,
    //   destLat: destinationLatitude,
    //   destLng: destinationLongitude,
    //   markersCount: markers.length,
    // });

    const timesPromises = markers.map(async (marker) => {
      const requestBody = {
        origin: {
          location: {
            latLng: {
              latitude: marker.latitude,
              longitude: marker.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: userLatitude,
              longitude: userLongitude,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "IMPERIAL",
      };

      const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": directionsAPI!,
        "X-Goog-FieldMask":
          "routes.legs.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      };
      const responseToUser = await fetchAPI(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestBody),
        },
      );

      const dataToUser = responseToUser;
      const durationStringToUser = dataToUser.routes[0].legs[0].duration; // e.g., "21004s"
      const timeToUser = parseInt(durationStringToUser.replace("s", ""), 10); // Convert "21004s" → 21004

      const requestBodyToDestination = {
        origin: {
          location: {
            latLng: {
              latitude: userLatitude,
              longitude: userLongitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "IMPERIAL",
      };

      const responseToDestination = await fetchAPI(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestBodyToDestination),
        },
      );

      const dataToDestination = responseToDestination;
      const durationStringToDestination =
        dataToDestination.routes[0].legs[0].duration;
      const timeToDestination = parseInt(
        durationStringToDestination.replace("s", ""),
        10,
      );

      const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
      const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};
