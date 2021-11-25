// Simple counter to track EventPlanner elements
let id: number = 0;

class EventPlanner {
    // Data
    private interpret: string;
    private date: string;
    private price: string;
    private id: number;

    // Constructor also gives each element an ID 
    constructor(i: string, d: string, p: string) {
        this.interpret = i;
        this.date = d;
        this.price = p;
        this.id = id;
        id++;
        console.log(this.asString());
    }

    // Getters
    asString(): string {
        return `${this.interpret} kostet ${this.price} und findet am ${this.date} statt. id: ${this.id}`;
    }

    getInterpret(): string {
        return this.interpret;
    }

    getDate(): string {
        return this.date;
    }

    getPrice(): string {
        return this.price;
    }

    getID(): string {
        return this.id.toString();
    }
}

// Input variables
let interpretinput: HTMLInputElement = document.getElementById("cinterpret") as HTMLInputElement;
let priceinput: HTMLInputElement = document.getElementById("cprice") as HTMLInputElement;
let dateinput: HTMLInputElement = document.getElementById("cdate") as HTMLInputElement;

// Event related variables / listeners
let events: EventPlanner[] = [];
let addButton: HTMLElement = document.getElementById("formbutton");
addButton.addEventListener("click", addEvent);

// Create new event and add it to the events array. Call helper function to display in HTML document
function addEvent(): void {
    // Check whether input fields are empty
    if (interpretinput.value == "" || dateinput.value == "" || priceinput.value == "") {
        alert("Bitte alle Felder ausfüllen!");
        return;
    }
    // Create the event
    let entry: EventPlanner = new EventPlanner(interpretinput.value, dateinput.value, priceinput.value);
    events.push(entry);
    addTableEntry(entry);

    //Clear input fields. Commented out for easier testing.
    //interpretinput.value = "";
    //dateinput.value = "";
    //priceinput.value = "";
}

// Remove event from HTML table
function removeTableEntry(event: Event): void {
    let element: HTMLElement = <HTMLElement>event.currentTarget;
    let parent: HTMLElement = ( <HTMLElement>event.target ).parentElement;
    removeEvent(element.getAttribute("data-id"));
    parent.remove();
}

// Remove event from events array
function removeEvent(itemid: string): void {
    events.forEach( (eventelem, index) => {
        if (eventelem.getID() == itemid) events.splice(index, 1);
    });
    console.log(events);
}

// Create new HTML table elements to display data
function addTableEntry(eventitem: EventPlanner): void {
    // Create HTML elements
    let entry: HTMLTableRowElement =      document.createElement("tr");
    let date: HTMLTableCellElement =      document.createElement("td");
    let interpret: HTMLTableCellElement = document.createElement("td");
    let price: HTMLTableCellElement =     document.createElement("td");
    let trash: HTMLTableCellElement =     document.createElement("td");

    // Data collection
    date.innerHTML = eventitem.getDate();
    interpret.innerHTML = eventitem.getInterpret();
    price.innerHTML = eventitem.getPrice();

    // Add trash functionality
    trash.setAttribute("class", "trash");
    trash.setAttribute("data-id", eventitem.getID());
    trash.addEventListener("click", removeTableEntry);

    // Build HTML table row element
    entry.appendChild(date);
    entry.appendChild(interpret);
    entry.appendChild(price);
    entry.appendChild(trash);

    // Display on website
    document.getElementById("table2").appendChild(entry);
}