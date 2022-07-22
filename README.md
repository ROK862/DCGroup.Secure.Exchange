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
