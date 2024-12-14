import express from 'express';
import { addressSchema } from '../validator';
import * as middlewares from '../middlewares';
import pool from '../../db';
import { z } from 'zod';
require('dotenv').config();

const app = express();
const router = express.Router();

router.use(express.json());
router.use(middlewares.authHandler);

/* Get user addresses */
router.get('/', async (req, res) => {

  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  console.log('user_id is:', user_id);

  try {
    const get_addresses_query = {
      text:"SELECT id, street, city, state, country, postal_code, latitude, longitude  FROM addresses WHERE user_id = $1",
      values:[user_id]
    }
    const result = await pool.query(get_addresses_query);
    let addresses = result.rows;

    res.json({
      addresses
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
});

router.post('/', async(req, res) =>{
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  let restaurant_id = res.locals.restaurant_data;

  console.log('user_id is:', user_id);  //valdate json with zod

  try {
    const validatedData = addressSchema.parse(req.body);

    // Proceed with creating the user using validatedData
    // const user = await createUser(validatedData);
    console.log("data is valid:", validatedData);

    //insert restaurant data into db if valid
    let address_insert_query = {
      text: 'INSERT INTO addresses (user_id, street, city, state, country, postal_code, latitude, longitude)' + 
      'VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      values: [user_id, validatedData.street, validatedData.city, validatedData.state, validatedData.country, validatedData.postal_code, validatedData.latitude, validatedData.longitude]
    };

    const result = await pool.query(address_insert_query);
    let id = result.rows[0].id;

    console.log(result);

    let reply_json = {
      "id": id,
      "user_id": user_id,
      "street": validatedData.street,
      "city": validatedData.city,
      "state": validatedData.state,
      "country": validatedData.country,
      "postal_code": validatedData.postal_code,
      "latitude": validatedData.latitude,
      "longitude": validatedData.longitude
    }
    res.status(201).json(reply_json);
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


router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
