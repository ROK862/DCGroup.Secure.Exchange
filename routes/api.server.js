const fetch = require("node-fetch");
const https = require("https");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { config: env_config } = require("dotenv");
const SEToken = bcrypt.hashSync(
  `${process.env.API_USR}:${process.env.API_PASS}`,
  8
);

// We need to use the environment variables...so, lets call the config function.
env_config();

// Authentication object.
// Please keep this information in a secure location, IE: .env file.
// The alternative to this is to add a bcrypt hash of "User:Pass" as a "Secure-Exchange" request header.
// Much more secure.
const accessObject = {
  account: process.env.API_USR,
  secret: process.env.API_PASS,
};

const get_module = async ({ module_name, comp_id, filters }) => {
  const raw = JSON.stringify({ module_name, comp_id, filters });

  const requestOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Secure-Exchange": SEToken,
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      Authorization: "*",
    },
    body: raw,
    redirect: "follow",
    // This is to counter a port specific certificate bug on the exchange server.
    // we will communucate when this can be removed.
    agent: httpsAgent,
  };

  return await fetch(
    `${process.env.API_EXCHANGE_SERVER}:${process.env.API_PORT}/api/v2.0/secure/exchange/modules`,
    requestOptions
  )
    .then((res) => res.json())
    .catch((error) => console.log("error", error));
};

// This is perhaps the most important part of the code.
// Here, we are creating a sample request to business central using the
// secure exchange middle ware.
// The get module function will do the heavy lifting.
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
