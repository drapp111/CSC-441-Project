function validate_date() {
  var due_date = document.forms["to-do"]["duedate"].value;
  var date = new Date(due_date);
  if(!date) {
    return true;
  }
  if (date.toString() == "Invalid Date") {
    return false;
  }
}

function validate_description() {
  var description = document.forms["to-do"]["description"].value;
  if(description.length < 1) {
    return false;
  }

}

function validate_priority() {
  var alphabet = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  var priority = document.forms["to-do"]["priority"].value;
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

function validate_status() {
  var valid_inputs = ["not-started", "in-progress", "done"];
  var status = document.forms["to-do"]["status"].value;
  if(status == "") {
    return true;
  }
  if (!valid_inputs.includes(status)) {
    return false;
  }
}

function validate_form() {
  console.log("Got to here");
  var alert_message = "";
  if(validate_date() == false) {
    alert_message += "Date is invalid\n";
  }
  if(validate_description() == false) {
    alert_message += "Description must contain more than one character\n";
  }
  if(validate_priority() == false) {
    alert_message += "Priority is invalid\n";
  }
  if(validate_status() == false) {
    alert_message += "Status is invalid";
  }
  if(alert_message.length == 0) {
    alert("\nDue Date: " + document.forms["to-do"]["duedate"].value
        + "\nDescription: " + document.forms["to-do"]["description"].value
        + "\nPriority: " + document.forms["to-do"]["priority"].value
        + "\nStatus: " + document.forms["to-do"]["status"].value);
    return true;
  }
  else {
    alert(alert_message);
    return false;
  }
}
