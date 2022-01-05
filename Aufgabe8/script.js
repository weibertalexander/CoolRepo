"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Simple counter to track EventPlanner elements
var id = 0;
function requestTextWithGET(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    return [2 /*return*/, text];
            }
        });
    });
}
function sendJSONStringWithPOST(url, jsonString) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, { method: "post", body: jsonString })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addDatabaseEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requestTextWithGET("http://127.0.0.1:3000/concertEvents")];
                case 1:
                    entries = _a.sent();
                    console.log(entries);
                    return [2 /*return*/];
            }
        });
    });
}
var EventPlanner = /** @class */ (function () {
    // Constructor also gives each element an ID 
    function EventPlanner(i, d, p) {
        this.interpret = i;
        this.date = d;
        this.price = p;
        this.id = id;
        id++;
        //console.log(this.asString());
    }
    // Getters
    EventPlanner.prototype.asString = function () {
        return this.interpret + " kostet " + this.price + " und findet am " + this.date + " statt. id: " + this.id;
    };
    EventPlanner.prototype.getInterpret = function () {
        return this.interpret;
    };
    EventPlanner.prototype.getDate = function () {
        return this.date;
    };
    EventPlanner.prototype.getPrice = function () {
        return this.price;
    };
    EventPlanner.prototype.getID = function () {
        return this.id.toString();
    };
    return EventPlanner;
}());
// Input variables
var interpretinput = document.getElementById("cinterpret");
var priceinput = document.getElementById("cprice");
var dateinput = document.getElementById("cdate");
// Event related variables / listeners
var events = [];
var addButton = document.getElementById("formbutton");
addButton.addEventListener("click", addEvent);
// Create new event and add it to the events array. Call helper function to display in HTML document
function addEvent() {
    // Check whether input fields are empty
    if (interpretinput.value == "" || dateinput.value == "" || priceinput.value == "") {
        alert("Bitte alle Felder ausfüllen!");
        return;
    }
    // Create the event
    var entry = new EventPlanner(interpretinput.value, dateinput.value, priceinput.value);
    events.push(entry);
    addTableEntry(entry);
    sendJSONStringWithPOST("http://127.0.0.1:3000/concertEvents", JSON.stringify(entry)); // add to db
    //Clear input fields. Commented out for easier testing.
    //interpretinput.value = "";
    //dateinput.value = "";
    //priceinput.value = "";
}
// Remove event from HTML table
function removeTableEntry(event) {
    var element = event.currentTarget;
    var parent = event.target.parentElement;
    removeEvent(element.getAttribute("data-id"));
    parent.remove();
}
// Remove event from events array
function removeEvent(itemid) {
    events.forEach(function (eventelem, index) {
        if (eventelem.getID() == itemid)
            events.splice(index, 1);
    });
    console.log(events);
}
// Create new HTML table elements to display data
function addTableEntry(eventitem) {
    // Create HTML elements
    var entry = document.createElement("tr");
    var date = document.createElement("td");
    var interpret = document.createElement("td");
    var price = document.createElement("td");
    var trash = document.createElement("td");
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
    document.getElementById("table2").appendChild(entry); // ! supresses "possibly null" error
}
