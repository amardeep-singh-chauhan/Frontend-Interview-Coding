
const p1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("P1 Success")
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
            reject("P3 Success")
        }, 500)
    })
}

Promise.myAny = function (promises) {

    return new Promise((res, rej) => {
        if (!Array.isArray(promises)) {
            rej("Please share array of promises");
            return;
        }
        const n = promises.length;

        if (n === 0) {
            return;
        }
        let settled = false;

        for (let i = 0; i < n; i++) {
            Promise.resolve(promises[i])
                .then((t) => {
                    if(!settled){
                        res(t)
                        settled = true;
                        return
                    }
                })
                .catch(() => {
                    if(settled === false){
                        rej("All promises are rejected")
                        return
                    }
                })
        }

    })
}

Promise.myAny([p1(), p2(), p3()])
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })