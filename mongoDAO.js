/********************************************************************************* 
ITE5315 – Project: I declare that this assignment is my own work in accordance with Humber Academic Policy. 
No part of this assignment has been copied manually or electronically from any other source (including web sites) or distributed to other students. 
Name: Simul Bista, Student ID: N01489966, 
Name: Jaydenn(Ching-Ting) Chang, Student ID: N01511476
Date: 2023-04-22 
**********************************************************************************/

const mongoose = require("mongoose");

class MongoDAO {
    RestaurantModel = null;

    initialize = uri => {
        // Establish a connection with the MongoDB server and initialize the "Restaurant" model with the "restaurant" collection

        mongoose
            // .connect(uri, { dbName: "test" }) // test use
            .connect(uri, { dbName: "sample_restaurants" }) // restaurant database
            .then(() => console.log("Database connection initialized"))
            .catch(console.error);

        const restaurantSchema = new mongoose.Schema({
            address: {
                building: String,
                coord: [Number],
                street: String,
                zipcode: String
            },
            borough: String,
            cuisine: String,
            grades: [{ date: Date, grade: String, score: Number }],
            name: String,
            restaurant_id: String
        });

        // Compile the restaurant model only if it doesn't already exist
        this.RestaurantModel =
            this.RestaurantModel ||
            mongoose.model("Restaurant", restaurantSchema);
    };

    addNewRestaurant = data => {
        //  Create a new restaurant in the collection using the object passed in the "data" parameter
        const restaurant = new this.RestaurantModel(data);
        return restaurant.save();
    };

    getAllRestaurants = (page = 1, perPage = 5, borough) => {
        // Return an array of all restaurants for a specific page (sorted by restaurant_id), given the number of items per page. For example, if page is 2 and perPage is 5, then this function would return a sorted list of restaurants (by restaurant_id), containing items 6 – 10. This will help us to deal with the large amount of data in this dataset and make paging easier to implement in the UI later. Additionally, there is an optional parameter "borough" that can be used to filter results by a specific "borough" value

        const filter = borough ? { borough: borough } : {};

        let restaurantList = this.RestaurantModel.find(filter)
            .sort({ restaurant_id: 1 })
            .exec()
            .then(restaurants => {
                let startIndex = (page - 1) * perPage;
                let restaurantsOnPage = restaurants.slice(
                    startIndex,
                    startIndex + perPage
                );

                return restaurantsOnPage;

                // console.log(restaurantsOnPage);
                // console.log("inDAO: " + restaurants.length);
            });

        return restaurantList;
    };

    getRestaurantById = id => {
        // Return a single restaurant object whose "_id" value matches the "Id" parameter
        return this.RestaurantModel.findOne({ _id: id }).exec();

        // Mongoose way
        // return this.RestaurantModel.findById(id).exec();
    };

    updateRestaurantById = (data, id) => {
        // console.log("data is : " + data);
        // console.log("id is" + id);
        // Overwrite an existing restaurant whose "_id" value matches the "Id" parameter, using the object passed in the "data" parameter.

        return this.RestaurantModel.findOneAndUpdate({ _id: id }, data)
            .exec()
            .then(() => this.getRestaurantById(id));

        // Mongoose way
        // return this.RestaurantModel.findByIdAndUpdate(id, data).exec();
    };

    deleteRestaurantById = id => {
        // Delete an existing restaurant whose "_id" value matches the "Id" parameter
        return this.RestaurantModel.deleteOne({ _id: id })
            .exec()
            .then(() => id);

        // Mongoose way
        // return this.RestaurantModel.findByIdAndDelete(id).exec();
    };
}

module.exports = MongoDAO;
