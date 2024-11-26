import { NextFunction, Request, Response } from 'express';
import ErrorResponse from './interfaces/ErrorResponse';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();


export function validateJWT(token:string){
  let secret_token:jwt.Secret = process.env.TOKEN_SECRET!;
  try {
    let decoded = jwt.verify(token, secret_token );
    //console.log("from verifyToken function",decoded); 
    return decoded;
  } catch(err) {
    console.log("invalid token")
    console.log(err);
    return false
  }

}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

export function authHandler(req:Request, res:Response, next:NextFunction){
  //check if auth header present
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'Missing authorization headers' });
  }

  let token:string|null = null;
  if (req.headers.authorization.split(' ')[0] === 'Bearer')
  token = req.headers.authorization.split(' ')[1];

//verify jwt token
if(token){
  let userdata = validateJWT(token);
  if (userdata){
    console.log('valid token');
    res.locals.userdata = userdata;
    next();

  }else{
    return res.status(403).json({ error: 'invalid token' });
  }
}

}
