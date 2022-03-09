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
let infotable = document.getElementById("infotable");
let params = new URLSearchParams(window.location.search);
getFromDatabase();
function getFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let items;
        console.log(params.get("itemid") == null);
        // Get one item from database.
        if (params.get("itemid") != null || "") {
            console.log(params.get("itemid"));
            let response = yield requestFromDatabase(`http://127.0.0.1:3000/item?id=${params.get("itemid")}`);
            items = JSON.parse(response)[0];
            let newitem = new Fridgeitem(items._category, items._name, items._expirationDate, items._creationDate, items._note, items._compartment, items._id);
            console.log(newitem);
            displayInfo(newitem);
        }
        else if (params.get("compartment") != null || "") {
            console.log(params.get("compartment"));
            let response = yield requestFromDatabase(`http://127.0.0.1:3000/compartment?number=${params.get("compartment")}`);
            console.log(response);
            items = JSON.parse(response);
            for (let item of items) {
                let newitem = new Fridgeitem(item._category, item._name, item._expirationDate, item._creationDate, item._note, item._compartment, item._id);
                displayInfo(newitem);
            }
        }
    });
}
function displayInfo(item) {
    let fulltable = document.createElement("table");
    let tablerowicons = document.createElement("tr");
    let icon = document.createElement("td");
    let iconimg = document.createElement("img");
    tablerowicons.appendChild(icon);
    fulltable.appendChild(tablerowicons);
    let tablerownames = document.createElement("tr");
    let nametext = document.createElement("td");
    let name = document.createElement("td");
    tablerownames.appendChild(nametext);
    tablerownames.appendChild(name);
    fulltable.appendChild(tablerownames);
    let tablerowcateg = document.createElement("tr");
    let categorytext = document.createElement("td");
    let category = document.createElement("td");
    tablerowcateg.appendChild(categorytext);
    tablerowcateg.appendChild(category);
    fulltable.appendChild(tablerowcateg);
    let tablerowexpdt = document.createElement("tr");
    let expirationtext = document.createElement("td");
    let expiration = document.createElement("td");
    tablerowexpdt.appendChild(expirationtext);
    tablerowexpdt.appendChild(expiration);
    fulltable.appendChild(tablerowexpdt);
    let tablerownote = document.createElement("tr");
    let notetext = document.createElement("td");
    let note = document.createElement("td");
    tablerownote.appendChild(notetext);
    tablerownote.appendChild(note);
    fulltable.appendChild(tablerownote);
    let tablerowcreat = document.createElement("tr");
    let creationtext = document.createElement("td");
    let creation = document.createElement("td");
    tablerowcreat.appendChild(creationtext);
    tablerowcreat.appendChild(creation);
    fulltable.appendChild(tablerowcreat);
    let buttontr = document.createElement("tr");
    let buttontd = document.createElement("td");
    let buttondiv = document.createElement("div");
    let editbutton = document.createElement("button");
    let deletebutton = document.createElement("button");
    iconimg.src = "./assets/icons/" + item.category() + "_icon.svg";
    iconimg.setAttribute("class", "detailicon");
    icon.appendChild(iconimg);
    icon.colSpan = 2;
    nametext.textContent = "Name";
    name.textContent = item.name();
    categorytext.textContent = "Category";
    category.textContent = item.category();
    expirationtext.textContent = "Expires";
    expiration.textContent = new Date(item.expirationDate()).toLocaleDateString();
    notetext.textContent = "Note";
    note.textContent = item.note();
    creationtext.textContent = "Added";
    creation.textContent = new Date(item.creationDate()).toLocaleDateString();
    editbutton.setAttribute("class", "edititembutton");
    editbutton.setAttribute("data-id", item.id().toString());
    editbutton.textContent = "Edit item";
    deletebutton.setAttribute("class", "deleteitembutton");
    deletebutton.setAttribute("data-id", item.id().toString());
    deletebutton.textContent = "Delete item";
    editbutton.addEventListener("click", editFridgeitem);
    deletebutton.addEventListener("click", deleteFridgeitem);
    buttondiv.appendChild(editbutton);
    buttondiv.appendChild(deletebutton);
    buttondiv.setAttribute("class", "buttoncontainer");
    buttontr.appendChild(buttondiv);
    buttontr.setAttribute("class", "buttonrow");
    fulltable.appendChild(buttontr);
    infotable.appendChild(fulltable);
}
function editFridgeitem(event) {
    let ebutton = event.currentTarget;
    window.location.href = `http://127.0.0.1:5500/Client/additem.html?itemid=${ebutton.getAttribute("data-id")}`;
}
function deleteFridgeitem(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbutton = event.currentTarget;
        yield fetch(`http://12.0.0.1:3000/delete?id=${dbutton.getAttribute("data-id")}`);
    });
}
