
const express = require('express')
const userRouter = express.Router()
const cors = require('cors')

const axios = require("axios");
const SapCfAxios = require("sap-cf-axios").default;
const bodyParser = require('body-parser');

const app = express()
//const PORT = 5005
const PORT = process.env.PORT || 5000;
app.use(cors())
const utf8 = require('utf8');
const USERS = []  
const SalesOrders = []    
const SalesOrderItems = []    
const CUSTOMERS = []   
const ProdLists = []    

const PurchaseOrderReqs = []
/*
const SalesOrders = [{
    "SalesOrder": "12345",
    "SalesOrderType": "XX",  
    "SalesOrganization" : "SALEST", 
    "SoldToParty": "STP",
    "CreationDate": "20210910",
    "CreatedByUser": "JWHAN",
    "PurchaseOrderByCustomer": "TEST",
}]
*/
    

userRouter.get('/',(req,res) => {
    res.send('User List')
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 
/*
const axios2 = SapCfAxios("SalesCloud");

userRouter.get('/Users',async (req,res) => {
    //res.send('User List2')
    //req.user = USERS
    const response = await axios2({
        method: "GET",
        url: "/sap/c4c/odata/v1/c4codataapi/LeadCollection",
        params: {
            $format: "json",
            $top: 10
        },
        headers: {
            accept: "application/json"
        }
    })
    .then(response => {
        const lineitem = JSON.parse(JSON.stringify(response.data.d.results));
        //lineitem.array.forEach(element => {
        //    USERS.push(element.ContactID);
        //});           
        //USERS.push({
        //    id : lineitem[1].ContactID,
        // })
    
        for(let i=0 ; i<10 ; i++) {
            USERS.push({ContactID : lineitem[i].ContactID,
                        ContactName : lineitem[i].ContactName});

        }        
    } )
    res.send(USERS)
    //res.send(JSON.parse(JSON.stringify(response.data.d)))
})
*/

const axios3 = SapCfAxios("S50");

userRouter.get('/SOLists',async (req,res) => {
    SalesOrders.length = 0;

    console.log(req.query);
    //console.log(req);
    const filtercond = JSON.parse(JSON.stringify(req.query));
    var filterstr =''
    if (filtercond.SONumber !== undefined && filtercond.SONumber !==  '' ) {
     //   console.log(`SONumber is ${filtercond.SONumber}`)
        filterstr = `&$filter=(SalesOrder eq '${filtercond.SONumber}')`       
    }
    else if (filtercond.STPartyNumber !== undefined && filtercond.STPartyNumber !== ''  && filtercond.STPartyNumber !== '999999999') {
        filterstr = `&$filter=(SoldToParty eq '${filtercond.STPartyNumber}')`       
    //    console.log("SONumber is null")
    } else if (filtercond.SalesOrderDate !== undefined && filtercond.SalesOrderDate !== '' ) {
        var str = filtercond.SalesOrderDate
            str = str.slice(0, -1);
        filterstr = `&$filter=(SalesOrderDate eq datetime'${str}')`   
    //    console.log("SONumber is null")  RequestedDeliveryDate
    } else if (filtercond.RequestedDeliveryDate !== undefined && filtercond.RequestedDeliveryDate !== '' ) {
        var str = filtercond.RequestedDeliveryDate
            str = str.slice(0, -1);
        filterstr = `&$filter=(RequestedDeliveryDate eq datetime'${str}')`   
    //    console.log("SONumber is null")  
    }
    else {
        filterstr = ''                
    }
    console.log(filterstr)
        
    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder?$top=10&$select=SalesOrder,SalesOrderType,SalesOrganization,SoldToParty,CreationDate,CreatedByUser,PurchaseOrderByCustomer,RequestedDeliveryDate,OverallTotalDeliveryStatus,SalesOrderDate,TotalNetAmount,TransactionCurrency&$orderby=CreationDate desc ,SalesOrder desc"+filterstr,
        //url: "/sap/opu/odata/sap/C_GOODSMOVEMENTQUERY_CDS/Customer?$top=10&$select=Customer_ID,CustomerText",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json"
        }
    })
    .then(response => {

        const solists = JSON.parse(JSON.stringify(response.data.d.results));

        for(let i=0 ; i < solists.length ; i++) {
            SalesOrders.push({SalesOrder : solists[i].SalesOrder,
                            SalesOrderType : solists[i].SalesOrderType,
                            SalesOrganization: solists[i].SalesOrganization,
                            SoldToParty: solists[i].SoldToParty,
                            //CreationDate: solists[i].CreationDate,
                            CreationDate: eval('new ' + solists[i].CreationDate.replace(/\//g, '')),
                            CreatedByUser: solists[i].CreatedByUser,
                            PurchaseOrderByCustomer: solists[i].PurchaseOrderByCustomer,
                            //RequestedDeliveryDate: solists[i].RequestedDeliveryDate,
                            RequestedDeliveryDate: eval('new ' + solists[i].RequestedDeliveryDate.replace(/\//g, '')),
                            OverallTotalDeliveryStatus: solists[i].OverallTotalDeliveryStatus,
                            //SalesOrderDate: solists[i].SalesOrderDate,
                            SalesOrderDate: eval('new ' + solists[i].SalesOrderDate.replace(/\//g, '')),
                            TotalNetAmount: solists[i].TotalNetAmount,
                            TransactionCurrency: solists[i].TransactionCurrency  
                        });                    
        }                                      
    } )
    res.send(SalesOrders);
    SalesOrders.length = 0;
})

/*
userRouter.get('/SOItems',async (req,res) => {

    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('4283')/to_Item?$select=SalesOrder,SalesOrderItem,SalesOrderItemCategory,SalesOrderItemText,RequestedQuantity",
        //url: "/sap/opu/odata/sap/C_GOODSMOVEMENTQUERY_CDS/Customer?$top=10&$select=Customer_ID,CustomerText",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json"
        }
    })
    .then(response => {

        const solists = JSON.parse(JSON.stringify(response.data.d.results));

        for(let i=0 ; i < solists.length ; i++) {
            SalesOrders.push({SalesOrder : solists[i].SalesOrder,
                            SalesOrderItem : solists[i].SalesOrderItem,
                            SalesOrderItemCategory: solists[i].SalesOrderItemCategory,
                            SalesOrderItemText: solists[i].SalesOrderItemText,
                            RequestedQuantity: solists[i].RequestedQuantity});                    
        }                                      
    } )
    res.send(SalesOrders)
})
*/

userRouter.get('/SOItems/:id',async (req,res) => {

    console.log("SOItems debug")
    console.log(req.params.id);
    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('" + req.params.id + "')/to_Item?$select=SalesOrder,SalesOrderItem,SalesOrderItemCategory,SalesOrderItemText,PurchaseOrderByCustomer,Material,RequestedQuantity,RequestedQuantityUnit,NetAmount,TransactionCurrency",
        //url: "/sap/opu/odata/sap/C_GOODSMOVEMENTQUERY_CDS/Customer?$top=10&$select=Customer_ID,CustomerText",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json"
        }
    })
    .then(response => {

        const solists = JSON.parse(JSON.stringify(response.data.d.results));

        for(let i=0 ; i < solists.length ; i++) {
            SalesOrderItems.push({SalesOrder : solists[i].SalesOrder,
                            SalesOrderItem : solists[i].SalesOrderItem,
                            SalesOrderItemCategory: solists[i].SalesOrderItemCategory,
                            SalesOrderItemText: solists[i].SalesOrderItemText,
                            PurchaseOrderByCustomer: solists[i].PurchaseOrderByCustomer,
                            Material: solists[i].Material,
                            RequestedQuantityUnit: solists[i].RequestedQuantityUnit,
                            NetAmount: solists[i].NetAmount,
                            TransactionCurrency: solists[i].TransactionCurrency,                            
                            RequestedQuantity: solists[i].RequestedQuantity});                    
        }                                      
    } )
    res.send(SalesOrderItems);
    SalesOrderItems.length = 0;

})


userRouter.post('/SOPost',async (req,res) => {

    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('22')",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json",
            "x-csrf-token": "fetch"
        }
    })
    .then(response => {
        console.log(req.body)

            const s4token = response.headers['x-csrf-token'];
            const s4cookie = response.headers["set-cookie"];
            const response2 = axios3({
                    method: "POST",
                    url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder",
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                        'x-csrf-token': s4token,
                        'Cookie': s4cookie
                },
                    data: req.body
            })
            .then(response2 => {
                    const solists = JSON.parse(JSON.stringify(response2.data));
                    console.log(solists);
                    res.send(response2.data);
                } )
        //res.send(response2.data);
       
        //res.send("OK Complete")
    })    
})


