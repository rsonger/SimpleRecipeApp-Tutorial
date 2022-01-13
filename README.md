# Simple Recipe App

This is the Express application from **Unit 2** of "_Get Programming with Node.js_" by Jon Wexler. The source code has been modified from **Unit 2**, **Lesson 12**. See [TODO](#todo) below for specific instructions on completing this practice.

Here are some key points about the app structure:
  - The **Express** framework is used for its practical MVC functionality.
    - Static files (such as CSS and image files) are in the `public` folder and served using `express.static` in **Express** middleware functions.
    - Pages for errors like 404 and 500 are served with functions in `errorController.js`. The 404 error is just a middleware function that runs after all other middleware functions, so it will handle all requests not handled by other functions. The 500 internal error is a special middleware function with the parameters `(error, req, res, next)`.  (参考：Expressの[エラー処理](https://expressjs.com/ja/guide/error-handling.html))
  -  Routes are configured with middleware functions in the `controllers` folder. `errorController.js` handles 404 and internal errors. When completed, `homeController.js` will handle operations for the home page and courses, while `subscribersController.js` will handle operations on the `Subscriber` model:

  | HTTP Method | Endpoint (Route) | Middleware Function                         |
  | ---         | ---              | ---                                         |
  | GET         | `/`              | `homeController.showIndex`                  |
  | GET         | `/courses`       | `homeController.showCourses`                |
  | GET         | `/subscribe`     | `subscribersController.getSubscriptionPage` |
  | POST        | `/subscribe`     | `subscribersController.saveSubscriber`      |
  | GET         | `/subscribers`   | `subscribersController.getAllSubscribers`   |

    - Currently, the POST route for the "Subscribe" page does not process the input. It only renders a "Thank You!" page.
  - Pages are rendered with **Embedded JavaScript** (**EJS**) templating and layouts. This requires using `"express-ejs-layouts"` with **Express** middleware in `index.js`. The template files are stored in the `views` folder and we can build pages using the `render` method on the response object. For example, `res.render("index");` will tell EJS to build the home page and send it back to the client. (日本語の超入門はこれ：[ejsでレイアウト機能を使う](https://qiita.com/kanye__east/items/87172e946471b9c71cfa))

## TODO
To complete this app, we will build the `homeController`, complete the "Courses" page with **EJS**, connect to a **MongoDB** database, create our first model called `Subscriber`, build its route with a controller, and make a view for reading subscriber data from the database.

1. First, let's create `homeController` and give it middleware functions from `index.js`.
  **a)** Create a new file in the `controllers` folder called `homeController.js`.
  **b)** Look for the `courses` list in `index.js`. Cut the list from `index.js` and paste it into `homeController.js`. This is some data we will use to generate the "Courses" page later.
  **c)** In `homeController.js`, add the `showIndex` function to the `exports` object and assign it the arrow function from the Home Page routing in `index.js`. That is, add this code to `homeController.js`:  
  ```javascript
  exports.showIndex = (req, res) => {
    res.render("index");
  };
  ```
  **d)** Then add a function called `showCourses` to `exports` and assign it the arrow function from the Courses page routing in `index.js`. That is, add this code to `homeController.js`:
  ```javascript
  exports.showCourses = (req, res) => {
    res.render("courses", {
      offeredCourses: courses
    });
  };
  ```
  **e)** Finally, update the `app.get` routes in `index.js` for the _Home page_ and _Courses page_. Import `homeController` at the top of the file with:
  ```javascript
  const homeController = require("./controllers/homeController");
  ```
  Then, change the 3 lines of code for the _Home page_ (from line 38) to:
  ```javascript
  app.get("/", homeController.showIndex);
  ```
  And change the 5 lines of code for the _Courses page_ (after _Home page_) to:
  ```javascript
  app.get("/courses", homeController.showCourses);
  ```
  **f)** Run your project to make sure everything still works!


