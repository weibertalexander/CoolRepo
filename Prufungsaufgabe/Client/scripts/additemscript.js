"use strict";
//#region Display and Input
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Get HTML input fields.
let nameinput = document.getElementById("i_name");
let expdateinput = document.getElementById("i_expire");
let noteinput = document.getElementById("i_note");
// Display text and fill out input fields (if an item is being edited).
function display() {
    return __awaiter(this, void 0, void 0, function* () {
        let displaydiv = document.getElementById("displaycompartment");
        // Create HTML Element and get search parameter for compartment.
        let textelem = document.createElement("h1");
        let params = new URLSearchParams(window.location.search);
        // Add 1 to the compartment number (display only), as index starts at 0. If its null, set it to -1.    
        let compnumber = +(params.get("compartment") || "-1") + 1; // "+" turns it into a number.
        // Check if items are to be added or edited.
        if (params.get("itemid") != null) {
            // Get item from server
            let request = yield requestFromDatabase(`http://127.0.0.1:3000/item?id=${params.get("itemid")}`);
            let item = JSON.parse(request);
            textelem.textContent = `Editing ${item[0]._name} from compartment number ${compnumber}`;
            // Convert string to correct format to use in input field.
            let datevalue = new Date(item[0]._expirationDate).toISOString();
            // Set values of the input fields.
            nameinput.value = item[0]._name;
            expdateinput.value = datevalue.split("T")[0];
            noteinput.value = item[0]._note;
            setCategory(item[0]._category);
        }
        if (params.get("itemid") == null) {
            textelem.textContent = `Add item to compartment ${compnumber}`;
        }
        displaydiv.prepend(textelem);
    });
}
display();
// Get the value of active radio button.
function getCategory() {
    let radio = document.querySelector('input[name="category"]:checked');
    return radio.value;
}
// Set the value of a radio button.
function setCategory(category) {
    let radio = document.querySelector(`input[value=${category}]`);
    radio.checked = true;
}
//#endregion Display and Input
//#region Add button
// Button functionality.
let addbutton = document.getElementById("additembutton");
addbutton.addEventListener("click", addItem);
function addItem() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get input field values.
        let categv = getCategory();
        let namev = nameinput.value;
        let expv = expdateinput.value;
        let notev = noteinput.value;
        // Check if any input fields are empty and alert if necessary.
        if (categv == null || categv == "" || namev == null || namev == "" || expv == null || expv == "" || notev == null || notev == "") {
            alert("Please fill out every input field.");
            return;
        }
        // Create new Fridgeitem object.
        let expdate = new Date(expv).getTime();
        let curdate = new Date().getTime();
        // Get url parameters.
        let params = new URLSearchParams(window.location.search);
        let comp = params.get("compartment");
        let item;
        // As this item is being edited, get the original item from database.
        if (params.get("itemid") != null) {
            let text = yield requestFromDatabase(`http://127.0.0.1:3000/item?id=${params.get("itemid")}`);
            let olditem = JSON.parse(text);
            item = new Fridgeitem(categv, namev, expdate, olditem[0]._creationDate, notev, comp, olditem[0]._id);
        }
        else {
            item = new Fridgeitem(categv, namev, expdate, curdate, notev, comp);
        }
        // Send item to server via POST and redirect to overview page.
        yield sendJSONStringWithPOST(`http://127.0.0.1:3000/item`, item.asJSONstring());
        window.location.href = "http://127.0.0.1:5500/Client/overview.html";
    });
}
//#endregion
//#region Delete Button
let deletebutton = document.getElementById("deleteitembutton");
deletebutton.addEventListener("click", deleteItem);
function deleteItem() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("delete");
        let params = new URLSearchParams(window.location.search);
        let id = params.get("itemid");
        yield fetch(`http://127.0.0.1:3000/delete?id=${id}`);
        window.location.href = "http://127.0.0.1:5500/Client/overview.html";
    });
}
