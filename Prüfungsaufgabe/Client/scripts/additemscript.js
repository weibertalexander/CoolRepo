"use strict";
// Retrieve the compartment number and generate text.
function displayComparment() {
    var displaydiv = document.getElementById("displaycompartment");
    var textelem = document.createElement("h1");
    var params = new URLSearchParams(window.location.search);
    // Add 1 to the compartment number, as index starts at 0. If its null, set it to -1.
    var compnumber = +(params.get("compartment") || "-1") + 1;
    textelem.textContent = "Add item to compartment ".concat(compnumber);
    displaydiv.prepend(textelem);
}
displayComparment();
