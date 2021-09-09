//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


//==================================================


const homeStartingContent = "Welcome to my first real attempt at creating a daily journal with an attached mongo atlas database.";
const aboutContent = "My name is Ivan and I am learning the in's and out's of web development. I've dived into frontend languages such as HTML, CSS, and Javascript, venturing into backend technologies such as NodeJS, as well as data storage technologies such as mongoDB using mongo Atlas, Robo3t, and the mongo shell.";
const contactContent = "Email: ashbanmon@gmail.com";


//==================================================


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//==================================================
//mongodb://localhost:27017/
mongoose.connect("mongodb+srv://admin-ivan:320559jjeom@cluster0.srhlg.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


//==================================================






app.get("/", function(req, res){

  Post.find({}, function(err, foundPosts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    })
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose")
});

app.post("/compose", function(req, res){

  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;


  const post = new Post ({
    title: postTitle,
    content: postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

  // posts.push(post);
  // res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const reqName = req.params.postName;
  const kebabReqName = _.kebabCase(reqName);
  const requestedPostId = req.params.postId;



  Post.findOne({_id: requestedPostId}, function(err, post){

    res.render("post", {
      postTitle: post.title,
      postContent: post.content
    })
  })



  // posts.forEach(function(post){
  //   const storedName = _.kebabCase(post.title);
  //
  //   if (kebabReqName === storedName){
  //     res.render("post", {
  //       postTitle: post.title,
  //       postContent: post.body
  //     })
  //   }
  //
  // });


});

//Testing Heroku Hosting


let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started on port " + port);
});
