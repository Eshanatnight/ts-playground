class IndexDB<T> {
	private readonly dbName: string;
	private readonly objectStoreName: string;
	private readonly options;
	constructor(
		dbName: string,
		objectStoreName: string,
		objectStoreOptions: any
	) {
		this.dbName = dbName;
		this.objectStoreName = objectStoreName;
		this.options = objectStoreOptions;
	}

	/*
		* @description: open the database 
		* @returns: Promise<IDBDatabase>
	*/
	private async getDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);
			request.onerror = (event: Event) => reject(event);
			request.onsuccess = (event: Event) => resolve(request.result);
			request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.objectStoreName)) {
					db.createObjectStore(this.objectStoreName, this.options);
				}
			};
		});
	}

	/*
		* @description: add data to the database
		* @param: data: T
		* @returns: Promise<Event>
	*/
	public async addData(data: T): Promise<Event> {
		const db: IDBDatabase = await this.getDB();
		const tx: IDBTransaction = db.transaction(
			this.objectStoreName,
			"readwrite"
		);
		const store: IDBObjectStore = tx.objectStore(this.objectStoreName);
		return new Promise((resolve, reject) => {
			const request: IDBRequest = store.add(data);
			request.onerror = (event: Event) => reject(event);
			request.onsuccess = (event: Event) => resolve(request.result);
		});
	}

	/*
		* @description: delete data to the database
		* @param: key: string
		* @returns: Promise<Event>
	*/
	public async deleteData(key: string): Promise<Event> {
		const db: IDBDatabase = await this.getDB();
		const tx: IDBTransaction = db.transaction(
			this.objectStoreName,
			"readwrite"
		);
		const store: IDBObjectStore = tx.objectStore(this.objectStoreName);
		return new Promise((resolve, reject) => {
			const request: IDBRequest = store.delete(key);
			request.onerror = (event: Event) => reject(event);
			request.onsuccess = (event: Event) => resolve(request.result);
		});
	}

	/*
		* @description: get data to the database
		* @returns: Promise<T>
	*/
	public async getData(): Promise<T> {
		const db: IDBDatabase = await this.getDB();
		const tx: IDBTransaction = db.transaction(
			this.objectStoreName,
			"readonly"
		);
		const store: IDBObjectStore = tx.objectStore(this.objectStoreName);
		const request: IDBRequest = store.getAll();
		return new Promise((resolve, reject) => {
			request.onerror = (event: Event) => reject(event);
			request.onsuccess = (event: Event) => resolve(request.result);
		});
	}

		/*
		* @description: closethe database
		* @returns: Promise<void>
	*/
	public async closeDB() {
		const db: IDBDatabase = await this.getDB();
		db.close();
	}
}

const SIZE: number = 2 * 1024 * 1024;

type QueryResult = {
	rows: SQLResultSetRowList;
	insertId: number;
	rowsAffected: number;
};

class WSql {
	private db: Database;
	constructor(
		dbName: string,
		version: string,
		description: string,
		size: number
	) {
		this.db = window.openDatabase(dbName, version, description, size);
	}

	/*
		* @description: run a sql query
		* @param: sql: string
		* @param: params: any[]
		* @returns: Promise<SQLResultSetRowList> 
	*/
	public executeSql(
		sql: string,
		params: any[]
	): Promise<SQLResultSetRowList> {
		return new Promise((resolve, reject) => {
			this.db.transaction((tx) => {
				tx.executeSql(sql, params, (_, result: SQLResultSet) => {
					resolve(result.rows);
				});
			});
		});
	}

	/*
	 * @description: Create a function to convert the SQLResultSetRowList to an array of Person objects
	 * @param: rows: SQLResultSetRowList
	 * @returns: Person[]
	 */
	public static SQLRowsToPersonArray(rows: SQLResultSetRowList): Person[] {
		let personArray: Person[] = [];
		for (let i = 0; i < rows.length; i++) {
			personArray.push(rows.item(i));
		}
		return personArray;
	}
}

