// src/schemas.ts

import { z } from 'zod';

/**
 * 1. Users
 */

// User Registration Schema
export const userRegistrationSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone_number: z.string().optional(),
  password: z.string().min(6),
});

// User Login Schema
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// User Profile Update Schema
export const userProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone_number: z.string().optional(),
  password: z.string().min(6).optional(),
});

// User TypeScript Types
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

/**
 * 2. Restaurants
 */

// Restaurant Creation Schema (for admin use)
export const restaurantCreationSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email().optional(),
});

// Restaurant Update Schema
export const restaurantUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email().optional(),
});

// Restaurant TypeScript Types
export type RestaurantCreation = z.infer<typeof restaurantCreationSchema>;
export type RestaurantUpdate = z.infer<typeof restaurantUpdateSchema>;

/**
 * 3. Addresses
 */

// Address Schema
export const addressSchema = z.object({
  street: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  postal_code: z.string().min(1).max(20),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Address Update Schema
export const addressUpdateSchema = addressSchema.partial();

// Address TypeScript Types
export type Address = z.infer<typeof addressSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;

/**
 * 4. Categories
 */

// Category Schema
export const categorySchema = z.object({
  restaurant_id: z.number().int().positive(),
  name: z.string().min(1).max(100),
});

// Category Update Schema
export const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

// Category TypeScript Types
export type Category = z.infer<typeof categorySchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

/**
 * 5. Menu Items
 */

// Menu Item Schema
export const menuItemSchema = z.object({
  restaurant_id: z.number().int().positive(),
  category_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  is_available: z.boolean().optional(),
});

// Menu Item Update Schema
export const menuItemUpdateSchema = z.object({
  category_id: z.number().int().positive().optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  is_available: z.boolean().optional(),
});

// Menu Item TypeScript Types
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuItemUpdate = z.infer<typeof menuItemUpdateSchema>;

/**
 * 6. Orders
 */

// Order Item Input Schema
const orderItemInputSchema = z.object({
  menu_item_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

// Order Creation Schema
export const orderCreationSchema = z.object({
  restaurant_id: z.number().int().positive(),
  delivery_address_id: z.number().int().positive(),
  menu_items: z.array(orderItemInputSchema).min(1),
});

// Order Update Schema (e.g., to cancel an order)
export const orderUpdateSchema = z.object({
  order_status: z.enum(['Pending', 'Processing', 'Delivered', 'Cancelled']),
});

// Order TypeScript Types
export type OrderCreation = z.infer<typeof orderCreationSchema>;
export type OrderUpdate = z.infer<typeof orderUpdateSchema>;

/**
 * 7. Payments
 */

// Payment Schema
export const paymentSchema = z.object({
  order_id: z.number().int().positive(),
  payment_method: z.string().min(1).max(50),
  transaction_id: z.string().optional(),
});

// Payment TypeScript Type
export type Payment = z.infer<typeof paymentSchema>;

/**
 * 8. Delivery Personnel
 */

// Delivery Personnel Schema
export const deliveryPersonnelSchema = z.object({
  name: z.string().min(1).max(100),
  phone_number: z.string().min(1).max(20),
  email: z.string().email().optional(),
  vehicle_info: z.string().optional(),
  availability_status: z.enum(['Available', 'Unavailable']).optional(),
});

// Delivery Personnel Update Schema
export const deliveryPersonnelUpdateSchema = deliveryPersonnelSchema.partial();

// Delivery Personnel TypeScript Types
export type DeliveryPersonnel = z.infer<typeof deliveryPersonnelSchema>;
export type DeliveryPersonnelUpdate = z.infer<typeof deliveryPersonnelUpdateSchema>;

/**
 * 9. Delivery Assignments
 */

// Delivery Assignment Update Schema
export const deliveryAssignmentUpdateSchema = z.object({
  assignment_status: z.enum(['Assigned', 'In Transit', 'Delivered', 'Cancelled']),
});

// Delivery Assignment TypeScript Type
export type DeliveryAssignmentUpdate = z.infer<typeof deliveryAssignmentUpdateSchema>;

/**
 * 10. Reviews
 */

// Review Schema
export const reviewSchema = z.object({
  restaurant_id: z.number().int().positive(),
  order_id: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  comments: z.string().optional(),
});

// Review TypeScript Type
export type Review = z.infer<typeof reviewSchema>;
