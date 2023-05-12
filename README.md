A node js web app about restaurants that interacts with mongodb (using thunderclient) to perform CRUD operations.

The following methods interact with mongodb (in the DAO):
db.addNewRestaurant(data): to add record
getAllRestaurants: get all restaurants (filter by borough) and paginates as well 			based on the 2 parameters - page (start page) & perPage (total 			restaurants number)
getRestaurantById(id): display specific restaurant by its id
updateRestaurantById(id): update specific restaurant by its id
deleteRestaurantById(id): delete specific restaurant by its id

The following url have been implemented:
/api/restaurants (displays form to enter restaurant info) - submitting this calls the add method in the DAO to insert data into mongodb and then again displaying the result
/api/restaurants?page=1&perPage=5&borough=Toronto (displays 5 restaurants starting from 1st record and filtering Toronto as the borough)
/api/restaurants/5eb3d668b31de5d588f4292a (the number is the restaurant id) : displays restaurant with the id
/api/restaurants/5eb3d668b31de5d588f4292a (in thunderclient - put) updates the record (based on the new json record entered in thunderclient's body section)
/api/restaurants/5eb3d668b31de5d588f4292a (in thunderclient - delete) deletes the record with the id




