// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(bodyParser.json());
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/hooks/:hookPart1/:hookPart2", function (req, res) {
  var body = req.body;
  //TODO verify that part1 and 2 exist
  var hookPart1 = req.params.hookPart1;
  var hookPart2 = req.params.hookPart2;
  var discordHookUrl = "https://discordapp.com/api/webhooks/" + hookPart1 + "/" + hookPart2;
  
  console.log("Posting to hook: " + discordHookUrl)
  // https://discordapp.com/developers/docs/resources/webhook#execute-webhook
  var discordPayload = new Object();
   discordPayload.content = body.before;
   var jsonString= JSON.stringify(discordPayload);
  request.post({
    headers: {'content-type' : 'application/json'},
    url:     discordHookUrl,
    body:    jsonString
  }, function(error, response, body){
    console.log(body);
    if (error) {
      console.log(error)
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
