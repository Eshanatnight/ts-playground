// Query and get data from webSQL database
let webSQLDB: Database = window.openDatabase(
	"Person",
	"1.0",
	"Person Database",
	SIZE
);
let webSQLQuery: string = "SELECT * FROM person";
let dataFromDB: SQLResultSetRowList;
let webSQLShowButton = <HTMLButtonElement>document.getElementById("btnFour");

// Create a function to convert the SQLResultSetRowList to an array of Person objects
// @param: rows: SQLResultSetRowList
function SQLRowsToPersonArray(rows: SQLResultSetRowList): Person[] {
	let personArray: Person[] = [];
	for (let i = 0; i < rows.length; i++) {
		personArray.push(rows.item(i));
	}
	return personArray;
}

// Run a transaction to get the data from the database
function getDateFromWebSQL(): void {
	webSQLDB.transaction(function (tx: SQLTransaction) {
		tx.executeSql(
			webSQLQuery,
			[],
			function (tx: SQLTransaction, result: SQLResultSet) {
				dataFromDB = result.rows;
			}
		);
	});
}

if (webSQLShowButton) {
	// Event Listener for the webSQLShowButton
	// ! this is taking a second to load after click of the button
	// ! not sure why?
	webSQLShowButton.addEventListener("click", () => {
		getDateFromWebSQL();

		let personArray: Person[] = SQLRowsToPersonArray(dataFromDB);

		// Get the table HTML Element
		let webSQLTableElement = <HTMLElement>document.getElementById("Table");

		// Set the innerHTML of the table to be empty just in case there is any  data in it
		webSQLTableElement.innerHTML = "";

		// Create the table and append it to the webSQLTableElement
		webSQLTableElement.appendChild(createTable(personArray));
	});
}
