// var PromisePool = require('es6-promise-pool');


Profile.find()
    .where({
        deleted: {$ne: true},
        customerZohoId: null
    })
    .then((profiles) => {
        if (profiles.length > 0) {
            let count = 0;
            let length = profiles.length;

            var promiseProducer = function () {
                if (count < length) {
                    count++;
                    promise = createZohoCustomerSimple(profiles[count]);

                    return promise;
                } else {
                    return null;
                }
            }

            var concurrency = 5;

            var pool = new PromisePool(promiseProducer, concurrency);

            var poolPromise = pool.start();

            poolPromise.then(function () {
                console.log('All promises fulfilled')
            }, function (error) {
                console.log('Some promise rejected: ' + error.message)
            })

        }
    }).catch((e) => {
    return res.send(500, {'error': e});
})



