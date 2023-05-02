let dataFromDB: SQLResultSetRowList;
const button = <HTMLButtonElement>document.getElementById("loadButton");





if (button) {
	button.addEventListener("click", () => {
		getDataFromWebSQL();
		let personArray: Person[] = toPersonArray(dataFromDB);
		console.log(personArray);

		// Get the table HTML Element
		let webSQLTableElement = <HTMLElement>document.getElementById("Table");

		// Set the innerHTML of the table to be empty just in case there is any  data in it
		webSQLTableElement.innerHTML = "";

		// Create the table and append it to the webSQLTableElement
		webSQLTableElement.appendChild(createTable(personArray));
	});
}


/*
	* @description - Run a transaction to get the data from the database
	* @returns {void}
*/
function getDataFromWebSQL(): void {
	// ! its taking a while to get the data from the database
	// ! hence why its not showing up the first time
	// Note: Probably should add a spinner or something to show that the data is loading
	// ? should i make the name, version, desciption of the database a constant?
	let db: Database = window.openDatabase(
		"person",
		"1.0",
		"Person Details",
		SIZE
	);

	db.transaction(function (tx: SQLTransaction) {
		tx.executeSql(
			fetchAllQuery,
			[],
			function (tx: SQLTransaction, result: SQLResultSet) {
				dataFromDB = result.rows;
			}
		);
	});
}
