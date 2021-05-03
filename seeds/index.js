/**
 * The seed module to insert cities data and initial camp data.
 */

// Require --------------------------------------------------------------------
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./camps');


// Database -------------------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/WeCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Datbase connected.");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const idx = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[idx].city}, ${cities[idx].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum at voluptas reiciendis, molestiae ipsum quidem temporibus nesciunt explicabo libero quisquam rerum. Eligendi quod quam magni incidunt minima quaerat odit voluptatum.',
            price
        });
        await camp.save();
    }
};

seedDB().then(() => mongoose.connection.close());
