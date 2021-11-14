"use strict";
// -- [Aufgabe 1]
/**
 * @var {number} age: Bitte anstatt der 24 dein Alter eintragen
 */
let age = 21;
/**
 * @var {string} firstName: Bitte anstatt 'Max' deinen Vornamen eintragen
 */
let firstName = `Alex`;
function func1(age) {
    return 2021 - age;
}
let output = func2(firstName);
console.log(output);
function func3(meal) {
    console.log(`Ich esse gerne ${meal || "Pizza"}.`);
    return func1(age) > 1995
        ? `Ich gehöre zur Generation Z`
        : `Ich gehöre zur Generation Y`;
}
function func2(name) {
    console.log(`Ich heiße ${name}.`);
    return func3();
}
/* -- HIER BITTE IHRE LÖSUNG ZUR AUFGABE 1 EINTRAGEN
 *  Ich heiße Alex.
 *  Ich esse gerne Pizza.
 *  Ich gehöre zur Generation Z.
 */
// -- [Aufgabe 2]
let events = [
    ["Mark Knopfler", 10.1],
    ["Pink Floyd", 15.9],
    ["Metallica", 20.1],
    ["Michael Bublé", 11.1],
    ["Dire Straits", 12.2],
    ["Mariah Carey", 1.1],
    ["Cat Stevens", 12.99],
    ["Mark Forster", 2.1],
    ["Helene Fischer", 3.1],
    ["Bee Gees", 25.2],
];
// -- HIER BITTE IHRE LÖSUNG ZUR AUFGABE 2 EINTRAGEN
// Lösung a) ...
let laenge = events.length;
console.log(`Es gibt ${laenge} Elemente im Array.`);
// Lösung b) ...
for (let i = 0; i < laenge; i++) {
    console.log(`Interpret: ` + events[i][0] + ` Preis: ` + events[i][1]);
}
// Lösung c) ...
function highest(arr) {
    let max = arr[0][1];
    for (let i = 0; i < arr.length; i++) {
        if (max < arr[i][1]) {
            max = arr[i][1];
        }
    }
    return max;
}
console.log(highest(events));
// Lösung d) ...
function find(arr, name) {
    for (let i = 0; i < arr.length; i++) {
        if (name == arr[i][0]) {
            return true;
        }
    }
    return false;
}
console.log(find(events, "Metallica"));
console.log(find(events, "Deine Mutter"));
// Lösung e) ...
function factorial(n) {
    let result = n;
    while (n > 1) {
        result *= n - 1;
        n -= 1;
    }
    return result;
}
console.log(factorial(4));
console.log(factorial(5));
console.log(factorial(10));
// Lösung f) ...
function divisible() {
    for (let i = 0; i <= 100; i++) {
        if (i % 3 == 0) {
            console.log(i);
        }
    }
}
divisible();
// Lösung g) ...
class ConcertEvent {
    interpret;
    price;
    constructor(i, p) {
        this.interpret = i;
        this.price = p;
    }
    show() {
        return `${this.interpret}'s Konzert kostet ${this.price} Geld.`;
    }
}
// Lösung h) ...
let cevent = [];
for (let i = 0; i < events.length; i++) {
    cevent.push(new ConcertEvent(events[i][0], events[i][1]));
}
for (let i = 0; i < cevent.length; i++) {
    console.log(cevent[i].show());
}
//# sourceMappingURL=script_vorlage1.js.map