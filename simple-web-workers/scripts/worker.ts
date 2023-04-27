onmessage = function (e: MessageEvent<any>) {
	console.log("Worker: Message received from Main script");

	const result: number = e.data[0] * e.data[1]; // Multiply the two numbers received from the main script

	if (isNaN(result)) {
		postMessage("Please write two numbers");
	} else {
		const workerResult = "Result: " + result;
		console.log("Worker: Posting message back to Main script");
		postMessage(workerResult);
	}
};
