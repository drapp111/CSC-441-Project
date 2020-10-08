'use strict';

const http = require('http');
const { parse } = require('querystring');
const { check, validationResult } = require('express-validator');
const hostname = 'cscweb.lemoyne.edu';
const port = 3301;

var express = require('express');
var app = express();
app.use(express.json());

app.post('/to-do%20form.html', [
	check('name').isLength({min: 1}),
	check('due_date').isDate()),
	check('description').isLength({min: 1})
	check('priority').custom(priority => {
		var alphabet = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		if(priority == "") {
			return true;
		}
		if (isNaN(priority)) {
			if (!(alphabet.includes(priority.toUpperCase()))) {
				throw new Error('Priority must be a number 1 - 10 or a letter A-Z')
			}
		}
		else if (priority < 1 || priority > 10) {
			throw new Error('Priority must be a number 1 - 10 or a letter A-Z')
		}
	}),
	check('status').custom(status => {
		var valid_inputs = ["not-started", "in-progress", "done"];
	  if(status == "") {
	    return true;
	  }
	  if (!valid_inputs.includes(status)) {
	    return false;
	  }
	}),
] (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(422).json({errors: errors.array()})
		}
		const name = req.body.name;
		const due_date = req.body.due_date;
		const description = req.body.description;
		const priority = req.body.priority;
		const status = req.body.status;
})

function listen_func() {
	console.log("form data version 04 (post) server running.");
}

function

function process_other_request(body, reqMethod, res) {
	console.log("Sending response for " + reqMethod + " request, whose data is:" + body);
	var htmlResponse = `<!doctype html><html><head>` +
		`<title>Other Request</title></head><body>` +
		`<p>Received a ${reqMethod} request from server; expecting a POST request.</p>` +
		`<p>Ignoring client request.</p></body></html>`;
	send_response(htmlResponse, res);
}

function process_post_request(body, res) {
	console.log('POST data is: ' + body);
	var postParams = parse(body);
	var error_num = validate_form(postParams);
	send_response(error_num, res);
}

function send_response(error_num, res) {
	res.writeHead(200);
	res.redirect("back"?error = );
	res.end();
}

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
  console.log(date);
  console.log(date.toString());
  if(!date) {
    return false;
  }
  if (date.toString() == "Invalid Date") {
    return false;
  }
  return true;
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
  if(validate_title(postParams.title) == false) {
    htmlResponse += `<p>Title must contain more than one character</p>`;
  }
  if(validate_date(postParams.due_date) == false) {
    htmlResponse += `<p>Date is invalid</p>`;
  }
  if(validate_description(postParams.description) == false) {
    htmlResponse += `<p>Description must contain more than one character</p>`;
  }
  if(validate_priority(postParams.priority) == false) {
    htmlResponse += `<p>Priority is invalid</p>`;
  }
  if(validate_status(postParams.status) == false) {
    htmlResponse += `<p>Status is invalid</p>`;
  }
  if(htmlResponse.length == 0) {
    htmlResponse += `<p>Title: " + ${postParams.title}</p>`
                  + `<p>Due Date: + ${postParams.due_date}</p>`
                  + `<p>Description: + ${postParams.description}</p>`
                  + `<p>Priority: + ${postParams.priority}</p>`
                  + `Status: + ${postParams.status}</p>`;
  }

  htmlResponse += `</body></html>`;
  return htmlResponse;

}
