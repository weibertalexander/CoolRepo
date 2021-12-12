let dateelem: HTMLInputElement = <HTMLInputElement>document.getElementById("date");
let sendbutton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("send");
let datecontainer: HTMLElement = <HTMLElement>document.getElementById("datecontainer");

sendbutton.addEventListener("click", sendToServer);

function createHTMLElem(datestring: string): void{
    let paragraph: HTMLElement = document.createElement("p");
    paragraph.textContent = datestring;
    datecontainer.appendChild(paragraph);
}

async function requestTextWithGET(url: RequestInfo): Promise<string> {
    let response: Response = await fetch(url);
    let text: string = await response.text();
    return text;
  }

async function sendToServer() {
    let date: string = JSON.stringify(dateelem.value);
    //console.log(dateelem.value);
    let serverresponse : string = await requestTextWithGET(`http://localhost:3000/convertDate?date=${date}`);
    createHTMLElem(serverresponse);
}