
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const sha512 = require("js-sha512");
const app = express();
const jwt_decode = require('jwt-decode');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/***************/// Auth0 token validation config ////***************/

const { auth } = require('express-jwt');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');


const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-e2po5s5efwus35nn.us.auth0.com/.well-known/jwks.json",
  }),

  audience: "https://mybank-api-1.test",
  issuer: "https://dev-e2po5s5efwus35nn.us.auth0.com/",
  algorithms: ["RS256"],
});



const jwtAuthz = require('express-jwt-authz');
var jwtAuthzOptions = { customScopeKey: 'scope', customUserKey: 'auth' };



/*********************************************/


/***************/// API 1 (public)////***************/
app.get("/", async ( request, response) => {

  
    console.log("Welcome to Fady Hakim demo - MyBank API 1");
  
    response.header("Access-Control-Allow-Origin", "*");
    response.send({"msg" : "Welcome to Fady Hakim demo"});
   
});


/***************///  API 2 (secured)////***************/
app.post("/balance", checkJwt, jwtAuthz(['read:balance'], jwtAuthzOptions) , async ( request, response) => {

  
    console.log("Account number is: " + request.body.account_number);
    
    response.header("Access-Control-Allow-Origin", "*");
    response.send({"balance": "$10,188.90"});
   

  
});
  
/*********************************************/




app.use(express.static("public"));

app.get("/", (request, response) => {
  
  response.sendFile(__dirname + "/src/pages/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const cors = require("cors"); 
app.use(cors());
