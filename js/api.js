const express = require("express"); 
const app = express(); 
const fs = require("fs");
const cors = require("cors"); 

app.use(express.json()); 
app.use(cors());

const getAllTasks = () => {

    fs.readFile("js/tasks.json", (error, data) => {
        if (error) {
            throw error; 
        } else {
            return JSON.parse(data);  
            // console.log(JSON.parse(data));
        }
    });

}

/**
 * The base API access, gets all tasks from the JSON file
 */
app.get("/api/tasks/", (req, res) => {
    // read the file, tasks.json
    fs.readFile("js/tasks.json", (error, data) => {
        if (error) {
            throw error; 
        } else {
            res.contentType("application/json");
            res.send(data);
            res.end(); 
        }
    }); 

});

/**
 * Handles post requests where the body contains 
 * a description 
 */
app.post("/api/tasks/", (req, res) => {

    let newDescription = req.body;
    // console.log(newDescription);

    // read from the file 
    let currentTasks = JSON.parse(fs.readFileSync("js/tasks.json")); 

    currentTasks.push(newDescription); 

    fs.writeFile("js/tasks.json", JSON.stringify(currentTasks), err => {
        if (err) throw err; 
        res.send(currentTasks);
        console.log("Done writing.");
    })
    
    
})

app.listen(3000, () => {
    console.log("Listening on port 3000.");
});