// Type Definition For the Person Object
type Person = {
	name: string;
	age: number;
	email: string;
};

class UI {
	userName: HTMLInputElement;
	userAge: HTMLInputElement;
	userEmail: HTMLInputElement;
	indexedDBButton: HTMLButtonElement;
	webSQLButton: HTMLButtonElement;
	moveToIDBButton: HTMLButtonElement;
	moveTowebSQLButton: HTMLButtonElement;
	table: HTMLElement;
	tableTwo: HTMLElement;
	person: Person;

	constructor() {
		this.userName = <HTMLInputElement>document.getElementById("userName");
		this.userAge = <HTMLInputElement>document.getElementById("userAge");
		this.userEmail = <HTMLInputElement>document.getElementById("userEmail");
		this.indexedDBButton = <HTMLButtonElement>(
			document.getElementById("btnOne")
		);
		this.webSQLButton = <HTMLButtonElement>(
			document.getElementById("btnTwo")
		);
		this.moveToIDBButton = <HTMLButtonElement>(
			document.getElementById("btnThree")
		);
		this.moveTowebSQLButton = <HTMLButtonElement>(
			document.getElementById("btnFour")
		);
		this.table = <HTMLElement>document.getElementById("Table");
		this.tableTwo = <HTMLElement>document.getElementById("TableTwo");
		this.person = {
			name: "",
			age: 0,
			email: "",
		};
	}

	/*
		* @description: hydrate the DOM with the table from the data from IDB
		* @returns: Promise<void>
	*/
	async populateFromIDB() {
		let db: IndexDB<Person> = new IndexDB<Person>("Person", "Person", {
			keyPath: "email",
		});
		let persons: Person[] = await db.getData();
		this.table.innerHTML = "";
		let header = document.createElement("h3");
		header.innerHTML = "IndexedDB";
		this.table.appendChild(header);
		this.table.appendChild(this.createTable(persons));
	}

	/*
		* @description: hydrate the DOM with the table from the data from WebSQL
		* @returns: Promise<void>
	*/
	async populateFromWebSQL() {
		let db: WSql = new WSql("Person", "1.0", "Person", SIZE);
		let persons = WSql.SQLRowsToPersonArray(
			await db.executeSql("SELECT * FROM Person", [])
		);
		this.tableTwo.innerHTML = "";
		let header = document.createElement("h3");
		header.innerHTML = "WebSQL";
		this.tableTwo.appendChild(header);
		this.tableTwo.appendChild(this.createTable(persons));
	}

	/*
		* @description: attatch event listeners to the dom elements
		* @returns: void
	*/
	attatchEventListeners() {
		if (this.userName) {
			// Add Event Listeners
			this.userName.addEventListener("change", (event) => {
				const val = <HTMLInputElement>event.target;
				this.person.name = val.value;
			});
		}

		// Null Check for the HTML Elements just in case
		if (this.userAge) {
			// Add Event Listeners
			this.userAge.addEventListener("change", (event) => {
				const val = event.target as HTMLInputElement;
				this.person.age = parseInt(val.value);
			});
		}

		if (this.userEmail) {
			// Add Event Listeners
			this.userEmail.addEventListener("change", (event) => {
				const val = event.target as HTMLInputElement;
				this.person.email = val.value;
			});
		}

		if (this.indexedDBButton) {
			this.indexedDBButton.addEventListener("click", async () => {
				let db: IndexDB<Person> = new IndexDB<Person>(
					"Person",
					"Person",
					{
						keyPath: "email",
					}
				);
				await db.addData(this.person);
			});
		}
		// Null Check for the HTML Elements just in case
		if (this.webSQLButton) {
			this.webSQLButton.addEventListener("click", async () => {
				let db: WSql = new WSql("Person", "1.0", "Person", SIZE);
				await db.executeSql(
					"CREATE TABLE IF NOT EXISTS Person (name TEXT, age INTEGER, email TEXT)",
					[]
				);
				await db.executeSql(
					"INSERT INTO Person (name, age, email) VALUES (?, ?, ?)",
					[this.person.name, this.person.age, this.person.email]
				);
			});
		}

		// Null Check for the HTML Elements just in case
		if(this.moveToIDBButton){
			this.moveToIDBButton.addEventListener("click", async () => {
				this.moveTOIDB();
			});
		}

		// Null Check for the HTML Elements just in case
		if(this.moveTowebSQLButton) {
			this.moveTowebSQLButton.addEventListener("click", async () => {
				this.moveTowebSQL();
			});
		}
	}

