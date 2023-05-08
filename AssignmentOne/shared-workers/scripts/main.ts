const first = <HTMLInputElement>document.querySelector("#number1");
const second = <HTMLInputElement>document.querySelector("#number2");

const result = document.querySelector(".result1");

if (!!window.SharedWorker) {
	let worker = new SharedWorker("worker.js");

	first.onchange = function () {
		worker.port.postMessage([first.value, second.value]);
		console.log("Posted to Worker");
	};

	second.onchange = function () {
		worker.port.postMessage([first.value, second.value]);
		console.log("Posted to Worker");
	};

	worker.port.onmessage = function (event: MessageEvent<any>) {
		// ! result might be null
		if (result != null) {
			result.textContent = event.data;
			console.log("Recived From Worker");
			console.log("Event ID: ", event.lastEventId);
		} else {
			console.error("Failed to Recive any Message from Worker");
		}
	};
}
