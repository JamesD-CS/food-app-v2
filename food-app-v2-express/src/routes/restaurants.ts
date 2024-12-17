import express from 'express';
import { restaurantCreationSchema } from '../validator';
import * as middlewares from '../middlewares';
import pool from '../../db';
import { z } from 'zod';
require('dotenv').config();

const router = express.Router();

router.use(express.json());

interface Restaurant {
  id?: number;
  address?:Address;
  [key: string]: any; // Other attributes are allowed
}

interface Address {
  restaurant_id?: number;
  user_id?:number;
  [key: string]: any; // Other attributes are allowed
}

/* Get list of all restaurants */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants");
    let restaurants = result.rows;

    //get restaurant addresses from address table
    let rest_ids = restaurants.map(item => item.id);

    let get_rest_address_query = {
      text: "SELECT * FROM addresses WHERE restaurant_id = ANY($1::int[])",
      values:[rest_ids]
    }

    let rest_addresses = await pool.query(get_rest_address_query);

    console.log("restaurant addresses:", rest_addresses.rows);

    const addressMap = <Address> {};
    for (const addr of rest_addresses.rows) {
      if (addr && addr.restaurant_id != null) {
        delete addr.user_id;
        addressMap[addr.restaurant_id] = addr;
      }
    }

  // Merge addresses into restaurant objects
  for (const restaurant of restaurants) {
    const matchingAddress = addressMap[restaurant.id] || null;
    restaurant.address = matchingAddress;
  }

    res.json({
      restaurants
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

/* Get restaurant details */
router.get('/:restaurant_id/', async (req, res) => {
  let restaurant_id = Number(req.params.restaurant_id);

  const query = {
    text: 'SELECT * FROM restaurants WHERE id = $1',
    values: [restaurant_id]
  
  }

  try {
    const result = await pool.query(query);
    let restaurant:Restaurant = result.rows[0];

    const get_address_query={
      text:"SELECT * FROM addresses WHERE restaurant_id = $1",
      values:[restaurant_id]
    }

    const rest_address = await pool.query(get_address_query);

    console.log("restaurant address:", rest_address.rows);
    delete rest_address.rows[0].user_id;
    restaurant.address = rest_address.rows[0];
    console.log("restaurant object:", restaurant);
    res.json({
      restaurant
    });

  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
});

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
