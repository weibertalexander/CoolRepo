"use strict";
// Simple counter to track EventPlanner elements
let id = 0;
class EventPlanner {
    // Data
    interpret;
    date;
    price;
    id;
    // Constructor also gives each element an ID 
    constructor(i, d, p) {
        this.interpret = i;
        this.date = d;
        this.price = p;
        this.id = id;
        id++;
        console.log(this.asString());
    }
    // Getters
    asString() {
        return `${this.interpret} kostet ${this.price} und findet am ${this.date} statt. id: ${this.id}`;
    }
    getInterpret() {
        return this.interpret;
    }
    getDate() {
        return this.date;
    }
    getPrice() {
        return this.price;
    }
    getID() {
        return this.id.toString();
    }
}
// Input variables
let interpretinput = document.getElementById("cinterpret");
let priceinput = document.getElementById("cprice");
let dateinput = document.getElementById("cdate");
// Event related variables / listeners
let events = [];
let addButton = document.getElementById("formbutton");
addButton.addEventListener("click", addEvent);
// Create new event and add it to the events array. Call helper function to display in HTML document
function addEvent() {
    // Check whether input fields are empty
    if (interpretinput.value == "" || dateinput.value == "" || priceinput.value == "") {
        alert("Bitte alle Felder ausfüllen!");
        return;
    }
    // Create the event
    let entry = new EventPlanner(interpretinput.value, dateinput.value, priceinput.value);
    events.push(entry);
    addTableEntry(entry);
    //Clear input fields. Commented out for easier testing.
    //interpretinput.value = "";
    //dateinput.value = "";
    //priceinput.value = "";
}
// Remove event from HTML table
function removeTableEntry(event) {
    let element = event.currentTarget;
    let parent = event.target.parentElement;
    removeEvent(element.getAttribute("data-id"));
    parent.remove();
}
// Remove event from events array
function removeEvent(itemid) {
    events.forEach((eventelem, index) => {
        if (eventelem.getID() == itemid)
            events.splice(index, 1);
    });
    console.log(events);
}
// Create new HTML table elements to display data
function addTableEntry(eventitem) {
    // Create HTML elements
    let entry = document.createElement("tr");
    let date = document.createElement("td");
    let interpret = document.createElement("td");
    let price = document.createElement("td");
    let trash = document.createElement("td");
    // Data collection
    date.innerHTML = eventitem.getDate();
    interpret.innerHTML = eventitem.getInterpret();
    price.innerHTML = eventitem.getPrice();
    // Add trash functionality
    trash.setAttribute("class", "trash");
    trash.setAttribute("data-id", eventitem.getID());
    trash.addEventListener("click", removeTableEntry);
    // Build HTML table row element
    entry.appendChild(date);
    entry.appendChild(interpret);
    entry.appendChild(price);
    entry.appendChild(trash);
    // Display on website
    document.getElementById("table2").appendChild(entry);
}
//# sourceMappingURL=script.js.map