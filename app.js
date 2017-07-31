/**
 * Created by Iyyappan on 29/05/2017.
 */
var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
   // appId: process.env.MICROSOFT_APP_ID,
   // appPassword: process.env.MICROSOFT_APP_PASSWORD
    
    
appId:'73bae9cc-e21c-4199-9357-2b0b617e4b87',

appPassword:'1tu9ya1G8oc1Orx6ooEPRkb'
});

server.post('api/messages', connector.listen());

/*
var bot = new builder.UniversalBot(connector, function(session)
{
    session.send("You Said: %s",session.message.text);
})*/


var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "Who's name will this reservation be under?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send("Reservation confirmed. Reservation details: <br/>Date/Time: %s <br/>Party size: %s <br/>Reservation name: %s",
            session.dialogData.reservationDate, session.dialogData.partySize, session.dialogData.reservationName);
        session.endDialog();
    }
]);

