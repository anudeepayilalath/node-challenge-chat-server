const express = require("express");
const cors = require("cors");
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());



function getAllMessages(req, res) {
  let mess = getMessages();
  res.send(mess);
}

function getMessagesById(req, res) {
  let mess = getMessages();
  let resultArray = mess.filter((item) => {
    if (item.id == req.params.id) {
      return true;
    }
  });
  res.send(resultArray);
}

function postMessageSave(req, res) {
  if (req.body.from == '') {
    res.status(400).send('U have to provide a From');
  }

  if (req.body.text == '') {
    res.status(400).send('U have to provide a Text');
  }

  if (req.body.from != '' && req.body.text != '') {
    let mess = getMessages();
    let newMessage = req.body;
    newMessage.id = mess.length;
    newMessage.timeSent = new Date();
    mess.push(req.body);
    saveMessages(mess);
    res.send(newMessage);
  }

}

function deleteMessage(req, res) {
  let mess = getMessages();
  let messagetoDeleteId = req.params.id;

  let resultArray = mess.filter((item) => {
    if (item.id != messagetoDeleteId) {
      return true;
    }
  });

  saveMessages(resultArray);
  res.send(resultArray);
}

function getMessagesLast(req, res) {
  let mess = getMessages();
  resultArray = mess.slice(0, 10);

  res.send(resultArray);
}

function getMessagesSearch(req, res) {
  let textForSearch = req.query.text;

  let mess = getMessages();

  let resultArray = mess.filter((item) => {
    if (item.text.includes(textForSearch)) {
      return true;
    }
  });

  res.send(resultArray);
}


const getMessages = () => {
  let rawdata = fs.readFileSync('db.json');
  return JSON.parse(rawdata);
};
const saveMessages = quotes => {
  let data = JSON.stringify(quotes);
  fs.writeFileSync('db.json', data);
};

// ENDPOINTS
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get('/message', getAllMessages);
app.get('/message/latest', getMessagesLast);
app.get('/message/search', getMessagesSearch);
app.get('/message/:id', getMessagesById);
app.post('/message', postMessageSave);
app.delete('/message/:id', deleteMessage);




app.listen(3000, function () {
  console.log("info", 'Server is running at port : ' + 3000);
});



// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());

// const welcomeMessage = {
//   id: 0,
//   from: "Bart",
//   text: "Welcome to CYF chat system!",
// };

// //This array is our "data store".
// //We will start with one message in the array.
// //Note: messages will be lost when Glitch restarts our server.
// const messages = [welcomeMessage];

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.listen(3000, function(){
//   console.log("Hey there!")
// });
