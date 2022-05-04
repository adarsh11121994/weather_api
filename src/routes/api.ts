import express from "express";
const app = express.Router();
import fetch from "request";

import mysql from "mysql";

let con=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "wt_api"
});
 

con.connect(function(err : any){
    if(err) throw err;
    console.log('database connected successfully');
});

app.get('/',(req:any, res:any) => {
    console.log(req.body);
    res.send(' API Server');
});

app.get('/apihit',  async (req:any, res:any) => {
    //Fetch API Data
    fetch({uri: 'http://dataservice.accuweather.com/locations/v1/postalcodes/search?q=821310&apikey=B6CjbtL9AAD9D1x58SRAPQXxG8OQnhy5', 
        method: 'GET',
        multipart: {
            chunked: false,
            data: [
                {
                    'content-type': 'application/json',
                    body:  '{}'
                }
            ]
        }
        
    }, async function (error:any, response:any, body:any) {


        //Save data
        let data = JSON.stringify(response);    
        let insertQuery='insert into `data` (`datacol`) VALUES(? )';
        let query=mysql.format(insertQuery,[ 
            data || ``,        
        ]);
        await con.query(query,function(err:any,res:any){
            if(err) throw err ;   
        });   


        //check for date prime or not prime
        const d = new Date();
        let day = d.getDay();
        let count = 0;
        for(let i = 2; i<day/2; i++){
            if(day%i == 0){
                count++;
            }
        }
        if(count == 0){
            res.send({data: JSON.parse(data),data_body: JSON.parse(JSON.parse(data).body), date: 'date is prime', data_save: "success"});
        }else{
            res.send({dateError: 'date is not prime', data_save: "success"});
        }
    });
});



app.post('/raw_save',(req:any, res:any) => {
    console.log(req.body, " req.body ");
    let data = JSON.stringify(req.body);
    try{
        let insertQuery='insert into `data` (`datacol` ) VALUES(? )';
        let query=mysql.format(insertQuery,[ 
            data || ``,        
        ]);
        con.query(query,function(err:any,response:any){
            if(err) throw err;
            res.send( { title: 'Records', records: req.body, success: 'Record Inserted Successfully' });    
        });
    }catch(err){
        res.send({msg:"Error", error: err});
        console.log(err, "<<<<<<<<<<<<>>>>>>>>>>>");
    }
});

export default app;