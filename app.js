const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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

let listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

let List = mongoose.model("List", listSchema);




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

            res.render("list", { listTitle: "Today", newListItems: foundItems });

        }

    });

});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    let item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, callback = (err, foundList) => {
            if (!foundList) {
                console.log("Not found")
            } else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }

        });
    }
});

app.post("/delete", callback = (req, res) => {
    console.log(req.body.checkbox);

    let checkedItemId = req.body.checkbox;
    let listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({ _id: checkedItemId }, callback = (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Document", checkedItemId, "succesfully deleted");
            }

            res.redirect("/");

        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, callback = (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }

});

app.get("/:customListName", callback = (req, res) => {
    let customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, callback = (err, foundList) => {
        if (!err) {
            if (!foundList) {

                let list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();

                console.log("Doesn't exists: List has been created");

                res.redirect("/" + customListName);

            } else {

                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });
});

app.listen(3000, function () {
    console.log("App running on port 3000");
});



