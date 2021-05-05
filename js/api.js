const express = require("express"); 
const app = express(); 
const fs = require("fs");

app.use(express.json()); 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Access the API itself
app.get("/api/tasks", (req, res) => {
    // read the file, tasks.json
    fs.readFile("js/tasks.json", (error, data) => {
        if (error) {
            throw error; 
        } else {
            res.send(data.toString());
            res.end(); 
        }
    }); 

});

app.listen(3000, () => {
    console.log("Listening on port 3000.");
});
