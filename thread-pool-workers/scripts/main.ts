/*
take multiple request from user at the same time and use same webworker to register
multiple time and pass each request to different webworker and
return the data in the same sequence as the user is given in form of request
Eg: User 1 - Request1
    User 2 - Request2
Return data
User 1 Response - Response1
User2 Response -  Response2
*/

async function createWorkerPool(): Promise<Worker> {
	const worker = new Worker("worker.js");
	worker.postMessage([1, 2]);
	return worker;
}

const workerPool: Promise<Worker>[] = [];
async function start() {

	for (let i = 0; i < 5; i++) {
		workerPool.push(createWorkerPool());
	}

	Promise.all(workerPool).then((res: Worker[]) => {
		res.forEach((worker: Worker) => {
			worker.onmessage = function (e: MessageEvent<any>) {
				console.log("Message received from worker: ", e.data);
			};
		});
	});
}

async function join() {
    Promise.all(workerPool)
        .then((res: Worker[]) => {
            res.forEach((worker: Worker) => {
                worker.terminate();
            });
    });
}

// Start the worker pool
start();

// Terminate the worker pool after 10 seconds
setTimeout(() => {
    join();
}, 10000)
