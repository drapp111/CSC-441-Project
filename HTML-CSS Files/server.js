'use strict';

//Using node.js version 12.18.0

const http = require('http');
const { parse } = require('querystring');
const fs = require('fs'); //for opening html files
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "cscmysql.lemoyne.edu",
  user: "rapp",
  password: "rapp",
  database: "ToDo441",
})

var id = con.query("SELECT id FROM todo WHERE username = 'declan'", function(err, result, fields) {
  if(err) throw err;
  return result;
})

const hostname = 'cscweb.lemoyne.edu';
const port = 3301;	//Ports 3301-3305 are open for TCP and UDP

//Log the start of server functionality
function listen_func() {
  console.log("form data version 04 (post) server running.");
}

//Purpose: Send a response to client.
//Input: body - the type of data received from the client request.
//	res - an http:ServerResponse object.
//  reqMethod - the type of request sent
//Post-conditions: Response has been sent.
function process_other_request(body, reqMethod, res) {
  console.log("Sending response for " + reqMethod + " request, whose data is:" + body);
  var htmlResponse = ``;
	send_response(htmlResponse, res);
}

//Purpose: Send a response to client.
//Input: body - the POST data received from the client request.
//	res - an http:ServerResponse object.
//Post-conditions: Response has been sent.
function process_post_request(body, res) {
  console.log('POST data is: ' + body);
  var postParams = parse(body);
  var error_message = validate_form(postParams);
  if(error_message.length != 0) {
    var invalid_res = invalid_response(postParams, error_message)
    send_invalid_response(invalid_res, res);
  }
  else {
    send_valid_response(postParams, res);
  }
}

//Purpose: Send a valid response from the server to the webpage
//Input: postParams - the data sent in the POST request, res - the response object
//Post: sends a response to the send_response method

function send_valid_response(postParams, res) {
  var createdFormPage = valid_response(postParams);
  send_response(createdFormPage, res);
}

//Purpose: send an invalid response to the webpage
//Input: invalid_response - and html doc that is sent back to the webpage to tell the user their inputs are invalid, res - a response object
//Post: sends data to the send_response method

function send_invalid_response(invalid_response, res) {
  send_response(invalid_response, res);
}

//Purpose: Creates the html response page to an invalid user response
//Input: postParams - data sent with the POST request, error_message - message generatedfrom the input validation
//Post: returns a modified version of the original form to be redisplayed

function invalid_response(postParams, error_message) {
  var formPage = readWriteSync('./to-do form.html');
  formPage = formPage.replace('datevalue', 'value = ' + postParams.duedate);
  formPage = formPage.replace('descriptionvalue', 'value = ' + postParams.description);
  formPage = formPage.replace('statusvalue', 'value = ' + postParams.status);
  formPage = formPage.replace('priorityvalue', 'value = ' + postParams.priority);
  formPage = formPage.replace('//alert', 'alert("' + error_message + '");');
  return formPage;
}

//Purpose: creates an html doc for a valid user input response
//Input: postParams - the data sent with the POST request
//Post: returns a new page that has the original user data on display

function valid_response(postParams) {
  var createdFormPage = readWriteSync('./newFormCreated.html');
  createdFormPage = createdFormPage.replace('Due Date: ', 'Due Date: ' + postParams.duedate);
  createdFormPage = createdFormPage.replace('Description: ', 'Description: ' + postParams.description);
  createdFormPage = createdFormPage.replace('Priority: ', 'Priority: ' + postParams.priority);
  createdFormPage = createdFormPage.replace('Status: ', 'Status: ' + postParams.status);
  console.log(createdFormPage);
  return createdFormPage;
}

function add_db_item(postParams) {
  var insertItems = [id, id, postParams.description, postParams.priority, postParams.duedate, postParams.status]
  con.query("INSERT INTO todoItem (toDoID, id, description, priority, dueDate, status) VALUES ?", insertItems, function(err, result){ 
    if (err) throw err;
    console.log("Success!");
  })
}

//Purpose: Read a file synchronously
//Input: file_path - the path to the file
//Post: returns a string version of the file

function readWriteSync(file_path) {
  var data = "";
  try {
    data = fs.readFileSync(file_path, 'utf8');
    console.log(data);
  }
  catch(error) {
    console.log(error);
  }
  return data;

}

//Purpose: Send an html response back to the client.
//Inputs: htmlResponse - the html being sent back to the client.
//	res - an http:ServerResponse object.
//Post-conditions: An html response has been sent back to the client.
function send_response(htmlResponse, res) {
	res.writeHead(200);
	res.write(htmlResponse);
	res.end();
}

//Purpose: validate the date data
//Input: due_date - the date input by the user
//Post: returns a boolean whether the data is valid or invalid

function validate_date(due_date) {
  var date = new Date(due_date);
  if(!date) {
    return true;
  }
  if (date.toString() == "Invalid Date") {
    return false;
  }
}

//Purpose: validate the description
//Input: description - the user input 
//Post: returns a boolean whether the data is valid or invalid

function validate_description(description) {
  if(description.length < 1) {
    return false;
  }
  return true;

}

//Purpose: validate the priority value
//Input: priority - the user input
//Post: returns a boolean whether the data is valid or invalid

function validate_priority(priority) {
  var alphabet = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if(priority == "") {
    return true;
  }
  if (isNaN(priority)) {
    if (!(alphabet.includes(priority.toUpperCase()))) {
      return false;
    }
    else {
      return true;
    }
  }
  else if (priority < 1 || priority > 10) {
    return false;
  }
}

//Purpose: validate status value
//Input: status - the user input for the status
//Post: returns a boolean whether the data is valid or invalid

function validate_status(status) {
  var valid_inputs = ["not-started", "in-progress", "done"];
  if(status == "") {
    return true;
  }
  if (!valid_inputs.includes(status)) {
    return false;
  }
}

//Purpose: combine all the validation functions
//Input: postParams - the data sent along in the POST request
//Post: returns a string error_message that either has errors or is empty

function validate_form(postParams) {
  var error_message = "";
  if(validate_date(postParams.duedate) == false) {
    error_message += 'Date is invalid';
  }
  if(validate_description(postParams.description) == false) {
    error_message += 'Description must contain more than one character';
  }
  if(validate_priority(postParams.priority) == false) {
    error_message += 'Priority is invalid';
  }
  if(validate_status(postParams.status) == false) {
    error_message += 'Status is invalid';
  }
  return error_message;
}

//Purpose: Create an http server.
//Inputs: req - a http:
//	res - an http:ServerResponse object.
//Purpose: 
const http_server = function(req, res) {
  con.connect(function(err) {
    if(err) throw err;
    console.log("Connected!");
  })
  var body = ""
	req.on('data', function (chunk) {
		//Continue receiving data for one client request
		body += chunk;
	});
	req.on('end', function () {
    //Received all client request data; process this request
		if (req.method == "POST")
			process_post_request(body, res);
		else
			process_other_request(body, req.method, res);
	});
}

const server = http.createServer(http_server);

server.listen(port, hostname, listen_func());
