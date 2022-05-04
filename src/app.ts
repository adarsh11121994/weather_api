// let jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv'; 
dotenv.config();
import express from "express";
const app = express();
app.use(express.json());
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

import API from './routes/api';
app.use('/api', API);

app.get('/',(req:any, res:any) => {
    res.send(' API Server');
});


app.listen(5000, () => console.log("Server Running..."))