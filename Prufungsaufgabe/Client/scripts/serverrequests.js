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
// Request from server.
function sendFilterSettings(url, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(url, { method: "post", body: filters });
    });
}
function requestFromDatabase(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(url);
        let text = yield response.text();
        return text;
    });
}
function sendJSONStringWithPOST(url, jsonString) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(url, { method: "post", body: jsonString });
    });
}
