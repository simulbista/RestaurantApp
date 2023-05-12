/********************************************************************************* 
ITE5315 – Project: I declare that this assignment is my own work in accordance with Humber Academic Policy. 
No part of this assignment has been copied manually or electronically from any other source (including web sites) or distributed to other students. 
Name: Simul Bista, Student ID: N01489966, 
Name: Jaydenn(Ching-Ting) Chang, Student ID: N01511476
Date: 2023-04-22 
**********************************************************************************/

// required imports
const express = require("express");
const app = express();
const portNo = 3000;
const MongoDAO = require("./mongoDAO.js");
const mongoDAOinstance = new MongoDAO();
const currentDate = new Date();

// mongodb atlast connection uri (change username and password in the uri to the actual mongodb credential)
const uri =
  "mongodb+srv://username:password@cluster0.xj2wfdh.mongodb.net/?retryWrites=true&w=majority";

//for thunder client
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // Parse JSON request body

// url
app.get("/", (req, res) => {
  res.write("<h1> Hello from Simul & Jaydenn!</h1>");
});

/** Decode Form URL Encoded data */
app.use(express.urlencoded({ extended: true }));

// Serve static files from a public directory (css file for example)
app.use(express.static("public"));

// take in page,perpage and borough info from the url query parameters and display the restaurants records accordingly (filter)
// e.g: http://localhost:3000/api/restaurants?page=1&perPage=5&borough=Bronx will display 5 records from page 1 filtering borough=Toronto
app.get("/api/restaurants", (req, res) => {
  /* This route must accept the numeric query parameters "page" and "perPage" as well as the string parameter "borough", ie: /api/restaurants?page=1&perPage=5&borough=Bronx. It will use these values to return all "Restaurant" objects for a specific "page" to the client as well as optionally filtering by "borough", if provided. */

  const page = req.query.page;
  const perPage = req.query.perPage;
  const borough = req.query.borough;


  const getRestaurants = async () => {
    mongoDAOinstance.initialize(uri);
    mongoDAOinstance
      .getAllRestaurants(page, perPage, borough)
      .then((savedRestaurants) => {
        if (savedRestaurants.length === 0) {
          // If no restaurants found, send 204 status code
          res.status(204).send("No restaurants found!");
          console.log("not found!");
        } else {
          // If restaurants found, send success response with 201 status code
          res.status(201).send(`
          <h2>Restaurants List:</h2>
          <table border="1">
              <tr>
                  <th>Restaurant ID</th>
                  <th>Name</th>
                  <th>Building</th>
                  <th>Coordinates</th>
                  <th>Street</th>
                  <th>Zipcode</th>
                  <th>Borough</th>
                  <th>Cuisine</th>
                  <th>Grades</th>
              </tr>
              ${savedRestaurants
                .map(
                  (restaurant) => `
              <tr>
                  <td>${restaurant.restaurant_id}</td>
                  <td>${restaurant.name}</td>
                  <td>${restaurant.address.building}</td>
                  <td>${restaurant.address.coord}</td>
                  <td>${restaurant.address.street}</td>
                  <td>${restaurant.address.zipcode}</td>
                  <td>${restaurant.borough}</td>
                  <td>${restaurant.cuisine}</td>
                  <td>
                    <ul>
                      ${restaurant.grades
                        .map(
                          (grade) => `
                          <li>
                            <strong>Grade:</strong> ${grade.grade}<br>
                            <strong>Score:</strong> ${grade.score}<br>
                            <strong>Date:</strong> ${grade.date.toLocaleDateString()}
                          </li>
                        `
                        )
                        .join("")}
                    </ul>
                  </td>
              </tr>
              `
                )
                .join("")}
          </table>
          `);
        }
      })
      .catch((err) => {
        // Send error response with 500 status code
        res.status(500).send("Error 500: Data could not be fetched!");
      });
  };
  
  // open html page only if the url is /api/restaurants
  //call the getRestaurants method if the url is /api/restaurants?page=1&perPage=5&borough=Bronx
  if(page==null){
    res.sendFile(__dirname + "/public/restaurant-form.html");
  }else{
    getRestaurants();
  }
});

