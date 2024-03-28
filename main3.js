
const express = require('express')
const userRouter = express.Router()
const cors = require('cors')

const axios = require("axios");
const SapCfAxios = require("sap-cf-axios").default;

const app = express()
//const PORT = 5005
const PORT = process.env.PORT || 5000;
app.use(cors())

const SalesOrders = 
    [  
       {
           "SoldToParty": "99999",
           "SalesOrderType": "OR",
       },
       {
           "SoldToParty": "999998",
           "SalesOrderType": "OK",
       },
   ]    

userRouter.get('/',(req,res) => {
    res.send('User List')
})
const axios3 = SapCfAxios("S4H");

userRouter.get('/SOLists',async (req,res) => {

    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$top=3&$select=SoldToParty,SalesOrderType",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json"
        }
    })
    .then(response => {

        const lineitem2 = JSON.parse(JSON.stringify(response.data.d.results));

        for(let i=0 ; i<10 ; i++) {
            SalesOrders.push({SoldToParty : lineitem2[i].SoldToParty,
                              SalesOrderType : lineitem2[i].SalesOrderType});
            }                    
    } )
    res.send(SalesOrders)
})

app.use('/', userRouter)
app.listen(PORT, () => {
    console.log(`The Express server is listending ${PORT}`)
})