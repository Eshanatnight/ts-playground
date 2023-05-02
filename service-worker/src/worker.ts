// import { promises as fsPromises } from "fs";

onmessage = (event: MessageEvent<any>) => {
	console.log("Message received from main script");
	let _data = event.data;
	let data: TableData[] = transformData(_data);
	let incomingDataLength: number = data.length;

	saveToIndexedDB(data);
	postMessage(data);
}

/*onmessage = (event: MessageEvent<any>) => {
	let data: TableData[] = transformData(event.data);
	console.log("Message received from main script");
	console.log("Data: ", data);
	let numEntries: number[] = [];

	//save to indexedDB
	saveToIndexedDB(data);

	saveToJSONFile(data).then(() => {
		console.log("Data saved to JSON file");
		let cnt: string | null = localStorage.getItem("Entries");
		let lastEntryCount: number = 0;
		if (cnt) {
			lastEntryCount = parseInt(cnt);
		}
		for (let i: number = 1; i <= data.length; i++) {
			numEntries.push(lastEntryCount - i);
		}
		// might be a issue as i dont know if i is 1 | 0
		//let numEntries: number[] = [].map((_: never, i: number): number => lastEntryCount - i);

		// after the data is saved to the JSON file, set the status to processed
		setToProcessedState();

	});
	// finally post the message back to the main thread the messageIDs that were prosessed
	postMessage(numEntries);
};*/

/*
	* @description - saves the data to the indexedDB
	* @param: data: TableData[]
	* @returns: void
*/
function saveToIndexedDB(data: TableData[]): void {
	// run a request to open the database
	let request: IDBOpenDBRequest = indexedDB.open("person", 1);

	// handle the error case
	// @param: event: Event
	request.onerror = (event: Event) => {
		console.error("Error opening database: ", event);
	};

	// handle the upgradeneeded case
	// @param: event: IDBVersionChangeEvent
	request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
		let db: IDBDatabase = request.result;
		db.createObjectStore("person", {
			keyPath: "MessageID",
			autoIncrement: true,
		});
		console.log("Created object store");
	};

	// handle the success case
	// @param: event: Event
	request.onsuccess = (event: Event): void => {
		let db: IDBDatabase = request.result;
		let trans: IDBTransaction = db.transaction("person", "readwrite");
		let objStore: IDBObjectStore = trans.objectStore("person");

		// add() can throw an error
		try {
			data.forEach((entry: TableData) => {
				objStore.add(entry);
			});
		} catch (err) {
			console.error("Error adding entry: ", err);
		}
	};
}

/*
	* @description - saves the file to the JSON file
	* @param: data: TableData[]
	* @returns: Promise<void>
*/
/* async function saveToJSONFile(data: TableData[]): Promise<void> {
	data.forEach((entry: TableData) => {
		entry.status = "Processed";
	});

	try {
		// this might create a race condition
		checkDBFile("./db/data.json");

		// got the data buffer in a string i prefer JSON.parse to be unknow rather than any
		// now JSONData is a {string[]}, but technically it should be {TableData[]}
		// but then serialization and deserialization would be a pain to deal with
		let buf = JSON.parse(
			await fsPromises.readFile("./db/data.json", { encoding: "utf-8" })
		) as JSONData;

		// Table will be in the parsed data except for the first time
		if ("Table" in buf) {
			data.forEach((entry: TableData) => {
				buf.Table.push(JSON.stringify(entry));
			});
		} else {
			buf = {
				Table: [],
			};

			data.forEach((entry: TableData) => {
				buf.Table.push(JSON.stringify(entry));
			});
		}

		// saving the number of entries in local storage so i can use it
		// even if the app session is closed
		let numberOfEntries: number = buf.Table.length;
		localStorage.setItem("Entries", numberOfEntries.toString());

		let out: string = JSON.stringify(buf);

		await fsPromises.writeFile("./db/data.json", out, {
			encoding: "utf-8",
		});
	} catch (err) {
		console.error("Error in saveToJSONFile Function",err);
	}
} */

/*
	* @description - checks is the file exists, if not, creates it
	* @path: string
	* @returns: Promise<void>
*/
/* async function checkDBFile(path: string): Promise<void> {
	try {
		await fsPromises.access(path);
	} catch (err) {
		//@ts-expect-error
		if (err.code === "ENOENT") {
			console.warn("File does not exist, creating file...");
			await fsPromises.writeFile(path, "{}", { encoding: "utf-8" });
		}

		console.error(err);
	}
} */

/*
	* @description - transform the data to be saved to the database into a desired format
	* @param: data: Person[]
	* @returns: TableData[]
*/
function transformData(data: Person[]): TableData[] {
	let transformedData: TableData[] = [];
	data.forEach((person: Person) => {
		let data: TableData = {
			person: person,
			status: "New",
		};

		transformedData.push(data);
	});
	return transformedData;
}

/*
	* @description - set the status value of the saved entries to processed
	* @returns: void
*/
/* function setToProcessedState(): void {
	let request: IDBOpenDBRequest = indexedDB.open("person", 1);
	let db: IDBDatabase = request.result;
	let transaction: IDBTransaction = db.transaction("person", "readwrite");
	let objectStore: IDBObjectStore = transaction.objectStore("person");

	// now to change the status of all the entries with new to processed
	let indexCursor: IDBRequest<IDBCursorWithValue | null> =
		objectStore.openCursor(IDBKeyRange.only("New"));
	indexCursor.onsuccess = (event: Event) => {
		let cursor: IDBCursorWithValue | null = indexCursor.result;
		if (cursor) {
			cursor.value.status = "Processed";
			cursor.update(cursor.value);
			cursor.continue();
		}
	};
}
*/