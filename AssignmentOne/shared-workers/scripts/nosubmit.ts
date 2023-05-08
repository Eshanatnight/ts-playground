const form = <HTMLFormElement>document.querySelector("form");

form.onsubmit = function (event) {
	event.preventDefault();
};
