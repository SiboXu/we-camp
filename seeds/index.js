/**
 * The seed module to insert cities data and initial camp data.
 */

// Require --------------------------------------------------------------------
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./camps');


// Database -------------------------------------------------------------------
const dbUrl = process.env.DB;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Datbase connected.");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const idx = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '609560c19f04e7704d5c0cef',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[idx].longitude,
                    cities[idx].latitude
                ]
            },
            location: `${cities[idx].city}, ${cities[idx].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/sxu/image/upload/v1620241242/WeCamp/s2kxekojxq59b7f7cyed.jpg',
                    filename: 'WeCamp/s2kxekojxq59b7f7cyed'
                }
            ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum at voluptas reiciendis, molestiae ipsum quidem temporibus nesciunt explicabo libero quisquam rerum. Eligendi quod quam magni incidunt minima quaerat odit voluptatum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum at voluptas reiciendis, molestiae ipsum quidem temporibus nesciunt explicabo libero quisquam rerum. Eligendi quod quam magni incidunt minima quaerat odit voluptatum.',
            price
        });
        await camp.save();
    }
};

seedDB().then(() => mongoose.connection.close());
