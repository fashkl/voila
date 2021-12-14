//connect to DB
const mongoose = require("mongoose");
const Notification = require("../models/notification");
const City = require("../models/city");
const User = require("../models/users");
const faker = require("faker");

require('dotenv').config();


mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    keepAlive: 1,
    useCreateIndex: true,
}).then(() => console.log("=========>  database is connected DB")).catch((e) => console.log("error connecting to database",e));

const db = mongoose.connection;
db.once("open", async () => {
    if ((await Notification.countDocuments().exec()) <= 0) {
        Promise.all([Notification.create({"name": "Notification 1"}), Notification.create({"name": "Notification 2"}), Notification.create({"name": "Notification 3"}), Notification.create({"name": "Notification 4"}), Notification.create({"name": "Notification 5"}), Notification.create({"name": "Notification 6"}), Notification.create({"name": "Notification 7"}), Notification.create({"name": "Notification 8"}), Notification.create({"name": "Notification 9"}), Notification.create({"name": "Notification 10"}),]).then(() => {
            console.log('Notification inserted to Database');
        }).catch(() => console.log("error occurred while inserting data to database"))
    }
    if ((await City.countDocuments().exec()) <= 0) {
        Promise.all([City.create({"name": "Berlin"}), City.create({"name": "Dubai"}), City.create({"name": "Munich"}), City.create({"name": "Madrid"}), City.create({"name": "Cairo"}), City.create({"name": "Alexandria"}), City.create({"name": "Frankfurt"}), City.create({"name": "New York"}), City.create({"name": "Vienna"}), City.create({"name": "Barcelona"})]).then(() => {
            console.log('City inserted to Database');
        }).catch(() => console.log("error occurred while inserting data to database"))
    }
    if ((await User.countDocuments().exec()) <= 0) {
        const cities = await City.find({}).select('_id');

        let st = performance.now();
        let bulk = [];
        for (let i = 0; i < 1000001; i++) {
            const city = cities[Math.floor((Math.random() * 9))]._id;

            bulk.push({
                "name": faker.name.findName(), "city": city, "preference": (Math.floor(Math.random() * 2) + 1)
            });

            if (i % 10000 === 0) {
                console.log(i);
                await User.insertMany(bulk);
                bulk = [];
            }

        }

        console.log("Consumed Time in M ==>  ", ((performance.now() - st) / (1000 * 60)));
    }
});

module.exports = db;