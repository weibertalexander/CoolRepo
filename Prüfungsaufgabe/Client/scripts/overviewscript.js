"use strict";
var closedfridgeimg = document.getElementById("closedimg");
var openedfridgeimg = document.getElementById("openedimg");
var openedfridgediv = document.getElementById("openedfridgecontainer");
var compartments = document.getElementsByClassName("compartment");
closedfridgeimg.addEventListener("click", openfridge);
// Change to "opened" view, make contents of it visible.
function openfridge() {
    closedfridgeimg.style.display = "none";
    openedfridgeimg.style.display = "block";
    openedfridgediv.style.display = "inline-flex";
    setInterval(dynamicResize, 50);
    appendAddButtons();
}
// Dynamically resize openedfridgediv to make it fit the fridge image size.
function dynamicResize() {
    openedfridgediv.style.width = openedfridgeimg.width.toString() + "px";
    openedfridgediv.style.height = openedfridgeimg.height.toString() + "px";
}
// Append add-buttons to each compartment to not spend 100 hours manually copying them into the html file.
function appendAddButtons() {
    for (var i = 0; i < compartments.length; i++) {
        var button = document.createElement("a");
        button.href = "additem.html?compartment=".concat(i);
        var buttonimage = document.createElement("img");
        buttonimage.src = "../Client/assets/add_icon.svg";
        button.appendChild(buttonimage);
        button.setAttribute("class", "compartmentitem");
        compartments[i].appendChild(button);
    }
}
