const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();

// Authentication object.
// Please keep this information in a secure location, IE: .env file.
const accessObject = {
  account: process.env.API_USER,
  secret: process.env.API_PASS,
};

const get_module = async ({ module_name, comp_id, filters }) => {
  const myHeaders = new fetch.Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({ accessObject, module_name, comp_id, filters });

  const requestOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      Authorization: "*",
    },
    body: JSON.stringify(raw),
    redirect: "follow",
  };
  return await fetch(
    `${process.env.API_EXCHANGE_SERVER}:${process.env.API_PORT}/api/v2.0/secure/exchange/modules`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};

const sample_request = async () => {
  const module = "Value Entries";
  const filters = [];

  // Get entries with Numbers between "1000" and "1050".
  filters.push(["Entry_No", "1000..1050"]);

  // Only get entries where the warehouse location is "WH001"
  // filters.push(["Location_Code", "WH001"]);

  return await get_module({
    module_name: module,
    filters: filters,
    comp_id: 24,
  });
};

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const dataset = await sample_request();
  res.send(JSON.stringify(dataset));
  res.end();
});

module.exports = router;
