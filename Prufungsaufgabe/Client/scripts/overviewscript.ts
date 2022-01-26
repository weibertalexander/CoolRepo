let closedfridgeimg: HTMLInputElement = document.getElementById("closedimg") as HTMLInputElement;
let openedfridgeimg: HTMLImageElement = document.getElementById("openedimg") as HTMLImageElement;
let openedfridgediv: HTMLDivElement = document.getElementById("openedfridgecontainer") as HTMLDivElement;
let compartments: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("compartment") as HTMLCollectionOf<HTMLDivElement>;

const maxitemdisplay: number = 3;

// Display only set amount of items to avoid overflow. Toggle the "more items button" if not all items are shown.
function displayItems(): void {
    compartments = document.getElementsByClassName("compartment") as HTMLCollectionOf<HTMLDivElement>;
    for (let comp of compartments) {
        // Get every HTML element with class compartmentitem that is being 
        let visibleitems: HTMLDivElement[] = Array.from(comp.querySelectorAll(`.compartmentitem`) as NodeListOf<HTMLDivElement>);
        let itemamount: number = visibleitems.length;
        console.log(itemamount);
        let morebutton: HTMLAnchorElement = comp.querySelector(`[data-id]`) as HTMLAnchorElement;
        let active = 0;
        for (let item of visibleitems) {
            if (active < maxitemdisplay && toggleIconView(item)) {
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
    setInterval(dynamicResize, 50);
    appendButtons();
    displayItems();
}

// Add filters.
let filterbuttons: HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName("filter") as HTMLCollectionOf<HTMLInputElement>;
let filters = new Map<string, boolean>();

// Initialize category filters and add event listeners to buttons.
for (let b of filterbuttons) {
    filters.set(b.value, b.checked);
    b.addEventListener("click", updateCategoryFilters);
}

// Turn on/off category filter if button is pressed.
function updateCategoryFilters(event: Event) {
    let filterbutton: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    let category: string = filterbutton.value;
    let checked: boolean = filterbutton.checked;
    console.log(`${category} is ${checked}`);

    filters.set(category, checked);
    displayItems();
}

function nameFilterSubstring(name: string): boolean {
    let namefilterinput: HTMLInputElement = document.getElementById("namefilter") as HTMLInputElement;
    let substring: string = name.substring(0, namefilterinput.value.length);
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
let nameFilterOn: boolean = false;
let namefilterinput: HTMLInputElement = document.getElementById("namefilter") as HTMLInputElement;
namefilterinput.addEventListener("input", toggleNameFilter);

function toggleNameFilter(event: Event): void {
    console.log("inputfield is being edited");
    let inputfield: HTMLInputElement = event.target as HTMLInputElement
    if (inputfield.value != "" || null) {
        nameFilterOn = true;
    } else {
        nameFilterOn = false;
    }
    displayItems();
}
// Show / hide items based on filter settings.
function toggleIconView(item: HTMLDivElement): boolean {
    let itemname: string = item.getAttribute("data-name") || "";
    let itemcategory: string = item.getAttribute("data-category")!;

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
            return false;
        }
    }
}

// Dynamically resize openedfridgediv to make it fit the fridge image size.
function dynamicResize(): void {
    openedfridgediv.style.width = openedfridgeimg.width.toString() + "px";
    openedfridgediv.style.height = openedfridgeimg.height.toString() + "px";
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
async function loadFromDatabase() {
    let dbtext = await requestTextWithGET("http://127.0.0.1:3000/allitems");
    let fridgeitems = JSON.parse(dbtext);

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


loadFromDatabase();

// Display Fridgeitem in HTML.
function displayItem(fridgeitem: Fridgeitem): void {
    // Get addbutton in compartment to add in front of it.
    let addbutton: HTMLAnchorElement = document.getElementById(fridgeitem.compartment()) as HTMLAnchorElement;

    // Create HTML elements.
    let itemdisplay: HTMLDivElement = document.createElement("div");
    let hyperlink: HTMLAnchorElement = document.createElement("a");
    let img: HTMLImageElement = document.createElement("img") as HTMLImageElement;

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
