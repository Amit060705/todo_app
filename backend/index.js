// start writing from here
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectToDatabase } = require("./db");
dotenv.config();
// const path = require("path");
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.frontend_url,
    credentials:true
}));
// app.use(express.static(path.join(__dirname, "../frontend")));
// app.get("/",(req,res)=>{
//     res.sendFile(path.join(__dirname, "../frontend/index.html"));
// })
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");
//  start writing your routes here
app.use("/user", userRoutes);
app.use("/todo", todoRoutes);
app.get("/healthy", (req, res) => res.send("I am Healthy"));
connectToDatabase().then(() => {
    const port = process.env.PORT;
    app.listen(port, () => console.log(`server is running at http://localhost:${port}`));
})