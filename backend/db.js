const mongoose = require('mongoose');
const mongoURI="mongodb://127.0.0.1:27017/inotebook"

mongoose.set("strictQuery", false);
const connectToMongo = ()=>{
mongoose.connect(mongoURI, (err) => {
    if(err) console.log(err) 
    else console.log("mongdb is connected");
   })
}

module.exports = connectToMongo    