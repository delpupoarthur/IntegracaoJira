// server.js

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var gitlab = require('./gitlab')
var app = express();


app.use(bodyParser.json());
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/api/webhooks/:hookPart1/:hookPart2/:from", function (req, res) {
  //TODO verify that part1 and 2 exist
  var hookPart1 = req.params.hookPart1;
  var hookPart2 = req.params.hookPart2;
  var from = req.params.from;
  var discordHookUrl = "https://discordapp.com/api/webhooks/" + hookPart1 + "/" + hookPart2;
  
  console.log("Posting to hook: " + discordHookUrl);
  console.log("Hook from: " + from);
  // https://discordapp.com/developers/docs/resources/webhook#execute-webhook
  var discordPayload = new Object();
  switch(from) {
    case "gitlab":
      gitlab.parse(req, discordPayload)
      break;
    default:
      console.log("Unknown from: " + from);
      //todo return some error
  }
  
   var jsonString= JSON.stringify(discordPayload);
  request.post({
    headers: {'content-type' : 'application/json'},
    url:     discordHookUrl,
    body:    jsonString
  }, function(error, response, body){
    console.log(body);
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