//receive submitted data from the form, add it to mongodb collection and display the result back to the client
app.post("/api/restaurants", (req, res) => {
  /* This route uses the body of the request to add a new "Restaurant" document to the collection and return the created object / fail message to the client. */

  //getting submitted from the form and storing and processing
  const {
    restaurant_id,
    name,
    building,
    coord,
    street,
    zipcode,
    borough,
    cuisine,
    grade,
    score,
  } = req.body;

  // Create a new restaurant object with the extracted values
  const restaurant = {
    address: { building, coord, street, zipcode },
    borough,
    cuisine,
    grades: [{ date: currentDate, grade, score }],
    name,
    restaurant_id,
  };

  const addRestaurant = async () => {
    mongoDAOinstance.initialize(uri);
    mongoDAOinstance
  .addNewRestaurant(restaurant)
  .then((savedRestaurant) => {
    if (savedRestaurant.length === 0) {
      // If no restaurants found, send 204 status code
      res.status(204).send(`Restaurant with ${restaurant_id} doesn't exist!`);
    } else {
      // If restaurants found, send success response with 201 status code
      let gradesHtml = '';
      savedRestaurant.grades.forEach((grade) => {
        gradesHtml += `
          <tr>
            <td>Grade:</td>
            <td>${grade.grade}</td>
          </tr>
          <tr>
            <td>Score:</td>
            <td>${grade.score}</td>
          </tr>
          <tr>
            <td>Date:</td>
            <td>${grade.date.toLocaleDateString()}</td>
          </tr>
        `;
      });

      res.status(201).send(`
        <h2>Restaurant with ${restaurant_id} has been inserted!</h2>
        <table border="1">
          <tr>
            <td>Restaurant ID:</td>
            <td>${savedRestaurant.restaurant_id}</td>
          </tr>
          <tr>
            <td>Restaurant:</td>
            <td>${savedRestaurant.name}</td>
          </tr>
          <tr>
            <td>Building:</td>
            <td>${savedRestaurant.address.building}</td>
          </tr>
          <tr>
            <td>Coordinates:</td>
            <td>${savedRestaurant.address.coord}</td>
          </tr>
          <tr>
            <td>Street:</td>
            <td>${savedRestaurant.address.street}</td>
          </tr>
          <tr>
            <td>Zipcode:</td>
            <td>${savedRestaurant.address.zipcode}</td>
          </tr>
          <tr>
            <td>Borough:</td>
            <td>${savedRestaurant.borough}</td>
          </tr>
          <tr>
            <td>Cuisine:</td>
            <td>${savedRestaurant.cuisine}</td>
          </tr>
          ${gradesHtml}
        </table>
      `);
    }
  })
  .catch((error) => {
    // Handle error
    res.status(500).send(`Error: ${error.message}`);
  });

  };
  //call the addRestaurant method
  addRestaurant(restaurant);
});

