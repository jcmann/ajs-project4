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
app.post("/api/tasks/:description?", (req, res) => {

    let newDescription; 

    // Determine if the description is coming in
    // as a parameter (URL), or request body
    if (req.params.description != null) {
        newTask = { "id" : 0, "description" : req.params.description}
    } else {
        newTask = req.body;
    }

    // read from the file 
    let currentTasks = JSON.parse(fs.readFileSync("js/tasks.json")); 

    newTask.id = currentTasks.length + 1; 

    currentTasks.push(newTask); 

    fs.writeFile("js/tasks.json", JSON.stringify(currentTasks), err => {
        if (err) throw err; 
        res.send(newTask);
        console.log("Done writing.");
    })
    
});

/**
 * Used to handle delete requests. 
 */
app.delete("/api/tasks/:id", (req, res) => {

    // read from the file to get current data
    let currentTaskList = JSON.parse(fs.readFileSync("js/tasks.json")); 

    let idToDelete; 
    if (req.params.id != null) {
        idToDelete = req.params.id; 
        let updatedTaskList = 
                currentTaskList.filter(current => current.id != idToDelete);
        
            fs.writeFile("js/tasks.json", JSON.stringify(updatedTaskList), err => {
                if (err) throw err; 
                res.send({"id" : idToDelete});
                console.log("Done writing.");
            })

    } else {
        res.send({}); 
    }

})

app.listen(3000, () => {
    console.log("Listening on port 3000.");
});
