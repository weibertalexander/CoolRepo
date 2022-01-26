"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let closedfridgeimg = document.getElementById("closedimg");
let openedfridgeimg = document.getElementById("openedimg");
let openedfridgediv = document.getElementById("openedfridgecontainer");
let compartments = document.getElementsByClassName("compartment");
const maxitemdisplay = 3;
// Display only set amount of items to avoid overflow. Toggle the "more items button" if not all items are shown.
function displayItems() {
    compartments = document.getElementsByClassName("compartment");
    for (let comp of compartments) {
        // Get every HTML element with class compartmentitem that is being 
        let visibleitems = Array.from(comp.querySelectorAll(`.compartmentitem`));
        let itemamount = visibleitems.length;
        console.log(itemamount);
        let morebutton = comp.querySelector(`[data-id]`);
        let active = 0;
        for (let item of visibleitems) {
            if (active < maxitemdisplay && toggleIconView(item)) {
                item.style.display = "block";
                active++;
            }
            else {
                item.style.display = "none";
            }
            if (itemamount > maxitemdisplay && active == maxitemdisplay) {
                morebutton.style.display = "block";
            }
            else {
                morebutton.style.display = "none";
            }
        }
    }
}
// Add button functionality.
closedfridgeimg.addEventListener("click", openfridge);
// Change to "opened" view, make contents of it visible.
function openfridge() {
    closedfridgeimg.style.display = "none";
    openedfridgeimg.style.display = "inline-flex";
    openedfridgediv.style.display = "inline-flex";
    setInterval(dynamicResize, 50);
    appendButtons();
    displayItems();
}
// Add filters.
let filterbuttons = document.getElementsByClassName("filter");
let filters = new Map();
// Initialize category filters and add event listeners to buttons.
for (let b of filterbuttons) {
    filters.set(b.value, b.checked);
    b.addEventListener("click", updateCategoryFilters);
}
// Turn on/off category filter if button is pressed.
function updateCategoryFilters(event) {
    let filterbutton = event.currentTarget;
    let category = filterbutton.value;
    let checked = filterbutton.checked;
    console.log(`${category} is ${checked}`);
    filters.set(category, checked);
    displayItems();
}
function nameFilterSubstring(name) {
    let namefilterinput = document.getElementById("namefilter");
    let substring = name.substring(0, namefilterinput.value.length);
    if (substring.toLowerCase() == namefilterinput.value.toLowerCase()) {
        return true;
    }
    else {
        return false;
    }
}
/*
    function nameFilterOn(): boolean {
        let namefilterinput: HTMLInputElement = document.getElementById("namefilter") as HTMLInputElement;
        if (namefilterinput.value != "" || null) {
            console.log(`namefilter is active with ${namefilterinput.value}`);
            return true;
        }
        return false;
    }
*/
let nameFilterOn = false;
let namefilterinput = document.getElementById("namefilter");
namefilterinput.addEventListener("input", toggleNameFilter);
function toggleNameFilter(event) {
    console.log("inputfield is being edited");
    let inputfield = event.target;
    if (inputfield.value != "" || null) {
        nameFilterOn = true;
    }
    else {
        nameFilterOn = false;
    }
    displayItems();
}
// Show / hide items based on filter settings.
function toggleIconView(item) {
    let itemname = item.getAttribute("data-name") || "";
    let itemcategory = item.getAttribute("data-category");
    if (nameFilterOn) {
        if (nameFilterSubstring(itemname) && filters.get(itemcategory)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (filters.get(itemcategory)) {
            return true;
        }
        else {
            console.log(`${itemcategory} is being filtered off.`);
            return false;
        }
    }
}
// Dynamically resize openedfridgediv to make it fit the fridge image size.
function dynamicResize() {
    openedfridgediv.style.width = openedfridgeimg.width.toString() + "px";
    openedfridgediv.style.height = openedfridgeimg.height.toString() + "px";
}
// Append add-buttons to each compartment to not spend 100 hours manually copying them into the html file.
function appendButtons() {
    for (let i = 0; i < compartments.length; i++) {
        let morebutton = document.createElement("a");
        let addbutton = document.createElement("a");
        addbutton.href = `additem.html?compartment=${i}`;
        morebutton.href = `details.html?compartment=${i}`;
        let addbuttonimage = document.createElement("img");
        let morebuttonimage = document.createElement("img");
        addbuttonimage.src = "../Client/assets/icons/add_icon.svg";
        morebuttonimage.src = "../Client/assets/icons/more_icon.svg";
        addbutton.setAttribute("id", i.toString());
        morebutton.setAttribute("data-id", i.toString());
        morebutton.setAttribute("style", "display: none");
        addbutton.appendChild(addbuttonimage);
        morebutton.appendChild(morebuttonimage);
        addbutton.setAttribute("class", "additembutton");
        morebutton.setAttribute("class", "moreitembutton");
        compartments[i].appendChild(morebutton);
        compartments[i].appendChild(addbutton);
    }
}
// Load all items from database and create Fridgeitem objects.
function loadFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let dbtext = yield requestTextWithGET("http://127.0.0.1:3000/allitems");
        let fridgeitems = JSON.parse(dbtext);
        // Add Fridgeitems from database to array.
        for (let item of fridgeitems) {
            let fridgeitem = new Fridgeitem(item._category, item._name, item._expirationDate, item._creationDate, item._note, item._compartment, item._id);
            if (fridgeitem.compartment() >= "0") {
                let comp = fridgeitem.compartment();
                let arr = fridgeitemarray.get(comp) || [];
                arr.push(fridgeitem);
                fridgeitemarray.set(comp, arr);
                displayItem(fridgeitem);
            }
        }
        displayItems();
        //console.log(fridgeitemarray);
    });
}
loadFromDatabase();
// Display Fridgeitem in HTML.
function displayItem(fridgeitem) {
    // Get addbutton in compartment to add in front of it.
    let addbutton = document.getElementById(fridgeitem.compartment());
    // Create HTML elements.
    let itemdisplay = document.createElement("div");
    let hyperlink = document.createElement("a");
    let img = document.createElement("img");
    // Set attributes.
    itemdisplay.setAttribute("class", "compartmentitem");
    itemdisplay.setAttribute("data-category", fridgeitem.category());
    itemdisplay.setAttribute("data-name", fridgeitem.name());
    hyperlink.href = `additem.html?itemid=${fridgeitem.id()}&category=${fridgeitem.category()}&compartment=${fridgeitem.compartment()}`;
    img.setAttribute("src", "./assets/icons/" + fridgeitem.category() + "_icon.svg");
    hyperlink.appendChild(img);
    itemdisplay.appendChild(hyperlink);
    // Get compartment number and insert in front of add button and style background.
    if (fridgeitem.compartment() >= "0") {
        compartments[parseInt(fridgeitem.compartment())].insertBefore(itemdisplay, addbutton);
    }
}
