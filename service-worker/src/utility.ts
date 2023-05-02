// Type for person object
type Person = {
	name: string;
	age: number;
	email: string;
};

// ! Bad Name for the type figure something better out
type TableData = {
	person: Person;
	status: "New" | "Processed" | "Incomming";
};

type JSONData = {
	Table: string[];
};

// CONSTANTS





/*
	* @description - create a html table from an array of Person objects
	// ! Might be better if i abstracted this function to 2 seperate functions
	// ! one for placing the table in the DOM and one for creating the table
	* @param: table: Person[]
	* @return: HTMLTableElement
*/
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


