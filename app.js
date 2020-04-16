const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const items = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

let itemSchema = new mongoose.Schema({
    name: String
});

let Item = new mongoose.model("Item", itemSchema);

let item1 = new Item({
    name: "Welcome to ToDoList!"
});

let item2 = new Item({
    name: "Hit the + button to add a new item"
});

let item3 = new Item({
    name: "<-- Hit this to delete an item"
});

let defaultItems = [item1, item2, item3];



app.get("/", function (req, res) {

    Item.find({}, callback = (err, foundItems) => {

        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, callback = (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Default Items added succesfully");
                }
            });
            
            res.redirect("/");

        } else {

            res.render("list", { listTitle: "Today", newListItems: foundItems});
        
        }

    });

});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;

    let item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");

});

app.listen(3000, function () {
    console.log("App running on port 3000");
});



