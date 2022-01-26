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
function dbFind(db, collection, requestObject, response) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        let result = yield mongoClient.db(db).collection(collection).find(requestObject).toArray();
        //console.log(result, requestObject); // bei Fehlern zum Testen
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify(result));
    });
}
function dbAddOrEdit(db, collection, request) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get JSON from request
        let jsonString = "";
        request.on("data", data => { jsonString += data; });
        request.on("end", () => __awaiter(this, void 0, void 0, function* () {
            //console.log(`adding ${jsonString}`); // bei Fehlern zum Testen
            yield mongoClient.connect();
            // Parse JSON and choose collection based on category.
            let item = JSON.parse(jsonString);
            //console.log(item);
            // Replace item in database as it has an id.
            if (item._id && item._id != "") {
                // Item category has changed. Delete old entry and create new one.
                if (collection != item._category) {
                    console.log(typeof item._id);
                    dbDelete(item._id, collection);
                    item._id = new mongo.ObjectId();
                    mongoClient.db(db).collection(item._category).insertOne(item);
                    // Item category has not changed, replace old entry with new one.
                }
                else {
                    mongoClient.db(db).collection(collection).replaceOne({
                        _id: item._id,
                    }, item);
                }
                // New item, add straight to database.
            }
            else {
                item._id = new mongo.ObjectId();
                mongoClient.db(db).collection(collection).insertOne(item);
            }
        }));
    });
}
function dbDelete(id, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        mongoClient.db("fridgeitem").collection(collection).deleteOne({ _id: new mongo.ObjectId(id) });
        console.log(`deleted old item from ${collection}, as it has changed location`);
    });
}
function dbGetAll(db, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = "[";
        yield mongoClient.connect();
        // Get all collections (aka categories) and iterate to get all elements.
        let collections = yield mongoClient.db(db).listCollections().toArray();
        for (let i = 0; i < collections.length; i++) {
            let obj = yield mongoClient.db(db).collection(collections[i].name).find().toArray();
            for (let j = 0; j < obj.length; j++) {
                result += JSON.stringify(obj[j]);
                if (i < collections.length - 1 || j < obj.length - 1) {
                    result += ", ";
                }
            }
            // Send database contents to server.
            response.setHeader("Content-Type", "application/json");
        }
        result += "]";
        response.write(result);
    });
}
function dbDropDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoClient.connect();
        mongoClient.db("fridgeitem").dropDatabase();
    });
}
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
                    let category = url.searchParams.get("category");
                    console.log(category);
                    // Get specific item based on id.
                    yield dbFind("fridgeitem", category, {
                        _id: new mongo.ObjectId(url.searchParams.get("id")), // von String zu Zahl konvertieren
                    }, response);
                    break;
                case "POST":
                    console.log(`post item with category: ${url.searchParams.get("collection")}`);
                    dbAddOrEdit("fridgeitem", url.searchParams.get("collection"), request);
                    break;
            }
            break;
        }
        case "/allitems": {
            yield dbGetAll("fridgeitem", response);
            break;
        }
        default:
            response.statusCode = 404;
    }
    response.end();
}));
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
