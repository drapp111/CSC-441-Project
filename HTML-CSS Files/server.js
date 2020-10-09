'use strict';

//Using node.js version 12.18.0

const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');
const url = require('url');

const hostname = 'cscweb.lemoyne.edu';
const port = 3301;

var validTitle = true;
var validDate = true;
var validDescription = true;
var validStatus = true;
var validPriority = true;

function listen_func() {
  console.log("form data version 04 (post) server running.");
}

function process_other_request(body, reqMethod, res) {
  console.log("Sending response for " + reqMethod + " request, whose data is:" + body);
  var htmlResponse = ``;
	send_response(htmlResponse, res);
}

function process_post_request(body, res) {
  console.log('POST data is: ' + body);
  var postParams = parse(body);
  var error_message = validate_form(postParams);
  console.log(error_message);
  if(!validDate || !validDescription || !validPriority || !validStatus || !validTitle) {
    error_message += `
    <form name = "to-do" method = "post" action = "http://cscweb.lemoyne.edu:3301">
		<table>
			<tr>
				<td colspan = "1"><label for = "Title">Title</label></td>
				<td colspan = "1"><label for="duedate">Due Date</label></td>
			</tr>
			<tr>
				<td><input type="text" id="title" name="title" required value ="${postParams.title}"></td>
  				<td><input type= "date" id = "duedate" name = "duedate" value = "${postParams.duedate}"></td>
			</tr>
		</table>
  			<label for="description">Description</label>
  			<input type="text" id="description" name="description" required value="${postParams.description}">
		<table>
			<tr>
				<td colspan = "1"><label for="priority">Priority</label></th>
				<td colspan = "1"><label for="status">Status</label></th>
			</tr>

			<tr>
				<td><input style = "width: 100%;" type="text" id="priority" name="priority" value ="${postParams.priority}"></th>
				<td><input style = "width: 100%;" type="text" id="status" name="status" value="${postParams.status}"></th>
  		</tr>
      <tr>
        <td><input style = "width: 100%;" type = "submit" value = "Submit"></td>
        <td><input style = "width: 100%; background-color: black; color: white;" type = "reset" value = "Cancel"></td>
		</table>
		</form>
    `
    send_response(error_message, res);
  }
  else {
    var htmlResponse = `
    <html><body>

    <p>Title: ${postParams.title}</p>
    <p>Due Date: ${postParams.duedate}</p>
    <p>Description: ${postParams.description}</p>
    <p>Priority: ${postParams.priority}</p>
    <p>Status: ${postParams.status}</p>

    <a href = "http://cscweb.lemoyne.edu/rappdb/to-do%20form.html">New To-Do Item</a>
    <a href="http://cscweb.lemoyne.edu/rappdb/index.html">Home</a>
    `
    send_response(htmlResponse, res);
  }
}

function send_response(htmlResponse, res) {
	res.writeHead(200);
	res.write(htmlResponse);
	res.end();
}

function validate_title(title_input) {
    if (title_input.length < 1) {
      validTitle = false;
      return false;
    }
}

function validate_date(due_date) {
  var date = new Date(due_date);
  if(!date) {
    return true;
  }
  if (date.toString() == "Invalid Date") {
    validDate = false;
    return false;
  }
}

function validate_description(description) {
  if(description.length < 1) {
    validDescription = false;
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
      validPriority = false;
      return false;
    }
    else {
      validPriority = false;
      return true;
    }
  }
  else if (priority < 1 || priority > 10) {
    validPriority = false;
    return false;
  }
}

function validate_status(status) {
  var valid_inputs = ["not-started", "in-progress", "done"];
  if(status == "") {
    return true;
  }
  if (!valid_inputs.includes(status)) {
    validStatus = false;
    return false;
  }
}

function validate_form(postParams) {
  var htmlResponse = `<html><body>`;
  if(validate_title(postParams.title) == false) {
    htmlResponse += `<p>Title must contain more than one character</p>`;
  }
  if(validate_date(postParams.duedate) == false) {
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
    htmlResponse += `<p>Title:  + ${postParams.title}</p>`
                  + `<p>Due Date: + ${postParams.due_date}</p>`
                  + `<p>Description: + ${postParams.description}</p>`
                  + `<p>Priority: + ${postParams.priority}</p>`
                  + `Status: + ${postParams.status}</p>`;
  }
  htmlResponse += `</body></html>`;
  return htmlResponse;
}

const http_server = function(req, res) {
  var body = ""
	req.on('data', function (chunk) {
		body += chunk;
	});
	req.on('end', function () {
		if (req.method == "POST")
			process_post_request(body, res);
		else
			process_other_request(body, req.method, res);
	});
}

const server = http.createServer(http_server);

server.listen(port, hostname, listen_func());
