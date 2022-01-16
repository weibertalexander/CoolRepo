// Retrieve the compartment number and generate text.
function displayComparment(): void {
    let displaydiv: HTMLDivElement = document.getElementById("displaycompartment") as HTMLDivElement;

    let textelem: HTMLElement = document.createElement("h1");
    let params: URLSearchParams = new URLSearchParams(window.location.search);
    
    // Add 1 to the compartment number, as index starts at 0. If its null, set it to -1.
    let compnumber: number = +(params.get("compartment") || "-1") + 1;
    textelem.textContent = `Add item to compartment ${compnumber}`;

    displaydiv.prepend(textelem);
}

displayComparment();