import express from 'express';
import { userRegistrationSchema, userProfileUpdateSchema } from '../validator';
import * as middlewares from '../middlewares';
import api from '../api';
import pool from '../../db';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

const app = express();
const router = express.Router();
const salt_rounds:number = 10;

router.use(express.json());

function generate_jwt(user_email:string, user_name:string){
  let secret_token:string = process.env.TOKEN_SECRET!;

  if (secret_token){
    return jwt.sign({user_email, user_name, expiresIn: '2 days'}, secret_token);
  }else{
    console.log('Error. secret_token not found in environemental variable');
  }

};

/* Get user profile - auth required*/
router.get('/profile', async (req, res) => {
  //user id in req.body
  let userid = req.body.userid;

  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userid]
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
    const match = await bcrypt.compare(pass, profile[0].password_hash);
    console.log(match);
    if (match){
      let token = generate_jwt(profile[0].email, profile[0].name);

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
    let hashed_pass:string = await(bcrypt.hash(validatedData.password, salt_rounds));
    console.log(hashed_pass);
    //insert user data into db if valid
    let user_insert_query = {
      text: 'INSERT INTO users (name, email, phone_number, password_hash) VALUES($1, $2, $3, $4 )',
      values: [validatedData.name, validatedData.email, validatedData.phone_number, hashed_pass]
    };

    const result = await pool.query(user_insert_query);
    console.log(result);
    res.status(201).json({"response": "user registered"});
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
router.put('/profile', async(req, res) =>{

  try{

  }catch(error){

  }

});

router.use('/api/v1', api);

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
