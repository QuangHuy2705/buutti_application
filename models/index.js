import mongoose from 'mongoose'
import config from 'config' //we load the database location from the JSON files based on ENV VAR(test, dev, ...)

mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(config.DBHost, {
	keepAlive: true,
	useNewUrlParser: true,
}, () => {
	console.log("Mongo connected")
});

export { default as Event } from './event'