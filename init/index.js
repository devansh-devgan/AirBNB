const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

main().then(() => {
    console.log("Connected to AirBNB Database");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB = async () => {
  await Listing.deleteMany({});
  //initData.data = initData.data.map((obj) => ({...obj, owner: "679c79ce843df15d737f7f14"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();