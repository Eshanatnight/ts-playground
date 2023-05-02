// ! I know this should be in its own module but I just cant figure out how to do it
class Timer {
	public static ONE_SECOND: number = 1000;
	public static ONE_MINUTE: number = 60 * 1000;
	public static THREE_MINUTES: number = 3 * 60 * 1000;
	public static FIVE_MINUTES: number = 5 * 60 * 1000;
	private _start: number;
	private _duration: number;
	private _timerID: ReturnType<typeof setInterval>;

	constructor() {
		this._start = 0;
		this._duration = 0;
		this._timerID = <ReturnType<typeof setInterval>>{};
	}

	/*
        * @description - starts the timer
        * @param {number} duration - the duration of the timer
        * @param {Function} callback - the callback function to be called
        * @param {any} args - the arguments to be passed to the callback function
        * @returns {void}

    */
	start(duration: number, callback: Function, ...args: any): void {
		this._start = Date.now();
		this._timerID = setInterval(() => {
			this._duration = Date.now() - this._start;
			console.log(`Elapsed time: ${this._duration}ms`);
			callback(...args);
		}, duration);
	}

	/*
	 * @description - ends the timer
	 * @returns {void}
	 */
	end(): void {
		clearInterval(this._timerID);
		this._start = 0;
		this._duration = 0;
		this._timerID = <ReturnType<typeof setInterval>>{};
	}
}

// ? SQL Database Size
const SIZE: number = 2 * 1024 * 1024; // 2MB

// ? SQL Queries
const fetchAllQuery: string = "SELECT * FROM person";
const createQuery: string =
	"CREATE TABLE IF NOT EXISTS person(name TEXT, age INTEGER, email TEXT PRIMARY KEY)";
const insertQuery: string = "INSERT INTO person VALUES(?, ?, ?)";

// ! i can merge all the if statements into one if statement
// ! then i can have this variable inside that scope,
// ! rather than it being a global variable
let person: Person = {
	name: "",
	age: 0,
	email: "",
};

const timer: Timer = new Timer();

const userName = <HTMLInputElement>document.getElementById("userName");
const userAge = <HTMLInputElement>document.getElementById("userAge");
const userEmail = <HTMLInputElement>document.getElementById("userEmail");
const saveButton = <HTMLButtonElement>document.getElementById("saveButton");
let rows: SQLResultSetRowList;

if (userName) {
	userName.addEventListener("change", (event: Event) => {
		const val = event.target as HTMLInputElement;
		person.name = val.value;
	});
}

if (userAge) {
	userAge.addEventListener("change", (event: Event) => {
		const val = event.target as HTMLInputElement;
		person.age = parseInt(val.value);
	});
}

if (userEmail) {
	userEmail.addEventListener("change", (event: Event) => {
		const val = event.target as HTMLInputElement;
		person.email = val.value;
	});
}

if (saveButton) {
	saveButton.addEventListener("click", () => {
		let db: Database = window.openDatabase(
			"person",
			"1.0",
			"Person Details",
			SIZE
		);

		// create table if not exists and insert data
		// ! is it a better idea to seperate the creation and
		// ! the insertion of the data?
		// !
		// ! probably should add a flag to check if the table exists
		// ! rather than running the query every time
		db.transaction(function (tx: SQLTransaction) {
			tx.executeSql(createQuery);
			tx.executeSql(insertQuery, [person.name, person.age, person.email]);
		});
	});
}

// this activates the callback function every minute and runs indefinitely
// Note: i need to invoke the web worker every other moment
// Note: so the web worker will take the data that was inserted between the last time it was invoked
// Note: and the current time it was invoked. But how do i do that?
// Note: do i keep track of at what the index of the data that was inserted last time?
// Note: or is threre a better way to do it?
/* timer.start(50000, () => {
	let personArray: Person[];
	let db: Database = window.openDatabase(
		"person",
		"1.0",
		"Person Details",
		SIZE
	);

	const getTx = (db: Database): Promise<SQLTransaction> => {
		return new Promise((resolve, reject) => {
			db.transaction((tx: SQLTransaction) => {
				resolve(tx);
			});
		});
	};

	const query = (tx: SQLTransaction) => {
		return new Promise((resolve) => {
			tx.executeSql(
				fetchAllQuery,
				[],
				(tx: SQLTransaction, result: SQLResultSet) => {
					rows = result.rows;
					personArray = toPersonArray(rows);
					resolve(rows);
				}
			);
		});
	};

	async function runQuery() {
		let tx = await getTx(db);
		await query(tx);
	}

	runQuery().then(() => {
		// personArray has all the entries in the database, i need to filter it
		let lastEntryNumber: number = parseInt(
			localStorage.getItem("Entries") as string
		);

		personArray.filter((_, index: number) => {
			return index > lastEntryNumber;
		});

		invokeWebWorker(personArray);
	});
}); */

/* function invokeWebWorker(data: Person[]) {
	if (!window.Worker) {
		return console.error("Web Worker is not supported in this browser");
	}

	let worker = new Worker("src/js/worker.js");
	worker.postMessage(data);
	console.log("Posted: ", data);

	// Note: has an event of type MessageEvent<any>
	// Note: is there a way to get rid of that any?
	worker.onmessage = (event: MessageEvent<any>) => {
		console.log("Processed Data: ", event.data);
	};

	worker.onerror = (event: ErrorEvent) => {
		console.error("Error occured in worker: ", event);
	};
} */

/*
 * @description - deserializes a SQLResultSetRowList into an array of Person objects
 * @param: rows: SQLResultSetRowList
 * @return: Person[]
 */
function toPersonArray(rows: SQLResultSetRowList): Person[] {
	let personArray: Person[] = [];
	for (let i = 0; i < rows.length; i++) {
		personArray.push(rows.item(i));
	}
	return personArray;
}

let personArray: Person[];
let db: Database = window.openDatabase("person", "1.0", "Person Details", SIZE);

const getTx = (db: Database): Promise<SQLTransaction> => {
	return new Promise((resolve, reject) => {
		db.transaction((tx: SQLTransaction) => {
			resolve(tx);
		});
	});
};

const query = (tx: SQLTransaction) => {
	return new Promise((resolve) => {
		tx.executeSql(
			fetchAllQuery,
			[],
			(tx: SQLTransaction, result: SQLResultSet) => {
				rows = result.rows;
				personArray = toPersonArray(rows);
				resolve(rows);
			}
		);
	});
};

async function runQuery() {
	let tx = await getTx(db);
	await query(tx);
}

runQuery().then(() => {
	// personArray has all the entries in the database, i need to filter it
	let lastEntryNumber: number = parseInt(
		localStorage.getItem("Entries") as string
	);

	personArray.filter((_, index: number) => {
		return index > lastEntryNumber;
	});

	let worker = new Worker("src/js/worker.js");
	worker.postMessage([personArray]);
	console.log("Posted: ", personArray);

	// Note: has an event of type MessageEvent<any>
	// Note: is there a way to get rid of that any?
	worker.onmessage = (event: MessageEvent<any>) => {
		console.log("Processed Data: ", event.data);
	};

	worker.onerror = (event: ErrorEvent) => {
		console.error("Error occured in worker: ", event);
	};
});
