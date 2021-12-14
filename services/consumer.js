const {handlerFailure, handlerCompleted, handlerStalled} = require('./handler');
const {connectQueue} = require('../config/queue.config');

// import models
const User = require('../models/users');
const SentNotifications = require('../models/sentNotifications');
const Notification = require('../models/notification');


//get jobs from the queue
const nameQueue = 'notifications_queue';
const cases = connectQueue(nameQueue);

/*
  @description initial all job queue
*/
const processJob = async (job, done) => {
    try {
        console.info(`running job! with id ${job.id}`);

        let notifications = await Notification.find({}, '_id').exec();

        //1- get users from User collection
        let users = await User.find(job.data.query, '_id name preference').exec();

        console.info("-----------  ",users.length," User will be checked before sending ----------- ");
        for (const doc of users) {
            //2- check if not exist in SentNotifications collection
            const userExists = await SentNotifications.exists({userId: doc._id});
            //2-1 if not exist ==> send Email or SMS & insert his record in SentNotifications
            if (!userExists) {
                try {
                    // send email Method
                    console.log('================= Notification Sent to ', doc.name);

                    // insert sent record
                    await SentNotifications.create({
                        "userId": doc._id,
                        "notificationId": notifications[Math.floor(Math.random() * notifications.length - 1)],
                        "preference": doc.preference,
                    });

                } catch (e) {
                    done(null, e);
                }
            }
        }

        done(null, 'success');
    } catch (error) {
        done(null, error);
    }
}


const initJob = () => {
    console.info('Job is working!');
    cases.process(processJob);
    cases.on('failed', handlerFailure);
    cases.on('completed', handlerCompleted);
    cases.on('stalled', handlerStalled);
}


initJob()


module.exports = {initJob}
