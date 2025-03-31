const express = require('express');
const path= require("path");
const fs = require('node:fs');
const app= express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

let fName="";

app.get("/", (req, res) => {
    fs.readdir(`./files`, function(err, files) {
        // console.log(files);
        res.render("index", {files: files});
    })
});

app.get("/files/:fileName", (req, res) => {
    fs.readFile(`./files/${req.params.fileName}`, "utf-8", function(err, fileData) {
        res.render("show", {fileName: req.params.fileName, fileData: fileData});
    })
});

app.get("/edit/:fileName", (req, res) => {
    fName = req.params.fileName;
    fs.readFile(`./files/${fName}`, "utf-8", function(err, fileData) {
        res.render("edit", {fileName: req.params.fileName, fileData: fileData});
    })
    // edit page me load krne k baad us file ko delete kr dena h taki new updated file save kr sake lgega ki edit ho rha h pr wo edit nhi ew bn rha hoga

    

});

app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.desc, function(err){
        res.redirect("/")
    })
    console.log(req.body)
});

app.post("/edit", (req, res) => {
    let newFileName = req.body.title;
    let filePath = ''; 
    let containsDot = req.body.title.includes('.');
    let containsSpace = req.body.title.includes(' ');
    
    fs.unlink(`./files/${fName}`, (err) => {
        if (err) throw err;
        console.log(`./files/${fName} was deleted`);
      });

    if(fName===newFileName){ 
        filePath=`./files/${newFileName}`;
    }
    else if(containsDot || containsSpace){
        // console.log(req.body.title)
        console.log(req.body.title.split('.')[0]+".txt");
        let text =  req.body.title.split('.')[0]
        filePath=`./files/${text.split(' ').join('')+".txt"}`;
    }
    else {
        filePath = `./files/${req.body.title.split(' ').join('')}.txt`;
    }
    
    // console.log(filePath)
    fs.writeFile(filePath, req.body.desc, function(err){
        res.redirect("/")
    })
    // console.log(req.body)

    

});

app.listen(3000)