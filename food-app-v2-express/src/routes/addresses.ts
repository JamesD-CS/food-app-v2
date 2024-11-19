import express from 'express';
import { addressSchema } from '../validator';
import * as middlewares from '../middlewares';
import api from '../api';
import pool from '../../db';
import { z } from 'zod';
require('dotenv').config();

const app = express();
const router = express.Router();

router.use(express.json());

/* Get list of all addresses */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM addresses");
    let addresses = result.rows;

    res.json({
      addresses
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching addresses" });
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
    let restaurant = result.rows;
    res.json({
      restaurant
    });

  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
});

/*Add a restaurant */
router.post('/', async(req, res) =>{

  //valdate json with zod
  try {
    const validatedData = addressSchema.parse(req.body);

    // Proceed with creating the user using validatedData
   // const user = await createUser(validatedData);
    console.log("data is valid:", validatedData);

    //insert restaurant data into db if valid
    let rest_insert_query = {
      text: 'INSERT INTO restaurants (name, description, phone_number, email) VALUES($1, $2, $3, $4 )',
      //values: [validatedData.name, validatedData.description, validatedData.phone_number, validatedData.email]
    };

    const result = await pool.query(rest_insert_query);
    console.log(result);
    res.status(201).json({"response": "restaurant added to db"});
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.log("invalid data", error.errors);
      res.status(400).json({ errors: error.errors });
    } else {
      // Handle other errors
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

});

router.use('/api/v1', api);

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
