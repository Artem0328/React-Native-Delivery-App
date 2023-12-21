import { useMutation, useQuery } from "@tanstack/react-query";
import * as API from "@/core/services/home/home.api";
import { queries } from "@/core/constants/queryKeys";

export const getBanners = (options: any) =>
  useQuery({
    queryKey: queries.home.banners.queryKey,
    queryFn: API.getBanners,
    ...options,
  });

export const getCategories = (options: any) =>
  useQuery({
    queryKey: queries.home.mainCategories.queryKey,
    queryFn: API.getCategories,
    ...options,
  });

export const getCatMenus = (options: any, id: any) =>
  useQuery({
    queryKey: queries.home.catMenus.queryKey,
    queryFn: () => API.getCatMenus(id),
    ...options,
  });

export const getAllMenus = (options: any) =>
  useQuery({
    queryKey: queries.home.allMenus.queryKey,
    queryFn: API.getAllMenus,
    ...options,
  });

export const getUserInfo = (options: any) =>
  useQuery({
    queryKey: queries.home.userAddress.queryKey,
    queryFn: API.getAddress,
    ...options,
  });

export const getUserSpecifiedOrders = (options: any) =>
  useQuery({
    queryKey: queries.home.userOrders.queryKey,
    queryFn: API.getUsersOrders,
    ...options,
  });

export const updateFavMenus = (options: any) =>
  useMutation({ mutationFn: API.upateFav, ...options });

export const updateUser = (options: any) =>
  useMutation({ mutationFn: API.upateUser, ...options });

export const updateUserAddress = (options: any) =>
  useMutation({ mutationFn: API.upateUserAddress, ...options });

export const searchMenus = (options: any) =>
  useMutation({ mutationFn: API.searchMenus, ...options });

export const postOrder = (options: any) =>
  useMutation({ mutationFn: API.postOrders, ...options });

export const postReview = (options: any) =>
  useMutation({ mutationFn: API.postReviews, ...options });

export const otpGenerate = (options: any) =>
  useMutation({ mutationFn: API.generateOTP, ...options });

export const verifyOTP = (options: any) =>
  useMutation({ mutationFn: API.otpVerify, ...options });

export const test = (options: any) =>
  useQuery({
    queryKey: queries.home.mainCategories.queryKey,
    queryFn: API.test,
    ...options,
  });
