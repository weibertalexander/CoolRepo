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
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var hostname = "127.0.0.1"; // localhost
var port = 3000;
var server = http.createServer(function (request, response) {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.setHeader('Access-Control-Allow-Origin', '*'); // bei CORS Fehler 
    var url = new URL(request.url || "", "http://" + request.headers.host);
    switch (url.pathname) {
        case "/":
            response.end("Server erreichbar");
            break;
        case "/convertDate":
            var givendate = url.searchParams.get("date") || "";
            response.end(convertDate(givendate));
            break;
    }
});
function convertDate(date) {
    console.log(date);
    return "Day: " + date.substring(9, 11) + ", Month: " + date.substring(6, 8) + ", Year: " + date.substring(1, 5);
}
server.listen(port, hostname, function () {
    console.log("Server running at http://" + hostname + ":" + port + "/");
});
