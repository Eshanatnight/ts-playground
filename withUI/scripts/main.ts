// Note: I really want to move the type defs and the constants
// Note: and the utility functions to seperate files
// Note: but i cant figure out how to do that
// Note: I just keep getting module resolution errors

// Type Definition For the Person Object
type Person = {
	name: string;
	age: number;
	email: string;
};

const SIZE: number = 5 * 1024 * 1024; // 5MB

// Create a Person Object default initialized
let person: Person = {
	name: "",
	age: 0,
	email: "",
};

// Get the HTML Elements
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
// ! should i move this to the `indexedDB.ts` file?
if (indexedDBButton) {
	// Callback function for the event listener
	// Note: this callback is moved out of the event listener
	// because i personally dont like having code indented
	// more than 2 levels. imo it makes the code harder to read
	let indexedDBCallback = () => {
		// Open the database request
		let request: IDBOpenDBRequest = indexedDB.open("Person", 1);

		// onerror case
		request.onerror = function (event) {
			// On Error handle the error gracefully
			// by logging ther errot and the event to the console
			console.error("Error opening database");
			console.error(event);
		};

		// onupgradeneeded case
		request.onupgradeneeded = function () {
			//get the database and create the object store
			let db: IDBDatabase = request.result;
			db.createObjectStore("person", { keyPath: "email" });
		};

		// onsuccess case
		request.onsuccess = function () {
			let db: IDBDatabase = request.result;
			let tx: IDBTransaction = db.transaction("person", "readwrite");
			let store: IDBObjectStore = tx.objectStore("person");

			// Using put to insert data into the database
			// because it will overwrite the data if it already exists
			// and hence i wont need to deal with the
			// DOMException: ConstraintError
			store.put(person);

			// Upon completion close the database
			tx.oncomplete = function () {
				db.close();
			};
		};

		addLastUpdated();
	};

	// Add Event Listeners
	indexedDBButton.addEventListener("click", indexedDBCallback);
}

// Null Check for the HTML Elements just in case
if (webSQLButton) {
	// add event listener
	webSQLButton.addEventListener("click", () => {
		let db: Database = window.openDatabase(
			"Person",
			"1.0",
			"Person Database",
			SIZE
		);

		// create table if not exists and insert data
		// ! is it a better idea to seperate the creation and
		// ! the insertion of the data?
		db.transaction(function (tx) {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS person(name TEXT, age INTEGER, email TEXT)"
			);
			tx.executeSql("INSERT INTO person VALUES(?, ?, ?)", [
				person.name,
				person.age,
				person.email,
			]);
		});

		addLastUpdated();
	});
}

// create a html table from an array of Person objects
// ! Might be better if i abstracted this function to 2 seperate functions
// ! one for placing the table in the DOM and one for creating the table
function createTable(table: Person[]): HTMLTableElement {
	let tableElement: HTMLTableElement = document.createElement("table");
	let tableHeader: HTMLTableSectionElement = document.createElement("thead");
	let tableBody: HTMLTableSectionElement = document.createElement("tbody");
	let tableHeaderRow: HTMLTableRowElement = document.createElement("tr");
	let tableHeaderName: HTMLTableCellElement = document.createElement("th");
	let tableHeaderAge: HTMLTableCellElement = document.createElement("th");
	let tableHeaderEmail: HTMLTableCellElement = document.createElement("th");

	tableHeaderName.textContent = "Name";
	tableHeaderAge.textContent = "Age";
	tableHeaderEmail.textContent = "Email";

	tableHeaderRow.appendChild(tableHeaderName);
	tableHeaderRow.appendChild(tableHeaderAge);
	tableHeaderRow.appendChild(tableHeaderEmail);
	tableHeader.appendChild(tableHeaderRow);

	tableElement.appendChild(tableHeader);

	for (const element of table) {
		let tableRow: HTMLTableRowElement = document.createElement("tr");
		let tableDataName: HTMLTableCellElement = document.createElement("td");
		let tableDataAge: HTMLTableCellElement = document.createElement("td");
		let tableDataEmail: HTMLTableCellElement = document.createElement("td");

		tableDataName.textContent = element.name;
		tableDataAge.textContent = element.age.toString();
		tableDataEmail.textContent = element.email;

		tableRow.appendChild(tableDataName);
		tableRow.appendChild(tableDataAge);
		tableRow.appendChild(tableDataEmail);
		tableBody.appendChild(tableRow);
	}

	tableElement.appendChild(tableBody);

	return tableElement;
}

// will save the last updated time to the local storage
function addLastUpdated(): void {
	// Get the current date and time
	// storing it as a utc defined string because i want the time also
	let now: string = new Date().toUTCString();
	localStorage.setItem("lastUpdated", now);

	// create a paragraph element and add the date and time to it
	let lastUpodated: HTMLParagraphElement = document.createElement("p");
	lastUpodated.textContent = `Last Updated: ${now}`;

	// append the paragraph element to the DOM
	let lastUpdateDiv = <HTMLElement>document.getElementById("lastUpdate");
	if (lastUpdateDiv) {
		lastUpdateDiv.innerHTML = "";
		lastUpdateDiv.appendChild(lastUpodated);
	}
}
