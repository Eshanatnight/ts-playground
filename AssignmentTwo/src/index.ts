import { SIZE, WSql } from "./webSQL";

// Type Definition For the Person Object
type Person = {
	name: string;
	age: number;
	email: string;
};

// Create a Person Object default initialized
let person: Person = {
	name: "",
	age: 0,
	email: "",
};

const userName = <HTMLInputElement>document.getElementById("userName");
const userAge = <HTMLInputElement>document.getElementById("userAge");
const userEmail = <HTMLInputElement>document.getElementById("userEmail");
const indexedDBButton = <HTMLButtonElement>document.getElementById("btnOne");
const webSQLButton = <HTMLButtonElement>document.getElementById("btnTwo");

// Null Check for the HTML Elements just in case
if (userName) {
	// Add Event Listeners
	userName.addEventListener("change", function (event) {
		const val = <HTMLInputElement>event.target;
		person.name = val.value;
	});
}

// Null Check for the HTML Elements just in case
if (userAge) {
	// Add Event Listeners
	userAge.addEventListener("change", function (event) {
		const val = event.target as HTMLInputElement;
		person.age = parseInt(val.value);
	});
}
// Null Check for the HTML Elements just in case
if (userEmail) {
	// Add Event Listeners
	userEmail.addEventListener("change", function (event) {
		const val = event.target as HTMLInputElement;
		person.email = val.value;
	});
}

// Null Check for the HTML Elements just in case
if (indexedDBButton) {
	indexedDBButton.addEventListener("click", () => {
		let db: IndexDB<Person> = new IndexDB<Person>("Person", "Person", {
			keyPath: "email",
		});
		db.addData(person);
	});
}

// Null Check for the HTML Elements just in case
if (webSQLButton) {
	webSQLButton.addEventListener("click", () => {
		let db: WSql = new WSql("Person", "1.0", "Person", SIZE);
		db.executeSql(
			"CREATE TABLE IF NOT EXISTS Person (name TEXT, age INTEGER, email TEXT)",
			[]
		);
		db.executeSql(
			"INSERT INTO Person (name, age, email) VALUES (?, ?, ?)",
			[person.name, person.age, person.email]
		);
	});
}

