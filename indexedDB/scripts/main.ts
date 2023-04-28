// 1. Create an indexDB with email as key path and name , age , gender as index DB.
// Type Definition for Person
type Person = {
	name: string;
	age: number;
	email: string
};


// @description: This function adds data to the object store.
// Dead Code
// @param transaction: IDBTransaction
// @param data: Person[]
function addDataToIDB(transaction: IDBTransaction, data: string[]) {
	let objectStore: IDBObjectStore = transaction.objectStore("Person");

    // Test: objectStore.add("{ name: 'John', age: 30, email: 'abc@ooo.com'}");
	for(const element of data) {
        let person = JSON.parse(element);
		console.log("person: ", person);
		objectStore.add(person);
	}
}

// a variable to store the database object.
let db: IDBDatabase;

// Attempt to connect to the database.
const request: IDBOpenDBRequest = window.indexedDB.open("Person", 1);

// @description: This event is triggered when the database is opened successfully.
// Note: We are not using the event param, but i kept it in case you want to use it.
// And just if i need to read this later to make changes to the database.
// @param event: IDBVersionChangeEvent
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
	// The database did not previously exist, so create object stores and indexes.
	db = request.result;

	// Create an objectStore for this database
	db.createObjectStore("Person", {	keyPath: "email",});
}

request.onsuccess = () => {
	// The database already exists, so just start using it.
	db = request.result;

	// Get the transaction
	let transaction: IDBTransaction = db.transaction("Person", "readwrite");

	// Array of Person
	// Dead Code
/*
	let persons: Person = [
		{ name: 'John', age: 30, email: 'abc@ooo.com' },
		{ name: 'Jane', age: 25, email: 'qwe@ooo.com' },
		{ name: 'Jack', age: 40, email: 'poi@ooo.com' },
	];
*/
    let objectStore: IDBObjectStore = transaction.objectStore("Person");

	// adds data to the object store
    objectStore.put({ name: 'John', age: 30, email: 'abc@ooo.com'});
    objectStore.put({ name: "Jane", age: 25, email: "qwe@ooo.com"});
    objectStore.put({ name: 'Jack', age: 40, email: 'poi@ooo.com'});

	transaction.oncomplete = () => {
		console.log("Transaction completed: database modification finished.");
		db.close();
	}
};

request.onerror = (event: Event) => {
	console.error("Database error: " + request.error);
	console.error("Occured Event: ", event)
};