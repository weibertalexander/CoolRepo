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
let outerleftsection = document.getElementById("outerleftsection");
let outerrightsection = document.getElementById("outerrightsection");
let innerrightsection = document.getElementById("innerrightsection");
let innerleftsection = document.getElementById("innerleftsection");
const maxitemdisplay = 3;
let currentFilters;
// Display only set amount of items to avoid overflow. Toggle the "more items button" if not all items are shown.
function displayItems() {
    compartments = document.getElementsByClassName("compartment");
    for (let comp of compartments) {
        // Get every HTML element with class compartmentitem that is being 
        let visibleitems = Array.from(comp.querySelectorAll(`.compartmentitem`));
        let itemamount = visibleitems.length;
        let morebutton = comp.querySelector(".moreitembutton");
        let active = 0;
        for (let item of visibleitems) {
            if (active < maxitemdisplay) {
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
    loadFromDatabase();
    setInterval(dynamicResize, 50);
    appendButtons();
    displayItems();
}
// Add filters.
let filterbuttons = document.getElementsByClassName("filter");
let categoryFilters = new Map();
function initCurrentFilters() {
    currentFilters = {
        name: "",
        categories: [],
        expirationDate: new Date("2520-12-20").getTime(),
    };
    // Initialize category filters and add event listeners to buttons.
    for (let b of filterbuttons) {
        categoryFilters.set(b.value, b.checked);
        currentFilters.categories.push(b.value);
        b.addEventListener("click", updateCategoryFilters);
    }
}
initCurrentFilters();
// Turn on/off category filter if button is pressed.
function updateCategoryFilters(event) {
    let filterbutton = event.currentTarget;
    let category = filterbutton.value;
    let checked = filterbutton.checked;
    categoryFilters.set(category, checked);
    let updatedCategories = [];
    currentFilters.categories = [];
    for (let b of filterbuttons) {
        categoryFilters.set(b.value, b.checked);
        if (b.checked) {
            currentFilters.categories.push(b.value);
        }
    }
    loadFromDatabase();
    displayItems();
}
let namefilterinput = document.getElementById("namefilter");
namefilterinput.addEventListener("input", nameFilterOn);
function nameFilterOn() {
    let namefilterinput = document.getElementById("namefilter");
    currentFilters.name = namefilterinput.value;
    loadFromDatabase();
}
let datefilter = document.getElementById("datefilter");
datefilter.addEventListener("change", toggleDateFilter);
function toggleDateFilter(event) {
    let field = event.currentTarget;
    let isEmpty = true;
    if (field.value.length != 0) {
        isEmpty = false;
    }
    let value = parseInt(field.value);
    let expiredate = new Date();
    console.log(value);
    console.log(field.value.length);
    if (isEmpty) {
        console.log("value is trash");
        currentFilters.expirationDate = new Date("2520-12-20").getTime();
    }
    else {
        expiredate.setDate((expiredate.getDate() + value));
        currentFilters.expirationDate = expiredate.getTime();
    }
    console.log(currentFilters.expirationDate);
    loadFromDatabase();
}
function toggleNameFilter(event) {
    let inputfield = event.target;
    if (inputfield.value != "" || null) {
        currentFilters.name = "";
    }
    else {
        currentFilters.name = inputfield.value;
    }
    loadFromDatabase();
    displayItems();
}
// Dynamically resize openedfridgediv to make it fit the fridge image size.
function dynamicResize() {
    openedfridgediv.style.width = openedfridgeimg.width.toString() + "px";
    openedfridgediv.style.height = openedfridgeimg.height.toString() + "px";
    //outerleftsection.style.width = openedfridgeimg.width * 0.118 + "px";
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
        addbutton.setAttribute("id", i.toString() + "a");
        morebutton.setAttribute("id", i.toString() + "m");
        morebutton.setAttribute("style", "display: none");
        addbutton.appendChild(addbuttonimage);
        morebutton.appendChild(morebuttonimage);
        addbutton.setAttribute("class", "additembutton");
        morebutton.setAttribute("class", "moreitembutton");
        compartments[i].appendChild(morebutton);
        compartments[i].appendChild(addbutton);
    }
}
function clearFridge() {
    let htmlitems = document.getElementsByClassName("compartmentitem");
    fridgeitemarray.clear;
    while (htmlitems.length) {
        htmlitems[0].remove();
    }
}
// Load all items from database and create Fridgeitem objects.
function loadFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let filters = JSON.stringify(currentFilters);
        yield sendFilterSettings("http://127.0.0.1:3000/filters", filters);
        let dbvalues = yield requestFromDatabase("http://127.0.0.1:3000/allitems");
        let fridgeitems = JSON.parse(dbvalues);
        console.log(fridgeitems);
        clearFridge();
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
// Display Fridgeitem in HTML.
function displayItem(fridgeitem) {
    // Get addbutton in compartment to add in front of it.
    let morebutton = document.getElementById(fridgeitem.compartment() + "m");
    // Create HTML elements.
    let itemdisplay = document.createElement("div");
    let hyperlink = document.createElement("a");
    let img = document.createElement("img");
    let tooltip = document.createElement("span");
    // Set attributes.
    itemdisplay.setAttribute("class", "compartmentitem");
    itemdisplay.setAttribute("data-category", fridgeitem.category());
    itemdisplay.setAttribute("data-name", fridgeitem.name());
    tooltip.textContent = `${fridgeitem.name()}, Expires: ${new Date(fridgeitem.expirationDate()).toLocaleDateString()}`;
    tooltip.setAttribute("class", "itemtooltip");
    //itemdisplay.setAttribute("data-expdate", fridgeitem.expirationDate().getDate().toString())
    hyperlink.href = `details.html?itemid=${fridgeitem.id()}`;
    img.setAttribute("src", "./assets/icons/" + fridgeitem.category() + "_icon.svg");
    hyperlink.appendChild(img);
    itemdisplay.appendChild(tooltip);
    itemdisplay.appendChild(hyperlink);
    // Get compartment number and insert in front of add button and style background.
    if (fridgeitem.compartment() >= "0") {
        compartments[parseInt(fridgeitem.compartment())].insertBefore(itemdisplay, morebutton);
    }
}
