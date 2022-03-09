//#region Display and Input

// Get HTML input fields.
let nameinput: HTMLInputElement = document.getElementById("i_name") as HTMLInputElement;
let expdateinput: HTMLInputElement = document.getElementById("i_expire") as HTMLInputElement;
let noteinput: HTMLInputElement = document.getElementById("i_note") as HTMLInputElement;

// Display text and fill out input fields (if an item is being edited).
async function display(): Promise<void> {
    let displaydiv: HTMLDivElement = document.getElementById("displaycompartment") as HTMLDivElement;

    // Create HTML Element and get search parameter for compartment.
    let textelem: HTMLElement = document.createElement("h1");
    let params: URLSearchParams = new URLSearchParams(window.location.search);

    // Add 1 to the compartment number (display only), as index starts at 0. If its null, set it to -1.    
    let compnumber: number = +(params.get("compartment") || "-1") + 1;  // "+" turns it into a number.

    // Check if items are to be added or edited.
    if (params.get("itemid") != null) {
        // Get item from server
        let request: string = await requestFromDatabase(`http://127.0.0.1:3000/item?id=${params.get("itemid")}`);
        let item = JSON.parse(request);

        textelem.textContent = `Editing ${item[0]._name} from compartment number ${compnumber}`;

        // Convert string to correct format to use in input field.
        let datevalue: string = new Date(item[0]._expirationDate).toISOString();

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
}

display();

// Get the value of active radio button.
function getCategory(): string {
    let radio: HTMLInputElement = document.querySelector('input[name="category"]:checked')!;
    return radio.value;
}

// Set the value of a radio button.
function setCategory(category: string): void {
    let radio: HTMLInputElement = document.querySelector(`input[value=${category}]`)!;
    radio.checked = true;
}
//#endregion Display and Input

//#region Add button

// Button functionality.
let addbutton: HTMLButtonElement = document.getElementById("additembutton") as HTMLButtonElement;

addbutton.addEventListener("click", addItem);

async function addItem(): Promise<void> {
    // Get input field values.
    let categv: string = getCategory();
    let namev: string = nameinput.value;
    let expv: string = expdateinput.value;
    let notev: string = noteinput.value;

    // Check if any input fields are empty and alert if necessary.
    if (categv == null || categv == "" || namev == null || namev == "" || expv == null || expv == "" || notev == null || notev == "") {
        alert("Please fill out every input field.");
        return;
    }

    // Create new Fridgeitem object.
    let expdate: number = new Date(expv).getTime();
    let curdate: number = new Date().getTime();

    // Get url parameters.
    let params: URLSearchParams = new URLSearchParams(window.location.search);
    let comp: string = params.get("compartment")!;

    let item: Fridgeitem;

    // As this item is being edited, get the original item from database.
    if (params.get("itemid") != null) {
        let text: string = await requestFromDatabase(`http://127.0.0.1:3000/item?id=${params.get("itemid")}`);
        let olditem = JSON.parse(text);
        item = new Fridgeitem(categv, namev, expdate, olditem[0]._creationDate, notev, comp, olditem[0]._id);
    }
    else {
        item = new Fridgeitem(categv, namev, expdate, curdate, notev, comp);
    }

    // Send item to server via POST and redirect to overview page.
    await sendJSONStringWithPOST(`http://127.0.0.1:3000/item`, item.asJSONstring());
    window.location.href = "http://127.0.0.1:5500/Client/overview.html";
}
//#endregion

//#region Delete Button

let deletebutton: HTMLButtonElement = document.getElementById("deleteitembutton") as HTMLButtonElement;
deletebutton.addEventListener("click", deleteItem);

async function deleteItem(): Promise<void> {
    console.log("delete");
    let params: URLSearchParams = new URLSearchParams(window.location.search);
    let id: string = params.get("itemid")!;
    await fetch(`http://127.0.0.1:3000/delete?id=${id}`);
    window.location.href = "http://127.0.0.1:5500/Client/overview.html";
}