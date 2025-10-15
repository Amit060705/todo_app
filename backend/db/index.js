//  start writing from here
const mongoose = require('mongoose');
require('dotenv').config();
// const ObjectId=mongoose.ObjectId;
// Connect to MongoDB
const connectToDatabase=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected");
    } catch (error) {
        console.log("Database connection failed:",error);
        process.exit(1);
    }
}
const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;
// Define schemas

const UserSchema = new Schema({
    // Schema definition here
    username:{type:String,unique:true},
    password:String,
});

const TodoSchema = new Schema({
    // Schema definition here
    userId:ObjectId,
    title:String,
    done:Boolean
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    connectToDatabase,
    User,
    Todo
}