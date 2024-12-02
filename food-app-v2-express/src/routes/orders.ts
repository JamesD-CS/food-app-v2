import express from 'express';
import { orderCreationSchema, orderUpdateSchema } from '../validator';
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
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;

  //get menu items from json, insert into menu items table, order_id references order id of orders table.
    try{
        const validatedOrder = orderCreationSchema.parse(req.body)
        console.log("data is valid:", validatedOrder);
        let menu_items = validatedOrder.menu_items;
        console.log("menu items:", menu_items);
        let order_insert_query = {
          text: 'INSERT INTO orders (user_id, restaurant_id, delivery_address_id, order_status, total_amount, payment_status)'
          + 'VALUES($1, $2, $3, $4, $5, $6)  RETURNING id, created_at, total_amount, payment_status',
          values: [user_id, validatedOrder.restaurant_id, validatedOrder.delivery_address_id, "Pending", 23.22, "not paid"]
        };
    
        const result = await pool.query(order_insert_query);
        let order_id = result.rows[0].id;
        let created_at = result.rows[0].created_at;
        let total_amount = result.rows[0].total_amount;
        let payment_status = result.rows[0].payment_status;

        console.log("order_id:", order_id, "created at", created_at);
        let placed_order = {
          "id": order_id,
          "user_id": user_id,
          "restaurant_id": validatedOrder.restaurant_id,
          "delivery_address_id": validatedOrder.delivery_address_id,
          "order_status": "Pending",
          "total_amount": total_amount,
          "payment_status": payment_status,
          "created_at": created_at,
          "order_items": menu_items

        }
        res.status(201).json(placed_order);
    }catch(error){
        res.status(500).json({ message: "Error placing orders" });

    }

});

/*Get order details*/
router.get('/:order_id', async(req,res) =>{
  //get user data from middleware authhandler
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  let order_id = req.params.order_id;
  console.log('userdata:', userdata);
  console.log('user id:', userdata.user_id);

  const get_order_details = {
    text: 'SELECT * FROM orders WHERE user_id = $1 AND id = $2',
    values: [user_id, order_id]
  }

  try{
    const result = await pool.query(get_order_details);
    let order = result.rows;
    res.json({
      order
    });

  }catch(error){
    res.status(500).json({ message: "Error getting order" });

  }

}) 

/*change an order */
router.put('/', async(req,res)=>{
  //get user data from middleware authhandler
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  console.log('userdata:', userdata);
  console.log('user id:', userdata.user_id);

  

})

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);


export default router;