const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Authentication object.
// Please keep this information in a secure location, IE: .env file.
// The alternative to this is to add a bcrypt hash of "User:Pass" as a "Secure-Exchange" request header.
// Much more secure.
const accessObject = {
  account: process.env.API_USER,
  secret: process.env.API_PASS,
};

const get_module = async ({ module_name, comp_id, filters }) => {
  const myHeaders = new fetch.Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Secure-Exchange",
    bcrypt.hashSync(`${process.env.API_USER}:${process.env.API_PASS}`, 8)
  );

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
