//https://medium.com/learnfactory-nigeria/create-a-pagination-middleware-with-node-js-fe4ec5dca80f

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const faker = require('faker');

app.use(express.json())

require('dotenv').config();

//models import
const User = require('./models/users');
const SentNotifications = require('./models/sentNotifications');
const Notification = require('./models/notification');
const City = require('./models/city');


//api routes


//connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log("database is connected to mongodb://localhost/voila")).catch(() => console.log("error connecting to database"));


const db = mongoose.connection;
db.once("open", async () => {
    if ((await Notification.countDocuments().exec()) <= 0) {
        Promise.all([Notification.create({"name": "Notification 1"}), Notification.create({"name": "Notification 2"}), Notification.create({"name": "Notification 3"}), Notification.create({"name": "Notification 4"}), Notification.create({"name": "Notification 5"}), Notification.create({"name": "Notification 6"}), Notification.create({"name": "Notification 7"}), Notification.create({"name": "Notification 8"}), Notification.create({"name": "Notification 9"}), Notification.create({"name": "Notification 10"}),]).then(() => {
            console.log('Notification inserted to Database');
        }).catch(() => console.log("error occurred while inserting data to database"))
    }
    if ((await City.countDocuments().exec()) <= 0) {
        Promise.all([
            City.create({"name": "Berlin"}),
            City.create({"name": "Dubai"}),
            City.create({"name": "Munich"}),
            City.create({"name": "Madrid"}),
            City.create({"name": "Cairo"}),
            City.create({"name": "Alexandria"}),
            City.create({"name": "Frankfurt"}),
            City.create({"name": "New York"}),
            City.create({"name": "Vienna"}),
            City.create({"name": "Barcelona"})
        ]).then(() => {
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

        console.log("ET ==>  ", performance.now() - st);
    }
});


app.post('/v1/notify', (req, res) => {
    let params = req.body;
    console.log(params)

    //1- check incoming body data
    //2- formulate the query filter
    //3- search and send to Job Queue to send it worker to finish it


    res.json(params)
});

app.get('/users', paginateMiddleware(User), (req, res) => {
    res.json(res.paginatedResult)
});


function paginateMiddleware(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const result = {}

        if (endIndex < (await model.countDocuments().exec())) {
            result.next = {
                page: page + 1, limit: limit,
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1, limit: limit,
            }
        }

        try {
            result.results = await model.find().limit(limit).skip(startIndex);
            res.paginatedResult = result

            next()
        } catch (e) {
            res.status(500).json({message: e.message});
        }
    }
}


app.listen(3001, () => {console.log('Server up & Running..')});
