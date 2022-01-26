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
// Retrieve the compartment number and generate text.
function display() {
    return __awaiter(this, void 0, void 0, function* () {
        let displaydiv = document.getElementById("displaycompartment");
        // Create HTML Element and get search parameter for compartment.
        let textelem = document.createElement("h1");
        let params = new URLSearchParams(window.location.search);
        // Check if items are to be added or edited.
        if (params.get("itemid") != null) {
            textelem.textContent = "Editing item";
            // Get item from server
            let request = yield requestTextWithGET(`http://127.0.0.1:3000/item?id=${params.get("itemid")}&category=${params.get("category")}`);
            let item = JSON.parse(request);
            nameinput.value = item[0]._name;
            // Split at T to get DD-MM-YYYY
            expdateinput.value = item[0]._expirationDate.split('T')[0];
            noteinput.value = item[0]._note;
            setCategory(item[0]._category);
        }
        if (params.get("itemid") == null) {
            // Add 1 to the compartment number (display only), as index starts at 0. If its null, set it to -1.    
            let compnumber = +(params.get("compartment") || "-1") + 1;
            textelem.textContent = `Add item to compartment ${compnumber}`;
        }
        displaydiv.prepend(textelem);
    });
}
display();
// Get HTML input fields + addbutton.
let nameinput = document.getElementById("i_name");
let expdateinput = document.getElementById("i_expire");
let noteinput = document.getElementById("i_note");
let addbutton = document.getElementById("additembutton");
// Get the value of active radio button. Only call when item should be added to database. 
function getCategory() {
    let radio = document.querySelector('input[name="category"]:checked');
    console.log(radio.value);
    return radio.value;
}
function setCategory(category) {
    let radio = document.querySelector(`input[value=${category}]`);
    radio.checked = true;
}
// Button functionality.
addbutton.addEventListener("click", addItem);
function addItem() {
    // Get input field values.
    let categv = getCategory();
    //console.log(categv);
    let namev = nameinput.value;
    let expv = expdateinput.value;
    let notev = noteinput.value;
    // Check if any input fields are empty and alert if necessary.
    if (categv == null || categv == "" || namev == null || namev == "" || expv == null || expv == "" || notev == null || notev == "") {
        alert("Please fill out every input field.");
        return;
    }
    // Create new Fridgeitem object.
    let expdate = new Date(expv);
    let curdate = new Date();
    let params = new URLSearchParams(window.location.search);
    let comp = params.get("compartment");
    let item;
    let url;
    if (params.get("itemid") != null) {
        url = `http://127.0.0.1:3000/item?collection=${params.get("category")}`;
        item = new Fridgeitem(categv, namev, expdate, curdate, notev, comp, params.get("itemid"));
    }
    else {
        url = `http://127.0.0.1:3000/item?collection=${categv}`;
        item = new Fridgeitem(categv, namev, expdate, curdate, notev, comp);
    }
    console.log(url);
    // Send item to server via POST
    sendJSONStringWithPOST(url, item.asJSONstring());
}
