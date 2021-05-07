/**
 * Runs on page load. Sets up event listeners and runs the initial get.
 */
 const init = () => {
    
    // Add event listeners to Add new task (delete code is added when task is added)
    document.querySelector("#newTask").addEventListener("click", (event) => addOrDeleteTask(event)); 
    document.querySelector("#task").addEventListener("keypress", (event) => {
        if (event.key === 'Enter') {
            addOrDeleteTask(event); 
        }
    })

    // Will get tasks for initial load
    getTasks(); 
    
}

/**
 * Runs a GET request to the API to get the current tasks. This is used when the page
 * is loaded, as well as when tasks are added or deleted. It calls a helper method
 * to actually generate the HTML. 
 */
const getTasks = () => {

    let xhr = new XMLHttpRequest(); 
    let url = `http://localhost:3000/api/tasks/`;

    xhr.open("get", url); 

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            let res = JSON.parse(xhr.responseText);
            outputTasks(res); 
        }
    }

    xhr.send();
    
}

/**
 * Takes in JSON data from getTasks (data), and creates list items 
 * to represent teach task. Each li also has a button, the delete event is added
 * to each task item here.
 */
const outputTasks = (data) => {

    // Extract just the data we need
    let tasks = data; 

    // Generate each task received in data
    for (current of tasks) {

        buildNewItem(current); // changed

    }

}

/**
 * Used for both add (post) and delete methods. The code for both is the same, 
 * except for the URL and the elements that provide relevant data 
 * (ex: the description). This also calls helper methods like clearInput, 
 * to set up the page for new data, prior to supplying that new data. 
 */
const addOrDeleteTask = (event) => {

    // General data required 
    let xhr = new XMLHttpRequest(); 
    let url = `http://localhost:3000/api/tasks/`;


    let params = {
        'description' : ""
    }

    let method;
    let description; 
    let id; 

    // Determine the method and description, determined differently on post/delete
    if (event.target.id == "newTask" || event.target.id == "task") {
        method = "post"; 
        description = document.querySelector("#task").value; 
        params.description = description; 
    } else if (event.target.classList.contains("deleteButton")) {
        method = "delete"; 
        id = event.target.getAttribute("data-id"); 
        url += `${id}`; // delete request uses parameters
        console.log(`Sending task to delete: ${id}`);
    }

    // Open the XHR, set headers, and execute. 
    xhr.open(method, url); 
    xhr.setRequestHeader("Content-Type", "application/json"); 


    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            // Clear things out to prepare for new refreshed tasks 
            clearInput(); 
            removeChildNodes(); 
            updateList(method, description); 
            // getTasks();
        }
    }

    xhr.send(JSON.stringify(params)); // how to send the http body

}

/**
 * Helper method used primarily for add method. This just clears the input
 * to make room for the next task and to communicate things are working. It's 
 * also called on deletes just in case and due to code structure.
 */
const clearInput = () => {
    document.querySelector("#task").value = ""; 
}

/**
 * This is a helper method for updating the task list. This prevents
 * the task list from duplicating on deletes or posts.
 */
const removeChildNodes = () => {
    let taskList = document.querySelector("#taskList");
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild); 
    }
}

/**
 * Used in the updateList method to actually generate a new task when 
 * it's been entered by the user
 */
const buildNewItem = (data) => {
    let ul = document.querySelector("#taskList");
    // Create the delete button 
    let deleteButton = document.createElement("button"); 
    deleteButton.setAttribute("data-id", data.id);
    deleteButton.textContent = "X"; 
    deleteButton.addEventListener("click", addOrDeleteTask);
    deleteButton.classList.add("deleteButton");

    // Create the li itself (bullet removed with CSS)
    let item = document.createElement("li");
    item.appendChild(deleteButton); // appending this first for placement 
    item.setAttribute("data-id", data.id);
    item.append(` ${data.description}`); // append (not child) because it's text
    ul.appendChild(item); 
}

/**
 * Visually removes an element from the UI without making a new request to the API. 
 */
const removeItem = (id) => {
    let items = [...document.querySelectorAll("button")]; 
    
    let itemToRemove = items.find(current => current.getAttribute("data-id") == id); 
    itemToRemove.parentNode.remove(); 
}
 
/**
 * Determines which methods to call to update the UI depending on the method
 */
const updateList = (method, description) => {
    if (method == "post") {
        buildNewItem(description); 
    } else if (method == "delete") {
        removeItem(description); 
    }
}


// build delete button 

window.onload = init; 