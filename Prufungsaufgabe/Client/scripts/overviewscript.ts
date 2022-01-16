let closedfridgeimg: HTMLInputElement = document.getElementById("closedimg") as HTMLInputElement;
let openedfridgeimg: HTMLImageElement = document.getElementById("openedimg") as HTMLImageElement;
let openedfridgediv: HTMLDivElement = document.getElementById("openedfridgecontainer") as HTMLDivElement;
let compartments: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("compartment") as HTMLCollectionOf<HTMLDivElement>;

closedfridgeimg.addEventListener("click", openfridge);

// Change to "opened" view, make contents of it visible.
function openfridge(): void {
    closedfridgeimg.style.display = "none";
    openedfridgeimg.style.display = "block";
    openedfridgediv.style.display = "inline-flex";
    setInterval(dynamicResize, 50);
    appendAddButtons();
}

// Dynamically resize openedfridgediv to make it fit the fridge image size.
function dynamicResize(): void {
    openedfridgediv.style.width = openedfridgeimg.width.toString() + "px";
    openedfridgediv.style.height = openedfridgeimg.height.toString() + "px";
}

// Append add-buttons to each compartment to not spend 100 hours manually copying them into the html file.
function appendAddButtons(): void {
    for (let i = 0; i < compartments.length; i++) {
        let button: HTMLAnchorElement = document.createElement("a");
        button.href = `additem.html?compartment=${i}`;
        let buttonimage: HTMLImageElement = document.createElement("img");
        buttonimage.src = "../Client/assets/add_icon.svg";
        button.appendChild(buttonimage);
        button.setAttribute("class", "compartmentitem");
        compartments[i].appendChild(button);
    }
}