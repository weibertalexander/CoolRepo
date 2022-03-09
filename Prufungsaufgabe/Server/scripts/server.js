"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// /// <reference types="@types/node"/>
const http = __importStar(require("http"));
const mongo = __importStar(require("mongodb"));
const hostname = "127.0.0.1";
const port = 3000;
const mongoUrl = "mongodb://127.0.0.1:27017"; // für lokale MongoDB
let mongoClient = new mongo.MongoClient(mongoUrl);
const db = "fridgeitems";
const collection = "items";
let filtersettings = "";
function dbFind(requestObject, response) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        console.log(`\tFinding item(s)`);
        let result = yield mongoClient.db(db).collection(collection).find(requestObject).toArray();
        console.log(result, requestObject); // bei Fehlern zum Testen
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify(result));
    });
}
function dbFindComp(requestObject, response) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        console.log(`\tFinding item(s)`);
        let result = (yield mongoClient.db(db).collection(collection).find(requestObject).toArray());
        console.log(result, requestObject); // bei Fehlern zum Testen
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify(result));
    });
}
function dbAddOrEdit(request) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get JSON from request
        let jsonString = "";
        request.on("data", data => { jsonString += data; });
        request.on("end", () => __awaiter(this, void 0, void 0, function* () {
            //console.log(`adding ${jsonString}`); // bei Fehlern zum Testen
            yield mongoClient.connect();
            // Parse JSON and choose collection based on category.
            let item = JSON.parse(jsonString);
            // Put item into database.
            if (item._id == null) {
                console.log("\tAdding new item to database");
                mongoClient.db(db).collection(collection).insertOne(item);
                let array = yield mongoClient.db(db).collection(collection).find().toArray();
                let size = array.length;
                console.log(`\t\tLength of collection: ${size}`);
                // Replace item with the same id.
            }
            else {
                console.log("\tReplacing item");
                item._id = new mongo.ObjectId(item._id);
                mongoClient.db(db).collection(collection).replaceOne({
                    _id: item._id
                }, item);
            }
        }));
    });
}
function dbDelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        mongoClient.db(db).collection(collection).deleteOne({ _id: new mongo.ObjectId(id) });
        console.log(`\tDeleting item`);
        let size = yield (yield mongoClient.db(db).collection(collection).find().toArray()).length;
        console.log(`\tLength of collection: ${size}`);
    });
}
function dbDropDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        mongoClient.db(db).dropDatabase();
    });
}
//dbDropDatabase();
const server = http.createServer((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    let url = new URL(request.url || "", `http://${request.headers.host}`);
    switch (url.pathname) {
        case "/item": {
            switch (request.method) {
                case "GET":
                    console.log("logging: /item GET");
                    yield dbFind({ _id: new mongo.ObjectId(url.searchParams.get("id")) }, response);
                    break;
                case "POST":
                    console.log("logging: /item POST");
                    dbAddOrEdit(request);
                    break;
            }
            break;
        }
        case "/compartment": {
            console.log("logging: /compartment GET");
            switch (request.method) {
                case "GET":
                    console.log(url.searchParams.get("number"));
                    yield dbFindComp({ _compartment: url.searchParams.get("number") }, response);
                    break;
            }
            break;
        }
        case "/filters": {
            switch (request.method) {
                case "POST":
                    console.log("logging: /filters POST");
                    setFilters(request);
                    break;
            }
            break;
        }
        case "/delete": {
            switch (request.method) {
                case "GET":
                    console.log("logging: /delete GET");
                    yield dbDelete(url.searchParams.get("id"));
                    break;
            }
        }
        case "/allitems": {
            switch (request.method) {
                case "GET":
                    console.log("logging: /allitems GET");
                    yield dbFindFilters(response);
            }
        }
        default:
            response.statusCode = 404;
    }
    response.end();
}));
function setFilters(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let jsonString = "";
        console.log("\tSetting filters");
        request.on("data", data => { jsonString += data; });
        request.on("end", () => __awaiter(this, void 0, void 0, function* () {
            filtersettings = jsonString;
        }));
    });
}
function dbFindFilters(response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\tLooking for items");
        yield mongoClient.connect();
        // Parse filtersettings.
        let filter = JSON.parse(filtersettings);
        let name = filter.name;
        let categories = filter.categories;
        let expdate = filter.expirationDate;
        if (name) {
            console.log("\t\tSearching with name");
            let result = yield mongoClient.db(db).collection(collection).find({
                $and: [
                    { _name: new RegExp('^' + name) },
                    { _category: { $in: categories } },
                    { _expirationDate: { $lt: expdate } },
                ]
            }).toArray();
            console.log(result);
            response.write(JSON.stringify(result));
        }
        else {
            console.log("\t\tSearching without name");
            let result = yield mongoClient.db(db).collection(collection).find({
                $and: [
                    { _category: { $in: categories } },
                    { _expirationDate: { $lt: expdate } },
                ]
            }).toArray();
            response.write(JSON.stringify(result));
        }
    });
}
server.listen(port, hostname, () => {
    console.log(`~ ~ ~ Server running at http://${hostname}:${port}/ ~ ~ ~`);
});