	/*
		* @description: helper function to create a table html element
		* @param: persons: Person[]
		* @returns: HTMLTableElement
	*/
	createTable(persons: Person[]): HTMLTableElement {
		let tableElement: HTMLTableElement = document.createElement("table");
		let tableHeader: HTMLTableSectionElement =
			document.createElement("thead");
		let tableBody: HTMLTableSectionElement =
			document.createElement("tbody");
		let tableHeaderRow: HTMLTableRowElement = document.createElement("tr");
		let tableHeaderName: HTMLTableCellElement =
			document.createElement("th");
		let tableHeaderAge: HTMLTableCellElement = document.createElement("th");
		let tableHeaderEmail: HTMLTableCellElement =
			document.createElement("th");

		tableHeaderName.textContent = "Name";
		tableHeaderAge.textContent = "Age";
		tableHeaderEmail.textContent = "Email";

		tableHeaderRow.appendChild(tableHeaderName);
		tableHeaderRow.appendChild(tableHeaderAge);
		tableHeaderRow.appendChild(tableHeaderEmail);
		tableHeader.appendChild(tableHeaderRow);

		tableElement.appendChild(tableHeader);

		for (const element of persons) {
			let tableRow: HTMLTableRowElement = document.createElement("tr");
			let tableDataName: HTMLTableCellElement =
				document.createElement("td");
			let tableDataAge: HTMLTableCellElement =
				document.createElement("td");
			let tableDataEmail: HTMLTableCellElement =
				document.createElement("td");

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

	/*
		* @description: helper function to populate the table from IDB
		* @returns: Promise<void>
	*/
	async moveTOIDB() {
		let email: string = prompt(
			"Enter the Email of the Person you want to move to IDB"
		) as string;
		let db_w: WSql = new WSql("Person", "1.0", "Person", SIZE);
		let person = WSql.SQLRowsToPersonArray(
			await db_w.executeSql("SELECT * FROM Person WHERE email = ?", [email])
		);
		await db_w.executeSql("DELETE FROM Person WHERE email = ?", [email]);

		if (person.length > 0) {
			let db_i: IndexDB<Person> = new IndexDB<Person>("Person", "Person", {
				keyPath: "email",
			});
			await db_i.addData(person[0]);
		} else {
			alert("No Person with that Email");
		}

		await this.populateFromIDB();
		await this.populateFromWebSQL();
	}

	/*
		* @description: helper function to populate the table from WebSQL
		* @returns: Promise<void>
	*/
	async moveTOSQL() {
		let email: string = prompt(
			"Enter the Email of the Person you want to move to IDB"
		) as string;
		let db_i: IndexDB<Person> = new IndexDB<Person>("Person", "Person", {
			keyPath: "email",
		});
		let person = await db_i.getData(email);
		await db_i.deleteData(email);

		if (person) {
			let db_w: WSql = new WSql("Person", "1.0", "Person", SIZE);
			await db_w.executeSql(
				"INSERT INTO Person (name, age, email) VALUES (?, ?, ?)",
				[person.name, person.age, person.email]
			);
		} else {
			alert("No Person with that Email");
		}

		await this.populateFromIDB();
		await this.populateFromWebSQL();
	}
}


let ui = new UI();
ui.attatchEventListeners();
ui.populateFromIDB().then(() => {
	ui.populateFromWebSQL();
});
