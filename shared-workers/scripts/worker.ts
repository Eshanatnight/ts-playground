// ? sharedworker types not defined
// ErrMsg: Cannot find name `onconnect`
// @ts-expect-error
onconnect = function (e: MessageEvent<any>) {
	const port = e.ports[0];

	port.onmessage = function (e) {
		const workerResult = `Result: ${e.data[0] * e.data[1]}`;
		port.postMessage(workerResult);
	};
};
