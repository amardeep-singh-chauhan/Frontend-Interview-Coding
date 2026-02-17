
const p1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("P1 Success")
        }, 500)
    })
}

const p2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("P2 Reject")
        }, 500)
    })
}

const p3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("P3 Success")
        }, 500)
    })
}

Promise.myAll = function (promises) {

    return new Promise((res, rej) => {
        if (Array.isArray(promises)) {
            rej("Please share array of promises");
            return;
        }
        const n = promises.length;
        if (n === 0) {
            res([])
            return;
        }
        let counter = 0;
        let data = [];
        let hasRejected = false;
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i])
                .then((res1) => {
                    data[i] = res1
                    counter++
                    if (counter === promises.length) res(data);
                })
                .catch((err) => {
                    if (!hasRejected) {
                        hasRejected = true;
                        rej(err);
                    }
                })
        }
    })
}

Promise.myAll([p1(), p2(), p3()])
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })