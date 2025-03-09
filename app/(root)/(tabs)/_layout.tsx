import { icons } from "@/constants";
import { Tabs } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  View,
} from "react-native";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => {
  const { width } = useWindowDimensions();
  const baseWidth = 375;
  // Clamp the scale factor to a maximum of 1 so that icons don’t get bigger on larger screens
  const scaleFactor = Math.min(width / baseWidth, 1);

  // Calculate dynamic sizes based on the scale factor
  const outerSize = 48 * scaleFactor; // originally 48px (w-12/h-12)
  const innerSize = 40 * scaleFactor; // slightly smaller inner circle
  const iconSize = 28 * scaleFactor; // originally 28px (w-7/h-7)

  return (
    <View
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: outerSize / 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          justifyContent: "center",
          alignItems: "center",
          // When focused, show the green background (#0CC25F)
          backgroundColor: focused ? "#0CC25F" : "transparent",
        }}
      >
        <Image
          source={source}
          tintColor="white"
          resizeMode="contain"
          style={{
            width: iconSize,
            height: iconSize,
          }}
        />
      </View>
    </View>
  );
};

const Layout = () => (
  <Tabs
    initialRouteName="home"
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "white",
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "#333333",
        borderRadius: 50,
        overflow: "hidden",
        marginHorizontal: 20,
        height: 78,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
      },
      tabBarItemStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.home} />
        ),
      }}
    />
    <Tabs.Screen
      name="rides"
      options={{
        title: "Rides",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.list} />
        ),
      }}
    />
    <Tabs.Screen
      name="chat"
      options={{
        title: "Chat",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.chat} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.profile} />
        ),
      }}
    />
  </Tabs>
);

export default Layout;
