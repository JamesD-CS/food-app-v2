import express from 'express';
import { addressSchema, addressUpdateSchema } from '../validator';
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

/*add an address */
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

/*Update an address */
router.put('/:address_id', async(req, res) =>{

  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  let address_id = req.params.address_id;

  try{
    let validatedAddressData = addressUpdateSchema.parse(req.body);
    let updatedStreet = ((validatedAddressData.street)? validatedAddressData.street:null);
    let updatedCity = ((validatedAddressData.city) ? validatedAddressData.city:null);
    let updatedCountry = ((validatedAddressData.country) ? validatedAddressData.country:null);
    let updatedState = ((validatedAddressData.state) ? validatedAddressData.state:null);
    let updatedPostalCode = ((validatedAddressData.postal_code) ? validatedAddressData.postal_code:null);
    let updatedLatitude = ((validatedAddressData.latitude) ? validatedAddressData.latitude:null);
    let updatedLongitude = ((validatedAddressData.longitude) ? validatedAddressData.longitude:null); 

    let update_string = 'UPDATE addresses SET ';
    let update_values = [];
    let var_num = 0;

    if (updatedStreet){
      var_num += 1;
      update_string += 'street = $' + var_num.toString() + ', ';
      update_values.push(updatedStreet);
    };

    if (updatedCity){
      var_num += 1;
      update_string += 'city = $' + var_num.toString() + ', ';
      update_values.push(updatedCity);
    };

    if (updatedState){
      var_num += 1;
      update_string += 'state = $' + var_num.toString() + ', ';
      update_values.push(updatedState);
    };

    if (updatedCountry){
      var_num += 1;
      update_string += 'country = $' + var_num.toString() + ', ';
      update_values.push(updatedCountry);
    };

    if (updatedPostalCode){
      var_num += 1;
      update_string += 'postal_code = $' + var_num.toString() + ', ';
      update_values.push(updatedPostalCode);
    };

    if (updatedLatitude){
      var_num += 1;
      update_string += 'latitude = $' + var_num.toString() + ', ';
      update_values.push(updatedLatitude);
    };

    if (updatedLongitude){
      var_num += 1;
      update_string += 'longitude = $' + var_num.toString() + ', ';
      update_values.push(updatedLongitude);
    };

    var_num += 1
    update_string += 'WHERE user_id = $' + var_num.toString();
    update_values.push(user_id);

    var_num += 1
    update_string += ' AND id =$' + var_num.toString();
    update_values.push(address_id);

    const formattedUpdateString = (str: string): string => {
      return str.replace(/,(\s*)WHERE/, '$1WHERE');
    };

    console.log(formattedUpdateString, update_values);

    let update_address_query ={
      text: formattedUpdateString(update_string) + ' Returning *',
      values: update_values
    }


    console.log('final update address query:', update_address_query);

    const result = await pool.query(update_address_query);
    console.log("update address result:",result);

    let updated_address = {"id": result.rows[0].id, "street":result.rows[0].street, "city": result.rows[0].city,
      "state":result.rows[0].state, "country":result.rows[0].country, "postal_code":result.rows[0].postal_code,
      "latitude":result.rows[0].latitude,"longitude":result.rows[0].longitude,"updated_at": result.rows[0].updated_at};
    
    
    res.status(200).json(updated_address);
  }
  catch(error){
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

/* Get user addresses */
router.delete('/:address_id', async (req, res) => {

  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  let address_id = req.params.address_id;
  console.log('user_id is:', user_id);

  try {
    const get_addresses_query = {
      text:"DELETE FROM addresses WHERE id = $1 AND user_id = $2",
      values:[address_id, user_id]
    }
    const result = await pool.query(get_addresses_query);

    res.status(204).send();

  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
});


router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
