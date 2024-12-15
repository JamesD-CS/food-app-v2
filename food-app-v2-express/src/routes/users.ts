import express from 'express';
import { userRegistrationSchema, userProfileUpdateSchema } from '../validator';
import * as middlewares from '../middlewares';
import pool from '../../db';
import { z } from 'zod';
//import * as bcrypt from 'bcryptjs';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

const router = express.Router();

router.use(express.json());


function generate_jwt(user_email:string, user_name:string, user_id:number){
  let secret_token:string = process.env.TOKEN_SECRET!;

  if (secret_token){
    return jwt.sign({user_email, user_name, user_id, expiresIn: '2 days'}, secret_token);
  }else{
    console.log('Error. secret_token not found in environemental variable');
  }

};

/* Get user profile - auth required*/
router.get('/profile',middlewares.authHandler, async (req, res) => {

  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  console.log('userdata:', userdata);
  console.log('user id:', userdata.user_id);

  //user id in req.body

  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [user_id]
  }

  try {
    const result = await pool.query(query);
    let profile = result.rows;
    res.json({
      profile
    });

  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/* Get list of all users */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    let users = result.rows;

    res.json({
      users
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching" });
  }
});



router.get('/login', async (req, res) => {
  //user id in req.body
  let pass = req.body.password;
  let email = req.body.email;

  if(!pass || !email){
    res.status(422).json({"error":"missing email or password"});
    return
  }

  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  }

  try {
    const result = await pool.query(query);
    let profile = result.rows;
    console.log(profile);
    if(profile.length ===0 ){
      console.log('not found')
      res.status(401).json({"error": "user not found"});
      return
    }
    const match = await argon2.verify( profile[0].password_hash ,pass );
    console.log(match);
    if (match){
      let token = generate_jwt(profile[0].email, profile[0].name, profile[0].id);

    res.json({
      "token":token, 
      "user":{
        "id": profile[0].id,
        "name": profile[0].name,
        "email": profile[0].email,
        "phone_number": profile[0].phone_number,
        "created_at": profile[0].created_at
      }
    });
    }else{
      res.status(401).json({"error":"invalid password"});
      return
    }
    

  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/*Add a user */
router.post('/', async(req, res) =>{
  //valdate json with zod
  try {
    const validatedData = userRegistrationSchema.parse(req.body);

    // Proceed with creating the user using validatedData
   // const user = await createUser(validatedData);
    console.log("data is valid:", validatedData);

    //hash password before insert
    let hashed_pass:string = await(argon2.hash(validatedData.password));
    console.log(hashed_pass);
    //insert user data into db if valid
    let user_insert_query = {
      text: 'INSERT INTO users (name, email, phone_number, password_hash) VALUES($1, $2, $3, $4) RETURNING *',
      values: [validatedData.name, validatedData.email, validatedData.phone_number, hashed_pass]
    };

    const result = await pool.query(user_insert_query);
    console.log(result);
    let new_user = {"id":result.rows[0].id, "name": result.rows[0].name, "email":result.rows[0].email, 
      "phone_number": result.rows[0].phone_number, "created_at": result.rows[0].created_at}
    res.status(201).json(new_user);
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

/*Update user profile */
router.put('/profile', middlewares.authHandler, async(req, res) =>{
  //get user data from middleware authhandler
  let userdata = res.locals.userdata;
  let user_id = userdata.user_id;
  console.log('userdata:', userdata);
  console.log('user id:', userdata.user_id);

  try{
    const validatedUserData = userProfileUpdateSchema.parse(req.body);
    let updatedName = ((validatedUserData.name) ? validatedUserData.name:null);
    let updatedPhone = ((validatedUserData.phone_number) ? validatedUserData.phone_number:null);
    let updatedPass = ((validatedUserData.password) ? validatedUserData.password:null);

    console.log('updated name:', updatedName, 'updated phone:', updatedPhone, 'updated pass:', updatedPass);

    let update_string = 'UPDATE users SET ';
    let update_values = []
    let var_num = 0;

    if (updatedName){
      var_num += 1;
      update_string += 'name = $' + var_num.toString() + ', ';
      update_values.push(updatedName);
    }

    if (updatedPhone) {
      var_num += 1;
      update_string += 'phone_number = $' + var_num.toString() + ', ';
      update_values.push(updatedPhone);
    }

    if (updatedPass) {
      var_num += 1;
      update_string += 'password = $' + var_num.toString() + ', ';
      //hash password before insert
      let hashed_pass:string = await(argon2.hash(updatedPass));
      update_values.push(hashed_pass);
    }
    var_num += 1
    update_string += 'WHERE id = $' + var_num.toString();
    update_values.push(user_id);

    console.log(update_string, update_values);

    const formattedUpdateString = (str: string): string => {
      return str.replace(/,(\s*)WHERE/, '$1WHERE');
    };


    let update_user_query ={
      text: formattedUpdateString(update_string) + ' Returning *',
      values: update_values
    }

    console.log('final query:', update_user_query);
    const result = await pool.query(update_user_query);
    console.log('returned results: ',result.rows[0].name, result.rows[0].phone_number);
    let updated_user = {"id": result.rows[0].id, "name":result.rows[0].name, "phone_number": result.rows[0].phone_number,"updated_at": result.rows[0].updated_at};

    res.status(200).json(updated_user);

  }catch(error){
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
