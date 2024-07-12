const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
const characterRoutes = require("./routes/api/character.api");
const battleRoutes = require("./routes/api/battle.api");


//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));



//connect to database
connectDB();

//routes
app.use("/characters" , characterRoutes)
app.use("/battles" , battleRoutes)


//listen to PORT
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});


module.exports = app