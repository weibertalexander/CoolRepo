let closedfridgeimg: HTMLInputElement = document.getElementById("closedimg") as HTMLInputElement;
let openedfridgeimg: HTMLImageElement = document.getElementById("openedimg") as HTMLImageElement;
let openedfridgediv: HTMLDivElement = document.getElementById("openedfridgecontainer") as HTMLDivElement;
let compartments: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("compartment") as HTMLCollectionOf<HTMLDivElement>;

let outerleftsection: HTMLDivElement = document.getElementById("outerleftsection") as HTMLDivElement;
let outerrightsection: HTMLDivElement = document.getElementById("outerrightsection") as HTMLDivElement;
let innerrightsection: HTMLDivElement = document.getElementById("innerrightsection") as HTMLDivElement;
let innerleftsection: HTMLDivElement = document.getElementById("innerleftsection") as HTMLDivElement;

const maxitemdisplay: number = 3;

let currentFilters: Filters;

interface Filters {
    name: string;
    categories: string[];
    expirationDate: number;
}

// Display only set amount of items to avoid overflow. Toggle the "more items button" if not all items are shown.
function displayItems(): void {
    compartments = document.getElementsByClassName("compartment") as HTMLCollectionOf<HTMLDivElement>;
    for (let comp of compartments) {
        // Get every HTML element with class compartmentitem that is being 
        let visibleitems: HTMLDivElement[] = Array.from(comp.querySelectorAll(`.compartmentitem`) as NodeListOf<HTMLDivElement>);
        let itemamount: number = visibleitems.length;
        let morebutton: HTMLAnchorElement = comp.querySelector(".moreitembutton") as HTMLAnchorElement;
        let active = 0;
        for (let item of visibleitems) {
            if (active < maxitemdisplay) {
                item.style.display = "block";
                active++;
            } else {
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
function openfridge(): void {
    closedfridgeimg.style.display = "none";
    openedfridgeimg.style.display = "inline-flex";
    openedfridgediv.style.display = "inline-flex";
    loadFromDatabase();
    setInterval(dynamicResize, 50);
    appendButtons();
    displayItems();
}

// Add filters.
let filterbuttons: HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName("filter") as HTMLCollectionOf<HTMLInputElement>;
let categoryFilters = new Map<string, boolean>();

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
function updateCategoryFilters(event: Event) {
    let filterbutton: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    let category: string = filterbutton.value;
    let checked: boolean = filterbutton.checked;

    categoryFilters.set(category, checked);
    let updatedCategories: string[] = [];

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

let namefilterinput: HTMLInputElement = document.getElementById("namefilter") as HTMLInputElement;
namefilterinput.addEventListener("input", nameFilterOn);

function nameFilterOn(): void {
    let namefilterinput: HTMLInputElement = document.getElementById("namefilter") as HTMLInputElement;
    currentFilters.name = namefilterinput.value;
    loadFromDatabase();
}


let datefilter: HTMLInputElement = document.getElementById("datefilter") as HTMLInputElement;
datefilter.addEventListener("change", toggleDateFilter);

function toggleDateFilter(event: Event): void {
    let field: HTMLInputElement = event.currentTarget as HTMLInputElement;
    let isEmpty: boolean = true;
    if (field.value.length != 0) {
        isEmpty = false;
    }
    let value: number = parseInt(field.value);
    let expiredate: Date = new Date();
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

function toggleNameFilter(event: Event): void {
    let inputfield: HTMLInputElement = event.target as HTMLInputElement
    if (inputfield.value != "" || null) {
        currentFilters.name = "";
    } else {
        currentFilters.name = inputfield.value;
    }
    loadFromDatabase();
    displayItems();
}

// Dynamically resize openedfridgediv to make it fit the fridge image size.
function dynamicResize(): void {
    openedfridgediv.style.width = openedfridgeimg.width.toString() + "px";
    openedfridgediv.style.height = openedfridgeimg.height.toString() + "px";

    //outerleftsection.style.width = openedfridgeimg.width * 0.118 + "px";
}

// Append add-buttons to each compartment to not spend 100 hours manually copying them into the html file.
function appendButtons(): void {
    for (let i = 0; i < compartments.length; i++) {
        let morebutton: HTMLAnchorElement = document.createElement("a");
        let addbutton: HTMLAnchorElement = document.createElement("a");

        addbutton.href = `additem.html?compartment=${i}`;
        morebutton.href = `details.html?compartment=${i}`;

        let addbuttonimage: HTMLImageElement = document.createElement("img");
        let morebuttonimage: HTMLImageElement = document.createElement("img");

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

function clearFridge(): void {
    let htmlitems: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("compartmentitem") as HTMLCollectionOf<HTMLDivElement>;
    fridgeitemarray.clear;
    while (htmlitems.length) {
        htmlitems[0].remove();
    }
}

// Load all items from database and create Fridgeitem objects.
async function loadFromDatabase() {
    let filters: string = JSON.stringify(currentFilters);
    await sendFilterSettings("http://127.0.0.1:3000/filters", filters);
    let dbvalues: string = await requestFromDatabase("http://127.0.0.1:3000/allitems");
    let fridgeitems = JSON.parse(dbvalues);

    console.log(fridgeitems);
    clearFridge();

    // Add Fridgeitems from database to array.
    for (let item of fridgeitems) {
        let fridgeitem: Fridgeitem = new Fridgeitem(item._category, item._name, item._expirationDate, item._creationDate, item._note, item._compartment, item._id);
        if (fridgeitem.compartment() >= "0") {
            let comp: string = fridgeitem.compartment();
            let arr: Fridgeitem[] = fridgeitemarray.get(comp) || [];
            arr.push(fridgeitem);
            fridgeitemarray.set(comp, arr);
            displayItem(fridgeitem);
        }

    }
    displayItems();
    //console.log(fridgeitemarray);
}




// Display Fridgeitem in HTML.
function displayItem(fridgeitem: Fridgeitem): void {
    // Get addbutton in compartment to add in front of it.
    let morebutton: HTMLAnchorElement = document.getElementById(fridgeitem.compartment() + "m") as HTMLAnchorElement;

    // Create HTML elements.
    let itemdisplay: HTMLDivElement = document.createElement("div");
    let hyperlink: HTMLAnchorElement = document.createElement("a");
    let img: HTMLImageElement = document.createElement("img") as HTMLImageElement;
    let tooltip: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;

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
