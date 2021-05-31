const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsondata = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/305b77cf3f";

  const options = {
    method: "POST",
    auth: "cherry1:3ec9326a7d7d1741e7cecea47a9d4750-us1"
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsondata);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
  console.log("the server is running on port 3000.");
});


//api key : 3ec9326a7d7d1741e7cecea47a9d4750-us1

//audience id : 305b77cf3f.
