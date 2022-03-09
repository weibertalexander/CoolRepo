"use strict";
class Fridgeitem {
    constructor(category, name, expdate, curedate, note, comp, id) {
        this._category = category;
        this._name = name;
        this._expirationDate = expdate;
        this._creationDate = curedate;
        this._note = note;
        this._compartment = comp;
        this._id = id;
    }
    // Getters
    category() {
        return this._category;
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
    id() {
        return this._id;
    }
    // Generate JSON string of this object.
    asJSONstring() {
        return JSON.stringify(this);
    }
}
// Number of available compartments.
const compartmentcount = 28;
// Create empty 2D Array to store the corresponding Fridgeitem.
let fridgeitemarray = new Map();
