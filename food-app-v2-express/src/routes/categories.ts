import express from 'express';
import { addressSchema } from '../validator';
import * as middlewares from '../middlewares';
import pool from '../../db';
import { z } from 'zod';
require('dotenv').config();

const router = express.Router({mergeParams: true});

router.use(express.json());

/* Get list of all categories */
router.get('/', async (req, res) => {

  const  restaurant_id  = req.params;  //console.log('rest_id is: ', restaurant_id);
  console.log("restaurant id is:", restaurant_id);
  try {
    const result = await pool.query("SELECT * FROM categories");
    let categories = result.rows;

    res.json({
        categories
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
