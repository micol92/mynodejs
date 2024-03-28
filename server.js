const express = require("express");
const axios = require("axios");
const SapCfAxios = require("sap-cf-axios").default;

const app = express();
const PORT = process.env.PORT || 5000;

const axios1 = SapCfAxios("Northwind");
const handleProductsRequest = async (req, res) => {

    const response = await axios1({
        method: "GET",
        url: "/V2/Northwind/Northwind.svc/Products",
        params: {
            $format: "json"
        },
        headers: {
            accept: "application/json"
        }
    });

    res.send(response.data.d.results);
}


const axios2 = SapCfAxios("SalesCloud");
const handleMaterialsRequest = async (req, res) => {

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

    res.send(response.data.d.results);
}
 

app.get("/products", handleProductsRequest);

app.get("/leadcollection", handleMaterialsRequest);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});