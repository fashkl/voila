const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

//models import
const City = require('./models/city');
const User = require('./models/users');


//Bull MQ Producer
const {processQueryAddToMQ} = require('./services/producer');


//POST endpoint
app.post('/api/v1/notify',  async (req, res) => {
    let query = {};
    if (typeof req.body?.city != 'undefined') {
        let city = req.body.city;
        city = city.toString().trim();
        city = await City.findOne({'name': city}).exec();
        query.city = city._id;
    }
    if (typeof req.body?.letter != 'undefined') {
        query.name = {$regex: `^${req.body.letter}`};
    }

    try {
        processQueryAddToMQ(query);
    } catch (error) {
        res.json({'message': error});
    }

    res.json({'message': 'Request Accepted and will be successful send notifications'});
});

//Bull MQ Consumer/Worker
require('./services/consumer');


//db - config
require('./config/db.config');


app.listen(process.env.PORT || 3001, () => {
    console.log(`Server up & Running on PORT ${process.env.PORT}`);
});
