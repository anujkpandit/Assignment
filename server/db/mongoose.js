import mongoose from "mongoose";

// Change 'mydatabase' to your desired database name
const mongodbURL = "mongodb://localhost:27017/mydatabase";

mongoose.connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("mongo db connected");
});