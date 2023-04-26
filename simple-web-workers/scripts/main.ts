const firstNumber = <HTMLInputElement>document.querySelector("#number1");
const secondNumber = <HTMLInputElement>document.querySelector("#number2");

const result = document.querySelector(".result");

if(window.Worker && firstNumber && secondNumber && result) {
    let myWorker = new Worker("worker.js");

    firstNumber.onchange = function() {
        myWorker.postMessage([firstNumber.value, secondNumber.value]);
        console.log("Message posted to worker");
    }

    secondNumber.onchange = function() {
        myWorker.postMessage([firstNumber.value, secondNumber.value]);
        console.log("Message posted to worker");
    }

    myWorker.onmessage = function(e: MessageEvent<any>) {
        result.textContent = e.data;
        console.log("Message received from worker");
    }
} else {
    console.error("Web Workers Not Supported!!");
}