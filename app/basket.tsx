import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  ToastAndroid,
} from "react-native";

import { Link, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";

import Colors from "@/constants/Colors";
import useBasketStore from "@/store/basketStore";

import SwipeableRow from "@/components/SwipeableRow";
import ConfettiCannon from "react-native-confetti-cannon";

import { Icon } from "@/constants/utils";
import { getUserInfo, postOrder } from "@/core/services/home";

import HalfBottomButton from "@/components/Buttons/HalfBottomButton";
import { useQueryClient } from "@tanstack/react-query";
import { queries } from "@/core/constants/queryKeys";

const Basket = () => {
  const userInfo = getUserInfo({});
  const [order, setOrder] = useState(false);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { clearCart } = useBasketStore();
  const [selectedTab, setSelectedTab] = useState("COD");

  const { products, total, reduceProduct } = useBasketStore();

  const FEES = {
    service: 2.99,
    delivery: 5.99,
  };

  const orderDetails: any = {
    orderStatus: "new",
    customer_name: userInfo?.data?.name,
    bill_total: Number(Math.ceil(total + FEES.service + FEES.delivery)),
    user_id: userInfo?.data?.id,
    user_number: userInfo?.data?.phone_number,
    address: userInfo?.data?.Address?.[0],
    Items: products,
    payment_type: selectedTab.toLowerCase(),
    payment_status: "false",
  };

  const postNewOrder = postOrder({
    onSuccess: () => {
      ToastAndroid.showWithGravity(
        "Order Placed Successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      queryClient.invalidateQueries({
        queryKey: queries.home.userOrders.queryKey,
      });
      clearCart();
    },
    onError: () => {
      ToastAndroid.showWithGravity(
        "Something Went Wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      queryClient.invalidateQueries({
        queryKey: queries.home.userOrders.queryKey,
      });
    },
  });

  function alertAddress() {
    Alert.alert(
      "Add Address",
      "You have to add your address to continue !",
      [
        { text: "Later", style: "cancel" },
        { text: "Add Now", onPress: () => goToAdrress() },
      ],
      { cancelable: false }
    );
  }

  function orderWithCOD() {
    Alert.alert(
      "Alert",
      "Are you sure you want to place the order ?",
      [
        { text: "Later", style: "cancel" },
        { text: "Add Now", onPress: () => postNewOrder.mutate(orderDetails) },
      ],
      { cancelable: false }
    );
  }

  function goToAdrress() {
    navigation.navigate("address");
    navigation.canGoBack(true);
  }

  function nav() {
    navigation.goBack();
  }

  return (
    <>
      {order && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fallSpeed={2500}
          fadeOut={true}
          autoStart={true}
        />
      )}
      {order && (
        <View style={{ marginTop: "50%", padding: 20, alignItems: "center" }}>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
            Thank you for your order!
          </Text>
          <Link href={"/"} asChild>
            <TouchableOpacity style={styles.orderBtn}>
              <Text style={styles.footerText}>New order</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
      {!order && (
        <>
          {products.length > 0 ? (
            <FlatList
              style={{ backgroundColor: "white" }}
              data={products}
              ListHeaderComponent={
                <View
                  style={{
                    ...styles.flex,
                    ...styles.section,
                    marginHorizontal: 8,
                  }}>
                  <Text style={styles.items}>Items</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Icon name="chevron-back" size={24} color={"red"} />

                    <Text style={{ fontWeight: "500" }}>
                      Swipe Right To Left Reduce
                    </Text>
                  </View>
                </View>
              }
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: Colors.grey,
                  }}
                />
              )}
              renderItem={({ item }) => (
                <SwipeableRow
                  onDelete={() => reduceProduct(item)}
                  style={{ marginHorizontal: 8 }}>
                  <View style={styles.row}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 18,
                        fontWeight: "800",
                      }}>
                      {item.quantity}x
                    </Text>
                    <Text style={{ flex: 1, fontSize: 18, fontWeight: "700" }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>
                      ₹{item.price * item.quantity}
                    </Text>
                  </View>
                </SwipeableRow>
              )}
              ListFooterComponent={
                <View style={{ marginHorizontal: 8 }}>
                  <View
                    style={{ height: 1, backgroundColor: Colors.grey }}></View>
                  <View style={{ ...styles.totalRow, marginTop: 16 }}>
                    <Text style={styles.total}>Subtotal</Text>
                    <Text style={{ fontSize: 18 }}>₹{total}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.total}>Service fee</Text>
                    <Text style={{ fontSize: 18 }}>₹{FEES.service}</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.total}>Delivery fee</Text>
                    <Text style={{ fontSize: 18 }}>₹{FEES.delivery}</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={{ ...styles.total, fontWeight: "800" }}>
                      Order Total
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "800",
                        backgroundColor: "#60B246",
                        paddingHorizontal: 20,
                        paddingVertical: 1,
                      }}>
                      ₹{(total + FEES.service + FEES.delivery).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={{ ...styles.total, fontWeight: "800" }}>
                      Payment Method
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "40%",
                        borderColor: Colors.medium,
                        borderWidth: 1,
                        padding: 0.8,
                        borderRadius: 2,
                        marginTop: 8,
                      }}>
                      <TouchableOpacity
                        onPress={() => setSelectedTab("COD")}
                        style={{
                          width: "50%",
                          alignItems: "center",
                          backgroundColor:
                            selectedTab === "COD" ? "#60B246" : "white",
                          borderRadius: 2,
                        }}>
                        <Text
                          style={{
                            fontSize: 17,
                            color: selectedTab === "COD" ? "white" : "black",
                            fontWeight: "800",
                          }}>
                          COD
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setSelectedTab("Online")}
                        style={{
                          width: "50%",
                          alignItems: "center",
                          backgroundColor:
                            selectedTab === "Online" ? "#60B246" : "white",
                        }}>
                        <Text
                          style={{
                            fontSize: 17,
                            color: selectedTab === "Online" ? "white" : "black",
                            fontWeight: "800",
                          }}>
                          Online
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.currentAddress}>
                      Delivery Address :
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}>
                      <Text style={styles.currentAddressText}>
                        {userInfo?.data?.Address?.length <= 0 ? (
                          "Clikc Add to Add Your Address  👉"
                        ) : (
                          <>
                            {userInfo?.data?.Address?.[0]?.house_no},{" "}
                            {userInfo?.data?.Address?.[0]?.street_address},{" "}
                            {userInfo?.data?.Address?.[0]?.area},{" "}
                            {userInfo?.data?.Address?.[0]?.landmark},{" "}
                            {userInfo?.data?.Address?.[0]?.city},{" "}
                            {userInfo?.data?.Address?.[0]?.state}-{" "}
                            {userInfo?.data?.Address?.[0]?.pincode}
                          </>
                        )}
                      </Text>

                      <Pressable
                        style={styles.editButton}
                        onPress={goToAdrress}>
                        <Text style={styles.text}>
                          {userInfo?.data?.Address?.length < 0
                            ? "Add "
                            : "Edit "}
                          <Icon name="create-outline" size={22} />
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              }
            />
          ) : (
            <View style={styles.imageContainer}>
              <Image
                style={styles.emptyIllustration}
                source={require("@/assets/images/empty-basket.png")}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 20,
                }}>
                Basket is Empty
              </Text>
            </View>
          )}
          {products.length > 0 ? (
            <>
              {userInfo?.data?.Address?.length <= 0 ? (
                <HalfBottomButton
                  title="Order Now"
                  handleClick={alertAddress}
                  width={"45%"}
                />
              ) : (
                <HalfBottomButton
                  title={"Order Now"}
                  nav={selectedTab == "Online" && "/razorpay"}
                  handleClick={orderWithCOD}
                  data={orderDetails}
                  orderTotal={(total + FEES.service + FEES.delivery).toFixed(2)}
                  width={"50%"}
                />
              )}
            </>
          ) : (
            <HalfBottomButton
              title="Order Now"
              handleClick={nav}
              width={"45%"}
            />
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  items: { fontSize: 20, fontWeight: "bold" },
  imageContainer: {
    backgroundColor: "white",
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#37a7ed",
    width: "25%",
    borderRadius: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5,
  },
  emptyIllustration: {
    width: 300,
    height: 300,
  },
  currentAddress: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    marginTop: 8,
  },
  currentAddressText: {
    fontSize: 16,
    width: "75%",
  },
  paymentBtn: {
    flex: 0.15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    gap: 20,
    alignItems: "center",
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: Colors.lightGrey,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  total: {
    fontSize: 18,
    flex: 1,
  },
  linkFooter: {
    flex: 0.3,
    borderWidth: 5,
    borderRadius: 20,
    width: "100%",
  },
  footer: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 20,
  },
  fullButton: {
    flex: 0.3,
    borderWidth: 5,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  footerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: 250,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
  },
});

export default Basket;
