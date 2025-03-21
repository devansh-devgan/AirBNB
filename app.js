if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
//console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';//local database
const MONGO_URL = process.env.ATLASDB_URL;//Atlas Database

main().then(() => {
    console.log("Connected to AirBNB Database");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.searchQuery = req.query.search || ""; // Set searchQuery globally
    res.locals.selectedCategory = req.query.category || ""; // Set selectedCategory globally
    res.locals.page = req.path.includes("/listings") ? "index" : "";  //page is passed everywhere
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



//Root route
app.get("/", (req,res) => {
    res.render("listings/root.ejs");
})

//Privacy route
app.get("/privacy", (req,res) => {
    res.render("privacy.ejs");
})

//Terms route
app.get("/terms", (req,res) => {
    res.render("terms.ejs");
})


//Page not Found Error
app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page not Found!"));
})

//Error Handling Middleware
app.use((err,req,res,next) => {
    let {status=500,message="Something went wrong!"} = err;
    res.status(status).render("error.ejs", {status, message});
})

app.listen(8080, () => {
    // console.log("Server is listening to port: 8080");
})