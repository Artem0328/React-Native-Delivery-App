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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const navigation = useNavigation();

  return (
    <>
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
              headerTitle: "Settings",
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
        </Stack>
      </BottomSheetModalProvider>
    </>
  );
}