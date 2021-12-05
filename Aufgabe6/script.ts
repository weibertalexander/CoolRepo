class Timer {
    // Time components
    private _minutes: number;
    private _seconds: number;
    private _milli: number;

    constructor() {
        this._minutes = 0;
        this._seconds = 0;
        this._milli = 0;
    }


    // Add given number of ms to the timer, then refactor
    public addTime(ms: number): void {
        this._milli += ms;
        this.refactor();
    }

    // Add leading zero if any of the components are only 1 digit long
    public toString(): string {
        let result: string;
        result = (this._minutes % 100 > 9) ? "" + this._minutes : "0" + this._minutes;
        result += (this._seconds % 100 > 9) ? ":" + this._seconds : ":0" + this._seconds;
        result += (this._milli % 1000 > 99) ? "." + Math.floor(this._milli / 10) : ".0" + Math.floor(this._milli / 10);
        return result;
    }

    // Turn milliseconds into seconds and seconds into minutes (if big enough)
    private refactor(): void {
        if (this._milli >= 1000) {
            this._seconds++;
            this._milli -= 1000;
        }
        if (this._seconds >= 60) {
            this._minutes++;
            this._seconds -= 60;
        }
    }
}

let timerstorage: string[] = [];

class TimerStorage {
    static storeTimer(): void {
        localStorage.setItem("stopwatch", JSON.stringify(timerstorage));
    }

    static loadTimer(): void {
        let timerJSON: string = JSON.parse(localStorage.getItem("stopwatch") || "[]");
        for (let timer of timerJSON) {
            console.log(timer);
            addToTable(timer);
        }
    }
}

TimerStorage.loadTimer();

// Get references for DOM manipulation
let timedisplay: HTMLElement = document.getElementById("timedisplay");

let startButton: HTMLElement = document.getElementById("start");
let roundButton: HTMLElement = document.getElementById("round");
let resetButton: HTMLElement = document.getElementById("reset");

// Timer related
let t: Timer = new Timer();
let interval: number;

// Add event listeners
startButton.addEventListener("click", startTime);
roundButton.addEventListener("click", storeTime);
resetButton.addEventListener("click", reset);

roundButton.hidden = true;  // Hide round button

function startTime(): void {
    clearInterval(interval);  // Clear in case the interval is running
    
    if (startButton.getAttribute("data-state") == "off") {
        roundButton.hidden = false;  // Make round button visible
        resetButton.hidden = true;
        // Every 10 ms add 10 to timer, display the elapsed time
        interval = setInterval(function (): void {
            t.addTime(10);
            timedisplay.textContent = t.toString();
        }, 10);
        
        // Set attributes to be able to turn off the timer
        startButton.setAttribute("data-state", "on");
        startButton.textContent = "stop";
    } else {
        // Turn the button off (and display it correctly)
        startButton.setAttribute("data-state", "off");
        startButton.textContent = "start";
        resetButton.hidden = false;
        roundButton.hidden = true;
    }
}

function storeTime(): void {
    let newtimer: string = t.toString();
    console.log(newtimer);
    timerstorage.push(newtimer);
    TimerStorage.storeTimer();
    addToTable(newtimer);
}

function addToTable(timer: string): void {
    let newrow: HTMLTableRowElement = document.createElement("tr");
    let newtime: HTMLTableCellElement = document.createElement("td");

    newtime.textContent = timer;
    newrow.appendChild(newtime);

    document.getElementById("table").appendChild(newrow);
}

function reset(): void {
    if (startButton.getAttribute("data-state") == "off") {
        roundButton.hidden = true;
        t = new Timer();
        timedisplay.textContent = t.toString();
        timerstorage = [];
        TimerStorage.storeTimer();
        deleteTable();
    }
}

function deleteTable(): void {
    document.getElementById("table").replaceChildren();
}

