// /// <reference types="@types/node"/>
import * as http from "http";
import * as mongo from "mongodb";

const hostname: string = "127.0.0.1";
const port: number = 3000;
const mongoUrl: string = "mongodb://127.0.0.1:27017"; // für lokale MongoDB
let mongoClient: mongo.MongoClient = new mongo.MongoClient(mongoUrl);

async function dbFind(db: string, collection: string, requestObject: any, response: http.ServerResponse) {
    await mongoClient.connect();
    let result = await mongoClient.db(db).collection(collection).find(requestObject).toArray();
    //console.log(result, requestObject); // bei Fehlern zum Testen
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}

async function dbAddOrEdit(db: string, collection: string, request: http.IncomingMessage) {
    // Get JSON from request
    let jsonString = "";
    request.on("data", data => { jsonString += data; });
    request.on("end", async () => {

        //console.log(`adding ${jsonString}`); // bei Fehlern zum Testen

        await mongoClient.connect();

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
            } else {

                mongoClient.db(db).collection(collection).replaceOne(
                    {
                        _id: item._id,
                    },
                    item
                );
            }
        // New item, add straight to database.
        } else { 
            item._id = new mongo.ObjectId();
            mongoClient.db(db).collection(collection).insertOne(item);
        }
    });
}

async function dbDelete(id: number, collection: string) {
    await mongoClient.connect();
    mongoClient.db("fridgeitem").collection(collection).deleteOne({ _id: new mongo.ObjectId(id)});
    console.log(`deleted old item from ${collection}, as it has changed location`);
}

async function dbGetAll(db: string, response: http.ServerResponse) {
    let result: string = "[";
    await mongoClient.connect();

    // Get all collections (aka categories) and iterate to get all elements.
    let collections = await mongoClient.db(db).listCollections().toArray();
    for (let i = 0; i < collections.length; i++) {
        let obj = await mongoClient.db(db).collection(collections[i].name).find().toArray();
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
}

async function dbDropDatabase() {
    await mongoClient.connect();
    mongoClient.db("fridgeitem").dropDatabase();
}

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
                    let category: string = url.searchParams.get("category")!;
                    console.log(category);
                    // Get specific item based on id.
                    await dbFind("fridgeitem", category,
                        {
                            _id: new mongo.ObjectId(url.searchParams.get("id")!), // von String zu Zahl konvertieren

                        },
                        response);
                    break;
                case "POST":
                    console.log(`post item with category: ${url.searchParams.get("collection")}`);
                    dbAddOrEdit("fridgeitem", url.searchParams.get("collection")!, request);
                    break;
            }
            break;
        }
        case "/allitems": {
            await dbGetAll("fridgeitem", response);
            break;
        }
        default:
            response.statusCode = 404;
    }
    response.end();
}
);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


