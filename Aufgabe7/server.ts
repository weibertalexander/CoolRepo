import * as http from "http";
const hostname: string = "127.0.0.1"; // localhost
const port: number = 3000;

const server: http.Server = http.createServer(
    (request: http.IncomingMessage, response: http.ServerResponse) => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/plain");

        response.setHeader('Access-Control-Allow-Origin', '*'); // bei CORS Fehler 

        let url: URL = new URL(request.url || "", `http://${request.headers.host}`);
        switch (url.pathname) {
            case "/":
                response.end("Server erreichbar");
                break;
            case "/convertDate":
                let givendate: string = url.searchParams.get("date") || "";
                response.end(convertDate(givendate))
                break;
        }
    }
);

function convertDate(date: string): string {
    console.log(date);
    // Creating new Date object with the date string did not work, as month for example is 0-based.
    return "Day: " + date.substring(9, 11) + ", Month: " + date.substring(6, 8) + ", Year: " + date.substring(1, 5);
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
