import express from 'express';
import { orderCreationSchema } from '../validator';
import * as middlewares from '../middlewares';
import pool from '../../db';
import { z } from 'zod';
require('dotenv').config();

const app = express();
const router = express.Router();

router.use(express.json());
router.use(middlewares.authHandler);


/* Get all user orders - authorization required */
router.get('/', async (req, res) => {

  console.log('data from next middleware: ',res.locals.userdata);
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  console.log('user_id is:', user_id);

  const get_user_orders = {
    text: 'SELECT * FROM orders WHERE user_id = $1',
    values: [user_id]
  }

  try {
    const result = await pool.query(get_user_orders);
    let orders = result.rows;
    res.json({
      orders
    });

  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
    
  //res.status(200).json({message:"coming soon"});
});

/*place an order. auth required */
router.post('/', async(req, res) =>{
    try{
    const validatedOrder = orderCreationSchema.parse(req.body)
    console.log("data is valid:", validatedOrder);

        res.status(201).json({"message":"order placed"});
    }catch(error){
        res.status(500).json({ message: "Error placing orders" });

    }

});

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);


export default router;