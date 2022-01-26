// Retrieve the compartment number and generate text.
async function display(): Promise<void> {
    let displaydiv: HTMLDivElement = document.getElementById("displaycompartment") as HTMLDivElement;

    // Create HTML Element and get search parameter for compartment.
    let textelem: HTMLElement = document.createElement("h1");
    let params: URLSearchParams = new URLSearchParams(window.location.search);

    // Check if items are to be added or edited.
    if (params.get("itemid") != null) {
        textelem.textContent = "Editing item";

        // Get item from server
        let request: string = await requestTextWithGET(`http://127.0.0.1:3000/item?id=${params.get("itemid")}&category=${params.get("category")}`);
        let item = JSON.parse(request);

        nameinput.value = item[0]._name;

        // Split at T to get DD-MM-YYYY
        expdateinput.value = item[0]._expirationDate.split('T')[0];

        noteinput.value = item[0]._note;

        setCategory(item[0]._category);
    }
    if (params.get("itemid") == null) {
        // Add 1 to the compartment number (display only), as index starts at 0. If its null, set it to -1.    
        let compnumber: number = +(params.get("compartment") || "-1") + 1;
        textelem.textContent = `Add item to compartment ${compnumber}`;
    }

    displaydiv.prepend(textelem);
}

display();

// Get HTML input fields + addbutton.
let nameinput: HTMLInputElement = document.getElementById("i_name") as HTMLInputElement;
let expdateinput: HTMLInputElement = document.getElementById("i_expire") as HTMLInputElement;
let noteinput: HTMLInputElement = document.getElementById("i_note") as HTMLInputElement;
let addbutton: HTMLButtonElement = document.getElementById("additembutton") as HTMLButtonElement;

// Get the value of active radio button. Only call when item should be added to database. 
function getCategory(): string {
    let radio: HTMLInputElement = document.querySelector('input[name="category"]:checked')!;
    console.log(radio.value);
    return radio.value;
}

function setCategory(category: string): void {
    let radio: HTMLInputElement = document.querySelector(`input[value=${category}]`)!;
    radio.checked = true;
}

// Button functionality.
addbutton.addEventListener("click", addItem);

function addItem(): void {
    // Get input field values.
    let categv: string = getCategory();
    //console.log(categv);
    let namev: string = nameinput.value;
    let expv: string = expdateinput.value;
    let notev: string = noteinput.value;

    // Check if any input fields are empty and alert if necessary.
    if (categv == null || categv == "" || namev == null || namev == "" || expv == null || expv == "" || notev == null || notev == "") {
        alert("Please fill out every input field.");
        return;
    }

    // Create new Fridgeitem object.
    let expdate: Date = new Date(expv);
    let curdate: Date = new Date();
    
    let params: URLSearchParams = new URLSearchParams(window.location.search);
    let comp: string = params.get("compartment")!;

    let item: Fridgeitem;
    let url: string;
    
    if (params.get("itemid") != null) {
        url = `http://127.0.0.1:3000/item?collection=${params.get("category")}`;
        item = new Fridgeitem(categv, namev, expdate, curdate, notev, comp, params.get("itemid")!);
    
    }
    else {
        url = `http://127.0.0.1:3000/item?collection=${categv}`;
        item = new Fridgeitem(categv, namev, expdate, curdate, notev, comp);
    }
    
    console.log(url);
    
    // Send item to server via POST
    sendJSONStringWithPOST(url, item.asJSONstring());

}
