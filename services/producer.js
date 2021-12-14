const {connectQueue} = require('../config/queue.config');


const jobOptions = {
    removeOnComplete: true, // remove job if complete
    delay: 60000, // 1 = 60000 min in ms
    attempts: 3 // attempt if job is error retry 3 times
};

const nameQueue = 'notifications_queue';

//init connection & add it to MQ to consumer
const init = async (data) => {
    return connectQueue(nameQueue).add(data, jobOptions);
}

// add job to MQ after request
const processQueryAddToMQ = (query) => {
    const data = {
        message: `------------- Send Notification job for users added to MQ --params--- ${JSON.stringify(query)}`,
        query: query,
    };

    init(data).then(res => {
        console.info(res.data.message);
    });
}


module.exports = {processQueryAddToMQ}