if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
} 

const express =require("express");
const app = express();
const mongoose= require("mongoose");
// let mongo_URL= "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const path= require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
     touchAfter: 24 *3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly :true,
    }
};

// app.get("/", (req, res)=>{
//     res.send("api is working");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());//to store user related info in session
passport.deserializeUser(User.deserializeUser());//to remove the user related info after session

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next(); 
})

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"sigma-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(()=>{
    console.log("connected with mongoose");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"MY NEW VILLA",
//         description:"By the beach",
//         price: "1200",
//         location:"calangute, Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("successfull testing");
// })

// app.use((err, req, res, next)=>{
//     res.send("Something went wrong");
// });

// app.all("*", (req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// });
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
   let{statusCode=500, message="Something went wrong"}= err;
   res.status(statusCode).render("listings/error.ejs",{message});
//    console.error(err);
//    res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})
