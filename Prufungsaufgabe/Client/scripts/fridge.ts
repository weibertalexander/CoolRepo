class Fridgeitem {
    private _category: string;
    private _name: string;
    private _expirationDate: number;
    private _creationDate: number;
    private _note: string;
    private _compartment: string;
    private _id?: number;  // ID is given by mongoDB

    constructor(category: string, name: string, expdate: number, curedate: number, note: string, comp: string, id?: number) {
        this._category = category;
        this._name = name;
        this._expirationDate = expdate;
        this._creationDate = curedate;
        this._note = note;
        this._compartment = comp;
        this._id = id;
    }

    // Getters
    public category(): string {
        return this._category;
    }

    public name(): string {
        return this._name;
    }

    public expirationDate(): number {
        return this._expirationDate
    }

    public creationDate(): number {
        return this._creationDate;
    }

    public note(): string {
        return this._note;
    }

    public compartment(): string {
        return this._compartment;
    }

    public id(): number {
        return this._id!;
    }

    // Generate JSON string of this object.
    public asJSONstring(): string {
        return JSON.stringify(this);
    }
}

// Number of available compartments.
const compartmentcount: number = 28;

// Create empty 2D Array to store the corresponding Fridgeitem.
let fridgeitemarray: Map<string, Fridgeitem[]> = new Map<string, Fridgeitem[]>();