// http://localhost:3000/api/restaurants/5eb3d668b31de5d588f4292a to get restaurant record for the id=6443076704c8221ce0d0b4b9
app.get("/api/restaurants/:id", (req, res) => {
  /* This route must accept a route parameter that represents the _id of the desired restaurant object, ie: /api/restaurants/ 5eb3d668b31de5d588f4292e. It will use this parameter to return a specific "Restaurant" object to the client. */

  const id = req.params.id;
  const getRestaurantById = async (id) => {
    mongoDAOinstance.initialize(uri);
    mongoDAOinstance
  .getRestaurantById(id)
  .then((savedRestaurant) => {
    if (savedRestaurant.length === 0) {
      // If no restaurants found, send 204 status code
      res.status(204).send(`Restaurant with ${id} doesn't exist!`);
    } else {
      // If restaurants found, send success response with 201 status code
      let gradesHtml = '';
      savedRestaurant.grades.forEach((grade) => {
        gradesHtml += `
          <tr>
            <td>Grade:</td>
            <td>${grade.grade}</td>
          </tr>
          <tr>
            <td>Score:</td>
            <td>${grade.score}</td>
          </tr>
          <tr>
            <td>Date:</td>
            <td>${grade.date.toLocaleDateString()}</td>
          </tr>
        `;
      });

      res.status(201).send(`
        <h2>Restaurant with ${id} has been found!</h2>
        <table border="1">
          <tr>
            <td>Restaurant ID:</td>
            <td>${savedRestaurant.restaurant_id}</td>
          </tr>
          <tr>
            <td>Restaurant:</td>
            <td>${savedRestaurant.name}</td>
          </tr>
          <tr>
            <td>Building:</td>
            <td>${savedRestaurant.address.building}</td>
          </tr>
          <tr>
            <td>Coordinates:</td>
            <td>${savedRestaurant.address.coord}</td>
          </tr>
          <tr>
            <td>Street:</td>
            <td>${savedRestaurant.address.street}</td>
          </tr>
          <tr>
            <td>Zipcode:</td>
            <td>${savedRestaurant.address.zipcode}</td>
          </tr>
          <tr>
            <td>Borough:</td>
            <td>${savedRestaurant.borough}</td>
          </tr>
          <tr>
            <td>Cuisine:</td>
            <td>${savedRestaurant.cuisine}</td>
          </tr>
          ${gradesHtml}
        </table>
      `);
    }
  })
  .catch((error) => {
    // Handle error
    res.status(500).send(`Error: ${error.message}`);
  });

  };
  // Call the getAllRestaurantByID method
  getRestaurantById(id);
});

//update the restaurant based on id (http://localhost:3000/api/restaurants/5eb3d668b31de5d588f4292a)
//make sure you add the data to be updated in the json body in thunderclient
app.put("/api/restaurants/:id", (req, res) => {
  /* This route must accept a route parameter that represents the _id of the desired restaurant object, ie: /api/restaurants/5eb3d668b31de5d588f4292e as well as read the contents of the request body. It will use these values to update a specific "Restaurant" document in the collection and return a success / fail message to the client. */

  const id = req.params.id;
  //data coming from thunderclient (in the json body)
  const data = req.body;
  const updateRestaurantById = async (data, id) => {
    mongoDAOinstance.initialize(uri);
    mongoDAOinstance
      .updateRestaurantById(data, id)
      .then((savedRestaurant) => {
        if (savedRestaurant.length === 0) {
          // If no restaurants found, send 204 status code
          res.status(204).send(`Restaurant with ${savedRestaurant.restaurant_id} doesn't exist!`);
        } else {
          // If restaurants found, send success response with 201 status code
          res
            .status(201)
            .send(`Restaurant record with ${savedRestaurant.restaurant_id} has been updated!`);
        }
      })
      .catch((err) => {
        // Send error response with 500 status code
        res.status(500).send(err + "Error 500: Data could not be fetched!");
      });
  };
      // Call the updateRestaurantById method
  updateRestaurantById(data, id);
});

//delete the restaurant by id (http://localhost:3000/api/restaurants/64430bb5796b7b13b8e1fc21)
app.delete("/api/restaurants/:id", (req, res) => {
  /* This route must accept a route parameter that represents the _id of the desired restaurant object, ie: /api/restaurants/5eb3d668b31de5vd588f4292e. It will use this value to delete a specific "Restaurant" document from the collection and return a success / fail message to the client. */

  const id = req.params.id;
  const deleteRestaurant = async (id) => {
    mongoDAOinstance.initialize(uri);
    // Call the getAllRestaurants method
    mongoDAOinstance
      .deleteRestaurantById(id)
      .then((deletedId) => {
        console.log('deleted id is' + deletedId);
        if (deletedId !== null) {
          // If no restaurants found, send 204 status code
          res.status(201).send(`Restaurant with ${deletedId} has been deleted!`);
        } 
      })
      .catch((err) => {
        // Send error response with 500 status code
        res.status(500).send("Error 500: Data could not be fetched or deleted!");
      });
  };
  deleteRestaurant(id);
});

//listening to a port
app.listen(portNo, () => {
  console.log("App listening on port " + portNo);
});
