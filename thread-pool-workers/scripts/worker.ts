onmessage = function (e: MessageEvent<any>) {
	console.log("Worker: Message received from Main script");
	const result: number = e.data[0] * e.data[0] + e.data[1] * e.data[1];

	console.log("Worker: Posting message back to Main script");
	postMessage(result);
};