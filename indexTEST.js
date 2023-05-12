const MongoDAO = require("./mongoDAO");

const mongoDAO = new MongoDAO();
const uri =
    "mongodb+srv://dennx2:myPassword258@week10.qstzdxu.mongodb.net/?retryWrites=true&w=majority";

const run = async () => {
    mongoDAO.initialize(uri);

    const newRestaurant = {
        address: {
            building: "5678",
            coord: [40.1234, -73.5678],
            street: "Main Street",
            zipcode: "12345",
        },
        borough: "Brooklyn",
        cuisine: "French",
        grades: [{ date: new Date(), grade: "A", score: 90 }],
        name: "New Restaurant",
        restaurant_id: "12345678",
    };

    const anotherRestaurant = {
        address: {
            building: "7890",
            coord: [41.5678, -74.1234],
            street: "Second Avenue",
            zipcode: "67890",
        },
        borough: "Queens",
        cuisine: "Japanese",
        grades: [{ date: new Date(), grade: "B", score: 85 }],
        name: "Another Restaurant",
        restaurant_id: "23456789",
    };
    
    
    // mongoDAO.addNewRestaurant(anotherRestaurant);
    await mongoDAO.addNewRestaurant(anotherRestaurant);
    
    // const searchResult = 
    // await mongoDAO.getRestaurantById('644195cc2e6e8fd3039d77c4');
    // console.log(searchResult);

    // await mongoDAO.updateRestaurantById(newRestaurant, '644195cc2e6e8fd3039d77c4');

    // await mongoDAO.deleteRestaurantById('644195cc2e6e8fd3039d77c4');

    // const allRest = 
    // await mongoDAO.getAllRestaurants(6, 5, 'Queens');
    // console.log(allRest);
}

run();
