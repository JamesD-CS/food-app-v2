import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import pool from '../db';
//import routes
import restaurantRouter from './routes/restaurants';
import addressRouter from './routes/addresses';
import usersRouter from './routes/users';
import ordersRouter from './routes/orders';


require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

/*Define routes for app to use */

app.use('/restaurants', restaurantRouter);
app.use('/addresses', addressRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);



app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.get<{}, MessageResponse>('/db-test', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM test");
    res.json({
      message: result.rows[0],
    });
  } catch (error) {
    console.error("Error reading from db", error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
