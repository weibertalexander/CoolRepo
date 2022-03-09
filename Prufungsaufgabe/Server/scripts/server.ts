// /// <reference types="@types/node"/>
import * as http from "http";
import * as mongo from "mongodb";

const hostname: string = "127.0.0.1";
const port: number = 3000;
const mongoUrl: string = "mongodb://127.0.0.1:27017"; // für lokale MongoDB
let mongoClient: mongo.MongoClient = new mongo.MongoClient(mongoUrl);

const db: string = "fridgeitems";
const collection: string = "items";

let filtersettings: string = "";

async function dbFind(requestObject: any, response: http.ServerResponse) {
    await mongoClient.connect();
    console.log(`\tFinding item(s)`);
    let result = await mongoClient.db(db).collection(collection).find(requestObject).toArray();
    console.log(result, requestObject); // bei Fehlern zum Testen
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}

async function dbFindComp(requestObject: any, response: http.ServerResponse) {
    await mongoClient.connect();
    console.log(`\tFinding item(s)`);
    let result = ( await mongoClient.db(db).collection(collection).find(requestObject).toArray());
    console.log(result, requestObject); // bei Fehlern zum Testen
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}


async function dbAddOrEdit(request: http.IncomingMessage) {
    // Get JSON from request
    let jsonString = "";
    request.on("data", data => { jsonString += data; });
    request.on("end", async () => {
        //console.log(`adding ${jsonString}`); // bei Fehlern zum Testen
        await mongoClient.connect();

        // Parse JSON and choose collection based on category.
        let item = JSON.parse(jsonString);
        // Put item into database.
        if (item._id == null) {
            console.log("\tAdding new item to database");
            mongoClient.db(db).collection(collection).insertOne(item);
            let array = await mongoClient.db(db).collection(collection).find().toArray();
            let size = array.length;
            console.log(`\t\tLength of collection: ${size}`);

            // Replace item with the same id.
        } else {
            console.log("\tReplacing item");
            item._id = new mongo.ObjectId(item._id);
            mongoClient.db(db).collection(collection).replaceOne(
                {
                    _id: item._id
                },
                item
            );
        }
    });
}


async function dbDelete(id: string) {
    await mongoClient.connect();
    mongoClient.db(db).collection(collection).deleteOne({ _id: new mongo.ObjectId(id) });
    console.log(`\tDeleting item`);
    let size = await (await mongoClient.db(db).collection(collection).find().toArray()).length;
    console.log(`\tLength of collection: ${size}`);
}

async function dbDropDatabase() {
    await mongoClient.connect();
    mongoClient.db(db).dropDatabase();
}
//dbDropDatabase();
const server: http.Server = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let url: URL = new URL(request.url || "", `http://${request.headers.host}`);
    switch (url.pathname) {
        case "/item": {
            switch (request.method) {
                case "GET":
                    console.log("logging: /item GET");
                    await dbFind({ _id: new mongo.ObjectId(url.searchParams.get("id")!) }, response);
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
                    await dbFindComp({ _compartment: url.searchParams.get("number") }, response);
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
                    await dbDelete(url.searchParams.get("id")!);
                    break;
            }
        }
        case "/allitems": {
            switch(request.method) {
                case "GET":
                    console.log("logging: /allitems GET");
                    await dbFindFilters(response);
            }
        }
        default:
            response.statusCode = 404;
    }
    response.end();
}
);

async function setFilters(request: http.IncomingMessage) {
    let jsonString: string = "";
    console.log("\tSetting filters");
    request.on("data", data => { jsonString += data; });
    request.on("end", async () => {
        filtersettings = jsonString;
    });
}


async function dbFindFilters(response: http.ServerResponse) {
    console.log("\tLooking for items");

    await mongoClient.connect();

    // Parse filtersettings.
    let filter = JSON.parse(filtersettings);
    let name: string = filter.name;
    let categories: string[] = filter.categories;
    let expdate: Date = filter.expirationDate;

    if (name) {
        console.log("\t\tSearching with name");
        let result = await mongoClient.db(db).collection(collection).find({
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
        let result = await mongoClient.db(db).collection(collection).find({
            $and: [
                { _category: { $in: categories } },
                { _expirationDate: { $lt: expdate } },
            ]
        }).toArray();
        response.write(JSON.stringify(result));
    }
}

server.listen(port, hostname, () => {
    console.log(`~ ~ ~ Server running at http://${hostname}:${port}/ ~ ~ ~`);
});