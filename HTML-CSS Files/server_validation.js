'use strict';

//Using node.js version 12.18.0

const http = require('http');
const { parse } = require('querystring');

const hostname = 'cscweb.lemoyne.edu';
const port = 3301;	//Ports 3301-3305 are open for TCP and UDP

//Purpose: Connect to MySQL databse.
//Inputs: None.
//Post-conditions: Either connection is still undefined or connection established.
function listen_func() {
	console.log("form data version 04 (post) server running.");
}

//Purpose: Send a response to client.
//Input: body - the POST data received from the client request.
//	res - an http:ServerResponse object.
//Post-conditions: Response has been sent.
function process_other_request(body, reqMethod, res) {
	console.log("Sending response for " + reqMethod + " request, whose data is:" + body);
	var htmlResponse = `<!doctype html><html><head>` +
		`<title>Other Request</title></head><body>` +
		`<p>Received a ${reqMethod} request from server; expecting a POST request.</p>` +
		`<p>Ignoring client request.</p></body></html>`;
	send_response(htmlResponse, res);
}

//Purpose: Send a response to client.
//Input: body - the POST data received from the client request.
//	res - an http:ServerResponse object.
//Post-conditions: Response has been sent.
function process_post_request(body, res) {
	console.log('POST data is: ' + body);
	var postParams = parse(body);

	var htmlResponse = validate_form(postParams);
	send_response(htmlResponse, res);
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

//Purpose: Create an http server.
//Inputs: req - a http:
//	res - an http:ServerResponse object.
//Purpose:
const http_server = function(req, res) {
	var body = "";
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

function validate_title(title_input) {
    if (title_input.length < 1) {
      return false;
    }
}

function validate_date(due_date) {
  var date = new Date(due_date);
  if(!date) {
    return true;
  }
  if (date.toString() == "Invalid Date") {
    return false;
  }
}

function validate_description(description) {
  if(description.length < 1) {
    return false;
  }

}

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

function validate_status(status) {
  var valid_inputs = ["not-started", "in-progress", "done"];
  if(status == "") {
    return true;
  }
  if (!valid_inputs.includes(status)) {
    return false;
  }
}

function validate_form(postParams) {

  var htmlResponse = `<!doctype html><html><head><meta charset="UTF-8">` +
		`<link rel="stylesheet" type="text/css" href="webExamples.css">` +
		`<title>Reponse for POST</title></head><body>` +
		`<h3>Response for POST (used by version 4)</h3>` +
		`<ul><li>Provides a response to the version 4 POST request simple form.</li></ul>`;

  if(validate_title(postParams.title) == false) {
    alert_message += `<p>Title must contain more than one character</p>`;
  }
  if(validate_date(postParams.due_date) == false) {
    alert_message += `<p>Date is invalid</p>`;
  }
  if(validate_description(postParams.description) == false) {
    alert_message += `<p>Description must contain more than one character</p>`;
  }
  if(validate_priority(postParams.priority) == false) {
    alert_message += `<p>Priority is invalid</p>`;
  }
  if(validate_status(postParams.status) == false) {
    alert_message += `<p>Status is invalid</p>`;
  }
  if(alert_message.length == 0) {
    htmlResponse += `<p>Title: " + ${postParams.title}</p>`
                  + `<p>Due Date: + ${postParams.due_date}</p>`
                  + `<p>Description: + ${postParams.description}</p>`
                  + `<p>Priority: + ${postParams.priority}</p>`
                  + `Status: + ${postParams.status}</p>`;
  }

  htmlResponse += `</body></html>`;
  return htmlResponse;

}
