// Request from server.
async function sendFilterSettings(url: RequestInfo, filters: string): Promise<void> {
    let response: Response = await fetch(url, { method: "post", body: filters});
}

async function requestFromDatabase(url: RequestInfo): Promise<string> {
    let response: Response = await fetch(url);
    let text: string = await response.text();
    return text;
}

async function sendJSONStringWithPOST(url: RequestInfo, jsonString: string): Promise<void> {
    await fetch(url, { method: "post", body: jsonString });
}