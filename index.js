const express = require("express");
const flightStatus = require('./routes/flightStatus');
const downloadticket =  require('./routes/downloadticket')
const { getStatusByPNR } = require('./services/api');
// const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const dotenv = require("dotenv")
dotenv.config();

const app = express();



// mongoose.connect(process.env.MONGOURL,(err)=>{
//     if(err) {
//         console.log();
//     }
//     console.log("Connected");
// })

app.use(bodyParser.json());

app.use('/flightstatus', flightStatus)
app.use('/downloadticket', downloadticket)




// app.post("/close",async (req,res)=>{
//     // console.log("res# - 123 ",JSON.parse(res));
//     console.log("post reqqqq -",req.body);


// if(msg.action == "add"){

// }
//     res.send({status : "success",
//     "messageCode": "hello",})

// })


// app.post('/sendresp',async (req,res)=>{
//     // console.log("res# - 123 ",JSON.parse(res));
//     console.log("post reqqqq -",req.body);


//     console.log("aaabb -", msg);
//     if(msg){
//         res.send({status : "success",
//         "messageCode": "hello",})
//     }    

// })

app.listen(5000, () => {
    console.log("Listening");
})




