//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://sharilmalik9:sharilbebest@todolist.5yapngi.mongodb.net/?retryWrites=true&w=majority");
const ItemSchema={
  Name:String

};
const Item=mongoose.model("Item",ItemSchema);
const Item1=new Item({
Name:"Welcome To ToDO List"
});
const Item2=new Item({
  Name:"Add Items"
  });
 const Item3=new Item({
   Name:"Remove Items"
    });

const defaultItems = [Item1,Item2,Item3];
const ListSchema={
  name:String,
  items:[ItemSchema]

};
const List=mongoose.model("List",ListSchema);
// Item.insertMany(defaultItems,function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("successfully added the default Items");
//     }
// });
const workItems = [];
const day = date.getDate();

app.get("/", function(req, res) {
  Item.find({}, function(err,foundItems){
    if(foundItems.length==0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully added the default Items");
        }

    });
    res.redirect("/");
  }
  else{
    res.render("list", {listTitle:day, newListItems:foundItems});
  }
  });    
//  const day = date.getDate();
});
app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        const list= new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+customListName);

      }
      else{
        res.render("List",{listTitle:customListName, newListItems:foundList.items})

      }
    }

  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const item=new Item({
    Name:itemName
  });
  if(listName==day){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }

  // item.save();
  // res.redirect("/");


  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});
app.post("/delete",function(req,res){
  const deletedItemId=req.body.checkbox;
  const listName=req.body.itemName;
  if(listName===day){
    Item.findByIdAndRemove(deletedItemId,function(err){
      if(!err){
        console.log("successfully deleted");
        res.redirect("/");
      }
      // res.redirect("/");
  
    });

  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:deletedItemId}}},function(err,foundList){
                 if(!err){
                  res.redirect("/"+listName);
                 }  
    });
  }
  

});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
