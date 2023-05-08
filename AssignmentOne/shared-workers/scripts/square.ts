const squareNumber = <HTMLInputElement>document.querySelector("#number3");

const squaredResult = document.querySelector(".result2");

if (!!window.SharedWorker) {
	const worker = new SharedWorker("worker.js");

	squareNumber.onchange = function () {
		worker.port.postMessage([squareNumber.value, squareNumber.value]);
		console.log("Sent to Worker");
	};

	worker.port.onmessage = function (event) {
		if (squaredResult != null) {
			squaredResult.textContent = event.data;
			console.log("Message Recived from Worker");
		} else {
			console.error("Failed to recive Message from Worker");
		}
	};
}
