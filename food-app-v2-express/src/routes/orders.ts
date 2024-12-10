import express from 'express';
import { OrderCreation, orderCreationSchema, orderUpdateSchema } from '../validator';
import * as middlewares from '../middlewares';
import pool from '../../db';
import { QueryResult } from 'pg';
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

  type ResultObject = {
    id: number;
    quantity: number;
    unit_price:number
    total_price: number;
};

  //get menu items from json, insert into menu items table, order_id references order id of orders table.
    try{
        const validatedOrder = orderCreationSchema.parse(req.body)
        console.log("data is valid:", validatedOrder);
        let menu_items = validatedOrder.menu_items;
        console.log("menu items:", menu_items);
        let item_ids =  menu_items.map(item => item.menu_item_id);

        /* lookup item price for each item in menu_items list from menu_items table, calculate total */
        let get_price_query={
          text: "SELECT price, id from menu_items WHERE id = ANY($1::int[])",
          values: [item_ids]
        }
        console.log(get_price_query);
        let price_result = await pool.query(get_price_query);
        console.log("price query results:", price_result.rows);

        const calculateTotal = (array1:QueryResult["rows"], array2:OrderCreation["menu_items"]) => {

          const idToQuantityMap: Record<number, number> = {};
          array2.forEach(obj => {
            idToQuantityMap[obj.menu_item_id] = obj.quantity;
          });

          // For each object in arr1, find the matching quantity in arr2 and calculate total_price
            return array1.reduce((resultArray: ResultObject[], obj1) => {
                const quantity = idToQuantityMap[obj1.id];
            if (quantity !== undefined) {
                const total_price = obj1.price * quantity;
                resultArray.push({
                    id: obj1.id,
                    quantity: quantity,
                    unit_price:obj1.price,
                    total_price: total_price
                });
            }
            // If no matching id is found in arr2, we skip the object
            return resultArray;
        }, []);
          
        };
        const total_price_per_item = calculateTotal(price_result.rows, menu_items);
        console.log("total price per item:",  total_price_per_item);

        const total_price = total_price_per_item.reduce(
          (accumulator, current_item) => accumulator + current_item.total_price,
          0,
        );

        console.log("total order price", total_price);
        let order_insert_query = {
          text: 'INSERT INTO orders (user_id, restaurant_id, delivery_address_id, order_status, total_amount, payment_status)'
          + 'VALUES($1, $2, $3, $4, $5, $6)  RETURNING id, created_at, total_amount, payment_status',
          values: [user_id, validatedOrder.restaurant_id, validatedOrder.delivery_address_id, "Pending", total_price, "not paid"]
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

        //insert menu items into order_items table 
        
       let insert_order_items_query = "INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price) VALUES"
       menu_items.forEach( (item) => {

        let filter_result = price_result.rows.filter(result => result.id === item.menu_item_id);
        let price = filter_result[0].price;
        let total_price_per = total_price_per_item.filter(order_item => order_item.id === item.menu_item_id)[0].total_price
        console.log("inside foreach price is:", price);
        insert_order_items_query += "(" + order_id + ", " + item.menu_item_id + ", " + item.quantity + ", " + price + ", " + total_price_per +"),"

       });

       insert_order_items_query = insert_order_items_query.slice(0, -1);
       console.log("insert order items query text:",insert_order_items_query);
       
      let insert_order_items_result = await pool.query(insert_order_items_query);
      console.log(insert_order_items_result);
       
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
    console.log(order);
    let get_items_query = 
    {
      text: "SELECT * FROM order_items where order_id =$1",
      values:[order[0].id]
    }
    let order_items = await pool.query(get_items_query);

    let get_rest_name_query =
    {text:"SELECT name FROM restaurants WHERE id= $1",
      values:[order[0].restaurant_id]
    } 

    let rest_name = await pool.query(get_rest_name_query);
    console.log("rest name query results:", rest_name.rows)

    let order_item_ids = order_items.rows.map(item => item.menu_item_id);

    let get_item_name_query = {
      text: "SELECT name, id FROM menu_items WHERE id = ANY($1::int[])",
      values:[order_item_ids]
    }
    
    let menu_item_names = await pool.query(get_item_name_query);

    console.log(menu_item_names.rows);
   

    //get menu item id and name from menu_items table
    //get restaurant name from restaurants table
    
        // Create a map of id -> name from the first array
        const nameMap = menu_item_names.rows.reduce((acc, item) => {
          acc[item.id] = item.name;
          return acc;
        }, {});
      
        // Use map to return a new array with the additional name property
        let update_order_items =  order_items.rows.map(item => ({
          ...item,
          name: nameMap[item.menu_item_id]
        }));
    
        console.log("updated order items:", update_order_items);

      let order_details = 
      {
        id: order[0].id,
        restaurant: {
          id:order[0].restaurant_id,
          name: rest_name.rows[0].name
        },
        order_items:update_order_items,
        order
  
      }

    //console.log("order items:", order_items.rows);
    res.json({
      order_details
    });

  }catch(error){
    res.status(500).json({ message: "Error getting order" });

  }

}); 

/*Cancel an order */
router.delete('/:order_id', async(req,res) =>{
  //get user data from middleware authhandler
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  let order_id = req.params.order_id;
  console.log('userdata:', userdata);
  console.log('user id:', userdata.user_id);
  const updated_status = "Cancelled";
  

  try{
    let update_status_query = {
      text:"UPDATE orders SET order_status = $1 WHERE id = $2",
      values: [updated_status, order_id]
    }

    let update_order_result = await pool.query(update_status_query);

    console.log(update_order_result);

    res.status(200).json({"message": "Order canceled successfully."});


  }catch(error){
    res.status(500).json({ message: "Error updating order" });

  }

});

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);


export default router;