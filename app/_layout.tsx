import React, { useState } from "react";
import Colors from "@/constants/Colors";

import { Icon } from "@/constants/utils";
import { FontAwesome } from "@expo/vector-icons";

import {
  BottomSheetModalProvider,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";

import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigation } from "expo-router";

import { useEffect } from "react";
import { HeaderReview } from "./review";

import * as SecureStore from "expo-secure-store";
import LoginScreen from "./Login";

import useBasketStore from "@/store/basketStore";
import QueryClient from "@/core/lib/QueryClient";

import * as Notifications from "expo-notifications";
import { setAuthHeader } from "@/core/lib/AxiosClient";

import NoNetwork from "@/components/NoNetwork";
import NetInfo from "@react-native-community/netinfo";

import { LogBox } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [network, setNetwork] = useState<any>(true);
  const { token, setToken, products, setProducts, setTotal } = useBasketStore();

  //Disable this While Go For Production
  LogBox.ignoreAllLogs();

  let result;
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function getValueFor() {
      result = await SecureStore.getItemAsync("token");
      if (result) {
        setToken(result);
        setAuthHeader(result);
      }
    }
    getValueFor();
  }, [result, token]);

  // Set Initial Basket
  useEffect(() => {
    async function basketSet() {
      result = await SecureStore.getItemAsync("basket");
      if (result) {
        const data = JSON.parse(result);
        setProducts(data);
        const totalCost = data.reduce(
          (acc: any, item: any) => acc + item.price * item.quantity,
          0
        );
        setTotal(totalCost);
      }
    }
    basketSet();
  }, []);

  // Set Basket
  useEffect(() => {
    async function basketSet(products: any) {
      const data = JSON.stringify(products);
      await SecureStore.setItemAsync("basket", data);
    }

    basketSet(products);
  }, [products]);

  if (!loaded) {
    return null;
  }

  NetInfo.fetch().then((state) => {
    console.log("Is connected?", state.isConnected);
    setNetwork(state.isConnected);
  });

  if (network) {
    if (token) {
      return <RootLayoutNav />;
    } else {
      return <LoginScreenWithQueryClient />;
    }
  } else {
    return <NoNetwork NetInfo={NetInfo} setNetwork={setNetwork} />;
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootLayoutNav() {
  // Notification Setup
  const navigation = useNavigation();

  return (
    <QueryClient>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modal)/filter"
            options={{
              presentation: "modal",
              headerTitle: "Filter",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.lightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/location-search"
            options={{
              presentation: "fullScreenModal",
              headerTitle: "Select location",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/dish"
            options={{
              presentation: "modal",
              headerTitle: "",
              headerTransparent: true,

              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 6,
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="basket"
            options={{
              headerTitle: "Basket",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="razorpay"
            options={{
              headerTitle: "Payments",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="menus"
            options={{
              headerTitle: "Account",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              headerTitle: "Edit Profile",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="address"
            options={{
              headerTitle: "Address",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="orders"
            options={{
              headerTitle: "Orders",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="orderDetails"
            options={{
              headerTitle: "Order-Details",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="review"
            options={{
              header: () => <HeaderReview />,
            }}
          />
          <Stack.Screen
            name="trackOrder"
            options={{
              headerTitle: "Track Order",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="search-page"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="category-menu"
            options={{
              headerTitle: "Category Menu",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </QueryClient>
  );
}

function LoginScreenWithQueryClient() {
  return (
    <QueryClient>
      <LoginScreen />
    </QueryClient>
  );
}
