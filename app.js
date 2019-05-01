var express =require("express");
var app= express();
var bodyParser =require("body-parser");
var mongoose =require("mongoose");
var methodOverride =require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//MONGODB SCHEMA
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema); 

// Blog.create({
//     title:"First Blog",
//     image:"https://images.unsplash.com/photo-1502631868851-1717aca1be29?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8c6d016a9c9ce9e8c9d1b6f81a7a58ad&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb",
//     body:"The new blog on camping"
// });

app.get("/", function(req, res){
    res.redirect("/blogs"); 
})

//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            res.send(err);
        }else{
                res.render("index", {blogs:blogs});     
        }
    });
});

//NEW
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//POST
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err);     
        }else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
                res.render("edit",{blog:foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
            
        }
    })
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Started!!");
});