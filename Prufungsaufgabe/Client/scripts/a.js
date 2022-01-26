"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fridge = void 0;
var Fridge;
(function (Fridge) {
    class Fridgeitem {
        constructor(color, name, expdate, curedate, note, comp) {
            this._color = color;
            this._name = name;
            this._expirationDate = expdate;
            this._creationDate = curedate;
            this._note = note;
            this._compartment = comp;
        }
        // Getters
        color() {
            return this._color;
        }
        name() {
            return this._name;
        }
        expirationDate() {
            return this._expirationDate;
        }
        creationDate() {
            return this._creationDate;
        }
        note() {
            return this._note;
        }
        compartment() {
            return this._compartment;
        }
        // Generate JSON string of this object.
        asJSONstring() {
            return JSON.stringify(this);
        }
    }
    Fridge.Fridgeitem = Fridgeitem;
})(Fridge = exports.Fridge || (exports.Fridge = {}));
