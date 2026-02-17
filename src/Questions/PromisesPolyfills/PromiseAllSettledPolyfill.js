
const p1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("P1 Success")
        }, 3000)
    })
}

const p2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("P2 Reject")
        }, 1000)
    })
}

const p3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("P3 Success")
        }, 2000)
    })
}

Promise.myAllSettled = function (promises) {

    return new Promise((res, rej) => {
        if (!Array.isArray(promises)) {
            rej("Please share array of promises");
            return;
        }
        const n = promises.length;

        if (n === 0) {
            res([])
            return;
        }
        let counter = 0;
        let results = [];

        for (let i = 0; i < n; i++) {
            Promise.resolve(promises[i])
                .then((t) => {
                    results[i] = t;
                })
                .catch((c) => {
                    results[i] = c;
                })
                .finally(() => {
                    counter++;
                    if (counter === n) {
                        res(results);
                        return;
                    }
                })
        }

    })
}

Promise.myAllSettled([p1(), p2(), p3()])
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })