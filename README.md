[![Build Status](https://travis-ci.org/migueldeicaza/TensorFlowSharp.svg?branch=master)](https://travis-ci.org/migueldeicaza/TensorFlowSharp)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/TensorFlowSharp)

# When to use Secure-Exchange - Business Central Middleware.

Secure-Exchange is a good runtime to query against Business Central "SOAP"--web services
and is mostly a simplified version of the general purpose XML request. Herein, the general
Purpose XML requests are replaced with simple JSON syntax to enable ease of use. That is,
The entire process for querying the web service is abstracted away and simplified by the secure
exchange. I believe most people will want to use a higher-level library for interfacing with
Business Central (BC) and Hansa World (HW).

The library was designed to blend in the .NET ecosystem with Node.js.

I strongly recommend that you use
[Secure-Exchange v.2.0](#) which takes a different approach than the standard secure exchange used throughout the organization.

# Secure-Exchange v.2.0

Secure-Exchange v.2.0 libraries are .NET bindings to the Node.js library:

The core of the extension was written in C#--and handles low-level tasks such as
authentication (NTLM BC/OAUTH HW), transcribing between ERP systems, modularized query handling,
and most importantly serves as an abstraction that reduces the complexity of querying
against Business Central / Hansa World.

The API surfaces the entire low-level .NET API, it is on par with other
language bindings. Bridging between the high-level abstraction and your
preferred language can be done with simple JSON interfacing as illustrated
below. Also, I have included a few variations to illustrate cross integration
across dev-ops.

# JavaScript Node.js with bcryptjs

```javascript
const server = “…”;
const port = “…”;
const myHeaders = new Headers();
myHeaders.append("Secure-Exchange", "…"); // bcryptjs hash “user:pass”
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "limit": "10", // Limit defines the maximum record count.
  "module_name": "Posted Sales Invoices", // Web Service you want to query.
  "comp_id": 24, // In system company number.
  "filters": [ // Filters are defined with a key-value pair, although in this case, in a sequential array.
    [
      "No", // Whats the first filter key?
      "156620..156620" // Whats the first filter value? Notice it’s a range between 156620 and 156620
    ],
    [
      "Due_Date",
      "2022-08-31"
    ]
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${server}:${port}/api/v2.0/secure/exchange/modules", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

# CSharp (.NET)

```csharp
var client = new RestClient(SERVER+”:”+PORT+”/api/v2.0/secure/exchange/modules");
client.Timeout = -1;
var request = new RestRequest(Method.POST);
request.AddHeader("Secure-Exchange", HASH);
request.AddHeader("Content-Type", "application/json");
var body = @"{
" + "\n" +
@"    ""limit"": ""10"",
" + "\n" +
@"    ""module_name"": ""Posted Sales Invoices"",
" + "\n" +
@"    ""comp_id"": 24,
" + "\n" +
@"    ""filters"": [
" + "\n" +
@"        [
" + "\n" +
@"            ""No"",
" + "\n" +
@"            ""156620..156620""
" + "\n" +
@"        ],[
" + "\n" +
@"            ""Due_Date"",
" + "\n" +
@"            ""2022-08-31""
" + "\n" +
@"        ]
" + "\n" +
@"    ]
" + "\n" +
@"}";
request.AddParameter("application/json", body,  ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```

#

```php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '{SERVER}:{PORT}/api/v2.0/secure/exchange/modules',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
    "limit": "10",
    "module_name": "Posted Sales Invoices",
    "comp_id": 24,
    "filters": [
        [
            "No",
            "156620..156620"
        ],[
            "Due_Date",
            "2022-08-31"
        ]
    ]
}',
  CURLOPT_HTTPHEADER => array(
    'Secure-Exchange: {HASH} ',
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
```

# Sample Response: Value Entries

```json
{
  "status": 200,
  "user": "Imperial",
  "requestTimestamp": "Fri Jul 22 2022 14:57:00 GMT+0200 (Central Africa Time)",
  "module": "5802 - Value Entries",
  "records": [
    {
      "Key": "12;qhYAAACHECc=10;13443715830;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122231",
      "Document_Line_No": "20000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "1082.6",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-1157.2",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-1157.2",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-100",
      "Valued_Quantity": "-100",
      "Invoiced_Quantity": "-100",
      "Cost_per_Unit": "11.572",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-HEI0352925",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1010",
      "Source_Type": "Customer",
      "Source_No": "1-OKHEINZ",
      "Document_Date": "2021-09-22",
      "External_Document_No": "NA0322111070",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9730",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10000",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHESc=10;13457028270;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122232",
      "Document_Line_No": "10000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "508.8",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-447.76",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-447.76",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-24",
      "Valued_Quantity": "-24",
      "Invoiced_Quantity": "-24",
      "Cost_per_Unit": "18.65667",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-MCC0007804",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1010",
      "Source_Type": "Customer",
      "Source_No": "1-OKMCAIN",
      "Document_Date": "2021-09-22",
      "External_Document_No": "NA0322111047",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9731",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10001",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHEic=10;13457028280;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122233",
      "Document_Line_No": "10000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "584",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-447.76",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-447.76",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-24",
      "Valued_Quantity": "-24",
      "Invoiced_Quantity": "-24",
      "Cost_per_Unit": "18.65667",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-MCC0007804",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1010",
      "Source_Type": "Customer",
      "Source_No": "1-DEHLIWSALE",
      "Document_Date": "2021-09-22",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9732",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10002",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHEyc=10;13438735850;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122234",
      "Document_Line_No": "10000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "325.56",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-305.1",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-305.1",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-48",
      "Valued_Quantity": "-48",
      "Invoiced_Quantity": "-48",
      "Cost_per_Unit": "6.35625",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-CHIL103529",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1040",
      "Source_Type": "Customer",
      "Source_No": "1-OKCHILLBEV",
      "Document_Date": "2021-09-22",
      "External_Document_No": "NA0322111449",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9733",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10003",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHFCc=10;13438400520;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122234",
      "Document_Line_No": "20000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "325.56",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-306.58",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-306.58",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-48",
      "Valued_Quantity": "-48",
      "Invoiced_Quantity": "-48",
      "Cost_per_Unit": "6.38708",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-CHIL103528",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1040",
      "Source_Type": "Customer",
      "Source_No": "1-OKCHILLBEV",
      "Document_Date": "2021-09-22",
      "External_Document_No": "NA0322111449",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9734",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10004",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHFSc=10;13446256330;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122235",
      "Document_Line_No": "10000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "598.26",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-598.26",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-598.26",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-32",
      "Valued_Quantity": "-32",
      "Invoiced_Quantity": "-32",
      "Cost_per_Unit": "18.69563",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-LAN0071466",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1020",
      "Source_Type": "Customer",
      "Source_No": "1-DEHLIWSALE",
      "Document_Date": "2021-09-22",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9735",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10005",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHFic=10;13446549880;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122235",
      "Document_Line_No": "20000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "598.26",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-598.27",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-598.27",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-32",
      "Valued_Quantity": "-32",
      "Invoiced_Quantity": "-32",
      "Cost_per_Unit": "18.69594",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-LAN0071467",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1020",
      "Source_Type": "Customer",
      "Source_No": "1-DEHLIWSALE",
      "Document_Date": "2021-09-22",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9736",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10006",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHFyc=10;13451697020;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122235",
      "Document_Line_No": "30000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "93.39",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-93.39",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-93.39",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-6",
      "Valued_Quantity": "-6",
      "Invoiced_Quantity": "-6",
      "Cost_per_Unit": "15.565",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-LAN0072122",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1020",
      "Source_Type": "Customer",
      "Source_No": "1-DEHLIWSALE",
      "Document_Date": "2021-09-22",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9737",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10007",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHGCc=10;13451794080;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122235",
      "Document_Line_No": "40000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "93.39",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-93.39",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-93.39",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-6",
      "Valued_Quantity": "-6",
      "Invoiced_Quantity": "-6",
      "Cost_per_Unit": "15.565",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-LAN0072123",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1020",
      "Source_Type": "Customer",
      "Source_No": "1-DEHLIWSALE",
      "Document_Date": "2021-09-22",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9738",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10008",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    },
    {
      "Key": "12;qhYAAACHGSc=10;13451642110;",
      "Posting_Date": "2021-09-22",
      "Valuation_Date": "2021-09-22",
      "Item_Ledger_Entry_Type": "Sale",
      "Entry_Type": "Direct_Cost",
      "Variance_Type": "_blank_",
      "Adjustment": "false",
      "Document_Type": "Sales_Invoice",
      "Document_No": "122235",
      "Document_Line_No": "50000",
      "Sales_Amount_Expected": "0",
      "Sales_Amount_Actual": "93.39",
      "Cost_Amount_Expected": "0",
      "Cost_Amount_Actual": "-93.39",
      "Cost_Amount_Non_Invtbl": "0",
      "Cost_Posted_to_G_L": "-93.39",
      "Expected_Cost_Posted_to_G_L": "0",
      "Cost_Amount_Expected_ACY": "0",
      "Cost_Amount_Actual_ACY": "0",
      "Cost_Amount_Non_Invtbl_ACY": "0",
      "Cost_Posted_to_G_L_ACY": "0",
      "Item_Ledger_Entry_Quantity": "-6",
      "Valued_Quantity": "-6",
      "Invoiced_Quantity": "-6",
      "Cost_per_Unit": "15.565",
      "Cost_per_Unit_ACY": "0",
      "Item_No": "Z-LAN0072120",
      "Location_Code": "WH001",
      "Type": "Work_Center",
      "Discount_Amount": "0",
      "Salespers_Purch_Code": "RETAIL",
      "User_ID": "DEEPCATCHGROUP\\PAULUSK",
      "Source_Posting_Group": "TRADE",
      "Source_Code": "SALES",
      "Gen_Bus_Posting_Group": "LOCAL",
      "Gen_Prod_Posting_Group": "1020",
      "Source_Type": "Customer",
      "Source_No": "1-DEHLIWSALE",
      "Document_Date": "2021-09-22",
      "Order_Type": "_blank_",
      "Valued_By_Average_Cost": "true",
      "Item_Ledger_Entry_No": "9739",
      "Capacity_Ledger_Entry_No": "0",
      "Entry_No": "10009",
      "Job_Ledger_Entry_No": "0",
      "Dimension_Set_ID": "0"
    }
  ]
}
```
