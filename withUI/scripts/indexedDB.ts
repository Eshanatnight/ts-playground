let db: IDBDatabase;
let table: Person[];

// create the indexedDB database request
let request: IDBOpenDBRequest = indexedDB.open("Person", 1);

let showIndexedDBDataButton = <HTMLButtonElement>(
	document.getElementById("btnThree")
);

// onerror case
request.onerror = function (event) {
	console.error("Error opening database");
	console.error(event);
};

// onupgradeneeded case
request.onupgradeneeded = function () {
	db = request.result;
	let objStore: IDBObjectStore = db.createObjectStore("person", {
		keyPath: "email",
	});
	objStore.createIndex("email", "email", { unique: true });
};

// onsuccess case
request.onsuccess = function () {
	db = request.result;
	let trans: IDBTransaction = db.transaction("person", "readwrite");

	let objStore: IDBObjectStore = trans.objectStore("person");
	let emailIndex: IDBIndex = objStore.index("email");
	let data: IDBRequest<Person[]> = emailIndex.getAll();
	data.onsuccess = function () {
		table = data.result;
	};
};

// Null Check for the HTML Elements just in case
if (showIndexedDBDataButton) {
	// Add Event Listeners
	showIndexedDBDataButton.addEventListener("click", () => {
		let tableElement = <HTMLElement>document.getElementById("Table");
		tableElement.innerHTML = "";
		tableElement?.appendChild(createTable(table));
	});
}
