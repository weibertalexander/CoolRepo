let infotable: HTMLDivElement = document.getElementById("infotable") as HTMLDivElement;

let params: URLSearchParams = new URLSearchParams(window.location.search);

getFromDatabase();
async function getFromDatabase(): Promise<void> {
    let items;
    console.log(params.get("itemid") == null);
    // Get one item from database.
    if (params.get("itemid") != null || "") {
        console.log(params.get("itemid"));
        let response: string = await requestFromDatabase(`http://127.0.0.1:3000/item?id=${params.get("itemid")}`);
        items = JSON.parse(response)[0];
        let newitem: Fridgeitem = new Fridgeitem(items._category, items._name, items._expirationDate, items._creationDate, items._note, items._compartment, items._id);
        console.log(newitem);
        displayInfo(newitem);
    }
    else if (params.get("compartment") != null || "") {
        console.log(params.get("compartment"));
        let response: string = await requestFromDatabase(`http://127.0.0.1:3000/compartment?number=${params.get("compartment")}`);
        console.log(response);
        items = JSON.parse(response);
        for (let item of items) {
            let newitem: Fridgeitem = new Fridgeitem(item._category, item._name, item._expirationDate, item._creationDate, item._note, item._compartment, item._id);
            displayInfo(newitem);
        }
    }
}

function displayInfo(item: Fridgeitem): void {
    let fulltable: HTMLTableElement = document.createElement("table") as HTMLTableElement;

    let tablerowicons: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let icon: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let iconimg: HTMLImageElement = document.createElement("img") as HTMLImageElement;

    tablerowicons.appendChild(icon);
    fulltable.appendChild(tablerowicons);

    let tablerownames: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let nametext: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let name: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;

    tablerownames.appendChild(nametext);
    tablerownames.appendChild(name);
    fulltable.appendChild(tablerownames);

    let tablerowcateg: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let categorytext: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let category: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;

    tablerowcateg.appendChild(categorytext);
    tablerowcateg.appendChild(category);
    fulltable.appendChild(tablerowcateg);

    let tablerowexpdt: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let expirationtext: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let expiration: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;

    tablerowexpdt.appendChild(expirationtext);
    tablerowexpdt.appendChild(expiration);
    fulltable.appendChild(tablerowexpdt);

    let tablerownote: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let notetext: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let note: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;

    tablerownote.appendChild(notetext);
    tablerownote.appendChild(note);
    fulltable.appendChild(tablerownote);

    let tablerowcreat: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let creationtext: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let creation: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;

    tablerowcreat.appendChild(creationtext);
    tablerowcreat.appendChild(creation);
    fulltable.appendChild(tablerowcreat);

    let buttontr: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
    let buttontd: HTMLTableCellElement = document.createElement("td") as HTMLTableCellElement;
    let buttondiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;

    let editbutton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
    let deletebutton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;

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

function editFridgeitem(event: Event): void {
    let ebutton: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
    window.location.href = `http://127.0.0.1:5500/Client/additem.html?itemid=${ebutton.getAttribute("data-id")}`;
}

async function deleteFridgeitem(event: Event): Promise<void> {
    let dbutton: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
    await fetch(`http://12.0.0.1:3000/delete?id=${dbutton.getAttribute("data-id")}`);

}