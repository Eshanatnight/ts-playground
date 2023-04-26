self.onmessage = function (event: MessageEvent<any>) {
    const num: number = Number(event.data);
    fibonacci(num);
}

function fibonacci(num: number): void {
    let a: number = 1;
    let b: number = 0;
    let temp: number;

    while(num >= 0) {
        temp = a;
        a += b;
        b = temp;
        num--;
    }

    self.postMessage(b);
}