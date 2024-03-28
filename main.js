
const express = require('express')
const userRouter = express.Router()
const cors = require('cors')

const axios = require("axios");
const SapCfAxios = require("sap-cf-axios").default;

const app = express()
//const PORT = 5005
const PORT = process.env.PORT || 5000;
app.use(cors())

const USERS = 
     [  
        {
            "id": "123",
            "nickname": "foo",
        },
        {
            "id": "1234",
            "nickname": "gom",
        },
    ]    

userRouter.get('/',(req,res) => {
    res.send('User List')
})
const axios2 = SapCfAxios("SalesCloud");

userRouter.get('/Users',async (req,res) => {
    //res.send('User List2')
    //req.user = USERS
    const response = await axios2({
        method: "GET",
        url: "/sap/c4c/odata/v1/c4codataapi/LeadCollection",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json"
        }
    });

    const lineitem = JSON.parse(JSON.stringify(response.data.d.results));
    //var lineitem = JSON.parse(response.data.d.results);
    //res.send(lineitem[1].ID);
    USERS.push({
        id : lineitem[1].ID,
     })
    //res.send(response.data.d.results);
    //console.log(resstring)
    res.send(USERS)
})


app.use('/', userRouter)
 
app.listen(PORT, () => {
    console.log(`The Express server is listending ${PORT}`)
})