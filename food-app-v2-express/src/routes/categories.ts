import express from 'express';
import * as middlewares from '../middlewares';
import pool from '../../db';
require('dotenv').config();

const router = express.Router({mergeParams: true});

router.use(express.json());

interface GetRestId {
  restaurant_id: Text
}

/* Get list of all categories */
router.get('/', async (req, res) => {

  let  restaurant_id  = <GetRestId>req.params;  
  console.log("restaurant id is:", restaurant_id.restaurant_id);
  //{restaurant_id:'1'}
  try {
    let get_restaurant_categories = {
      text:"SELECT * FROM categories where restaurant_id = $1",
      values:[restaurant_id.restaurant_id]
    }
    const result = await pool.query(get_restaurant_categories);
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
