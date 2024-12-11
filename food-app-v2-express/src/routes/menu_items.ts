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
  try {
    let get_menu_items_query = {
      text:"SELECT * FROM menu_items where restaurant_id = $1",
      values:[restaurant_id.restaurant_id]
    }
    const result = await pool.query(get_menu_items_query);
    let menu_items = result.rows;

    let category_ids = menu_items.map(item => item.category_id);

    console.log("category ids:", category_ids);

    let get_category_name_query = {
      text: "SELECT name, id FROM categories WHERE id = ANY($1::int[])",
      values:[category_ids]
    }
    
    let category_names = await pool.query(get_category_name_query);

    //console.log(category_names.rows);

    //[ { name: 'Pizzas', id: 1 }, { name: 'Sides', id: 2 } ]

    const lookup = category_names.rows.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});

    for (const obj of menu_items) {
      const categoryId = obj.category_id;
      const categoryName = lookup[categoryId] || null;
  
      // Replace category_id with a "category" object
      obj.category = {
        id: categoryId,
        name: categoryName
      };
  
      // Remove the old category_id property
      delete obj.category_id;
    }

    res.json({
      menu_items
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
