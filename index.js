const express = require("express"); // MVC framework
const layouts = require("express-ejs-layouts"); // EJS for building views
const errorController = require("./controllers/errorController");

//const dbUrl = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@golmarez.qbi7b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

// A list of recipe courses for the "Courses" page
let courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.use(layouts);

// This is necessary for accessing data in a POST body from HTML forms
app.use( express.urlencoded({extended: false}) );
// This line will parse data from a POST body as JSON
app.use( express.json() );

// BEGIN ROUTING

// Static files
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Courses page
app.get("/courses", (req, res) => {
  res.render("courses", {
    offeredCourses: courses
  });
});

// Subscribe Page
app.get("/subscribe", (req, res) => {
  res.render("subscribe");
});
app.post("/subscribe", (req, res) => {
  res.render("thanks");
});

// Error Handling - 404
app.use(errorController.pageNotFoundError);

// Error Handling - 500
app.use(errorController.internalServerError);

// Start the server app
let server = app.listen( () => { 
  console.log(`Server running on port ${server.address().port}`);
});