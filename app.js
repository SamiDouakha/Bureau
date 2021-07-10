import express from "express";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import intializePassport from "./config/passport-confing.js";
import dotenv from "dotenv";

const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";
dotenv.config();

const app = express();
//Passport Config
//Initialize Passport
intializePassport(passport);

// EJS
app.use(expressLayouts);
app.set("views", "./views");
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(express.static("public"));
//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);

//using the middleware passport to authenticate the users
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Glabals Variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Routes Or Controllers
app.use("/", indexRouter);
app.use("/users", usersRouter);

//MongoDb Connection
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Mongo"));

/*app.get("/", (req, res) => {
  res.render("pages/home", { title: "home" })
})*/
app.listen(port, host, () => {
	console.log(`sever runing on: http://${host}:${port}`);
});
