//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const e = require("express");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
const listSchema=mongoose.Schema({
  todo: String
});
const Work=mongoose.model("work",listSchema);
const Task=mongoose.model("task",listSchema);
const n1=new Task({
  todo:"HomeWork"
});
const n2=new Task({
  todo:"Sleep"
});
const n3=new Task({
  todo:"Eat"
});
// Task.insertMany([n1,n2,n3]);
app.get("/", function(req, res) {

// const day = date.getDate();
  let items=Task.find({},(err,results)=>{
    if(err){
      console.log(err);
      mongoose.connection.close();
    }
    else{
      if(results.length===0){
          Task.insertMany([n1,n2,n3]);
          console.log("I am Here.");
          res.redirect("/");
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: results});
      }
    }
  });
});

app.post("/add/Today", function(req, res){

  const item = req.body.newItem;
  console.log(item);
  let newTask= new Task({
    todo:item
  });
  newTask.save((err,results)=>{
    if(err){
      console.log("Found Error.");
    }
    else{
      console.log("Entry Added Successfully.");
    }
    res.redirect("/");
  });
});

app.post("/add/Work", function(req, res){
  console.log("I am here in add workd.");
  const item = req.body.newItem;
  console.log(item);
  let nT=new Work({
    todo:item
  });
  nT.save((err,results)=>{
    if(err){
      console.log("Found Error.");
    }
    else{
      console.log("Entry Added Successfully.");
    }
  });
  res.redirect("/work");
});

app.get("/work", function(req,res){
  let defaultData= new Work({
    todo:"Init Data"
  });
  Work.find({},(err,results)=>{
    if(err){
      console.log(err);
    }
    else{
      if(results.length===0){
        defaultData.save((err,res)=>{
          if(err){
            console.log(err);
          }
          else{
            res.redirect("/work");
          }
        });
      }
      else{
        res.render("list", {listTitle: "Work", newListItems: results});
      }
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});
app.post("/deleteWork",(req,res)=>{
  console.log(req.body.id);
  let id=req.body.id;
  Work.findByIdAndRemove(id,(err)=>{
    if(err){
      console.log("Error found.");
    }
    else{
      console.log("Deleted Successfully.");
    }
  });
  res.redirect("/work");
});
app.post("/deleteToday",(req,res)=>{
  console.log(req.body.id);
  let id=req.body.id;
  Task.findByIdAndRemove(id,(err)=>{
    if(err){
      console.log("Error found.");
    }
    else{
      console.log("Deleted Successfully.");
    }
  });
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
