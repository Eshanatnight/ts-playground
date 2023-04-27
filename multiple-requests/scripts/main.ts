const inOne = <HTMLInputElement>document.querySelector("#number1");
const inTwo = <HTMLInputElement>document.querySelector("#number2");
const result = document.querySelector(".result");

if (window.Worker && inOne && inTwo && result) {
	let worker = new Worker("worker.js");

	inOne.onchange = function () {
		worker.postMessage([inOne.value, inTwo.value]);
		console.log("Sent To Worker");
	};

	inTwo.onchange = function () {
		worker.postMessage([inOne.value, inTwo.value]);
		console.log("Sent To Worker");
	};

	worker.onmessage = function (e) {
		let res: number[] = e.data;
		if (result != null) {
			result.textContent = `Result 1: ${res[0]} & Result 2: ${res[1]}`;
		}
	};

	worker.onerror = function (err: ErrorEvent) {
		console.error("Error Occured: ", err.message);
		throw err;
	};
}
