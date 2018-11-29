// Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery Variables
var myTrain = $("#train-name");
var myTrainDestination = $("#train-destination");

// Time Form Validation
var myTrainTime = $("#train-time").mask("00:00");
var myTimeFreq = $("#time-freq").mask("00");


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCzdTCxSxog5mzWQ3Cw0WVt7R01sVREYA8",
    authDomain: "train-schedule-a0366.firebaseapp.com",
    databaseURL: "https://train-schedule-a0366.firebaseio.com",
    projectId: "train-schedule-a0366",
    storageBucket: "train-schedule-a0366.appspot.com",
    messagingSenderId: "729604113279"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function (snapshot) {

    //  Firebase Variables
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // Now and First Train Time Difference
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // Remainder of Time     
    trainRemainder = trainDiff % frequency;

    // Subtract Remainder from Frequency
    minutesTillArrival = frequency - trainRemainder;

    // Next Train
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // Display Train Info
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();



    
});

// function to call the button event, and store the values in the input form
var storeInputs = function (event) {
    // prevent from from reseting
    event.preventDefault();

    // get & store input values
    trainName = myTrain.val().trim();
    trainDestination = myTrainDestination.val().trim();
    trainTime = moment(myTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = myTimeFreq.val().trim();

    // add to firebase databse
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successuflly added!");

    //  empty form once submitted
    myTrain.val("");
    myTrainDestination.val("");
    myTrainTime.val("");
    myTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function (event) {
    // form validation - if empty - alert
    if (myTrain.val().length === 0 || myTrainDestination.val().length === 0 || myTrainTime.val().length === 0 || myTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function (event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (myTrain.val().length === 0 || myTrainDestination.val().length === 0 || myTrainTime.val().length === 0 || myTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});