userRouter.delete('/SODelete/:id',async (req,res) => {

    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('22')",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json",
            "x-csrf-token": "fetch"
        }
    })
    .then(response => {
        console.log(req.body)
        console.log(req.params.id)


            const s4token = response.headers['x-csrf-token'];
            const s4cookie = response.headers["set-cookie"];
            const response2 = axios3({
                    method: "DELETE",
                    url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('" + req.params.id + "')" ,
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                        'x-csrf-token': s4token,
                        'Cookie': s4cookie,
                        'If-Match': '*'
                },
                    data: req.body
            })
            .then(response2 => {
                    const solists = JSON.parse(JSON.stringify(response2.data));
                    console.log(solists);
                    res.send(response2.data);
                } )
        //res.send(response2.data);
       
        //res.send("OK Delete Complete")
    })    
})


userRouter.patch('/SOUpdate/:SOId/:SOItemId',async (req,res) => {

    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('22')",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json",
            "x-csrf-token": "fetch"
        }
    })
    .then(response => {
        console.log("PATCH==>")
        console.log(req.body)
        console.log(req.params.SOId)
        console.log(req.params.SOItemId)

            const s4token = response.headers['x-csrf-token'];
            const s4cookie = response.headers["set-cookie"];
            const response2 = axios3({
                    method: "PATCH",
                    url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrderItem(SalesOrder=' " + req.params.SOId + "',SalesOrderItem='" + req.params.SOItemId + "')",
                    //url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('" + req.params.id + "')" ,
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                        'x-csrf-token': s4token,
                        'Cookie': s4cookie,
                        'If-Match': '*'
                },
                    data: req.body
            })
            .then(response2 => {
                    const solists = JSON.parse(JSON.stringify(response2.data));
                    console.log(solists);
                    res.send(response2.data);
                } )
              
        //res.send(response2.data);
       
        //res.send("OK Update Complete")
        
    })    
})


userRouter.put('/SOUpdate/:SOId/:SOItemId',async (req,res) => {

    const response = await axios3({
        method: "GET",
        url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('22')",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json",
            "x-csrf-token": "fetch"
        }
    })
    .then(response => {
        console.log("PUT==>")
        console.log(req.body)
        console.log(req.params.SOId)
        console.log(req.params.SOItemId)

            const s4token = response.headers['x-csrf-token'];
            const s4cookie = response.headers["set-cookie"];
            const response2 = axios3({
                    method: "PATCH",
                    url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrderItem(SalesOrder=' " + req.params.SOId + "',SalesOrderItem='" + req.params.SOItemId + "')",
                    //url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('" + req.params.id + "')" ,
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                        'x-csrf-token': s4token,
                        'Cookie': s4cookie,
                        'If-Match': '*'
                },
                    data: req.body
            })
            .then(response2 => {
                    const solists = JSON.parse(JSON.stringify(response2.data));
                    console.log(solists);
                    res.send(response2.data);
                } )
              
        //res.send(response2.data);
       
        //res.send("OK Update Complete")
        
    })    
})



app.use('/', userRouter)

app.listen(PORT, () => {
    console.log(`The Express server is listending ${PORT}`)
})