2. Use **EJS** to render the _Courses page_ from a list of recipe courses and their prices. The `showCourses` method above in **1.d** creates the _Courses page_ with the argument `offeredCourses`. We give to this argument the value of the `courses` list in `homeController.js` so we can access that list in `courses.ejs`.
  **a)** Open `courses.ejs` and delete the `<h5>Nothing yet!</h5>` element.
  **b)** Next, embed a JavaScript loop with EJS to create a `<h5>` element with the course title and a `<span>` element with the course cost for each course. That is, enter this code where you deleted the `<h5>` element:  
  ```html
    <% offeredCourses.forEach(course => { %>
    <h5>
      <%= course.title %>
    </h5>
    <span>$
      <%= course.cost %> </span>
    <% }); %>

  ```  
  (Here is a simple guide on EJS tags: [EJSの基本的な書き方](https://qiita.com/miwashutaro0611/items/36910f2d784ff70a527d))
  **c)** Run the project again to see the courses appear on the _Courses page_.


3. Next we are ready to prepare a database connection. For this, we will use a **MongoDB** cluster provided by a cloud service called Atlas at [mongodb.com](https://www.mongodb.com/cloud).
  **a)** First, we need to set environment variables to hide our connection details. Create a new file called `.env` and add to it your database name, username, and password from the teacher. For example, the content should look like this:
  ```
  DB_NAME=name_of_db
  USER=username
  PASSWORD=xxxXXXxXxXXXx
  ```  
  **b)** Next, install the **Mongoose** package in your project. Open the Packages pane and search for `mongoose`. Click on the package name and then click the plus sign (+) to install. Wait for the installation to complete in the console before continuing.
  **c)** Open `index.js` and remove the comment marks `//` from the `dbUrl` constant at the top.
  **d)** On the lines below, then import the **Mongoose** package and connect with the following code:
  ```javascript
  const mongo = require("mongoose");

  mongo.Promise = global.Promise; // This is for our model operations later!
  mongo.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  ```
  **e)** Run your project and check that the connection works without error. If so, you should see in the console "Server running on port ..." and nothing after that.


4. Now we can make our `Subscriber` model. This model will manage data for people who subscribe on the app. 
  **a)** Add a `models` folder and inside that create a `subscriber.js` file.
  **b)** Open `subscriber.js` and enter the following code:  
  ```javascript
  const mongo = require("mongoose");

  const subscriberSchema = mongo.Schema({
    name: String,
    email: String,
    postalCode: Number
  });

  module.exports = mongo.model("Subscriber", subscriberSchema);
  ```  
  This will define the schema for a subscriber to have their name, email address, and postal code. Then, it makes the schema available for use as a model by other modules.
  **c)** Go to the `controllers` folder and create a new file called `subscribersController.js`.
  **d)** Inside the `subscribersController.js` file, add the operations for using the `Subscriber` model:
  ```javascript
  const Subscriber = require("../models/subscriber");

  exports.getAllSubscribers = (req, res) => {
    Subscriber.find({})
    .exec()
    .then( (subscribers) => {
      res.render("subscribers", {
        subscribers: subscribers
      });
    })
    .catch( (error) => {
      console.log(error.message);
      return [];
    })
    .then( () => {
      console.log("getAllSubscribers complete");
    });
  };

  exports.getSubscriptionPage = (req, res) => {
    res.render("subscribe");
  }

  exports.saveSubscriber = (req, res) => {
    let newSubscriber = new Subscriber( {
      name: req.body.name,
      email: req.body.email,
      postalCode: req.body.postalCode
    });

    newSubscriber.save()
      .then( () => {
        res.render("thanks");
      })
      .catch( (error) => {
        console.log("Unable to save new subscriber: " + error);
        res.send(error);
      })
      .then( () => {
        console.log("saveSubscriber complete");
      });
  };
  ```
  **e)** Finally, update the `app.get` routes in `index.js` for the _Subscribe page_. Import `subscribersController` at the top of the file with:
  ```javascript
  const subscribersController = require("./controllers/subscribersController");
  ```
  Then, change the 6 lines of code for the _Subscribe page_ to:
  ```javascript
  app.get("/subscribers", subscribersController.getAllSubscribers);
  app.get("/subscribe", subscribersController.getSubscriptionPage);
  app.post("/subscribe", subscribersController.saveSubscriber);
  ```
  And change the 5 lines of code for the _Courses page_ (after _Home page_) to:
  ```javascript
  app.get("/courses", homeController.showCourses);
  ```
  **f)** Run your project to test it. Go to the _Subscribe page_ and enter some data in the form. Submit the data, then go to the `/subscribers` route in your app (open the window in a new tab and directly edit the URL) to see the data you entered.